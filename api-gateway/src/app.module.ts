import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { join } from 'path';
import { CustomerController } from './customer.controller';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { LoanController } from './loan.controller';
import { AuthGuard } from './guards/auth.guard';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    WinstonModule.forRoot({}),
    ClientsModule.register([
      {
        name: 'CUSTOMER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'customer',
          protoPath: join(__dirname, '../../proto/customer.proto'),
          url: 'localhost:50051',
        },
      },
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../proto/user.proto'),
          url: 'localhost:50052',
        },
      },
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../proto/auth.proto'),
          url: 'localhost:50053',
        },
      },
      {
        name: 'LOAN_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'loan',
          protoPath: join(__dirname, '../../proto/loan.proto'),
          url: 'localhost:50054',
        },
      },
    ]),
  ],
  controllers: [CustomerController, AuthController, UserController, LoanController],
  providers: [
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}