import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { StorageService } from 'src/storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from 'src/auth/auth.service';
import { EmailChangeToken } from './entities/email-change-token.entity';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { create } from 'domain';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly storageService: StorageService,
    @InjectRepository(EmailChangeToken)
    private readonly tokenRepository: Repository<EmailChangeToken>,
    private emailService: EmailService,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'fullName',
        'profileImageUrl',
        'isActive',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('User not found');

    if (dto.fullName) {
      user.fullName = dto.fullName.trim();
    }

    if (file) {
      const imageUrl = await this.storageService.uploadProfileImage(
        file,
        userId,
      );
      user.profileImageUrl = imageUrl;
    }

    await this.userRepository.save(user);

    return {
      success: true,
    };
  }

  async requestEmailChange(
    userId: number,
    newEmail: string,
    currentPassword: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await this.authService.verifyPassword(
      currentPassword,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      throw new BadRequestException(
        'New email must be different from current email',
      );
    }

    const emailUsed = await this.userRepository.findOne({
      where: { email: newEmail.toLowerCase() },
    });

    if (emailUsed) {
      throw new BadRequestException('This email address is already in use');
    }

    const existingToken = await this.tokenRepository.findOne({
      where: { userId },
    });

    if (existingToken && existingToken.expiresAt > new Date()) {
      throw new BadRequestException(
        'You already have a pending email change request. Please check your email or wait before requesting again.',
      );
    }

    await this.tokenRepository.delete({ userId });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await this.tokenRepository.save({
      userId,
      newEmail: newEmail.toLowerCase(),
      token,
      expiresAt,
    });

    const link = `exp://${process.env.EXPO_DEV_IP}/--/verify-email-change?token=${token}`;

    try {
      await this.emailService.sendEmailChangeVerification(
        newEmail,
        user.fullName,
        link,
      );

      await this.emailService.sendEmailChangedNotification(
        user.email,
        user.fullName,
        user.email,
        newEmail,
      );

      return {
        message: 'Verification email sent successfully',
        newEmail: newEmail,
      };
    } catch (error) {
      await this.tokenRepository.delete({ token });
      console.error('Failed to send email change emails:', error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  async confirmEmailChange(token: string) {
    const record = await this.tokenRepository.findOne({
      where: { token },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    if (record.expiresAt < new Date()) {
      await this.tokenRepository.delete(record.id);
      throw new BadRequestException('This verification link has expired');
    }

    const user = await this.userRepository.findOne({
      where: { id: record.userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const emailInUse = await this.userRepository.findOne({
      where: { email: record.newEmail },
    });

    if (emailInUse && emailInUse.id !== user.id) {
      await this.tokenRepository.delete(record.id);
      throw new BadRequestException(
        'This email address is already in use by another account',
      );
    }

    const oldEmail = user.email;
    const newEmail = record.newEmail;

    await this.userRepository.update(record.userId, {
      email: newEmail,
    });

    await this.tokenRepository.delete(record.id);

    try {
      await this.emailService.sendEmailChangeSuccess(
        newEmail,
        user.fullName,
        newEmail,
      );

      await this.emailService.sendEmailChangeComplete(
        oldEmail,
        user.fullName,
        oldEmail,
        newEmail,
      );
    } catch (error) {
      console.error('Failed to send email change confirmation emails:', error);
    }

    return {
      message: 'Email address updated successfully',
      newEmail: newEmail,
    };
  }

  async cancelEmailChange(userId: number) {
    const result = await this.tokenRepository.delete({ userId });

    if (result.affected === 0) {
      throw new NotFoundException('No pending email change request found');
    }

    return {
      message: 'Email change request cancelled successfully',
    };
  }

  async getPendingEmailChange(userId: number) {
    const token = await this.tokenRepository.findOne({
      where: { userId },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new NotFoundException('No pending email change request found');
    }

    return {
      newEmail: token.newEmail,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
    };
  }
}
