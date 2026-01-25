import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { NewsModule } from './news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UsersModule } from './users/users.module';
import { ReadingHistoryService } from './reading-history/reading-history.service';
import { ReadingHistoryController } from './reading-history/reading-history.controller';
import { ReadingHistoryModule } from './reading-history/reading-history.module';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = `redis://${config.get('REDIS_HOST')}:${config.get(
          'REDIS_PORT',
        )}`;

        return {
          stores: [
            new Keyv({
              store: new KeyvRedis(redisUrl),
              ttl: 60 * 1000,
            }),
          ],
        };
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RedisModule,
    CategoriesModule,
    NewsModule,
    AuthModule,
    RedisModule,
    FavoritesModule,
    UsersModule,
    ReadingHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
