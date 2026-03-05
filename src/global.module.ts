import { Module, Global, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './database/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from './core/filters/exception-filter';
import { RolesGuard } from './core/guards/roles.guard';
import { PrismaExceptionFilter } from './common/exceptions/prisma.exception-filter';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '1h',
                },
                global: true,
            }),
        }),
        AuthModule,
        UserModule,
    ],
    providers: [
        JwtStrategy,
        PrismaService,
        {
            provide: APP_FILTER,
            useClass: ExceptionsFilter,
        },
        {
            provide: APP_FILTER,
            useClass: PrismaExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [
        PrismaService,
        JwtModule,
        JwtStrategy,
    ]
})
export class GlobalModule {}
