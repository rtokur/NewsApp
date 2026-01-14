import { ApiProperty } from '@nestjs/swagger';
import { NewsResponseDto } from './news-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

export class NewsListResponseDto {
  @ApiProperty({ type: [NewsResponseDto], description: 'List of news items' })
  data: NewsResponseDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Pagination metadata' })
  meta: PaginationMetaDto;
}
