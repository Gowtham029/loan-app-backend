import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting Loan Service...');
    console.log('Proto path:', join(__dirname, '../../proto/loan.proto'));
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'loan',
        protoPath: join(__dirname, '../../proto/loan.proto'),
        url: '0.0.0.0:50054',
      },
    });

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    await app.listen();
    console.log('Loan Service is listening on port 50054');
  } catch (error) {
    console.error('Failed to start Loan Service:', error);
    process.exit(1);
  }
}
bootstrap();