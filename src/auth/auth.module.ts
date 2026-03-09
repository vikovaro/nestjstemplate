import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../modules/user/user.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';

@Module({
    controllers: [AuthController],
    exports: [AuthService],
    providers: [AuthService, AuthRepository, UserRepository],
})
export class AuthModule {}
