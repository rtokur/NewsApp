import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetReadingHistoryDto {
    @ApiProperty({ example: 10, description: 'The maximum number of reading history records to retrieve' , required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'The cursor for pagination, representing the readAt timestamp of the last retrieved record' , required: false})
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Category ID to filter news',
    example: 3,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Category ID must be an integer' })
  categoryId?: number;

  @ApiPropertyOptional({ example: 'Nvidia' })
  @IsOptional()
  @IsString()
  search?: string;
}
