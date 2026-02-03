import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestEmailChangeDto {
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'New email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  newEmail: string;

  @ApiProperty({
    example: 'MyPassword123',
    description: 'Current password for verification',
  })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  currentPassword: string;
}
