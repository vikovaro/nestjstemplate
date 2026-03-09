import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthUser } from './models/auth.user.model';
import { ERole } from '../../common/enums/role.enum';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    private BASE_USER_SELECT = {
        id: true,
        username: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
    } as const;

    async addUser(user: AuthUser): Promise<User> {
        return this.prisma.user.create({
            data: { ...user, role: ERole.User },
            select: this.BASE_USER_SELECT,
        });
    }

    async getUser(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: this.BASE_USER_SELECT,
        });
    }

    async updateUser(
        userId: string,
        username?: string,
        email?: string,
        phone?: string,
        password?: string,
    ): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username: username ? username : undefined,
                email: email ? email : undefined,
                phone: phone ? phone : undefined,
                password: password ? password : undefined,
            },
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
