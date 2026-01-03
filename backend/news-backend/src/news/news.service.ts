import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { GetNewsDto } from './dto/get-news.dto';

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

  async findOne(id: number) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }
}
