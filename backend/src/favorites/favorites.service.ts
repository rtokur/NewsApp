import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorites.entity';
import { News } from 'src/news/entities/news.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addFavorite(userId: number, newsId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const news = await this.newsRepository.findOne({
      where: { id: newsId },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    const exists = await this.favoriteRepository.findOne({
      where: {
        user: { id: user.id },
        news: { id: news.id },
      },
    });

    if (exists) {
      throw new BadRequestException('Already added to favorites');
    }

    const favorite = this.favoriteRepository.create({
      user,
      news,
    });

    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: number, newsId: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        news: { id: newsId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.remove(favorite);

    return { success: true };
  }

  async getUserFavorites(
    userId: number,
    limit = 10,
    cursor?: string,
    categoryId?: number,
    sort: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ) {
    const qb = this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoin('favorite.user', 'user')
      .leftJoinAndSelect('favorite.news', 'news')
      .leftJoinAndSelect('news.category', 'category')
      .leftJoinAndSelect('news.source', 'source')
      .where('user.id = :userId', { userId: Number(userId) })

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    if (search) {
      qb.andWhere('(news.title ILIKE :search OR news.content ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (cursor) {
      const cursorDate = new Date(cursor);

      if (isNaN(cursorDate.getTime())) {
        throw new BadRequestException('Invalid cursor format');
      }

      qb.andWhere('favorite.createdAt < :cursor', {
        cursor: cursorDate,
      });
    }

    qb.orderBy('favorite.createdAt', sort);

    qb.take(limit + 1);

    const favorites = await qb.getMany();

    const hasNextPage = favorites.length > limit;
    const items = hasNextPage ? favorites.slice(0, limit) : favorites;

    return {
      items,
      nextCursor: hasNextPage ? items[items.length - 1].createdAt : null,
    };
  }
}
