import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeEmailDto {
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'New email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  newEmail: string;

  @ApiProperty({
    example: 'MySecurePassword123',
    description: 'Current password for security verification',
  })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  currentPassword: string;
}

export class VerifyEmailChangeDto {
  @ApiProperty({
    example: 'verificationtoken123',
    description: 'Token sent to the new email address for verification',
  })
  @IsNotEmpty({ message: 'Verification token is required' })
  @IsString()
  token: string;
}