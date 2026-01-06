import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { GetNewsDto } from './dto/get-news.dto';
import { NewsDetailResponseDto } from './dto/news-detail-response.dto';
import { GetBreakingNewsDto } from './dto/get-breaking-news.dto';

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
      }
    }
  }

  async findBreakingHighlight({ limit = 5 }: GetBreakingNewsDto) {
    const news = await this.newsRepository.find({
      where: { isBreaking: true },
      order: { publishedAt: 'DESC' },
      take: limit,
      relations: ['category'],
    });

    return {
      data: news.map(this.mapToListItem),
    };
  }

  async findBreakingNews(query: GetNewsDto) {
    const { qb, page, limit } = this.buildBaseQuery(query, qb =>
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
    const { qb, page, limit } = this.buildBaseQuery(query, qb =>
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
      relations: ['category'],
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
      source: news.source,
      sourceLogoUrl: news.sourceLogoUrl,
      category: { id: news.category.id, name: news.category.name },
    };
  }

  private buildBaseQuery(
    {
      page = 1,
      limit = 10,
      categoryId,
      search,
      sortOrder,
    }: GetNewsDto,
    extraWhere?: (qb: any) => void,
  ) {
    const qb = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.category', 'category')
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
          OR news.source ILIKE :search)`,
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
    source: news.source,
    sourceLogoUrl: news.sourceLogoUrl,
    category: news.category
      ? { id: news.category.id, name: news.category.name }
      : null,
  });
}
