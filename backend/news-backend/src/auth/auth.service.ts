import { ConflictException, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(RefreshToken) private refreshRepo: Repository<RefreshToken>,
        private jwtService: JwtService,
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

    async login(dto: LoginDto) {
        const user = await this.usersRepo.findOne({ where: { email: dto.email}});
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if(!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await this.refreshRepo.delete({user});

        await this.refreshRepo.save({
            tokenHash: refreshTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            user,
        });

        return { accessToken, refreshToken };
    }

    async refresh(token: string) {
        let payload: any;

        try {
          payload = this.jwtService.verify(token);
        } catch (err) {
          throw new UnauthorizedException('Invalid refresh token');
        }

        const storedToken = await this.refreshRepo.findOne({
            where: { user: { id: payload.sub} },
            relations: ['user'],
        });

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const isValid = await bcrypt.compare(
            token,
            storedToken.tokenHash,
        )
        
        if(!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newPayload = {
            sub: storedToken.user.id,
            email: storedToken.user.email,
        };
    
        const newAccessToken = this.jwtService.sign(newPayload, {
            expiresIn: '15m',
        });
    
        return { accessToken: newAccessToken };
    }


    async logout(@Req() req) {
        await this.refreshRepo.delete({
            user: { id: req.user.sub },
        });

        return { message: 'Logged out successfully' };
    }

}
