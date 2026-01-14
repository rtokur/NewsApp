import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('v1/categories')
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
