import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { RedisService } from 'src/redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('NewsService', () => {
  let service: NewsService;
  let newsRepository: Repository<News>;
  let redisService: RedisService;

  const mockNewsList = [
    {
      id: 1,
      title: 'News 1',
      imageUrl: 'img1',
      publishedAt: new Date(),
      source: { id: 1, name: 'BBC', logoUrl: 'bbc.png' },
      category: { id: 1, name: 'Tech' },
    },
    {
      id: 2,
      title: 'News 2',
      imageUrl: 'img2',
      publishedAt: new Date(),
      source: { id: 2, name: 'CNN', logoUrl: 'cnn.png' },
      category: { id: 2, name: 'Sports' },
    },
  ];

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getMany: jest.fn(),
  };

  const mockNewsRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(News),
          useValue: mockNewsRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    newsRepository = module.get<Repository<News>>(getRepositoryToken(News));
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* ---------------------------------- findAll ---------------------------------- */

  it('should return news list from cache', async () => {
    mockRedisService.get.mockResolvedValue(
      JSON.stringify({ data: [], meta: {} }),
    );

    const result = await service.findAll({});

    expect(redisService.get).toHaveBeenCalled();
    expect(newsRepository.createQueryBuilder).not.toHaveBeenCalled();
    expect(result).toEqual({ data: [], meta: {} });
  });

  it('should return news list from database and cache it', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockQueryBuilder.getManyAndCount.mockResolvedValue([mockNewsList, 2]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(newsRepository.createQueryBuilder).toHaveBeenCalledWith('news');
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    expect(redisService.set).toHaveBeenCalled();

    expect(result.data).toHaveLength(2);
    expect(result.meta.total).toBe(2);
  });

  /* -------------------------- findBreakingHighlight -------------------------- */

  it('should return breaking highlight news from database and cache it', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockNewsRepository.find.mockResolvedValue(mockNewsList);

    const result = await service.findBreakingHighlight({ limit: 2 });

    expect(newsRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isBreaking: true },
        take: 2,
      }),
    );
    expect(redisService.set).toHaveBeenCalled();
    expect(result.data).toHaveLength(2);
  });

  /* ------------------------ findRecommendationsHighlight ----------------------- */

  it('should return recommendations highlight news', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockNewsRepository.find.mockResolvedValue(mockNewsList);

    const result = await service.findRecommendationsHighlight({ limit: 2 });

    expect(newsRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isBreaking: false },
      }),
    );
    expect(result.data).toHaveLength(2);
  });

  /* ---------------------------------- findOne --------------------------------- */

  it('should return news detail from cache', async () => {
    const cached = { id: 1, title: 'Cached news' };
    mockRedisService.get.mockResolvedValue(JSON.stringify(cached));

    const result = await service.findOne(1);

    expect(redisService.get).toHaveBeenCalledWith('news:detail:1');
    expect(newsRepository.findOne).not.toHaveBeenCalled();
    expect(result).toEqual(cached);
  });

  it('should throw NotFoundException if news not found', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockNewsRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should return news detail from database and cache it', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockNewsRepository.findOne.mockResolvedValue({
      ...mockNewsList[0],
      content: 'detail',
    });

    const result = await service.findOne(1);

    expect(newsRepository.findOne).toHaveBeenCalled();
    expect(redisService.set).toHaveBeenCalled();
    expect(result.id).toBe(1);
    expect(result.source).toBeDefined();
    expect(result.category).toBeDefined();
  });
});
