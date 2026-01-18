import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const mockJwtAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{
        provide: CategoriesService,
        useValue: mockCategoriesService,
      }],
    })
    .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const mockCategoriesDto = [
      { id: 1, name: 'Category 1', newsCount: 5 },
      { id: 2, name: 'Category 2', newsCount: 10 },
    ];

    it('should call categoriesService.findAll and return its result', async () => {
      mockCategoriesService.findAll.mockResolvedValue(mockCategoriesDto);

      const result = await controller.findAll();

      expect(categoriesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCategoriesDto);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('newsCount');
    });
  });
});
