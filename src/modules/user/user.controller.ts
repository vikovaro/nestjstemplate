import { Controller, Get, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserResponse } from './dto/responses/user-response';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/getMe')
    getProfile(@Req() req): Promise<UserResponse> {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get/:id')
    async getUserById(@Req() req, @Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
        return await this.userService.getUserById(id, req.user.Role);
    }
}
