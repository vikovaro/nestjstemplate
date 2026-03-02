import { NestFactory } from '@nestjs/core';
import { GlobalModule } from './global.module';

async function bootstrap() {
    const app = await NestFactory.create(GlobalModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
