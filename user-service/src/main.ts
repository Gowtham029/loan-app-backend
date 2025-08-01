import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting User Service...');
    console.log('Proto path:', join(__dirname, '../../proto/user.proto'));
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, '../../proto/user.proto'),
        url: '0.0.0.0:50052',
      },
    });

    await app.listen();
    console.log('User Service is listening on port 50052');
  } catch (error) {
    console.error('Failed to start User Service:', error);
    process.exit(1);
  }
}
bootstrap();