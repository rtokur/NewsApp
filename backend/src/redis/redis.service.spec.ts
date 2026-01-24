import { RedisService } from './redis.service';
import Redis from 'ioredis';

jest.mock('ioredis', () => {
  return jest.fn();
});

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: any;
  const RedisMock = Redis as jest.MockedClass<typeof Redis>;

  beforeEach(() => {
    redisClient = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      incr: jest.fn(),
      expire: jest.fn(),
      on: jest.fn(),
      scanStream: jest.fn(),
      pipeline: jest.fn(),
      quit: jest.fn(),
    };
    
    RedisMock.mockImplementation(() => redisClient);
    service = new RedisService();
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ---------------------------------- set ---------------------------------- */
  it('should call set with EX when ttl is provided', async () => {
    await service.set('key', 'value', 60);
    expect(redisClient.set).toHaveBeenCalledWith('key', 'value', 'EX', 60);
  });

  it('should call set without EX when ttl is not provided', async () => {
    await service.set('key', 'value');
    expect(redisClient.set).toHaveBeenCalledWith('key', 'value');
  });

  /* ---------------------------------- get ---------------------------------- */
  it('should call get with key', async () => {
    redisClient.get.mockResolvedValue('value');
    const result = await service.get('key');
    expect(redisClient.get).toHaveBeenCalledWith('key');
    expect(result).toBe('value');
  });

  /* ---------------------------------- del ---------------------------------- */
  it('should call del with key', async () => {
    await service.del('key');
    expect(redisClient.del).toHaveBeenCalledWith('key');
  });

  /* ---------------------------------- incr ---------------------------------- */
  it('should set expire when incr returns 1 and ttl is provided', async () => {
    redisClient.incr.mockResolvedValue(1);
    const result = await service.incr('counter', 30);
    expect(redisClient.incr).toHaveBeenCalledWith('counter');
    expect(redisClient.expire).toHaveBeenCalledWith('counter', 30);
    expect(result).toBe(1);
  });

  it('should not set expire when incr returns > 1', async () => {
    redisClient.incr.mockResolvedValue(2);
    await service.incr('counter', 30);
    expect(redisClient.expire).not.toHaveBeenCalled();
  });

  /* -------------------------------- delByPattern ------------------------------ */
  it('should delete keys matching pattern', async () => {
    const mockKeys = ['key1', 'key2', 'key3'];
    const mockPipeline = {
      del: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield mockKeys;
      },
    };

    redisClient.scanStream.mockReturnValue(mockStream);
    redisClient.pipeline.mockReturnValue(mockPipeline);

    await service.delByPattern('user:*');

    expect(redisClient.scanStream).toHaveBeenCalledWith({
      match: 'user:*',
      count: 100,
    });
    expect(redisClient.pipeline).toHaveBeenCalled();
    expect(mockPipeline.del).toHaveBeenCalledWith('key1');
    expect(mockPipeline.del).toHaveBeenCalledWith('key2');
    expect(mockPipeline.del).toHaveBeenCalledWith('key3');
    expect(mockPipeline.exec).toHaveBeenCalled();
  });

  it('should handle empty keys from scanStream', async () => {
    const mockPipeline = {
      del: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield [];
      },
    };

    redisClient.scanStream.mockReturnValue(mockStream);
    redisClient.pipeline.mockReturnValue(mockPipeline);

    await service.delByPattern('nonexistent:*');

    expect(redisClient.scanStream).toHaveBeenCalledWith({
      match: 'nonexistent:*',
      count: 100,
    });
    expect(mockPipeline.del).not.toHaveBeenCalled();
    expect(mockPipeline.exec).toHaveBeenCalled();
  });

  it('should handle multiple batches of keys', async () => {
    const mockPipeline = {
      del: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield ['key1', 'key2'];
        yield ['key3', 'key4'];
        yield [];
      },
    };

    redisClient.scanStream.mockReturnValue(mockStream);
    redisClient.pipeline.mockReturnValue(mockPipeline);

    await service.delByPattern('session:*');

    expect(mockPipeline.del).toHaveBeenCalledTimes(4);
    expect(mockPipeline.del).toHaveBeenCalledWith('key1');
    expect(mockPipeline.del).toHaveBeenCalledWith('key2');
    expect(mockPipeline.del).toHaveBeenCalledWith('key3');
    expect(mockPipeline.del).toHaveBeenCalledWith('key4');
    expect(mockPipeline.exec).toHaveBeenCalled();
  });

  /* ---------------------------- Module Lifecycle ---------------------------- */
  it('should initialize redis client on module init', () => {
    expect(RedisMock).toHaveBeenCalledWith({
      host: 'news_redis',
      port: 6379,
    });
    expect(redisClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(redisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should quit redis client on module destroy', () => {
    service.onModuleDestroy();
    expect(redisClient.quit).toHaveBeenCalled();
  });
});