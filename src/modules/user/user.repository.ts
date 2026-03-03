import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getUser(userId: number) {
        return await this.prisma.user.findUnique({ id: userId });
    }

    async getUserByUsername(username: string) {
        return await this.prisma.user.findUnique({ username: username });
    }
}
