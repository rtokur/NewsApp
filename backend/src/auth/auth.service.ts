import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
  private readonly LOGIN_ATTEMPT_TTL = 60;
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly RESET_TOKEN_EXPIRY_HOURS = 6;

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      password: hashed,
      fullName: dto.fullName,
    });

    await this.usersRepo.save(user);
    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto, ip: string) {
    const attempts = await this.redisService.incr(
      `login:${ip}`,
      this.LOGIN_ATTEMPT_TTL,
    );
    if (attempts > this.MAX_LOGIN_ATTEMPTS) {
      throw new UnauthorizedException(
        'Too many login attempts. Please try again later.',
      );
    }

    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    await this.redisService.del(`login:${ip}`);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    await this.redisService.set(
      `refresh:${user.id}`,
      refreshTokenHash,
      this.REFRESH_TOKEN_TTL,
    );

    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedHash = await this.redisService.get(`refresh:${payload.sub}`);
    if (!storedHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (storedHash !== tokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload = {
      sub: payload.sub,
      email: payload.email,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15m',
    });

    return { accessToken: newAccessToken };
  }

  async logout(userId: number) {
    await this.redisService.del(`refresh:${userId}`);
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      return {
        message:
          'If an account exists with this email, a password reset link has been sent.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + this.RESET_TOKEN_EXPIRY_HOURS);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiryDate;
    await this.usersRepo.save(user);

    const resetUrl = `exp://${process.env.EXPO_DEV_IP}/--/reset-password?token=${resetToken}`;

    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.fullName,
        resetUrl,
      );

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await this.usersRepo.save(user);

      console.error('Failed to send password reset email:', error);
      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }

  async verifyResetToken(token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.usersRepo.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { valid: true, message: 'Token is valid' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (!dto.token || !dto.newPassword) {
      throw new BadRequestException('Token and new password are required');
    }

    if (dto.newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    const user = await this.usersRepo.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await this.usersRepo.save(user);

    try {
      await this.emailService.sendPasswordChangedEmail(
        user.email,
        user.fullName,
      );
    } catch (error) {
      console.error('Failed to send password changed email:', error);
    }

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Current password is incorrect');

    if (dto.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = newHashedPassword;
    await this.usersRepo.save(user);

    await this.redisService.del(`refresh:${userId}`);

    return { message: 'Password changed successfully' };
  }
}
