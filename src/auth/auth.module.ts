import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Module({
    imports: [],
    providers: [AuthRepository, AuthService, PrismaService],
    exports: [AuthService],
})
export class UserModule {}
