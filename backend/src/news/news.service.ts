import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { GetNewsDto } from './dto/get-news.dto';
import { NewsDetailResponseDto } from './dto/news-detail-response.dto';
import { GetHighlightNewsDto } from './dto/get-highlight-news.dto';
import { buildCacheKey } from './cache.util';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class NewsService {
  private readonly cacheTTL = 60 * 1000; 

  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(query: GetNewsDto) {
    const cacheKey = buildCacheKey('news:list', query);
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }

    console.log('FROM POSTGRES');
    const { qb, page, limit } = this.buildBaseQuery(query);

    const [news, total] = await qb.getManyAndCount();

    const response = {
      data: news.map(this.mapToListItem),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }

    await this.redisService.set(cacheKey, JSON.stringify(response), this.cacheTTL);

    return response;
  }

  async findBreakingHighlight({ limit }: GetHighlightNewsDto) {
    const take = limit ?? 5;

    const cacheKey = `news:breaking:highlight:limit=${take}` ;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }
    
    const news = await this.newsRepository.find({
      where: { isBreaking: true },
      order: { publishedAt: 'DESC' },
      take,
      relations: ['category', 'source'],
    });

    const response = {
      data: news.map(this.mapToListItem),
    };

    await this.redisService.set(cacheKey, JSON.stringify(response), this.cacheTTL,);

    return response;
  }

  async findRecommendationsHighlight({ limit }: GetHighlightNewsDto) {
    const take = limit ?? 5;
    const cacheKey = `news:recommendations:highlight:limit=${take}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }

    const news = await this.newsRepository.find({
      where: { isBreaking: false },
      order: { publishedAt: 'DESC' },
      take,
      relations: ['category', 'source'],
    });

    const response = {
      data: news.map(this.mapToListItem),
    };

    await this.redisService.set(cacheKey, JSON.stringify(response), this.cacheTTL,);

    return response;
  }

  async findBreakingNews(query: GetNewsDto) {
    const cacheKey = buildCacheKey('news:breaking:list', query);
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }

    const { qb, page, limit } = this.buildBaseQuery(query, (qb) =>
      qb.andWhere('news.isBreaking = true'),
    );

    const [news, total] = await qb.getManyAndCount();

    const response = {
      data: news.map(this.mapToListItem),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    await this.redisService.set(cacheKey, JSON.stringify(response), this.cacheTTL,);

    return response;
  }

  async findRecommendations(query: GetNewsDto) {
    const cacheKey = buildCacheKey('news:recommendations:list', query);
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }

    const { qb, page, limit } = this.buildBaseQuery(query, (qb) =>
      qb.andWhere('news.isBreaking = false'),
    );

    const [news, total] = await qb.getManyAndCount();

    const response = {
      data: news.map(this.mapToListItem),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    await this.redisService.set(cacheKey, JSON.stringify(response), this.cacheTTL,);

    return response;
  }

  async findOne(id: number): Promise<NewsDetailResponseDto> {
    const cacheKey = `news:detail:${id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }

    console.log('FROM POSTGRES');
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['category', 'source'],
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }
    
    const response: NewsDetailResponseDto = {
      id: news.id,
      title: news.title,
      content: news.content,
      imageUrl: news.imageUrl,
      publishedAt: news.publishedAt,
      source:  {
        id: news.source.id,
        name: news.source.name,
        logoUrl: news.source.logoUrl,
      },
      category: { id: news.category.id, name: news.category.name },
    };

    await this.redisService.set(cacheKey, JSON.stringify(response), this.cacheTTL,);

    return response;
  }

  private buildBaseQuery(
    { page = 1, limit = 10, categoryId, search, sortOrder }: GetNewsDto,
    extraWhere?: (qb: any) => void,
  ) {
    const qb = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.category', 'category')
      .leftJoinAndSelect('news.source', 'source')
      .orderBy('news.publishedAt', sortOrder ?? 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

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

    if (extraWhere) {
      extraWhere(qb);
    }

    return { qb, page, limit };
  }

  private mapToListItem = (news: News) => ({
    id: news.id,
    title: news.title,
    imageUrl: news.imageUrl,
    publishedAt: news.publishedAt,
    source: news.source
    ? {
        id: news.source.id,
        name: news.source.name,
        logoUrl: news.source.logoUrl,
      }
    : null,
    category: news.category
      ? { id: news.category.id, name: news.category.name }
      : null,
  });
}
