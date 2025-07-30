import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './repositories/customer.repository';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [
    WinstonModule.forRoot({}),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/microfinance?authSource=admin'),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}