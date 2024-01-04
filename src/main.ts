import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './dotenv.config';
import * as express from 'express'; // Import express module correctly

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json()); // Use express.json() for handling JSON
  await app.listen(3001);
}

bootstrap();
