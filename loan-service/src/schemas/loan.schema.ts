import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoanDocument = Loan & Document;

@Schema()
export class PaisaRate {
  @Prop({ required: true })
  ratePer100: number;

  @Prop({ required: true, enum: ['DAILY', 'WEEKLY', 'MONTHLY'] })
  frequency: string;
}

@Schema()
export class Customer {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;
}

@Schema()
export class LoanProvider {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;
}

@Schema()
export class LoanDocumentSchema {
  @Prop({ required: true })
  documentType: string;

  @Prop({ required: true })
  documentNumber: string;

  @Prop({ required: true })
  documentUrl: string;
}

@Schema()
export class Loan {
  @Prop({ required: true, unique: true })
  loanId: string;

  @Prop({ type: Customer, required: true })
  customer: Customer;

  @Prop({ required: true })
  principalAmount: number;

  @Prop({ required: true, enum: ['PERCENTAGE', 'PAISA'] })
  interestRateType: string;

  @Prop()
  interestRate: number;

  @Prop({ type: PaisaRate })
  paisaRate: PaisaRate;

  @Prop({ required: true })
  loanTerm: number;

  @Prop({ required: true, enum: ['DAILY', 'WEEKLY', 'MONTHLY'] })
  repaymentFrequency: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, enum: ['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'], default: 'ACTIVE' })
  status: string;

  @Prop({ required: true })
  balanceRemaining: number;

  @Prop({ type: LoanProvider, required: true })
  loanProvider: LoanProvider;

  @Prop({ type: LoanProvider })
  updatedBy: LoanProvider;

  @Prop({ type: [LoanDocumentSchema], default: [] })
  documents: LoanDocumentSchema[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);