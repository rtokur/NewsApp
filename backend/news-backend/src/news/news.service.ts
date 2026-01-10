import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { GetNewsDto } from './dto/get-news.dto';
import { NewsDetailResponseDto } from './dto/news-detail-response.dto';
import { GetHighlightNewsDto } from './dto/get-highlight-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async findAll(query: GetNewsDto) {
    const { qb, page, limit } = this.buildBaseQuery(query);

    const [news, total] = await qb.getManyAndCount();

    return {
      data: news.map(this.mapToListItem),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBreakingHighlight({ limit }: GetHighlightNewsDto) {
    const take = limit ?? 5;

    const news = await this.newsRepository.find({
      where: { isBreaking: true },
      order: { publishedAt: 'DESC' },
      take,
      relations: ['category', 'source'],
    });

    return {
      data: news.map(this.mapToListItem),
    };
  }

  async findRecommendationsHighlight({ limit }: GetHighlightNewsDto) {
    const take = limit ?? 5;

    const news = await this.newsRepository.find({
      where: { isBreaking: false },
      order: { publishedAt: 'DESC' },
      take,
      relations: ['category', 'source'],
    });

    return {
      data: news.map(this.mapToListItem),
    };
  }

  async findBreakingNews(query: GetNewsDto) {
    const { qb, page, limit } = this.buildBaseQuery(query, (qb) =>
      qb.andWhere('news.isBreaking = true'),
    );

    const [news, total] = await qb.getManyAndCount();

    return {
      data: news.map(this.mapToListItem),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findRecommendations(query: GetNewsDto) {
    const { qb, page, limit } = this.buildBaseQuery(query, (qb) =>
      qb.andWhere('news.isBreaking = false'),
    );

    const [news, total] = await qb.getManyAndCount();

    return {
      data: news.map(this.mapToListItem),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<NewsDetailResponseDto> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['category', 'source'],
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return {
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
