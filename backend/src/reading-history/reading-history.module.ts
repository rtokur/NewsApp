import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/news/entities/news.entity';
import { User } from 'src/users/entities/user.entity';
import { ReadingHistoryController } from './reading-history.controller';
import { ReadingHistoryService } from './reading-history.service';
import { ReadingHistory } from './entities/reading-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ReadingHistory, News, User])],
    controllers: [ReadingHistoryController],
    providers: [ReadingHistoryService],
})
export class ReadingHistoryModule {}
