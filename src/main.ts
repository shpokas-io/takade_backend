import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getEnvironmentConfig } from './config/environment';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const config = getEnvironmentConfig();
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: config.nodeEnv === 'production',
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));
        
        return new ValidationPipe().createExceptionFactory()(result);
      },
    }),
  );

  const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:3000',
    'https://lizdeproject.vercel.app',
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-New-Token'],
  });

  app.setGlobalPrefix('api');

  await app.listen(config.port);
  
  console.log(`🚀 Application is running on: http://localhost:${config.port}/api`);
  console.log(`📚 Environment: ${config.nodeEnv}`);
}

bootstrap();
