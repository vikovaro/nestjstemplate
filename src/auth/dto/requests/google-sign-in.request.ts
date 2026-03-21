import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GoogleSignInRequest {
    @ApiProperty({
        description: 'Google ID token from Google Sign-In',
        example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...',
    })
    @IsString()
    @MinLength(20)
    idToken: string;
}
