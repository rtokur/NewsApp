import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'test@mail.com',
    description: 'Email address of the user requesting password reset',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(254, { message: 'Email is too long' })
  @IsString({ message: 'Email must be a string' })
  email: string;
}
