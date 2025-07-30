import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'customer',
      protoPath: join(__dirname, '../../proto/customer.proto'),
      url: '0.0.0.0:50052',
    },
  });

  await app.listen();
  console.log('Customer Service is listening on port 50052');
}
bootstrap();