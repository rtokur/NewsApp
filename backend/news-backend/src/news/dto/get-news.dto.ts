import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetNewsDto{
    @ApiPropertyOptional({ description: 'Page number for pagination', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be an integer' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page for pagination', example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Category ID to filter news', example: 3 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Category ID must be an integer' })
    categoryId?: number;
}