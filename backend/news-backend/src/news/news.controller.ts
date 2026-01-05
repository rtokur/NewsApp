import { Controller, Get, ParseIntPipe, Query, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';
import { News } from './entities/news.entity';
import { NewsListResponseDto } from './dto/news-list-response.dto';
import { GetNewsDto } from './dto/get-news.dto';
import { GetBreakingNewsDto } from './dto/get-breaking-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'News list',
    type: NewsListResponseDto})
  async findAll(
    @Query() query: GetNewsDto,
  ) {
    return this.newsService.findAll(query);
  }

  @Get('breaking')
  @ApiResponse({
    status: 200,
    description: 'Breaking news list',
    type: NewsListResponseDto})
  async findBreakingNews(@Query() query: GetNewsDto) {
    return this.newsService.findBreakingNews(query);
  }

  @Get('breaking/highlight')
  @ApiResponse({
    status: 200,
    description: 'Highlight breaking news list',
    type: NewsResponseDto})
  async findBreakingHighlight(@Query() query: GetBreakingNewsDto) {
    return this.newsService.findBreakingHighlight(query);
  }

  @Get('recommendations')
  @ApiResponse({ 
    status: 200,
    description: 'Recommendations news list', 
    type: NewsListResponseDto})
  async findRecommendations(@Query() query: GetNewsDto) {
    return this.newsService.findRecommendations(query);
  }

  @ApiParam({name: 'id', type: Number})
  @ApiResponse({status: 200, description: 'The news item has been successfully retrieved.'})
  @ApiResponse({status: 404, description: 'News item not found.'})
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }
}
