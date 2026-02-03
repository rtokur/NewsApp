
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailChangeDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890...',
    description: 'Email change verification token',
  })
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  token: string;
}