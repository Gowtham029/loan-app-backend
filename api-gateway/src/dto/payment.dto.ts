import { IsString, IsNumber, IsEnum, IsOptional, IsObject, ValidateNested, IsDateString, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PaymentBreakdownDto {
  @ApiProperty({ example: 15000, description: 'Principal portion of payment' })
  @IsNumber()
  @Min(0)
  principalPortion: number;

  @ApiProperty({ example: 225, description: 'Interest portion of payment' })
  @IsNumber()
  @Min(0)
  interestPortion: number;

  @ApiProperty({ example: 0, required: false, description: 'Penalty portion of payment' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  penaltyPortion?: number;

  @ApiProperty({ example: 0, required: false, description: 'Late fees portion of payment' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lateFeesPortion?: number;

  @ApiProperty({ example: 2475, required: false, description: 'Savings from early payment' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  savingsFromEarlyPayment?: number;
}

class PaymentDetailsDto {
  @ApiProperty({ example: '2025-09-01T00:00:00.000Z', description: 'Payment due date' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: '2025-08-15T10:30:00.000Z', required: false, description: 'Actual payment date' })
  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @ApiProperty({ example: 17700, description: 'Expected payment amount' })
  @IsNumber()
  @Min(0)
  expectedAmount: number;

  @ApiProperty({ example: 15225, description: 'Actual paid amount' })
  @IsNumber()
  @Min(0)
  paidAmount: number;

  @ApiProperty({ type: PaymentBreakdownDto, description: 'Payment breakdown details' })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentBreakdownDto)
  breakdown: PaymentBreakdownDto;
}

class PaymentMethodDto {
  @ApiProperty({ example: 'BANK_TRANSFER', enum: ['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CARD'], description: 'Payment method type' })
  @IsEnum(['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CARD'])
  type: string;

  @ApiProperty({ example: 'TXN987654321', description: 'Payment reference number' })
  @IsString()
  reference: string;

  @ApiProperty({ example: 'Commonwealth Bank', required: false, description: 'Bank name' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ example: '****1234', required: false, description: 'Account number (masked)' })
  @IsOptional()
  @IsString()
  accountNumber?: string;
}

class OutstandingAfterPaymentDto {
  @ApiProperty({ example: 0, description: 'Remaining principal amount' })
  @IsNumber()
  @Min(0)
  remainingPrincipal: number;

  @ApiProperty({ example: 0, description: 'Remaining interest amount' })
  @IsNumber()
  @Min(0)
  remainingInterest: number;

  @ApiProperty({ example: 0, description: 'Total remaining amount' })
  @IsNumber()
  @Min(0)
  totalRemaining: number;
}

export class CreatePaymentDto {
  @ApiProperty({ example: 'LN1754023242749111', description: 'Loan ID' })
  @IsString()
  loanId: string;

  @ApiProperty({ example: '6889ba3a8d74894e62a3fc7f', description: 'Customer ID' })
  @IsString()
  customerId: string;

  @ApiProperty({ type: PaymentDetailsDto, description: 'Payment details' })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto;

  @ApiProperty({ type: PaymentMethodDto, description: 'Payment method details' })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @ApiProperty({ example: 'FULL_SETTLEMENT', enum: ['REGULAR', 'FULL_SETTLEMENT', 'PARTIAL', 'PENALTY'], description: 'Payment type' })
  @IsEnum(['REGULAR', 'FULL_SETTLEMENT', 'PARTIAL', 'PENALTY'])
  paymentType: string;

  @ApiProperty({ example: '688afc49153d985b5944818e', description: 'User ID who processed the payment' })
  @IsString()
  processedBy: string;

  @ApiProperty({ type: OutstandingAfterPaymentDto, required: false, description: 'Outstanding amount after payment' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OutstandingAfterPaymentDto)
  outstandingAfterPayment?: OutstandingAfterPaymentDto;
}

export class UpdatePaymentDto {
  @ApiProperty({ example: 'COMPLETED', enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PENDING_VERIFICATION'], required: false, description: 'Payment status' })
  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PENDING_VERIFICATION'])
  status?: string;

  @ApiProperty({ example: 'Insufficient funds in account', required: false, description: 'Failure reason if payment failed' })
  @IsOptional()
  @IsString()
  failureReason?: string;

  @ApiProperty({ type: PaymentMethodDto, required: false, description: 'Updated payment method details' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod?: PaymentMethodDto;

  @ApiProperty({ example: '688afc49153d985b5944818e', required: false, description: 'User ID who updated the payment' })
  @IsOptional()
  @IsString()
  processedBy?: string;

  @ApiProperty({ type: OutstandingAfterPaymentDto, required: false, description: 'Updated outstanding amount' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OutstandingAfterPaymentDto)
  outstandingAfterPayment?: OutstandingAfterPaymentDto;
}

export class ListPaymentsDto {
  @ApiProperty({ example: 1, required: false, description: 'Page number' })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 10, required: false, description: 'Items per page' })
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ example: 'LN1754023242749111', required: false, description: 'Filter by loan ID' })
  @IsOptional()
  @IsString()
  loanId?: string;

  @ApiProperty({ example: '6889ba3a8d74894e62a3fc7f', required: false, description: 'Filter by customer ID' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'COMPLETED', enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PENDING_VERIFICATION'], required: false, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PENDING_VERIFICATION'])
  status?: string;

  @ApiProperty({ example: 'FULL_SETTLEMENT', enum: ['REGULAR', 'FULL_SETTLEMENT', 'PARTIAL', 'PENALTY'], required: false, description: 'Filter by payment type' })
  @IsOptional()
  @IsEnum(['REGULAR', 'FULL_SETTLEMENT', 'PARTIAL', 'PENALTY'])
  paymentType?: string;

  @ApiProperty({ example: 'createdAt', required: false, description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ example: 'desc', enum: ['asc', 'desc'], required: false, description: 'Sort order' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string = 'desc';
}

export class PaymentResponseDto {
  @ApiProperty({ example: 'PAY_LN1754023242749111_001', description: 'Payment ID' })
  paymentId: string;

  @ApiProperty({ example: 'LN1754023242749111', description: 'Loan ID' })
  loanId: string;

  @ApiProperty({ example: '6889ba3a8d74894e62a3fc7f', description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ type: PaymentDetailsDto, description: 'Payment details' })
  paymentDetails: PaymentDetailsDto;

  @ApiProperty({ type: PaymentMethodDto, description: 'Payment method details' })
  paymentMethod: PaymentMethodDto;

  @ApiProperty({ example: 'COMPLETED', description: 'Payment status' })
  status: string;

  @ApiProperty({ example: 'FULL_SETTLEMENT', description: 'Payment type' })
  paymentType: string;

  @ApiProperty({ example: false, description: 'Is partial payment' })
  isPartialPayment: boolean;

  @ApiProperty({ example: -17, description: 'Days past due (negative for early payment)' })
  daysPastDue: number;

  @ApiProperty({ type: OutstandingAfterPaymentDto, description: 'Outstanding amount after payment' })
  outstandingAfterPayment: OutstandingAfterPaymentDto;

  @ApiProperty({ example: '688afc49153d985b5944818e', description: 'Processed by user ID' })
  processedBy: string;

  @ApiProperty({ example: '2025-08-15T10:35:00.000Z', description: 'Processing timestamp' })
  processedAt: string;

  @ApiProperty({ example: '2025-08-15T10:30:00.000Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2025-08-15T10:30:00.000Z', description: 'Update timestamp' })
  updatedAt: string;
}

export class ListPaymentsResponseDto {
  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({ type: [PaymentResponseDto], description: 'Array of payments' })
  payments: PaymentResponseDto[];

  @ApiProperty({ example: 25, description: 'Total number of payments' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;
}

export { PaymentBreakdownDto, PaymentDetailsDto, PaymentMethodDto, OutstandingAfterPaymentDto };