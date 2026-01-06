import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Category list with news count',
    type: CategoryResponseDto,
    isArray: true,
  })
  findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }
}
