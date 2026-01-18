import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /* ---------- REGISTER ---------- */
  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'password123',
      fullName: 'Test User',
    };

    it('should call authService.register with correct dto', async () => {
      const expectedResult = { message: 'User registered successfully' };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockAuthService.register.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle service errors', async () => {
      mockAuthService.register.mockRejectedValue(new Error('Database error'));

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  /* ---------- LOGIN ---------- */
  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    const mockRequest = {
      ip: '127.0.0.1',
      socket: { remoteAddress: '192.168.1.1' },
    } as unknown as Request;

    it('should call authService.login with dto and ip from request', async () => {
      const expectedResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto, mockRequest);

      expect(authService.login).toHaveBeenCalledWith(loginDto, '127.0.0.1');
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should use socket.remoteAddress if ip is not available', async () => {
      const requestWithoutIp = {
        socket: { remoteAddress: '192.168.1.1' },
      } as unknown as Request;

      const expectedResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      await controller.login(loginDto, requestWithoutIp);

      expect(authService.login).toHaveBeenCalledWith(loginDto, '192.168.1.1');
    });

    it('should use empty string if no ip available', async () => {
      const requestWithoutIp = {
        socket: {},
      } as unknown as Request;

      const expectedResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      await controller.login(loginDto, requestWithoutIp);

      expect(authService.login).toHaveBeenCalledWith(loginDto, '');
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto, '127.0.0.1');
    });

    it('should throw UnauthorizedException on too many attempts', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException(
          'Too many login attempts. Please try again later.',
        ),
      );

      await expect(controller.login(loginDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  /* ---------- REFRESH ---------- */
  describe('refresh', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    it('should call authService.refresh with refresh token', async () => {
      const expectedResult = { accessToken: 'new-access-token' };
      mockAuthService.refresh.mockResolvedValue(expectedResult);

      const result = await controller.refresh(refreshTokenDto);

      expect(authService.refresh).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(authService.refresh).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException on invalid refresh token', async () => {
      mockAuthService.refresh.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(controller.refresh(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.refresh).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
    });

    it('should throw UnauthorizedException if token not found in Redis', async () => {
      mockAuthService.refresh.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(controller.refresh(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle expired refresh token', async () => {
      mockAuthService.refresh.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(
        controller.refresh({ refreshToken: 'expired-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  /* ---------- LOGOUT ---------- */
  describe('logout', () => {
    const mockRequestWithUser = {
      user: { sub: 1, email: 'test@test.com' },
    } as any;

    it('should call authService.logout with user id from request', async () => {
      const expectedResult = { message: 'Logged out successfully' };
      mockAuthService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout(mockRequestWithUser);

      expect(authService.logout).toHaveBeenCalledWith(1);
      expect(authService.logout).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should be protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.logout);
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames).toContain('JwtAuthGuard');
    });

    it('should handle logout even if refresh token does not exist', async () => {
      const expectedResult = { message: 'Logged out successfully' };
      mockAuthService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout(mockRequestWithUser);

      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors during logout', async () => {
      mockAuthService.logout.mockRejectedValue(
        new Error('Redis connection error'),
      );

      await expect(controller.logout(mockRequestWithUser)).rejects.toThrow(
        'Redis connection error',
      );
    });
  });

  /* ---------- ENDPOINT METADATA ---------- */
  describe('API Documentation', () => {
    it('should have correct route prefix', () => {
      const prefix = Reflect.getMetadata('path', AuthController);
      expect(prefix).toBe('v1/auth');
    });

    it('should have Swagger ApiTags decorator', () => {
      const tags = Reflect.getMetadata('swagger/apiUseTags', AuthController);
      expect(tags).toEqual(['Auth']);
    });
  });
});
