import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationMetaDto {
    @ApiProperty({ example: 100, description: 'Total number of items' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    @Type(() => Number)
    page: number;

    @ApiProperty({ example: 10, description: 'Number of items per page' })
    @Type(() => Number)
    limit: number;

    @ApiProperty({ example: 10, description: 'Total number of pages' })
    totalPages: number;
}