import { Body, Controller, HttpStatus, Post, SerializeOptions } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleSignInRequest } from './dto/requests/google-sign-in.request';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/google/login')
    @ApiResponse({ status: HttpStatus.OK, description: 'google login', type: String })
    @SerializeOptions({
        strategy: 'exposeAll',
        type: String,
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
    })
    async signInWithGoogle(@Body() googleSignInDto: GoogleSignInRequest) {
        return await this.authService.signInWithGoogle(googleSignInDto.idToken);
    }
}
