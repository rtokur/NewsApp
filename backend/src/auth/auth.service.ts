import { ConflictException, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import * as crypto from 'crypto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    private readonly REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; 
    private readonly LOGIN_ATTEMPT_TTL = 60;
    private readonly MAX_LOGIN_ATTEMPTS = 5;

    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private jwtService: JwtService,
        private redisService: RedisService,
    ) {}

    async register(dto: RegisterDto) {
        const exists = await this.usersRepo.findOne({ where: { email: dto.email }});
        if (exists) throw new ConflictException('Email already exists');

        const hashed = await bcrypt.hash(dto.password, 10);
        
        const user = this.usersRepo.create({
            email: dto.email,
            password: hashed,
            fullName: dto.fullName,
        });

        await this.usersRepo.save(user);
        return { message: 'User registered successfully'};
    }

    async login(dto: LoginDto, ip: string) {
        const attempts = await this.redisService.incr(`login:${ip}`, this.LOGIN_ATTEMPT_TTL);
        if (attempts > this.MAX_LOGIN_ATTEMPTS) {
            throw new UnauthorizedException('Too many login attempts. Please try again later.');
        }

        const user = await this.usersRepo.findOne({ where: { email: dto.email}});
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if(!isMatch) throw new UnauthorizedException('Invalid credentials');

        await this.redisService.del(`login:${ip}`);

        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        await this.redisService.set(`refresh:${user.id}`, refreshTokenHash, this.REFRESH_TOKEN_TTL);

        return { accessToken, refreshToken };
    }

    async refresh(token: string) {
        let payload: any;

        try {
          payload = this.jwtService.verify(token);
        } catch (err) {
          throw new UnauthorizedException('Invalid refresh token');
        }

        const storedHash = await this.redisService.get(`refresh:${payload.sub}`);

        if (!storedHash) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        if (storedHash !== tokenHash) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const newPayload = {
            sub: payload.sub,
            email: payload.email,
        };
        const newAccessToken = this.jwtService.sign(newPayload, {
            expiresIn: '15m',
        });
    
        return { accessToken: newAccessToken };
    }


    async logout(userId: number) {
        await this.redisService.del(`refresh:${userId}`);

        return { message: 'Logged out successfully' };
    }

}
