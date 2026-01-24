import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { GetFavoritesQueryDto } from './dto/get-favorites.query.dto';
import { SortOrder } from 'src/news/dto/get-news.dto';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let favoritesService: FavoritesService;

  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  const mockFavoritesService = {
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getUserFavorites: jest.fn(),
  };

  const mockUser: JwtPayload = {
    sub: 1,
    email: 'test@test.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<FavoritesController>(FavoritesController);
    favoritesService = module.get<FavoritesService>(FavoritesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addFavorite', () => {
    it('should add a favorite successfully', async () => {
      const newsId = 1;
      const mockResult = {
        id: 1,
        user: { id: mockUser.sub },
        news: { id: newsId },
        createdAt: new Date(),
      };

      mockFavoritesService.addFavorite.mockResolvedValue(mockResult);

      const result = await controller.addFavorite(mockUser, newsId);

      expect(favoritesService.addFavorite).toHaveBeenCalledWith(
        mockUser.sub,
        newsId
      );
      expect(result).toEqual(mockResult);
    });

    it('should call service with correct parameters', async () => {
      const newsId = 5;

      await controller.addFavorite(mockUser, newsId);

      expect(favoritesService.addFavorite).toHaveBeenCalledTimes(1);
      expect(favoritesService.addFavorite).toHaveBeenCalledWith(
        mockUser.sub,
        newsId
      );
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      const newsId = 1;
      const mockResult = { success: true };

      mockFavoritesService.removeFavorite.mockResolvedValue(mockResult);

      const result = await controller.removeFavorite(mockUser, newsId);

      expect(favoritesService.removeFavorite).toHaveBeenCalledWith(
        mockUser.sub,
        newsId
      );
      expect(result).toEqual(mockResult);
    });

    it('should call service with correct parameters', async () => {
      const newsId = 10;

      await controller.removeFavorite(mockUser, newsId);

      expect(favoritesService.removeFavorite).toHaveBeenCalledTimes(1);
      expect(favoritesService.removeFavorite).toHaveBeenCalledWith(
        mockUser.sub,
        newsId
      );
    });
  });

  describe('getMyFavorites', () => {
    it('should get user favorites with default parameters', async () => {
      const query: GetFavoritesQueryDto = {
        limit: 10,
      };
      const mockResult = {
        items: [
          {
            id: 1,
            createdAt: new Date(),
            news: { id: 1, title: 'Test News' },
          },
        ],
        nextCursor: null,
      };

      mockFavoritesService.getUserFavorites.mockResolvedValue(mockResult);

      const result = await controller.getMyFavorites(mockUser, query);

      expect(favoritesService.getUserFavorites).toHaveBeenCalledWith(
        mockUser.sub,
        query.limit,
        query.cursor,
        query.categoryId,
        query.sortOrder,
        query.search
      );
      expect(result).toEqual(mockResult);
    });

    it('should get user favorites with all query parameters', async () => {
      const query: GetFavoritesQueryDto = {
        limit: 20,
        cursor: '2024-01-01T00:00:00.000Z',
        categoryId: 5,
        sortOrder: SortOrder.ASC,
        search: 'test search',
      };
      const mockResult = {
        items: [],
        nextCursor: null,
      };

      mockFavoritesService.getUserFavorites.mockResolvedValue(mockResult);

      const result = await controller.getMyFavorites(mockUser, query);

      expect(favoritesService.getUserFavorites).toHaveBeenCalledWith(
        mockUser.sub,
        query.limit,
        query.cursor,
        query.categoryId,
        query.sortOrder,
        query.search
      );
      expect(result).toEqual(mockResult);
    });

    it('should get user favorites with pagination cursor', async () => {
      const query: GetFavoritesQueryDto = {
        limit: 10,
        cursor: '2024-01-15T12:00:00.000Z',
      };
      const mockResult = {
        items: [
          {
            id: 2,
            createdAt: new Date('2024-01-14'),
            news: { id: 2, title: 'News 2' },
          },
        ],
        nextCursor: new Date('2024-01-14'),
      };

      mockFavoritesService.getUserFavorites.mockResolvedValue(mockResult);

      const result = await controller.getMyFavorites(mockUser, query);

      expect(favoritesService.getUserFavorites).toHaveBeenCalledWith(
        mockUser.sub,
        10,
        '2024-01-15T12:00:00.000Z',
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockResult);
    });

    it('should get user favorites filtered by category', async () => {
      const query: GetFavoritesQueryDto = {
        limit: 10,
        categoryId: 3,
      };
      const mockResult = {
        items: [],
        nextCursor: null,
      };

      mockFavoritesService.getUserFavorites.mockResolvedValue(mockResult);

      const result = await controller.getMyFavorites(mockUser, query);

      expect(favoritesService.getUserFavorites).toHaveBeenCalledWith(
        mockUser.sub,
        10,
        undefined,
        3,
        undefined,
        undefined
      );
      expect(result).toEqual(mockResult);
    });

    it('should get user favorites with search query', async () => {
      const query: GetFavoritesQueryDto = {
        limit: 10,
        search: 'technology',
      };
      const mockResult = {
        items: [
          {
            id: 1,
            createdAt: new Date(),
            news: { id: 1, title: 'Technology News' },
          },
        ],
        nextCursor: null,
      };

      mockFavoritesService.getUserFavorites.mockResolvedValue(mockResult);

      const result = await controller.getMyFavorites(mockUser, query);

      expect(favoritesService.getUserFavorites).toHaveBeenCalledWith(
        mockUser.sub,
        10,
        undefined,
        undefined,
        undefined,
        'technology'
      );
      expect(result).toEqual(mockResult);
    });

    it('should get user favorites with DESC sort order', async () => {
      const query: GetFavoritesQueryDto = {
        limit: 10,
        sortOrder: SortOrder.DESC,
      };
      const mockResult = {
        items: [],
        nextCursor: null,
      };

      mockFavoritesService.getUserFavorites.mockResolvedValue(mockResult);

      const result = await controller.getMyFavorites(mockUser, query);

      expect(favoritesService.getUserFavorites).toHaveBeenCalledWith(
        mockUser.sub,
        10,
        undefined,
        undefined,
        'DESC',
        undefined
      );
      expect(result).toEqual(mockResult);
    });

    it('should call service exactly once', async () => {
      const query: GetFavoritesQueryDto = {
        limit: 10,
      };

      mockFavoritesService.getUserFavorites.mockResolvedValue({
        items: [],
        nextCursor: null,
      });

      await controller.getMyFavorites(mockUser, query);

      expect(favoritesService.getUserFavorites).toHaveBeenCalledTimes(1);
    });
  });

  describe('Guard Protection', () => {
    it('should be protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        FavoritesController
      );
      expect(guards).toBeDefined();
    });
  });
});