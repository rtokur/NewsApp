import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorites.entity';
import { News } from 'src/news/entities/news.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Favorite, News, User])],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule {}
