import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './models/user.model';
import { UserResponse } from './dto/responses/user.response';
import { NotFoundError } from 'rxjs';
import { ERole } from '../../common/enums/role.enum';
import { UpdateUserRequest } from './dto/requests/update-user.request';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async getUserById(userId: string, requesterId?: string): Promise<UserResponse> {
        if (requesterId) {
            const requester = (await this.userRepository.getUser(requesterId))!;

            if (requester.role != ERole.Admin && userId != requesterId) {
                throw new UnauthorizedException();
            }
        }

        const user = await this.userRepository.getUser(userId);

        if (!user) {
            throw new NotFoundException('user-not-found');
        }

        return user;
    }

    async updateUser(
        userId: string,
        requesterId: string,
        updateData: UpdateUserRequest,
    ): Promise<UserResponse> {
        const requester = (await this.userRepository.getUser(requesterId))!;

        if (requester.role != ERole.Admin && userId != requesterId) {
            throw new UnauthorizedException();
        }

        const hashedPassword = updateData.password
            ? await argon2.hash(updateData.password)
            : undefined;

        const user = await this.userRepository.updateUser(
            userId,
            updateData.username,
            updateData.email,
            updateData.phone,
            hashedPassword,
        );

        if (!user) {
            throw new NotFoundException('user-not-found');
        }

        return user;
    }
}
