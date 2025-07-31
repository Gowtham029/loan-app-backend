import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting Auth Service...');
    console.log('Proto path:', join(__dirname, '../../proto/auth.proto'));
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(__dirname, '../../proto/auth.proto'),
        url: '0.0.0.0:50053',
      },
    });

    await app.listen();
    console.log('Auth Service is listening on port 50053');
  } catch (error) {
    console.error('Failed to start Auth Service:', error);
    process.exit(1);
  }
}
bootstrap();