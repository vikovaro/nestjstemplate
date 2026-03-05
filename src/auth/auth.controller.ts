import { Body, Controller, HttpStatus, Post, SerializeOptions } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInRequest } from './dto/requests/sign-in.request';
import { AuthService } from './auth.service';
import { SignUpRequest } from './dto/requests/sign-up.request';

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

    @Post('/register')
    @ApiResponse({ status: HttpStatus.OK, description: 'register', type: String })
    @SerializeOptions({
        strategy: 'exposeAll',
        type: String,
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
    })
    async signUp(@Body() signUpRequest: SignUpRequest) {
        return await this.authService.signUp(
            signUpRequest.username,
            signUpRequest.password,
            signUpRequest.email,
            signUpRequest.phone,
        );
    }
}
