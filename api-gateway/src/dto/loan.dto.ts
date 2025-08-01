import { IsString, IsNumber, IsEnum, IsOptional, IsObject, ValidateNested, IsDateString, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PaisaRateDto {
  @ApiProperty({ example: 1.5, description: 'Rate per 100 rupees' })
  @IsNumber()
  @Min(0)
  ratePer100: number;

  @ApiProperty({ example: 'MONTHLY', enum: ['DAILY', 'WEEKLY', 'MONTHLY'], description: 'Frequency of paisa rate' })
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY'])
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

class CustomerDto {
  @ApiProperty({ example: 'CUS987654321', description: 'Customer ID' })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 'John', description: 'Customer first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Customer last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Customer email' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Customer phone number' })
  @IsString()
  phoneNumber: string;
}

class LoanProviderDto {
  @ApiProperty({ example: 'USR123', description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'admin', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Admin', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'User', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email' })
  @IsString()
  email: string;
}

class DocumentDto {
  @ApiProperty({ example: 'Aadhaar', description: 'Document type' })
  @IsString()
  documentType: string;

  @ApiProperty({ example: '123456789012', description: 'Document number' })
  @IsString()
  documentNumber: string;

  @ApiProperty({ example: 'https://example.com/uploads/identity-docs/CUST123456_aadhaar.pdf', description: 'Document URL' })
  @IsString()
  documentUrl: string;
}

export class CreateLoanDto {
  @ApiProperty({ type: CustomerDto, description: 'Customer details' })
  @IsObject({ message: 'Customer must be an object' })
  @ValidateNested({ message: 'Customer validation failed' })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ example: 50000, description: 'Principal loan amount' })
  @IsNumber()
  @Min(0)
  principalAmount: number;

  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'PAISA'], description: 'Interest rate type' })
  @IsEnum(['PERCENTAGE', 'PAISA'])
  interestRateType: 'PERCENTAGE' | 'PAISA';

  @ApiProperty({ example: 18.0, required: false, description: 'Annual interest rate percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @ApiProperty({ type: PaisaRateDto, required: false, description: 'Paisa rate details' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaisaRateDto)
  paisaRate?: PaisaRateDto;

  @ApiProperty({ example: 12, description: 'Loan term in months' })
  @IsNumber()
  @Min(1)
  loanTerm: number;

  @ApiProperty({ example: 'MONTHLY', enum: ['DAILY', 'WEEKLY', 'MONTHLY'], description: 'Repayment frequency' })
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY'])
  repaymentFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';

  @ApiProperty({ example: '2024-06-01', description: 'Loan start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-05-31', description: 'Loan end date' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'], required: false, description: 'Loan status' })
  @IsOptional()
  @IsEnum(['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CANCELLED';

  @ApiProperty({ example: 30000, required: false, description: 'Remaining balance' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balanceRemaining?: number;
}

export class UpdateLoanDto {
  @ApiProperty({ type: CustomerDto, required: false, description: 'Updated customer details' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;
  @ApiProperty({ example: 60000, required: false, description: 'Updated principal amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  principalAmount?: number;

  @ApiProperty({ example: 'PAISA', enum: ['PERCENTAGE', 'PAISA'], required: false, description: 'Updated interest rate type' })
  @IsOptional()
  @IsEnum(['PERCENTAGE', 'PAISA'])
  interestRateType?: 'PERCENTAGE' | 'PAISA';

  @ApiProperty({ example: 20.0, required: false, description: 'Updated interest rate' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @ApiProperty({ type: PaisaRateDto, required: false, description: 'Updated paisa rate' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaisaRateDto)
  paisaRate?: PaisaRateDto;

  @ApiProperty({ example: 18, required: false, description: 'Updated loan term' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  loanTerm?: number;

  @ApiProperty({ example: 'WEEKLY', enum: ['DAILY', 'WEEKLY', 'MONTHLY'], required: false, description: 'Updated repayment frequency' })
  @IsOptional()
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY'])
  repaymentFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';

  @ApiProperty({ example: '2024-07-01', required: false, description: 'Updated start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2025-12-31', required: false, description: 'Updated end date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 'COMPLETED', enum: ['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'], required: false, description: 'Updated status' })
  @IsOptional()
  @IsEnum(['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CANCELLED';

  @ApiProperty({ example: 25000, required: false, description: 'Updated balance remaining' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balanceRemaining?: number;

  @ApiProperty({ type: [DocumentDto], required: false, description: 'Loan documents' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}

export { CustomerDto, LoanProviderDto, DocumentDto, PaisaRateDto };

export class ListLoansDto {
  @ApiProperty({ example: 1, required: false, description: 'Page number' })
  @IsOptional()
  page?: number | string = 1;

  @ApiProperty({ example: 10, required: false, description: 'Items per page' })
  @IsOptional()
  limit?: number | string = 10;

  @ApiProperty({ example: 'LN123', required: false, description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 'CUS987654321', required: false, description: 'Filter by customer ID' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'John Doe', required: false, description: 'Filter by customer name' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'], required: false, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(['ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED'])
  status?: string;
}

export class LoanResponseDto {
  @ApiProperty({ example: '64f1a2b3c4d5e6f7g8h9i0j1', description: 'Loan ID' })
  id: string;

  @ApiProperty({ example: 'LN17234567890123', description: 'Generated loan ID' })
  loanId: string;

  @ApiProperty({ type: CustomerDto, description: 'Customer details' })
  customer: CustomerDto;

  @ApiProperty({ example: 50000, description: 'Principal amount' })
  principalAmount: number;

  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'PAISA'], description: 'Interest rate type' })
  interestRateType: string;

  @ApiProperty({ example: 18.0, required: false, description: 'Interest rate percentage' })
  interestRate?: number;

  @ApiProperty({ example: { ratePer100: 1.5, frequency: 'MONTHLY' }, required: false, description: 'Paisa rate details' })
  paisaRate?: object;

  @ApiProperty({ example: 12, description: 'Loan term in months' })
  loanTerm: number;

  @ApiProperty({ example: 'MONTHLY', description: 'Repayment frequency' })
  repaymentFrequency: string;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z', description: 'Start date' })
  startDate: string;

  @ApiProperty({ example: '2025-05-31T00:00:00.000Z', description: 'End date' })
  endDate: string;

  @ApiProperty({ example: 'ACTIVE', description: 'Loan status' })
  status: string;

  @ApiProperty({ example: 30000, description: 'Balance remaining' })
  balanceRemaining: number;

  @ApiProperty({ type: LoanProviderDto, description: 'Loan provider details' })
  loanProvider: LoanProviderDto;

  @ApiProperty({ type: LoanProviderDto, required: false, description: 'Updated by user details' })
  updatedBy?: LoanProviderDto;

  @ApiProperty({ type: [DocumentDto], description: 'Loan documents' })
  documents: DocumentDto[];

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2024-07-01T00:00:00.000Z', description: 'Update timestamp' })
  updatedAt: string;
}

export class ListLoansResponseDto {
  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({ type: [LoanResponseDto], description: 'Array of loans' })
  loans: LoanResponseDto[];

  @ApiProperty({ example: 25, description: 'Total number of loans' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;
}