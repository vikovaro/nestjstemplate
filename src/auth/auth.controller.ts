import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    SerializeOptions,
    UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInRequest } from './dto/requests/sign-in.request';
import { AuthService } from './auth.service';
import { SignUpRequest } from './dto/requests/sign-up.request';
import { TokensResponse } from './dto/responses/tokens.response';
import { AuthRefreshRestGuard } from './guards/auth-refresh.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @ApiResponse({ status: HttpStatus.OK, description: 'login', type: TokensResponse })
    @SerializeOptions({
        strategy: 'exposeAll',
        type: TokensResponse,
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
    })
    async signIn(@Body() signInDto: SignInRequest) {
        return await this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Post('/refresh')
    @UseGuards(AuthRefreshRestGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'getting a pair of the new JWT tokens (access & refresh)',
        type: TokensResponse,
    })
    @SerializeOptions({
        strategy: 'exposeAll',
        type: TokensResponse,
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
    })
    async refreshToken(@Req() req: Request) {
        return await this.authService.refreshToken(req['data'].token);
    }

    @Post('/register')
    @ApiResponse({ status: HttpStatus.OK, description: 'register', type: TokensResponse })
    @SerializeOptions({
        strategy: 'exposeAll',
        type: TokensResponse,
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
