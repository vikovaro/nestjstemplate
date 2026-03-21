import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../modules/user/user.repository';
import { AuthUser } from '../modules/user/models/auth.user.model';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private googleClient!: OAuth2Client;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    onModuleInit() {
        const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        this.googleClient = new OAuth2Client(googleClientId);
    }

    async signInWithGoogle(idToken: string): Promise<string> {
        const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        if (!googleClientId) {
            throw new UnauthorizedException('google-auth-not-configured');
        }

        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: googleClientId,
        });
        const payload = ticket.getPayload();

        if (!payload?.email || !payload.email_verified) {
            throw new UnauthorizedException('google-email-not-verified');
        }

        const existingUser = await this.userRepository.getAuthUserByEmail(payload.email);
        if (existingUser) {
            return this.jwtService.signAsync({
                userId: existingUser.id,
                role: existingUser.role,
            });
        }

        {
            const newUser = new AuthUser();
            newUser.email = payload.email;
            newUser.phone = '';
            newUser.password = await argon2.hash(`${payload.sub}-${Date.now()}`);
            newUser.username = await this.generateUniqueUsername(payload.email);
            const savedUser = await this.userRepository.addUser(newUser);
            return this.jwtService.signAsync({
                userId: savedUser.id,
                role: savedUser.role,
            });
        }
    }

    private async generateUniqueUsername(email: string): Promise<string> {
        const rawBase = email.split('@')[0] ?? 'googleuser';
        const base = rawBase
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, '')
            .slice(0, 20) || 'googleuser';

        let candidate = base;
        let attempt = 1;

        while (await this.userRepository.getAuthUser(candidate)) {
            candidate = `${base}${attempt}`;
            attempt += 1;
        }

        return candidate;
    }
}
