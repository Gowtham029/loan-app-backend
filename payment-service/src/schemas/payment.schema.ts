import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class PaymentBreakdown {
  @Prop()
  principalPortion: number;

  @Prop()
  interestPortion: number;

  @Prop({ default: 0 })
  penaltyPortion: number;

  @Prop({ default: 0 })
  lateFeesPortion: number;

  @Prop({ default: 0 })
  savingsFromEarlyPayment: number;
}

@Schema()
export class PaymentDetails {
  @Prop()
  dueDate: Date;

  @Prop()
  paidDate: Date;

  @Prop()
  expectedAmount: number;

  @Prop()
  paidAmount: number;

  @Prop({ type: PaymentBreakdown })
  breakdown: PaymentBreakdown;
}

@Schema()
export class PaymentMethod {
  @Prop({ enum: ['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CARD'] })
  type: string;

  @Prop()
  reference: string;

  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;
}

@Schema()
export class OutstandingAfterPayment {
  @Prop()
  remainingPrincipal: number;

  @Prop()
  remainingInterest: number;

  @Prop()
  totalRemaining: number;
}

@Schema()
export class Payment {
  @Prop({ required: true, unique: true })
  paymentId: string;

  @Prop({ required: true })
  loanId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ type: PaymentDetails })
  paymentDetails: PaymentDetails;

  @Prop({ type: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop({ required: true, enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PENDING_VERIFICATION'], default: 'PENDING' })
  status: string;

  @Prop({ required: true, enum: ['REGULAR', 'FULL_SETTLEMENT', 'PARTIAL', 'PENALTY'] })
  paymentType: string;

  @Prop({ default: false })
  isPartialPayment: boolean;

  @Prop({ default: 0 })
  daysPastDue: number;

  @Prop({ type: OutstandingAfterPayment })
  outstandingAfterPayment: OutstandingAfterPayment;

  @Prop({ required: true })
  processedBy: string;

  @Prop()
  processedAt: Date;

  @Prop()
  failureReason: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);