import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { LoanRepository } from './repositories/loan.repository';
import { Loan, LoanSchema } from './schemas/loan.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:password123@localhost:27017/microfinance?authSource=admin'),
    MongooseModule.forFeature([{ name: Loan.name, schema: LoanSchema }]),
  ],
  controllers: [LoanController],
  providers: [LoanService, LoanRepository],
})
export class AppModule {}