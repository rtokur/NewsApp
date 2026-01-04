import { ApiProperty } from '@nestjs/swagger';

export class NewsDetailResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the news item',
  })
  id: number;
  @ApiProperty({
    example: 'Breaking News: Major Event Unfolds',
    description: 'The title of the news item',
  })
  title: string;
  @ApiProperty({
    example: 'Detailed content of the news item goes here...',
    description: 'The full content of the news item',
  })
  content: string;
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The URL of the news item image',
  })
  imageUrl: string;
  @ApiProperty({
    example: '2024-06-15T12:00:00Z',
    description: 'The publication date of the news item',
  })
  publishedAt: Date;
  @ApiProperty()
  source: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'The logo URL of the news source',
  })
  sourceLogoUrl: string;

  @ApiProperty()
  category: {
    id: number;
    name: string;
  };
}
