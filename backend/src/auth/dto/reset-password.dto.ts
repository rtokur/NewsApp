import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'reset-token-from-email',
    description: 'Password reset token sent via email',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  @Transform(({ value }) => value?.trim())
  token: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'New password for the account',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(64, { message: 'Password must be at most 64 characters' })
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one number',
  })
  @IsNotEmpty({ message: 'Password is required' })
  newPassword: string;
}
