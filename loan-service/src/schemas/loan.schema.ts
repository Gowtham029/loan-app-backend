import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoanDocument = Loan & Document;

@Schema({ _id: false })
export class Customer {
  @Prop({ required: true }) customerId: string;
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop() email: string;
  @Prop({ required: true }) phoneNumber: string;
}

@Schema({ _id: false })
export class InterestRate {
  @Prop({ required: true }) annualPercentage: number;
  @Prop({ required: true }) monthlyPercentage: number;
  @Prop({ required: true }) totalInterestRupees: number;
  @Prop({ required: true }) monthlyInterestRupees: number;
}

@Schema({ _id: false })
export class CompoundingDetails {
  @Prop({ required: true }) penaltyInterestRate: number;
  @Prop({ required: true }) compoundedInterest: number;
  @Prop({ required: true }) principalPenalty: number;
  @Prop({ required: true }) totalPenaltyAmount: number;
}

@Schema({ _id: false })
export class LateFees {
  @Prop({ required: true }) feePerMonth: number;
  @Prop({ required: true }) totalLateFees: number;
}

@Schema({ _id: false })
export class MissedPayments {
  @Prop({ required: true, default: 0 }) count: number;
  @Prop({ required: true, default: 0 }) closed: number;
  @Prop({ required: true, default: 0 }) totalMissedAmount: number;
  @Prop({ type: CompoundingDetails }) compoundingDetails: CompoundingDetails;
  @Prop({ type: LateFees }) lateFees: LateFees;
}

@Schema({ _id: false })
export class CurrentOutstanding {
  @Prop({ required: true }) remainingPrincipal: number;
  @Prop({ required: true }) pendingInterest: number;
  @Prop({ required: true }) penaltyAmount: number;
  @Prop({ required: true }) lateFees: number;
  @Prop({ required: true }) totalOutstanding: number;
  @Prop({ required: true }) lastCalculatedDate: Date;
}

@Schema({ _id: false })
export class LoanProvider {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) username: string;
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) email: string;
}

@Schema({ timestamps: true })
export class Loan {
  @Prop({ required: true, unique: true }) loanId: string;
  @Prop({ type: Customer, required: true }) customer: Customer;
  @Prop({ required: true }) originalPrincipal: number;
  @Prop({ required: true }) currentPrincipal: number;
  @Prop({ type: InterestRate, required: true }) interestRate: InterestRate;
  @Prop({ required: true }) termMonths: number;
  @Prop({ required: true }) remainingTerms: number;
  @Prop({ required: true, enum: ['WEEKLY', 'MONTHLY', 'QUARTERLY'] }) repaymentFrequency: string;
  @Prop({ required: true, enum: ['FIXED', 'FLEXIBLE'] }) type: string;
  @Prop({ required: true }) startDate: Date;
  @Prop({ required: true }) endDate: Date;
  @Prop({ required: true }) expectedMonthlyPayment: number;
  @Prop({ type: MissedPayments }) missedPayments: MissedPayments;
  @Prop({ type: CurrentOutstanding, required: true }) currentOutstanding: CurrentOutstanding;
  @Prop({ required: true, enum: ['ACTIVE', 'OVERDUE', 'DEFAULTED', 'PAID_OFF', 'RESTRUCTURED'], default: 'ACTIVE' }) status: string;
  @Prop({ required: true, enum: ['CURRENT', 'GRACE_PERIOD', 'DELINQUENT'], default: 'CURRENT' }) substatus: string;
  @Prop({ type: LoanProvider, required: true }) loanProvider: LoanProvider;
  @Prop({ default: false }) isDeleted: boolean;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);