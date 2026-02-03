import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StorageModule } from 'src/storage/storage.module';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmailChangeToken } from './entities/email-change-token.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, EmailChangeToken]),
        StorageModule,
        EmailModule,
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
