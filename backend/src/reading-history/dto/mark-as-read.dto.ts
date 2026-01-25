import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class MarkAsReadDto {
  @ApiProperty({ example: 123 , description: 'The ID of the news article to mark as read' })
  @IsInt()
  @Min(1)
  newsId: number;
}
