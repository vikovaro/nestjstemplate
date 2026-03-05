import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../modules/user/user.repository';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    exports: [AuthService],
    providers: [AuthService, UserRepository],
})
export class AuthModule {}
