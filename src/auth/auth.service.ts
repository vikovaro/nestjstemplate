import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../modules/user/user.repository';
import { User } from '../modules/user/models/user.model';
import { AuthUser } from '../modules/user/models/auth.user.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string): Promise<string> {
        const user = await this.userRepository.getAuthUser(username);

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

    async signUp(
        username: string,
        password: string,
        email: string,
        phone: string,
    ): Promise<string> {
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

        return await this.jwtService.signAsync({
            userId: savedUser.id,
            username: savedUser.username,
        });
    }
}
