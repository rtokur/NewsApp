import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  private readonly cacheTTL = 60 * 1000; 
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const cacheKey = 'categories:all';
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('FROM REDIS');
      return cached as CategoryResponseDto[];
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

    await this.cacheManager.set(cacheKey, response, this.cacheTTL);
    
    return response;
  } 
}
