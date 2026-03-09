import { Injectable } from '@nestjs/common';
import { Session } from './models/session.model';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getSessionByRefreshToken(token: string): Promise<Session | null> {
        return this.prisma.session.findUnique({
            where: { refreshToken: token },
        });
    }

    async updateSession(
        userId: string,
        accessToken: string,
        refreshToken: string,
    ): Promise<Session> {
        return this.prisma.session.upsert({
            where: {
                userId: userId,
            },
            update: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                updatedAt: new Date(),
            },
            create: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
}
