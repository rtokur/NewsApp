import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.newsCount', 'category.news')
      .orderBy('category.name', 'ASC')
      .getMany();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      newsCount: (category as Category & { newsCount: number }).newsCount,
    }));
  }
}
