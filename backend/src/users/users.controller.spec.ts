import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Readable } from 'stream';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockUser: JwtPayload = {
    sub: 1,
    email: 'test@test.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile (GET /me)', () => {
    it('should return current user profile', async () => {
      const mockUserProfile = {
        id: 1,
        email: 'test@test.com',
        fullName: 'Test User',
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(mockUserProfile);

      const result = await controller.getProfile(mockUser);

      expect(usersService.findById).toHaveBeenCalledWith(mockUser.sub);
      expect(result).toEqual(mockUserProfile);
    });

    it('should call service with user id from JWT payload', async () => {
      const userPayload: JwtPayload = {
        sub: 42,
        email: 'another@test.com',
      };

      mockUsersService.findById.mockResolvedValue({
        id: 42,
        email: 'another@test.com',
      });

      await controller.getProfile(userPayload);

      expect(usersService.findById).toHaveBeenCalledWith(42);
      expect(usersService.findById).toHaveBeenCalledTimes(1);
    });

    it('should be protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.getProfile);
      expect(guards).toBeDefined();
    });
  });

  describe('updateProfile (PATCH /me/profile)', () => {
    const mockUpdateDto: UpdateProfileDto = {
      fullName: 'Updated Name',
    };

    it('should update profile without file', async () => {
      const mockUpdatedProfile = {
        id: 1,
        email: 'test@test.com',
        fullName: 'Updated Name',
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.updateProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile(mockUser, mockUpdateDto);

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        mockUser.sub,
        mockUpdateDto,
        undefined,
      );
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should update profile with file', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test'),
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };

      const mockUpdatedProfile = {
        id: 1,
        email: 'test@test.com',
        fullName: 'Updated Name',
        profileImage: 'http://example.com/image.jpg',
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.updateProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile(
        mockUser,
        mockUpdateDto,
        mockFile,
      );

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        mockUser.sub,
        mockUpdateDto,
        mockFile,
      );
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should call service with correct user id', async () => {
      const userPayload: JwtPayload = {
        sub: 42,
        email: 'another@test.com',
      };

      mockUsersService.updateProfile.mockResolvedValue({
        id: 42,
        email: 'another@test.com',
        fullName: 'Updated Name',
      });

      await controller.updateProfile(userPayload, mockUpdateDto);

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        42,
        mockUpdateDto,
        undefined,
      );
      expect(usersService.updateProfile).toHaveBeenCalledTimes(1);
    });

    it('should be protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.updateProfile,
      );
      expect(guards).toBeDefined();
    });
  });
});