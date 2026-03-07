import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';

export class UpdateUserRequest {
    @ApiProperty({ example: 'username', required: false })
    @IsString()
    @IsOptional()
    @MinLength(3)
    username?: string;

    @ApiProperty({ example: '1@gmail.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '+79991234567', required: false })
    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'newpassword123', required: false })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;
}
