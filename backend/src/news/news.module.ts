import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Category } from 'src/categories/entities';

@Module({
  imports: [TypeOrmModule.forFeature([News, Category])],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
