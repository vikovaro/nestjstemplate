import { Body, Controller, HttpStatus, Post, SerializeOptions } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInRequest } from './dto/requests/sign-in.request';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @ApiResponse({ status: HttpStatus.OK, description: 'login', type: String })
    @SerializeOptions({
        strategy: 'exposeAll',
        type: String,
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
    })
    async signIn(@Body() signInDto: SignInRequest) {
        return await this.authService.signIn(signInDto.username, signInDto.password);
    }
}
