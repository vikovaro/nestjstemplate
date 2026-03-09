import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TRole } from '../../common/types/role.type';

export interface JwtPayload {
    userId: string;
    role: TRole;
    token: string;
    type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        if (payload.type === 'Refresh') {
            throw new UnauthorizedException('Refresh token is not allowed for this endpoint');
        }

        return {
            userId: payload.userId,
            role: payload.role,
            token: payload.token,
        };
    }
}
