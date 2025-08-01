import { IsString, IsNumber, IsEnum, IsOptional, IsObject, ValidateNested, IsDateString, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class PaisaRateDto {
  @IsNumber()
  @Min(0)
  ratePer100: number;

  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY'])
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

class CustomerDto {
  @IsString()
  customerId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;
}

class LoanProviderDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;
}

class DocumentDto {
  @IsString()
  documentType: string;

  @IsString()
  documentNumber: string;

  @IsString()
  documentUrl: string;
}

export class CreateLoanDto {
  @IsObject({ message: 'Customer must be an object' })
  @ValidateNested({ message: 'Customer validation failed' })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsObject({ message: 'LoanProvider must be an object' })
  @ValidateNested({ message: 'LoanProvider validation failed' })
  @Type(() => LoanProviderDto)
  loanProvider: LoanProviderDto;

  @IsNumber()
  @Min(0)
  principalAmount: number;

  @IsEnum(['PERCENTAGE', 'PAISA'])
  interestRateType: 'PERCENTAGE' | 'PAISA';

  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaisaRateDto)
  paisaRate?: PaisaRateDto;

  @IsNumber()
  @Min(1)
  loanTerm: number;

  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY'])
  repaymentFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CANCELLED';

  @IsOptional()
  @IsNumber()
  @Min(0)
  balanceRemaining?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}

export class UpdateLoanDto {
  @IsString()
  loanId: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  principalAmount?: number;

  @IsOptional()
  @IsEnum(['PERCENTAGE', 'PAISA'])
  interestRateType?: 'PERCENTAGE' | 'PAISA';

  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaisaRateDto)
  paisaRate?: PaisaRateDto;

  @IsOptional()
  @IsNumber()
  @Min(1)
  loanTerm?: number;

  @IsOptional()
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY'])
  repaymentFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CANCELLED';

  @IsOptional()
  @IsNumber()
  @Min(0)
  balanceRemaining?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LoanProviderDto)
  updatedBy?: LoanProviderDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}

export class GetLoanDto {
  @IsString()
  loanId: string;
}

export class DeleteLoanDto {
  @IsString()
  loanId: string;
}

export class ListLoansDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'])
  status?: string;
}