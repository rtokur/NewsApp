import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { News } from "src/news/entities/news.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { ReadingHistory } from "./entities/reading-history.entity";
import { ReadingHistoryListResponseDto } from "./dto/reading-history-list-response.dto";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectRepository(ReadingHistory)
    private readonly historyRepo: Repository<ReadingHistory>,

    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly redisService: RedisService,
  ) {}

  async markAsRead(userId: number, newsId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const news = await this.newsRepo.findOneBy({ id: newsId });

    if (!user || !news) {
      throw new NotFoundException();
    }

    const existing = await this.historyRepo.findOne({
      where: {
        userId,
        newsId,
      },
    });

    if (existing) {
      existing.readAt = new Date();
      return this.historyRepo.save(existing);
    }

    const history = this.historyRepo.create({
      user,
      news,
    });

    await this.historyRepo.save(history);
    await this.redisService.delByPattern(`reading-history:${userId}:*`);

    return ({ success: true });
  }

  async getHistory(
      userId: number,
      limit = 10,
      cursor?: string,
      categoryId?: number,
      search?: string,
  ) {
    const cacheKey = `reading-history:${userId}:${limit}:${cursor || 'none'}:${categoryId || 'none'}:${search || 'none'}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }

    console.log('FROM POSTGRES');

    const qb = this.historyRepo
      .createQueryBuilder('history')
      .innerJoin('history.user', 'user')
      .innerJoinAndSelect('history.news', 'news')
      .leftJoinAndSelect('news.category', 'category')
      .leftJoinAndSelect('news.source', 'source')
      .where('user.id = :userId', { userId })
      .orderBy('history.readAt', 'DESC')
      .take(limit + 1);
  
      if (categoryId) {
        qb.andWhere('category.id = :categoryId', { categoryId });
      }
      
      if (search) {
        qb.andWhere(
          `(news.title ILIKE :search
            OR news.content ILIKE :search
            OR source.name ILIKE :search)`,
          { search: `%${search}%` },
        );
      }  

    if (cursor) {
      qb.andWhere('history.readAt < :cursor', {
        cursor: new Date(cursor),
      });
    }
  
    const results = await qb.getMany();
  
    const hasNextPage = results.length > limit;
    const items = hasNextPage ? results.slice(0, limit) : results;
    const result = {
      items: items.map(this.mapToDto),
      nextCursor: hasNextPage
        ? items[items.length - 1].readAt.toISOString()
        : null, 
    }

    await this.redisService.set(cacheKey, JSON.stringify(result), 300); 
    
    return result;
  }  

  async removeFromHistory(userId: number, newsId: number) {
    const result = await this.historyRepo.delete({
      user: { id: userId },
      news: { id: newsId },
    });

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    
    await this.redisService.delByPattern(`reading-history:${userId}:*`);

    return { success: true };
  }

  private mapToDto(history: ReadingHistory) {
    return {
      id: history.id,
      readAt: history.readAt,
      news: {
        id: history.news.id,
        title: history.news.title,
        imageUrl: history.news.imageUrl,
        publishedAt: history.news.publishedAt,
        source: history.news.source
          ? {
              id: history.news.source.id,
              name: history.news.source.name,
              logoUrl: history.news.source.logoUrl,
            }
          : null,
        category: history.news.category
        ? {
            id: history.news.category.id,
            name: history.news.category.name,
          }
        : null,
      },
    };
  }
  
}
