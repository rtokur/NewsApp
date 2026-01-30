import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@mail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(254, { message: 'Email is too long' })
  email: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(64, { message: 'Password must be at most 64 characters' })
  password: string;
}
