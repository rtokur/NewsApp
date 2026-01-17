import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { CategoryResponseDto } from './dto/category-response.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CategoriesService {
  private readonly cacheTTL = 60 * 1000;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private redisService: RedisService,
  ) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const cacheKey = 'categories:all';
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      console.log('FROM REDIS');
      return JSON.parse(cached);
    }

    console.log('FROM POSTGRES');

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.newsCount', 'category.news')
      .orderBy('category.name', 'ASC')
      .getMany();

    const response = categories.map((category) => ({
      id: category.id,
      name: category.name,
      newsCount: (category as Category & { newsCount: number }).newsCount,
    }));

    await this.redisService.set(
      cacheKey,
      JSON.stringify(response),
      this.cacheTTL,
    );

    return response;
  }
}
