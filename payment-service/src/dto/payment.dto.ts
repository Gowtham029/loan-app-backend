import { IsString, IsNumber, IsEnum, IsOptional, IsObject, ValidateNested, IsDateString, Min, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentBreakdownDto {
  @IsNumber()
  @Min(0)
  principalPortion: number;

  @IsNumber()
  @Min(0)
  interestPortion: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  penaltyPortion?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lateFeesPortion?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  savingsFromEarlyPayment?: number;
}

class PaymentDetailsDto {
  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsNumber()
  @Min(0)
  expectedAmount: number;

  @IsNumber()
  @Min(0)
  paidAmount: number;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentBreakdownDto)
  breakdown: PaymentBreakdownDto;
}

class PaymentMethodDto {
  @IsEnum(['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CARD'])
  type: string;

  @IsString()
  reference: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;
}

class OutstandingAfterPaymentDto {
  @IsNumber()
  @Min(0)
  remainingPrincipal: number;

  @IsNumber()
  @Min(0)
  remainingInterest: number;

  @IsNumber()
  @Min(0)
  totalRemaining: number;
}

export class CreatePaymentDto {
  @IsString()
  loanId: string;

  @IsString()
  customerId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @IsEnum(['REGULAR', 'FULL_SETTLEMENT', 'PARTIAL', 'PENALTY'])
  paymentType: string;

  @IsString()
  processedBy: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OutstandingAfterPaymentDto)
  outstandingAfterPayment?: OutstandingAfterPaymentDto;
}

export class UpdatePaymentDto {
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PENDING_VERIFICATION'])
  status?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod?: PaymentMethodDto;

  @IsOptional()
  @IsString()
  processedBy?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OutstandingAfterPaymentDto)
  outstandingAfterPayment?: OutstandingAfterPaymentDto;
}

export class GetPaymentDto {
  @IsString()
  paymentId: string;
}

export class DeletePaymentDto {
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  deletedBy: string;
}

export class ListPaymentsDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  loanId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PENDING_VERIFICATION'])
  status?: string;

  @IsOptional()
  @IsEnum(['REGULAR', 'FULL_SETTLEMENT', 'PARTIAL', 'PENALTY'])
  paymentType?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string = 'desc';
}