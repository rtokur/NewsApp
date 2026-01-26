import { Test, TestingModule } from '@nestjs/testing';
import { ReadingHistoryController } from './reading-history.controller';
import { ReadingHistoryService } from './reading-history.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { GetReadingHistoryDto } from './dto/get-reading-history.dto';
import { ReadingHistoryListResponseDto } from './dto/reading-history-list-response.dto';
import { NewsItemDto } from './dto/news-item.dto';
import { Category } from 'src/categories/entities';
import { Source } from 'src/sources/entities/source.entity';

describe('ReadingHistoryController', () => {
  let controller: ReadingHistoryController;
  let service: ReadingHistoryService;

  const mockUser: JwtPayload = {
    sub: 1,
    email: 'test@example.com',
  };

  const mockReadingHistoryService = {
    markAsRead: jest.fn(),
    getHistory: jest.fn(),
    removeFromHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingHistoryController],
      providers: [
        {
          provide: ReadingHistoryService,
          useValue: mockReadingHistoryService,
        },
      ],
    }).compile();

    controller = module.get<ReadingHistoryController>(ReadingHistoryController);
    service = module.get<ReadingHistoryService>(ReadingHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('markAsRead', () => {
    it('should mark a news article as read', async () => {
      const dto: MarkAsReadDto = { newsId: 123 };
      const expectedResult = { success: true };

      mockReadingHistoryService.markAsRead.mockResolvedValue(expectedResult);

      const result = await controller.markAsRead(mockUser, dto);

      expect(service.markAsRead).toHaveBeenCalledWith(mockUser.sub, dto.newsId);
      expect(service.markAsRead).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors when marking as read', async () => {
      const dto: MarkAsReadDto = { newsId: 123 };
      const error = new Error('Database error');

      mockReadingHistoryService.markAsRead.mockRejectedValue(error);

      await expect(controller.markAsRead(mockUser, dto)).rejects.toThrow(error);
      expect(service.markAsRead).toHaveBeenCalledWith(mockUser.sub, dto.newsId);
    });
  });

  describe('getHistory', () => {
    it('should return reading history with all query parameters', async () => {
      const query: GetReadingHistoryDto = {
        limit: 10,
        cursor: 'abc123',
        categoryId: 5,
        search: 'technology',
      };

      const expectedResult: ReadingHistoryListResponseDto = {
        items: [
          {
            id: 1,
            readAt: new Date(),
            news: {
              id: 101,
              title: 'Tech News',
              imageUrl: 'http://example.com/image.jpg',
              publishedAt: new Date(),
              source: {
                id: 1,
                name: 'Tech Source',
                logoUrl: 'http://techsource.com',
              } as Source,
              category: {
                id: 5,
                name: 'Technology',
              } as Category,
            },
          },
        ],
        nextCursor: 'xyz789',
      };

      mockReadingHistoryService.getHistory.mockResolvedValue(expectedResult);

      const result = await controller.getHistory(mockUser, query);

      expect(service.getHistory).toHaveBeenCalledWith(
        mockUser.sub,
        query.limit,
        query.cursor,
        query.categoryId,
        query.search,
      );
      expect(service.getHistory).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should return reading history without optional query parameters', async () => {
      const query: GetReadingHistoryDto = {
        limit: 20,
      };

      const expectedResult: ReadingHistoryListResponseDto = {
        items: [],
        nextCursor: null,
      };

      mockReadingHistoryService.getHistory.mockResolvedValue(expectedResult);

      const result = await controller.getHistory(mockUser, query);

      expect(service.getHistory).toHaveBeenCalledWith(
        mockUser.sub,
        query.limit,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors when getting history', async () => {
      const query: GetReadingHistoryDto = { limit: 10 };
      const error = new Error('Service error');

      mockReadingHistoryService.getHistory.mockRejectedValue(error);

      await expect(controller.getHistory(mockUser, query)).rejects.toThrow(
        error,
      );
      expect(service.getHistory).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a news article from reading history', async () => {
      const newsId = 456;
      const expectedResult = { success: true };

      mockReadingHistoryService.removeFromHistory.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.remove(mockUser, newsId);

      expect(service.removeFromHistory).toHaveBeenCalledWith(
        mockUser.sub,
        newsId,
      );
      expect(service.removeFromHistory).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors when removing from history', async () => {
      const newsId = 456;
      const error = new Error('Not found');

      mockReadingHistoryService.removeFromHistory.mockRejectedValue(error);

      await expect(controller.remove(mockUser, newsId)).rejects.toThrow(error);
      expect(service.removeFromHistory).toHaveBeenCalledWith(
        mockUser.sub,
        newsId,
      );
    });

    it('should parse newsId from string to number', async () => {
      const newsId = 789;
      const expectedResult = { success: true };

      mockReadingHistoryService.removeFromHistory.mockResolvedValue(
        expectedResult,
      );

      await controller.remove(mockUser, newsId);

      expect(service.removeFromHistory).toHaveBeenCalledWith(
        mockUser.sub,
        newsId,
      );
      expect(typeof newsId).toBe('number');
    });
  });
});