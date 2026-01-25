import { Test, TestingModule } from '@nestjs/testing';
import { ReadingHistoryController } from './reading-history.controller';

describe('ReadingHistoryController', () => {
  let controller: ReadingHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingHistoryController],
    }).compile();

    controller = module.get<ReadingHistoryController>(ReadingHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
