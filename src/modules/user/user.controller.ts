import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserResponse } from './dto/responses/user.response';
import { UpdateUserRequest } from './dto/requests/update-user.request';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/getMe')
    @ApiOperation({ summary: 'get profile' })
    @ApiResponse({ type: UserResponse })
    getProfile(@Req() req): Promise<UserResponse> {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get/:id')
    @ApiOperation({ summary: 'get user by id' })
    @ApiResponse({ type: UserResponse })
    async getUserById(@Req() req, @Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
        return await this.userService.getUserById(id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update/:id')
    @ApiOperation({ summary: 'user update' })
    @ApiResponse({ type: UserResponse })
    async updateUser(
        @Req() req,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateData: UpdateUserRequest,
    ): Promise<UserResponse> {
        return await this.userService.updateUser(id, req.user.userId, updateData);
    }
}
