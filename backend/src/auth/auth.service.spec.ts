import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            incr: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ---------- REGISTER ---------- */

  describe('register', () => {
    it('should hash password and save user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        fullName: 'Test User',
      } as User;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepo, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepo, 'save').mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(userRepo.findOne).toHaveBeenCalledWith({where: {email: 'test@test.com'}});
      expect(userRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@test.com',
        fullName: 'Test User',
      }));

      expect(result).toEqual({ message: 'User registered successfully' });
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = { id: 1, email: 'test@test.com' } as User;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(existingUser);

      await expect(service.register({
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
      })).rejects.toThrow(ConflictException);
    });
  });

  /* ---------- LOGIN ---------- */

  describe('login', () => {
    const ip = '127.0.0.1';

    it('should return access and refresh tokens on successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed',
      } as User;

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jest.spyOn(redisService, 'incr').mockResolvedValue(1);
      jest.spyOn(redisService, 'del').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(jwtService, 'sign')
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login(
        { email: 'test@test.com', password: 'password' },
        ip,
      );

      expect(redisService.incr).toHaveBeenCalledWith(`login:${ip}`, 60);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(redisService.del).toHaveBeenCalledWith(`login:${ip}`);
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw UnauthorizedException if too many login attempts', async () => {
      jest.spyOn(redisService, 'incr').mockResolvedValue(6);

      await expect(service.login(
        {email: 'test', password: 'password'},
        ip,
      )).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(redisService, 'incr').mockResolvedValue(1);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(service.login(
        {email: 'test@test.com', password: 'password'},
        ip,
      )).rejects.toThrow(UnauthorizedException);  
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed',
      } as User;

      jest.spyOn(redisService, 'incr').mockResolvedValue(1);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(
        { email: 'test@test.com', password: 'wrongpassword' },
        ip,
      )).rejects.toThrow(UnauthorizedException);
    });
  });

    /* ---------- REFRESH ---------- */
  describe('refresh', () => {
    it('should return new access token on valid refresh token', async () => {
      const mockPayload = { sub: 1, email: 'test@test.com'};
      const refreshToken = 'valid-refresh-token';
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);
      jest.spyOn(redisService, 'get').mockResolvedValue(tokenHash);
      jest.spyOn(jwtService, 'sign').mockReturnValue('new-access-token');

      const result = await service.refresh(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
      expect(redisService.get).toHaveBeenCalledWith('refresh:1');
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token hash does not match', async () => {
      const mockPayload = { sub: 1, email: 'test@test.com'};
      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);
      jest.spyOn(redisService, 'get').mockResolvedValue('different-hash');

      await expect(service.refresh('token')).rejects.toThrow(UnauthorizedException);
    });

  });

  /* ---------- LOGOUT ---------- */
  describe('logout', () => {
    it('should delete refresh token from redis', async () => {
      jest.spyOn(redisService, 'del').mockResolvedValue(undefined);
      const mockReq = {
        user: { sub: 1 },
      } as any;

      const result = await service.logout(mockReq);

      expect(redisService.del).toHaveBeenCalledWith('refresh:1');
      expect(result).toEqual({ message: 'Logged out successfully'});
    });
  });
});
