import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../modules/user/user.repository';

@Module({
    imports: [UserRepository],
    providers: [AuthService],
    exports: [AuthService],
})
export class UserModule {}
