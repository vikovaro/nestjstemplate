import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../modules/user/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string): Promise<string> {
        const user = await this.userRepository.getUserByUsername(username);

        if (!user) {
            throw new UnauthorizedException('invalid-credentials');
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('invalid-credentials');
        }

        return await this.jwtService.signAsync({
            userId: user.id,
            username: user.username,
        });
    }
}
