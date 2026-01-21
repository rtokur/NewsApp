import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { SortOrder } from "src/news/dto/get-news.dto";

export class GetFavoritesQueryDto {
    @ApiPropertyOptional({description: 'Number of items return',
        example: 10,
        minimum: 1,
        maximum: 50,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 10;

    @ApiPropertyOptional({description: 'Cursor for pagination',
        example: '2024-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsString()
    cursor?: string;

    @ApiPropertyOptional({
        description: 'Category ID to filter favorites',
        example: 3,
      })
      @IsOptional()
      @Type(() => Number)
      @IsInt({ message: 'Category ID must be an integer' })
      categoryId?: number;
      @ApiPropertyOptional({
        description: 'Search in news title and content',
        example: 'economy',
      })
      @IsOptional()
      @IsString()
      search?: string;
    
      @ApiPropertyOptional({enum: SortOrder, default: SortOrder.DESC})
      @IsString()
      @IsOptional()
      sortOrder?: SortOrder = SortOrder.DESC;
}