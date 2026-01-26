import { Test, TestingModule } from '@nestjs/testing';
import { ReadingHistoryService } from './reading-history.service';
import { ReadingHistory } from './entities/reading-history.entity';
import { Repository } from 'typeorm';
import { News } from 'src/news/entities/news.entity';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ReadingHistoryService', () => {
  let service: ReadingHistoryService;
  let readingHistoryRepository: Repository<ReadingHistory>;
  let newsRepository: Repository<News>;
  let userRepository: Repository<User>;

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockReadingHistoryRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockNewsRepository = {
    findOneBy: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingHistoryService,
        {
          provide: getRepositoryToken(ReadingHistory),
          useValue: mockReadingHistoryRepository,
        },
        {
          provide: getRepositoryToken(News),
          useValue: mockNewsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ReadingHistoryService>(ReadingHistoryService);
    readingHistoryRepository = module.get<Repository<ReadingHistory>>(
      getRepositoryToken(ReadingHistory),
    );
    newsRepository = module.get<Repository<News>>(getRepositoryToken(News));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('markAsRead', () => {
    const userId = 1;
    const newsId = 1;
    const mockUser = { id: userId, email: 'test@mail.com' } as User;
    const mockNews = { id: newsId, title: 'Test News' } as News;

    it('should create new reading history when not exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockNewsRepository.findOneBy.mockResolvedValue(mockNews);
      mockReadingHistoryRepository.findOne.mockResolvedValue(null);
      mockReadingHistoryRepository.create.mockReturnValue({
        user: mockUser,
        news: mockNews,
      });
      mockReadingHistoryRepository.save.mockResolvedValue({
        id: 1,
        user: mockUser,
        news: mockNews,
      });

      const result = await service.markAsRead(userId, newsId);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(mockNewsRepository.findOneBy).toHaveBeenCalledWith({ id: newsId });
      expect(mockReadingHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { userId, newsId },
      });
      expect(mockReadingHistoryRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        news: mockNews,
      });
      expect(mockReadingHistoryRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should update existing reading history', async () => {
      const existingHistory = {
        id: 1,
        userId,
        newsId,
        readAt: new Date('2024-01-01'),
      } as ReadingHistory;

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockNewsRepository.findOneBy.mockResolvedValue(mockNews);
      mockReadingHistoryRepository.findOne.mockResolvedValue(existingHistory);
      mockReadingHistoryRepository.save.mockResolvedValue(existingHistory);

      const result = await service.markAsRead(userId, newsId);

      expect(mockReadingHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { userId, newsId },
      });
      expect(mockReadingHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          readAt: expect.any(Date),
        }),
      );
      expect(existingHistory.readAt.getTime()).toBeGreaterThan(
        new Date('2024-01-01').getTime(),
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockNewsRepository.findOneBy.mockResolvedValue(mockNews);

      await expect(service.markAsRead(userId, newsId)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(mockReadingHistoryRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when news not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockNewsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.markAsRead(userId, newsId)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockNewsRepository.findOneBy).toHaveBeenCalledWith({ id: newsId });
      expect(mockReadingHistoryRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('getHistory', () => {
    const userId = 1;
    const mockHistoryItems = [
      {
        id: 1,
        readAt: new Date('2024-01-03'),
        news: {
          id: 1,
          title: 'News 1',
          imageUrl: 'image1.jpg',
          publishedAt: new Date('2024-01-03'),
          source: { id: 1, name: 'Source 1', logoUrl: 'logo1.jpg' },
          category: { id: 1, name: 'Category 1' },
        },
      },
      {
        id: 2,
        readAt: new Date('2024-01-02'),
        news: {
          id: 2,
          title: 'News 2',
          imageUrl: 'image2.jpg',
          publishedAt: new Date('2024-01-02'),
          source: { id: 2, name: 'Source 2', logoUrl: 'logo2.jpg' },
          category: { id: 2, name: 'Category 2' },
        },
      },
    ] as ReadingHistory[];

    it('should return paginated history with default limit', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockHistoryItems);

      const result = await service.getHistory(userId);

      expect(
        mockReadingHistoryRepository.createQueryBuilder,
      ).toHaveBeenCalledWith('history');
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'history.user',
        'user',
      );
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith(
        'history.news',
        'news',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'news.category',
        'category',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'news.source',
        'source',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :userId', {
        userId,
      });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'history.readAt',
        'DESC',
      );
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(11);

      expect(result).toEqual({
        items: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            readAt: expect.any(Date),
            news: expect.objectContaining({
              id: 1,
              title: 'News 1',
            }),
          }),
        ]),
        nextCursor: null,
      });
      expect(result.items).toHaveLength(2);
    });

    it('should return history with custom limit', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockHistoryItems);

      const result = await service.getHistory(userId, 5);

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(6);
      expect(result.items).toHaveLength(2);
    });

    it('should return history with nextCursor when hasNextPage', async () => {
      const items = Array(11)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          readAt: new Date(`2024-01-${20 - i}`),
          news: {
            id: i + 1,
            title: `News ${i + 1}`,
            imageUrl: `image${i + 1}.jpg`,
            publishedAt: new Date(`2024-01-${20 - i}`),
            source: { id: 1, name: 'Source 1', logoUrl: 'logo1.jpg' },
            category: { id: 1, name: 'Category 1' },
          },
        })) as ReadingHistory[];

      mockQueryBuilder.getMany.mockResolvedValue(items);

      const result = await service.getHistory(userId, 10);

      expect(result.items).toHaveLength(10);
      expect(result.nextCursor).toBe(items[9].readAt.toISOString());
    });

    it('should filter by categoryId when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockHistoryItems);
      const categoryId = 1;

      await service.getHistory(userId, 10, undefined, categoryId);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.id = :categoryId',
        { categoryId },
      );
    });

    it('should filter by search term when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockHistoryItems);
      const search = 'test';

      await service.getHistory(userId, 10, undefined, undefined, search);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('news.title ILIKE :search'),
        { search: '%test%' },
      );
    });

    it('should apply cursor when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockHistoryItems);
      const cursor = new Date('2024-01-02').toISOString();

      await service.getHistory(userId, 10, cursor);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'history.readAt < :cursor',
        { cursor: new Date(cursor) },
      );
    });

    it('should apply multiple filters together', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockHistoryItems);
      const cursor = new Date('2024-01-02').toISOString();
      const categoryId = 1;
      const search = 'test';

      await service.getHistory(userId, 10, cursor, categoryId, search);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });

    it('should map history items to DTO correctly', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockHistoryItems[0]]);

      const result = await service.getHistory(userId);

      expect(result.items[0]).toEqual({
        id: 1,
        readAt: expect.any(Date),
        news: {
          id: 1,
          title: 'News 1',
          imageUrl: 'image1.jpg',
          publishedAt: expect.any(Date),
          source: {
            id: 1,
            name: 'Source 1',
            logoUrl: 'logo1.jpg',
          },
          category: {
            id: 1,
            name: 'Category 1',
          },
        },
      });
    });

    it('should handle items without source or category', async () => {
      const mockUser = { id: 1, email: 'test@mail.com' } as User;

      const itemWithoutRelations = [
        {
          id: 1,
          userId: 1,
          newsId: 1,
          user: mockUser,
          readAt: new Date('2024-01-03'),
          news: {
            id: 1,
            title: 'News 1',
            content: 'News content',
            imageUrl: 'image1.jpg',
            publishedAt: new Date('2024-01-03'),
            isBreaking: false,
            source: null,
            category: null,
            favorites: [],
          } as unknown as News,
        },
      ] as ReadingHistory[];

      mockQueryBuilder.getMany.mockResolvedValue(itemWithoutRelations);

      const result = await service.getHistory(userId);

      expect(result.items[0].news.source).toBeNull();
      expect(result.items[0].news.category).toBeNull();
    });

    describe('removeFromHistory', () => {
      const userId = 1;
      const newsId = 1;

      it('should remove reading history successfully', async () => {
        mockReadingHistoryRepository.delete.mockResolvedValue({ affected: 1 });

        const result = await service.removeFromHistory(userId, newsId);

        expect(mockReadingHistoryRepository.delete).toHaveBeenCalledWith({
          user: { id: userId },
          news: { id: newsId },
        });
        expect(result).toEqual({ success: true });
      });

      it('should throw NotFoundException when history not found', async () => {
        mockReadingHistoryRepository.delete.mockResolvedValue({ affected: 0 });

        await expect(service.removeFromHistory(userId, newsId)).rejects.toThrow(
          NotFoundException,
        );

        expect(mockReadingHistoryRepository.delete).toHaveBeenCalledWith({
          user: { id: userId },
          news: { id: newsId },
        });
      });

      it('should handle multiple affected rows', async () => {
        mockReadingHistoryRepository.delete.mockResolvedValue({ affected: 2 });

        const result = await service.removeFromHistory(userId, newsId);

        expect(result).toEqual({ success: true });
      });
    });
  });
});
