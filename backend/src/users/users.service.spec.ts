import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let storageService: StorageService;

  const mockUserRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockStorageService = {
    uploadProfileImage: jest.fn(),
    deleteProfileImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    storageService = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        fullName: 'Test User',
        profileImageUrl: 'https://example.com/image.jpg',
        isActive: true,
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'email', 'fullName', 'profileImageUrl', 'isActive', 'createdAt'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow('User with ID 999 not found');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        select: ['id', 'email', 'fullName', 'profileImageUrl', 'isActive', 'createdAt'],
      });
    });

    it('should call repository with correct parameters', async () => {
      const userId = 42;
      const mockUser = {
        id: userId,
        email: 'user@example.com',
        fullName: 'John Doe',
        profileImageUrl: null,
        isActive: true,
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await service.findById(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: ['id', 'email', 'fullName', 'profileImageUrl', 'isActive', 'createdAt'],
      });
    });
  });

  describe('updateProfile', () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      fullName: 'Old Name',
      profileImageUrl: null,
      isActive: true,
      createdAt: new Date(),
    };

    it('should update user full name successfully', async () => {
      const dto: UpdateProfileDto = { fullName: 'New Name' };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, fullName: 'New Name' });

      const result = await service.updateProfile(1, dto);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        fullName: 'New Name',
      });
      expect(result).toEqual({ success: true });
    });

    it('should trim whitespace from full name', async () => {
      const dto: UpdateProfileDto = { fullName: '  Trimmed Name  ' };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, fullName: 'Trimmed Name' });

      await service.updateProfile(1, dto);

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        fullName: 'Trimmed Name',
      });
    });

    it('should upload profile image and update user', async () => {
      const dto: UpdateProfileDto = {};
      const mockFile = {
        fieldname: 'image',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
        size: 1024,
      } as Express.Multer.File;

      const uploadedImageUrl = 'https://cloudinary.com/image.jpg';

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockStorageService.uploadProfileImage.mockResolvedValue(uploadedImageUrl);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        profileImageUrl: uploadedImageUrl,
      });

      const result = await service.updateProfile(1, dto, mockFile);

      expect(mockStorageService.uploadProfileImage).toHaveBeenCalledWith(mockFile, 1);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        profileImageUrl: uploadedImageUrl,
      });
      expect(result).toEqual({ success: true });
    });

    it('should update both full name and profile image', async () => {
      const dto: UpdateProfileDto = { fullName: 'Updated Name' };
      const mockFile = {
        fieldname: 'image',
        originalname: 'new-profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
        size: 2048,
      } as Express.Multer.File;

      const uploadedImageUrl = 'https://cloudinary.com/new-image.jpg';

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockStorageService.uploadProfileImage.mockResolvedValue(uploadedImageUrl);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        fullName: 'Updated Name',
        profileImageUrl: uploadedImageUrl,
      });

      const result = await service.updateProfile(1, dto, mockFile);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockStorageService.uploadProfileImage).toHaveBeenCalledWith(mockFile, 1);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        fullName: 'Updated Name',
        profileImageUrl: uploadedImageUrl,
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw BadRequestException when user not found', async () => {
      const dto: UpdateProfileDto = { fullName: 'New Name' };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateProfile(999, dto)).rejects.toThrow(BadRequestException);
      await expect(service.updateProfile(999, dto)).rejects.toThrow('User not found');

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should not update full name if not provided in dto', async () => {
      const dto: UpdateProfileDto = {};

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      await service.updateProfile(1, dto);

      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockUser.fullName).toBe('Old Name');
    });

    it('should handle storage service errors gracefully', async () => {
      const dto: UpdateProfileDto = {};
      const mockFile = {
        fieldname: 'image',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
        size: 1024,
      } as Express.Multer.File;

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockStorageService.uploadProfileImage.mockRejectedValue(
        new Error('Failed to upload image')
      );

      await expect(service.updateProfile(1, dto, mockFile)).rejects.toThrow(
        'Failed to upload image'
      );

      expect(mockStorageService.uploadProfileImage).toHaveBeenCalledWith(mockFile, 1);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should call save with updated user object', async () => {
      const dto: UpdateProfileDto = { fullName: 'Final Name' };
      const updatedUser = { ...mockUser, fullName: 'Final Name' };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      await service.updateProfile(1, dto);

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });
  });
});