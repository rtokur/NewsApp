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

    expect(redisClient.set).toHaveBeenCalledWith(
      'key',
      'value',
      'EX',
      60,
    );
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
});
