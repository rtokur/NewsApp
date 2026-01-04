import { Controller, Get, ParseIntPipe, Query, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';
import { News } from './entities/news.entity';
import { NewsListResponseDto } from './dto/news-list-response.dto';
import { GetNewsDto } from './dto/get-news.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiResponse({type: NewsListResponseDto})
  async findAll(
    @Query() query: GetNewsDto,
  ) {
    return this.newsService.findAll(query);
  }

  @ApiParam({name: 'id', type: Number})
  @ApiResponse({status: 200, description: 'The news item has been successfully retrieved.'})
  @ApiResponse({status: 404, description: 'News item not found.'})
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }
}
