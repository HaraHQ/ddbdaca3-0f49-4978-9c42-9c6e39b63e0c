/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Enable CORS with specific options
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Replace with your Next.js app domain
    methods: 'GET,HEAD,PUT',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };

  app.enableCors(corsOptions);

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()  // If you use JWT or any Bearer authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
