import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  onModuleDestroy() {
    this.redisClient.quit();
  }
  private redisClient: Redis;

  onModuleInit() {
    this.redisClient = new Redis({
      host: 'news_redis',
      port: 6379,
    });

    this.redisClient.on('connect', () => console.log('Redis connected'));
    this.redisClient.on('error', (err) => console.error('Redis error', err));
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.redisClient.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }

  async incr(key: string, ttlSeconds?: number) {
    const value = await this.redisClient.incr(key);
    if (value === 1 && ttlSeconds) {
      await this.redisClient.expire(key, ttlSeconds);
    }
    return value;
  }

  async delByPattern(pattern: string) {
    const stream = this.redisClient.scanStream({
      match: pattern,
      count: 100,
    });
  
    const pipeline = this.redisClient.pipeline();
  
    for await (const keys of stream) {
      if (keys.length) {
        keys.forEach((key: string) => pipeline.del(key));
      }
    }
  
    await pipeline.exec();
  }  
}
