import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
    ) {
        return this.newsService.findAll(Number(page), Number(limit));
    }
}
