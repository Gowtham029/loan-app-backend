import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api/v1');
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validateCustomDecorators: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      ).join('; ');
      console.log("Validation Error", errorMessages);
      return new BadRequestException(errorMessages);
    },
  }));
  
  // Rate limiting is handled by module
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Microfinance Management API')
    .setDescription('API for managing microfinance system - customers, users, loans')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication')
    .addTag('Customers')
    .addTag('Users')
    .addTag('Loans')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  
  await app.listen(3000);
  console.log('API Gateway is running on port 3000');
  console.log('Swagger documentation available at http://localhost:3000/api/v1/docs');
}
bootstrap();