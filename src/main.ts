import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata"
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.enableCors({
    origin: 'http://localhost:3000', // Replace when frontend URL is set up in instance
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(3001);
}
bootstrap();
