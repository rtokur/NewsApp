import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { find } from 'rxjs';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

describe('NewsController', () => {
  let controller: NewsController;
  let newsService: NewsService;

  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  const mockNewsService = {
    findAll: jest.fn(),
    findBreakingNews: jest.fn(),
    findBreakingHighlight: jest.fn(),
    findRecommendations: jest.fn(),
    findRecommendationsHighlight: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: mockNewsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

    /* ---------------------------------- findAll ---------------------------------- */

    it('should call newsService.findAll with query params', async () => {
      const query = { page: 1, limit: 10 };
      mockNewsService.findAll.mockResolvedValue({});
  
      const result = await controller.findAll(query as any);
  
      expect(newsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual({});
    });
  
    /* ----------------------------- findBreakingNews ----------------------------- */
  
    it('should call newsService.findBreakingNews', async () => {
      const query = { page: 1, limit: 5 };
      mockNewsService.findBreakingNews.mockResolvedValue({});
  
      const result = await controller.findBreakingNews(query as any);
  
      expect(newsService.findBreakingNews).toHaveBeenCalledWith(query);
      expect(result).toEqual({});
    });
  
    /* -------------------------- findBreakingHighlight -------------------------- */
  
    it('should call newsService.findBreakingHighlight', async () => {
      const query = { limit: 5 };
      mockNewsService.findBreakingHighlight.mockResolvedValue({ data: [] });
  
      const result = await controller.findBreakingHighlight(query as any);
  
      expect(newsService.findBreakingHighlight).toHaveBeenCalledWith(query);
      expect(result).toEqual({ data: [] });
    });
  
    /* -------------------------- findRecommendations -------------------------- */
  
    it('should call newsService.findRecommendations', async () => {
      const query = { page: 1, limit: 10 };
      mockNewsService.findRecommendations.mockResolvedValue({});
  
      const result = await controller.findRecommendations(query as any);
  
      expect(newsService.findRecommendations).toHaveBeenCalledWith(query);
      expect(result).toEqual({});
    });
  
    /* -------------------- findRecommendationsHighlight -------------------- */
  
    it('should call newsService.findRecommendationsHighlight', async () => {
      const query = { limit: 3 };
      mockNewsService.findRecommendationsHighlight.mockResolvedValue({ data: [] });
  
      const result = await controller.findRecommendationsHighlight(query as any);
  
      expect(newsService.findRecommendationsHighlight).toHaveBeenCalledWith(query);
      expect(result).toEqual({ data: [] });
    });
  
    /* ---------------------------------- findOne --------------------------------- */
  
    it('should call newsService.findOne with id', async () => {
      mockNewsService.findOne.mockResolvedValue({ id: 1 });
  
      const result = await controller.findOne(1);
  
      expect(newsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
});
