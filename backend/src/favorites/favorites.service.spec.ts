import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorites.entity';
import { News } from 'src/news/entities/news.entity';
import { User } from 'src/users/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('FavoritesService', () => {
  let service: FavoritesService;
  let favoriteRepository: Repository<Favorite>;
  let newsRepository: Repository<News>;
  let userRepository: Repository<User>;
  let redisService: RedisService;

  const mockQueryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockFavoriteRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
    create : jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockNewsRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    delByPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockFavoriteRepository,
        },
        {
          provide: getRepositoryToken(News),
          useValue: mockNewsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },

      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    favoriteRepository = module.get<Repository<Favorite>>(getRepositoryToken(Favorite));
    newsRepository = module.get<Repository<News>>(getRepositoryToken(News));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('should add a favorite successfully', async () => {
      const userId = 1;
      const newsId = 1;
      const mockUser = { id: userId, email: 'test@test.com' };
      const mockNews = { id: newsId, title: 'Test News' };
      const mockFavorite = { id: 1, user: mockUser, news: mockNews };
  
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockNewsRepository.findOne.mockResolvedValue(mockNews);
      mockFavoriteRepository.findOne.mockResolvedValue(null);
      mockFavoriteRepository.create.mockReturnValue(mockFavorite);
      mockFavoriteRepository.save.mockResolvedValue(mockFavorite);
  
      const result = await service.addFavorite(userId, newsId);
  
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockNewsRepository.findOne).toHaveBeenCalledWith({
        where: { id: newsId },
      });
      expect(mockFavoriteRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          news: { id: newsId },
        },
      });
      expect(mockFavoriteRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        news: mockNews,
      });
      expect(mockFavoriteRepository.save).toHaveBeenCalledWith(mockFavorite);
      expect(mockRedisService.delByPattern).toHaveBeenCalledWith(
        `favorites:user:${userId}:*`
      );
      expect(result).toEqual(mockFavorite);
    });
  
    it('should throw NotFoundException when user not found', async () => {
      const userId = 1;
      const newsId = 1;
  
      mockUserRepository.findOne.mockResolvedValue(null);
  
      await expect(service.addFavorite(userId, newsId)).rejects.toThrow(
        'User not found'
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  
    it('should throw NotFoundException when news not found', async () => {
      const userId = 1;
      const newsId = 1;
      const mockUser = { id: userId, email: 'test@test.com' };
  
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockNewsRepository.findOne.mockResolvedValue(null);
  
      await expect(service.addFavorite(userId, newsId)).rejects.toThrow(
        'News not found'
      );
      expect(mockNewsRepository.findOne).toHaveBeenCalledWith({
        where: { id: newsId },
      });
    });
  
    it('should throw BadRequestException when favorite already exists', async () => {
      const userId = 1;
      const newsId = 1;
      const mockUser = { id: userId, email: 'test@test.com' };
      const mockNews = { id: newsId, title: 'Test News' };
      const existingFavorite = { id: 1, user: mockUser, news: mockNews };
  
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockNewsRepository.findOne.mockResolvedValue(mockNews);
      mockFavoriteRepository.findOne.mockResolvedValue(existingFavorite);
  
      await expect(service.addFavorite(userId, newsId)).rejects.toThrow(
        'Already added to favorites'
      );
    });
  });
  
  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      const userId = 1;
      const newsId = 1;
      const mockFavorite = {
        id: 1,
        user: { id: userId },
        news: { id: newsId },
      };
  
      mockFavoriteRepository.findOne.mockResolvedValue(mockFavorite);
      mockFavoriteRepository.remove.mockResolvedValue(mockFavorite);
  
      const result = await service.removeFavorite(userId, newsId);
  
      expect(mockFavoriteRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          news: { id: newsId },
        },
      });
      expect(mockFavoriteRepository.remove).toHaveBeenCalledWith(mockFavorite);
      expect(mockRedisService.delByPattern).toHaveBeenCalledWith(
        `favorites:user:${userId}:*`
      );
      expect(result).toEqual({ success: true });
    });
  
    it('should throw NotFoundException when favorite not found', async () => {
      const userId = 1;
      const newsId = 1;
  
      mockFavoriteRepository.findOne.mockResolvedValue(null);
  
      await expect(service.removeFavorite(userId, newsId)).rejects.toThrow(
        'Favorite not found'
      );
      expect(mockFavoriteRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          news: { id: newsId },
        },
      });
    });
  });
  
  describe('getUserFavorites', () => {
    it('should return favorites from cache if available', async () => {
      const userId = 1;
      const limit = 10;
      const cachedData = {
        items: [{ id: 1, news: { title: 'Test News' } }],
        nextCursor: null,
      };
      const cacheKey = `favorites:user:${userId}:limit:${limit}:cursor:null:category:null:sort:DESC:search:null`;
  
      mockRedisService.get.mockResolvedValue(JSON.stringify(cachedData));
  
      const result = await service.getUserFavorites(userId, limit);
  
      expect(mockRedisService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(cachedData);
      expect(mockFavoriteRepository.createQueryBuilder).not.toHaveBeenCalled();
    });
  
    it('should fetch favorites from database when cache is empty', async () => {
      const userId = 1;
      const limit = 10;
      const mockFavorites = [
        {
          id: 1,
          createdAt: new Date('2024-01-01'),
          news: { id: 1, title: 'Test News' },
        },
      ];
      const cacheKey = `favorites:user:${userId}:limit:${limit}:cursor:null:category:null:sort:DESC:search:null`;
  
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilder.getMany.mockResolvedValue(mockFavorites);
  
      const result = await service.getUserFavorites(userId, limit);
  
      expect(mockRedisService.get).toHaveBeenCalledWith(cacheKey);
      expect(mockFavoriteRepository.createQueryBuilder).toHaveBeenCalledWith(
        'favorite'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'favorite.news',
        'news'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :userId', {
        userId,
      });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'favorite.createdAt',
        'DESC'
      );
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(limit + 1);
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(result.items).toEqual(mockFavorites);
      expect(result.nextCursor).toBeNull();
    });
  
    it('should apply category filter when categoryId is provided', async () => {
      const userId = 1;
      const limit = 10;
      const categoryId = 5;
      const mockFavorites = [];
  
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilder.getMany.mockResolvedValue(mockFavorites);
  
      await service.getUserFavorites(userId, limit, undefined, categoryId);
  
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.id = :categoryId',
        { categoryId }
      );
    });
  
    it('should apply search filter when search is provided', async () => {
      const userId = 1;
      const limit = 10;
      const search = 'test';
      const mockFavorites = [];
  
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilder.getMany.mockResolvedValue(mockFavorites);
  
      await service.getUserFavorites(
        userId,
        limit,
        undefined,
        undefined,
        'DESC',
        search
      );
  
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(news.title ILIKE :search OR news.content ILIKE :search)',
        { search: `%${search}%` }
      );
    });
  
    it('should apply cursor pagination when cursor is provided', async () => {
      const userId = 1;
      const limit = 10;
      const cursor = '2024-01-01T00:00:00.000Z';
      const mockFavorites = [];
  
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilder.getMany.mockResolvedValue(mockFavorites);
  
      await service.getUserFavorites(userId, limit, cursor);
  
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'favorite.createdAt < :cursor',
        { cursor: new Date(cursor) }
      );
    });
  
    it('should throw BadRequestException for invalid cursor format', async () => {
      const userId = 1;
      const limit = 10;
      const invalidCursor = 'invalid-date';
  
      mockRedisService.get.mockResolvedValue(null);
  
      await expect(
        service.getUserFavorites(userId, limit, invalidCursor)
      ).rejects.toThrow('Invalid cursor format');
    });
  
    it('should return nextCursor when there are more items', async () => {
      const userId = 1;
      const limit = 2;
      const mockFavorites = [
        {
          id: 1,
          createdAt: new Date('2024-01-03'),
          news: { id: 1, title: 'News 1' },
        },
        {
          id: 2,
          createdAt: new Date('2024-01-02'),
          news: { id: 2, title: 'News 2' },
        },
        {
          id: 3,
          createdAt: new Date('2024-01-01'),
          news: { id: 3, title: 'News 3' },
        },
      ];
  
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilder.getMany.mockResolvedValue(mockFavorites);
  
      const result = await service.getUserFavorites(userId, limit);
  
      expect(result.items).toHaveLength(2);
      expect(result.nextCursor).toEqual(new Date('2024-01-02'));
    });
  
    it('should apply ASC sort order when specified', async () => {
      const userId = 1;
      const limit = 10;
      const mockFavorites = [];
  
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilder.getMany.mockResolvedValue(mockFavorites);
  
      await service.getUserFavorites(userId, limit, undefined, undefined, 'ASC');
  
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'favorite.createdAt',
        'ASC'
      );
    });
  });
});
