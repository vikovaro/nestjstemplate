import { NestFactory } from '@nestjs/core';
import { GlobalModule } from './global.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(GlobalModule);

    const config = new DocumentBuilder()
        .setTitle('Template')
        .setDescription('Template API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const methods = ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'PATCH'];
    const urls = ['http://localhost:3000'];
    app.enableCors({
        origin: urls,
        methods: methods,
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
