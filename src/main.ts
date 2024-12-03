import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const nodeOriginPrefix = process.env.NODE_ORIGIN_PREFIX;
  app.setGlobalPrefix(nodeOriginPrefix);

  app.enableCors();
  
  // Swagger
  const swaggerUrl = `${nodeOriginPrefix}/swagger`;
  const swaggerJsonUrl = `${swaggerUrl}/json`;

  const config = new DocumentBuilder()
    .setTitle('NestJS Swagger')
    .setExternalDoc('API JSON Documentation', swaggerJsonUrl)
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

  SwaggerModule.setup(swaggerUrl, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    jsonDocumentUrl: swaggerJsonUrl,
  });

  const port = +process.env.NODE_PORT || 3000;
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('NestApplication');
  const appUrl = `${await app.getUrl()}/${swaggerUrl}`;
  logger.log(`Nest application is running on: ${appUrl}`);
}
bootstrap();
