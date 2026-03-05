import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthUser } from './models/auth.user.model';
import { ERole } from '../../common/enums/role.enum';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async addUser(user: AuthUser): Promise<User> {
        return this.prisma.user.create({ data: { ...user, role: ERole.User } });
    }

    async getUser(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

    async getAuthUser(username: string): Promise<AuthUser | null> {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
}
