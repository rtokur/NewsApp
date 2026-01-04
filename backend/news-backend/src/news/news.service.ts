import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { GetNewsDto } from './dto/get-news.dto';
import { NewsDetailResponseDto } from './dto/news-detail-response.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async findAll({ page = 1, limit = 10, categoryId }: GetNewsDto) {
    const query = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.category', 'category')
      .orderBy('news.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    const [news, total] = await query.getManyAndCount();

    return {
      data: news.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        publishedAt: item.publishedAt,
        source: item.source,
        sourceLogoUrl: item.sourceLogoUrl,
        category: item.category
          ? { id: item.category.id, name: item.category.name }
          : null,
      })),
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
}
