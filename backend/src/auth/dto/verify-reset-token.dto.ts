import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}