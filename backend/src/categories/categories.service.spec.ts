import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<Category>;
  let redisService: RedisService;

  const mockCategoriesFromDb = [
    {
      id: 1,
      name: 'Technology',
      newsCount: 10,
    },
    {
      id: 2,
      name: 'Sports',
      newsCount: 5,
    },
  ];

  const mockQueryBuilder = {
    loadRelationCountAndMap: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockCategoryRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return categories from cache if available', async () => {
      mockRedisService.get.mockResolvedValue(JSON.stringify(mockCategoriesFromDb));

      const result = await service.findAll();

      expect(redisService.get).toHaveBeenCalledWith('categories:all');
      expect(result).toEqual(mockCategoriesFromDb);
      expect(mockCategoryRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should return categories from database and cache them if not in cache', async () => {
      mockRedisService.get.mockResolvedValue(null);
    
      mockQueryBuilder.getMany.mockResolvedValue([
        { id: 1, name: 'Technology', newsCount: 10 },
        { id: 2, name: 'Sports', newsCount: 5 },
      ]);
    
      const expectedResponse = [
        { id: 1, name: 'Technology', newsCount: 10 },
        { id: 2, name: 'Sports', newsCount: 5 },
      ];
    
      const result = await service.findAll();
    
      expect(redisService.get).toHaveBeenCalledWith('categories:all');
      expect(categoryRepository.createQueryBuilder).toHaveBeenCalledWith('category');
      expect(mockQueryBuilder.loadRelationCountAndMap).toHaveBeenCalledWith(
        'category.newsCount',
        'category.news',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'category.name',
        'ASC',
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    
      expect(redisService.set).toHaveBeenCalledWith(
        'categories:all',
        JSON.stringify(expectedResponse),
        60000,
      );
    
      expect(result).toEqual(expectedResponse);
    });    
  });
});
