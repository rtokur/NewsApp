import { Controller, Get, ParseIntPipe, Query, Param, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { News } from './entities/news.entity';
import { NewsListResponseDto } from './dto/news-list-response.dto';
import { GetNewsDto } from './dto/get-news.dto';
import { GetHighlightNewsDto } from './dto/get-highlight-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('News')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('v1/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'News list',
    type: NewsListResponseDto,
  })
  async findAll(@Query() query: GetNewsDto) {
    return this.newsService.findAll(query);
  }

  @Get('breaking')
  @ApiResponse({
    status: 200,
    description: 'Breaking news list',
    type: NewsListResponseDto,
  })
  async findBreakingNews(@Query() query: GetNewsDto) {
    return this.newsService.findBreakingNews(query);
  }

  @Get('breaking/highlight')
  @ApiResponse({
    status: 200,
    description: 'Highlight breaking news list',
    type: NewsResponseDto,
  })
  async findBreakingHighlight(@Query() query: GetHighlightNewsDto) {
    return this.newsService.findBreakingHighlight(query);
  }

  @Get('recommendations')
  @ApiResponse({
    status: 200,
    description: 'Recommendations news list',
    type: NewsListResponseDto,
  })
  async findRecommendations(@Query() query: GetNewsDto) {
    return this.newsService.findRecommendations(query);
  }

  @Get('recommendations/highlight')
  @ApiResponse({
    status: 200,
    description: 'Highlight recommendations news list',
    type: NewsResponseDto,
  })
  async findRecommendationsHighlight(@Query() query: GetHighlightNewsDto) {
    return this.newsService.findRecommendationsHighlight(query);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The news item has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'News item not found.' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }
}
