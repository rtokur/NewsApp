import { ApiProperty } from "@nestjs/swagger";

export class NewsResponseDto {
    @ApiProperty({ example: 1, description: 'The unique identifier of the news item' })
    id: number;

    @ApiProperty({ example: 'Breaking News: Major Event Unfolds', description: 'The title of the news item' })
    title: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'The URL of the news item image' })
    imageUrl: string;

    @ApiProperty({ example: '2024-06-15T12:00:00Z', description: 'The publication date of the news item' })
    publishedAt: Date;

    @ApiProperty()
    source: string;
  
    @ApiProperty({ nullable: true })
    category: {
      id: number;
      name: string;
    } | null;
}