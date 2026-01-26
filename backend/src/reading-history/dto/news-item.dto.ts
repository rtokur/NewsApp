import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/categories/entities";
import { Source } from "src/sources/entities/source.entity";

export class NewsItemDto {
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    title: string;
  
    @ApiProperty()
    imageUrl: string;
  
    @ApiProperty()
    publishedAt: Date;
  
    @ApiProperty({ type: Source, nullable: true })
    source: Source | null;
  
    @ApiProperty({ type: Category, nullable: true })
    category: Category | null;
  }