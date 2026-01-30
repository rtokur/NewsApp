import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { RedisModule } from "src/redis/redis.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EmailModule } from "src/email/email.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              secret: config.get('JWT_SECRET'),
              signOptions: { expiresIn: '15m' },
            }),
          }),
        RedisModule,
        ConfigModule,
        EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}