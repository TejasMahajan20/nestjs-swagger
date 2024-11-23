import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Swagger')
    .setExternalDoc('API JSON Documentation', 'api/swagger/json')
    .setVersion('1.0')
    .addServer(process.env.NODE_ORIGIN_LOCAL, 'Local')
    .addServer(process.env.NODE_ORIGIN_LOCAL_DEVELOPMENT, 'Local Development')
    .addServer(process.env.NODE_ORIGIN_DEVELOPMENT, 'Development')
    .addServer(process.env.NODE_ORIGIN_PRODUCTION, 'Production')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    jsonDocumentUrl: 'api/swagger/json',
  });

  const port = process.env.NODE_PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  const logger = new Logger();
  logger.debug(`This application is running on: ${await app.getUrl()}/api/swagger`);
}
bootstrap();
