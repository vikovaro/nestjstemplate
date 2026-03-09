import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../modules/user/user.repository';
import { User } from '../modules/user/models/user.model';
import { AuthUser } from '../modules/user/models/auth.user.model';
import { TokensResponse } from './dto/responses/tokens.response';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string): Promise<TokensResponse> {
        const user = await this.userRepository.getAuthUser(username);

        if (!user) {
            throw new UnauthorizedException('invalid-credentials');
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('invalid-credentials');
        }
        const tokens = await this.generateToken(user.id, user.role);

        await this.authRepository.updateSession(user.id, tokens.accessToken, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async signUp(
        username: string,
        password: string,
        email: string,
        phone: string,
    ): Promise<TokensResponse> {
        const existingUser = await this.userRepository.getAuthUser(username);

        if (existingUser) {
            throw new ConflictException('user-already-exists');
        }

        const hashedPassword = await argon2.hash(password);

        const user = new AuthUser();
        user.username = username;
        user.password = hashedPassword;
        user.email = email;
        user.phone = phone;

        const savedUser = await this.userRepository.addUser(user);

        const tokens = await this.generateToken(savedUser.id, savedUser.role);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async refreshToken(refreshToken: string): Promise<TokensResponse> {
        const session = await this.authRepository.getSessionByRefreshToken(refreshToken);
        if (!session) {
            throw new UnauthorizedException();
        }

        const user = (await this.userRepository.getUser(session.userId))!;

        const tokens = await this.generateToken(user.id, user.role);

        await this.authRepository.updateSession(user.id, tokens.accessToken, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async generateToken(userId: string, role: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    userId,
                    role,
                    type: 'Access',
                    date: Date.now(),
                },
                {
                    expiresIn: '10m',
                },
            ),
            this.jwtService.signAsync(
                {
                    userId,
                    role,
                    type: 'Refresh',
                    date: Date.now(),
                },
                {
                    expiresIn: '30d',
                },
            ),
        ]);

        return { accessToken, refreshToken };
    }
}
