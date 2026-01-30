import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetTokenDto } from './dto/verify-reset-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    verifyResetToken: jest.fn(),
    resetPassword: jest.fn(),
    changePassword: jest.fn(),
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

    const mockIp = '127.0.0.1';

    it('should call authService.login with dto and ip', async () => {
      const expectedResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto, mockIp);

      expect(authService.login).toHaveBeenCalledWith(loginDto, mockIp);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto, mockIp)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto, mockIp);
    });

    it('should throw UnauthorizedException on too many attempts', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException(
          'Too many login attempts. Please try again later.',
        ),
      );

      await expect(controller.login(loginDto, mockIp)).rejects.toThrow(
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
    const mockUser = { sub: 1, email: 'test@test.com' };

    it('should call authService.logout with user id', async () => {
      const expectedResult = { message: 'Logged out successfully' };
      mockAuthService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout(mockUser);

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

      const result = await controller.logout(mockUser);

      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors during logout', async () => {
      mockAuthService.logout.mockRejectedValue(
        new Error('Redis connection error'),
      );

      await expect(controller.logout(mockUser)).rejects.toThrow(
        'Redis connection error',
      );
    });
  });

  /* ---------- FORGOT PASSWORD ---------- */
  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@test.com',
    };

    it('should call authService.forgotPassword with correct dto', async () => {
      const expectedResult = { message: 'Password reset email sent successfully' };
      mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
      expect(authService.forgotPassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should return success message even if user does not exist (security)', async () => {
      const expectedResult = { 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      };
      mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if email fails to send', async () => {
      mockAuthService.forgotPassword.mockRejectedValue(
        new InternalServerErrorException('Failed to send password reset email'),
      );

      await expect(controller.forgotPassword(forgotPasswordDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  /* ---------- VERIFY RESET TOKEN ---------- */
  describe('verifyResetToken', () => {
    const verifyResetTokenDto: VerifyResetTokenDto = {
      token: 'valid-reset-token',
    };

    it('should call authService.verifyResetToken with token', async () => {
      const expectedResult = { valid: true, message: 'Token is valid' };
      mockAuthService.verifyResetToken.mockResolvedValue(expectedResult);

      const result = await controller.verifyResetToken(verifyResetTokenDto);

      expect(authService.verifyResetToken).toHaveBeenCalledWith(
        verifyResetTokenDto.token,
      );
      expect(authService.verifyResetToken).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if token is invalid', async () => {
      mockAuthService.verifyResetToken.mockRejectedValue(
        new BadRequestException('Invalid or expired reset token'),
      );

      await expect(
        controller.verifyResetToken(verifyResetTokenDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if token is expired', async () => {
      mockAuthService.verifyResetToken.mockRejectedValue(
        new BadRequestException('Invalid or expired reset token'),
      );

      await expect(
        controller.verifyResetToken({ token: 'expired-token' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  /* ---------- RESET PASSWORD ---------- */
  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'valid-reset-token',
      newPassword: 'newPassword123',
    };

    it('should call authService.resetPassword with correct dto', async () => {
      const expectedResult = { message: 'Password reset successfully' };
      mockAuthService.resetPassword.mockResolvedValue(expectedResult);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if token is invalid', async () => {
      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('Invalid or expired reset token'),
      );

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password is too short', async () => {
      const invalidDto = { token: 'token', newPassword: '123' };
      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('Password must be at least 6 characters'),
      );

      await expect(controller.resetPassword(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if token is missing', async () => {
      const invalidDto = { token: '', newPassword: 'password123' };
      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('Token and new password are required'),
      );

      await expect(controller.resetPassword(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /* ---------- CHANGE PASSWORD ---------- */
  describe('changePassword', () => {
    const mockUser = { sub: 1, email: 'test@test.com' };
    const changePasswordDto: ChangePasswordDto = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
    };

    it('should call authService.changePassword with user id and dto', async () => {
      const expectedResult = { message: 'Password changed successfully' };
      mockAuthService.changePassword.mockResolvedValue(expectedResult);

      const result = await controller.changePassword(mockUser, changePasswordDto);

      expect(authService.changePassword).toHaveBeenCalledWith(
        mockUser.sub,
        changePasswordDto,
      );
      expect(authService.changePassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should be protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.changePassword);
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames).toContain('JwtAuthGuard');
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      mockAuthService.changePassword.mockRejectedValue(
        new UnauthorizedException('Current password is incorrect'),
      );

      await expect(
        controller.changePassword(mockUser, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if new password is same as current', async () => {
      const invalidDto = {
        currentPassword: 'password123',
        newPassword: 'password123',
      };
      mockAuthService.changePassword.mockRejectedValue(
        new BadRequestException(
          'New password cannot be the same as current password',
        ),
      );

      await expect(
        controller.changePassword(mockUser, invalidDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new password is too short', async () => {
      const invalidDto = {
        currentPassword: 'oldPassword123',
        newPassword: '123',
      };
      mockAuthService.changePassword.mockRejectedValue(
        new BadRequestException('New password must be at least 6 characters'),
      );

      await expect(
        controller.changePassword(mockUser, invalidDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle user not found error', async () => {
      mockAuthService.changePassword.mockRejectedValue(
        new UnauthorizedException('User not found'),
      );

      await expect(
        controller.changePassword(mockUser, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
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

    it('should have ApiBearerAuth on protected endpoints', () => {
      const logoutSecurity = Reflect.getMetadata(
        'swagger/apiSecurity',
        controller.logout,
      );
      const changePasswordSecurity = Reflect.getMetadata(
        'swagger/apiSecurity',
        controller.changePassword,
      );

      expect(logoutSecurity).toBeDefined();
      expect(changePasswordSecurity).toBeDefined();
    });
  });

  /* ---------- INTEGRATION SCENARIOS ---------- */
  describe('Integration Scenarios', () => {
    it('should handle complete password reset flow', async () => {
      const email = 'test@test.com';
      const token = 'reset-token-123';
      const newPassword = 'newPassword123';

      mockAuthService.forgotPassword.mockResolvedValue({
        message: 'Password reset email sent successfully',
      });
      await controller.forgotPassword({ email });

      mockAuthService.verifyResetToken.mockResolvedValue({
        valid: true,
        message: 'Token is valid',
      });
      await controller.verifyResetToken({ token });

      mockAuthService.resetPassword.mockResolvedValue({
        message: 'Password reset successfully',
      });
      await controller.resetPassword({ token, newPassword });

      expect(authService.forgotPassword).toHaveBeenCalled();
      expect(authService.verifyResetToken).toHaveBeenCalled();
      expect(authService.resetPassword).toHaveBeenCalled();
    });

    it('should handle complete login and logout flow', async () => {
      const loginDto = { email: 'test@test.com', password: 'password123' };
      const mockUser = { sub: 1, email: 'test@test.com' };

      mockAuthService.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      await controller.login(loginDto, '127.0.0.1');

      mockAuthService.logout.mockResolvedValue({
        message: 'Logged out successfully',
      });
      await controller.logout(mockUser);

      expect(authService.login).toHaveBeenCalled();
      expect(authService.logout).toHaveBeenCalled();
    });
  });
});