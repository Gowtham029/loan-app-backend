import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, ValidateNested, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @ApiProperty({ example: 'CUS987654321' })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string;
}

class SimpleInterestRateDto {
  @ApiProperty({ example: 18.0 })
  @IsNumber()
  @Min(0)
  annualPercentage: number;

  @ApiProperty({ example: 1.5 })
  @IsNumber()
  @Min(0)
  monthlyPercentage: number;
}

class FullInterestRateDto extends SimpleInterestRateDto {
  @ApiProperty({ example: 2700 })
  totalInterestRupees: number;

  @ApiProperty({ example: 225 })
  monthlyInterestRupees: number;
}

class CompoundingDetailsDto {
  @ApiProperty({ example: 2.5 })
  penaltyInterestRate: number;

  @ApiProperty({ example: 147.5 })
  compoundedInterest: number;

  @ApiProperty({ example: 312.5 })
  principalPenalty: number;

  @ApiProperty({ example: 460 })
  totalPenaltyAmount: number;
}

class LateFeesDto {
  @ApiProperty({ example: 500 })
  feePerMonth: number;

  @ApiProperty({ example: 500 })
  totalLateFees: number;
}

class MissedPaymentsDto {
  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({ example: 1 })
  closed: number;

  @ApiProperty({ example: 1475 })
  totalMissedAmount: number;

  @ApiProperty({ type: CompoundingDetailsDto })
  compoundingDetails: CompoundingDetailsDto;

  @ApiProperty({ type: LateFeesDto })
  lateFees: LateFeesDto;
}

class CurrentOutstandingDto {
  @ApiProperty({ example: 12500 })
  remainingPrincipal: number;

  @ApiProperty({ example: 225 })
  pendingInterest: number;

  @ApiProperty({ example: 460 })
  penaltyAmount: number;

  @ApiProperty({ example: 500 })
  lateFees: number;

  @ApiProperty({ example: 13685 })
  totalOutstanding: number;

  @ApiProperty({ example: '2025-10-06T00:00:00.000Z' })
  lastCalculatedDate: string;
}

class LoanProviderDto {
  @ApiProperty({ example: 'USR123' })
  userId: string;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'Admin' })
  firstName: string;

  @ApiProperty({ example: 'User' })
  lastName: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;
}

export class CreateLoanDto {
  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(1)
  originalPrincipal: number;

  @ApiProperty({ type: SimpleInterestRateDto })
  @ValidateNested()
  @Type(() => SimpleInterestRateDto)
  interestRate: SimpleInterestRateDto;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(1)
  termMonths: number;

  @ApiProperty({ example: 'MONTHLY', enum: ['WEEKLY', 'MONTHLY', 'QUARTERLY'] })
  @IsEnum(['WEEKLY', 'MONTHLY', 'QUARTERLY'])
  repaymentFrequency: string;

  @ApiProperty({ example: 'FLEXIBLE', enum: ['FIXED', 'FLEXIBLE'] })
  @IsEnum(['FIXED', 'FLEXIBLE'])
  type: string;

  @ApiProperty({ example: '2025-08-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
  @IsDateString()
  endDate: string;
}

export class UpdateLoanDto {
  @ApiPropertyOptional({ example: 12500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentPrincipal?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  remainingTerms?: number;

  @ApiPropertyOptional({ type: MissedPaymentsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MissedPaymentsDto)
  missedPayments?: MissedPaymentsDto;

  @ApiPropertyOptional({ type: CurrentOutstandingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CurrentOutstandingDto)
  currentOutstanding?: CurrentOutstandingDto;

  @ApiPropertyOptional({ example: 'OVERDUE', enum: ['ACTIVE', 'OVERDUE', 'DEFAULTED', 'PAID_OFF', 'RESTRUCTURED'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'OVERDUE', 'DEFAULTED', 'PAID_OFF', 'RESTRUCTURED'])
  status?: string;

  @ApiPropertyOptional({ example: 'DELINQUENT', enum: ['CURRENT', 'GRACE_PERIOD', 'DELINQUENT'] })
  @IsOptional()
  @IsEnum(['CURRENT', 'GRACE_PERIOD', 'DELINQUENT'])
  substatus?: string;
}

export class LoanResponseDto {
  @ApiProperty({ example: 'LN1754023242749111' })
  loanId: string;

  @ApiProperty({ type: CustomerDto })
  customer: CustomerDto;

  @ApiProperty({ example: 15000 })
  originalPrincipal: number;

  @ApiProperty({ example: 12500 })
  currentPrincipal: number;

  @ApiProperty({ type: FullInterestRateDto })
  interestRate: FullInterestRateDto;

  @ApiProperty({ example: 12 })
  termMonths: number;

  @ApiProperty({ example: 10 })
  remainingTerms: number;

  @ApiProperty({ example: 'MONTHLY' })
  repaymentFrequency: string;

  @ApiProperty({ example: 'FLEXIBLE' })
  type: string;

  @ApiProperty({ example: '2025-08-01T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
  endDate: string;

  @ApiProperty({ example: 1475 })
  expectedMonthlyPayment: number;

  @ApiProperty({ type: MissedPaymentsDto })
  missedPayments: MissedPaymentsDto;

  @ApiProperty({ type: CurrentOutstandingDto })
  currentOutstanding: CurrentOutstandingDto;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 'CURRENT' })
  substatus: string;

  @ApiProperty({ type: LoanProviderDto })
  loanProvider: LoanProviderDto;

  @ApiProperty({ example: '2025-08-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-08-01T00:00:00.000Z' })
  updatedAt: string;
}

export class ListLoansQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'CUS987654321' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ['ACTIVE', 'OVERDUE', 'DEFAULTED', 'PAID_OFF', 'RESTRUCTURED'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'OVERDUE', 'DEFAULTED', 'PAID_OFF', 'RESTRUCTURED'])
  status?: string;

  @ApiPropertyOptional({ example: 'CURRENT', enum: ['CURRENT', 'GRACE_PERIOD', 'DELINQUENT'] })
  @IsOptional()
  @IsEnum(['CURRENT', 'GRACE_PERIOD', 'DELINQUENT'])
  substatus?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt', enum: ['createdAt', 'originalPrincipal', 'status'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string;
}

export class ListLoansResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [LoanResponseDto] })
  loans: LoanResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}