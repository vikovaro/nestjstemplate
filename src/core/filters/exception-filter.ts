import {
    Injectable,
    HttpException,
    HttpStatus,
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
    ForbiddenException,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { AppException } from '../../common/exceptions/app-exception';

@Injectable()
@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    readonly ignoredExceptions = [
        NotFoundException,
        ForbiddenException,
        UnauthorizedException,
        BadRequestException,
    ];

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof AppException) {
            response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: exception.message,
            });
        } else {
            const isIgnoredException = this.ignoredExceptions.some(
                (ignoredException) => exception instanceof ignoredException,
            );

            const status =
                exception instanceof HttpException
                    ? exception.getStatus()
                    : HttpStatus.INTERNAL_SERVER_ERROR;
            let message: string;
            if (isIgnoredException) {
                if (exception instanceof BadRequestException) {
                    message = exception.getResponse()['message'][0];
                } else {
                    message = exception.message;
                }
            } else {
                console.log('mes', exception);
                message = 'internal-server-error';
            }
            response.status(status).json({
                statusCode: status,
                message: message,
            });
        }
    }
}
