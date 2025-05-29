import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with multiple origins for development and production
  const allowedOrigins = [
    process.env.FRONTEND_URL, // Current environment URL
    'http://localhost:3000',  // Local development
    'https://lizdeproject.vercel.app', // Production frontend
  ].filter(Boolean); // Remove any undefined values

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: ${process.env.NODE_ENV === 'production' ? process.env.BACKEND_URL : `http://localhost:${port}`}`);
  console.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}
bootstrap();
