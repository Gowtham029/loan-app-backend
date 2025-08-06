import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, ValidateNested, Min, Max, IsDateString, IsNotEmpty, MinLength, MaxLength, Matches, IsUrl, Allow } from 'class-validator';
import { Type } from 'class-transformer';

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

enum KycStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

enum AccountStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended',
  CLOSED = 'Closed'
}

class AddressDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  residenceSince?: string;
}

class IdentificationDocumentDto {
  @ApiProperty({ example: 'Passport' })
  @IsString()
  documentType: string;

  @ApiProperty({ example: 'A12345678' })
  @IsString()
  documentNumber: string;

  @ApiPropertyOptional({ example: 'Government Authority' })
  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @ApiPropertyOptional({ example: '2020-01-01' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2030-01-01' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ example: 'https://example.com/document.jpg' })
  @IsOptional()
  @IsString()
  documentUrl?: string;
}

class EmploymentDetailsDto {
  @ApiProperty()
  @IsString()
  employmentStatus: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  workExperience?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  monthlyIncome?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  annualIncome?: number;
}

export class CreateCustomerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: 'US' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ example: 'john.doe@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone number must be a valid 10-digit Indian mobile number' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: '9876543211' })
  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Alternate phone number must be a valid 10-digit Indian mobile number' })
  alternatePhoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  // @IsUrl({}, { message: 'Photo URL must be valid' })
  photoUrl?: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  currentAddress?: AddressDto;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  permanentAddress?: AddressDto;

  @ApiPropertyOptional({ type: [IdentificationDocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdentificationDocumentDto)
  identificationDocuments?: IdentificationDocumentDto[];

  @ApiPropertyOptional({ type: EmploymentDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmploymentDetailsDto)
  employmentDetails?: EmploymentDetailsDto;

  @ApiPropertyOptional({ example: 750, minimum: 300, maximum: 850 })
  @IsOptional()
  @IsNumber()
  @Min(300)
  @Max(850)
  creditScore?: number;

  @ApiPropertyOptional({ enum: KycStatus, default: 'Pending' })
  @IsOptional()
  @IsEnum(KycStatus)
  kycStatus?: KycStatus;

  @ApiPropertyOptional({ enum: AccountStatus, default: 'Active' })
  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  fatcaStatus?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  pepStatus?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerNotes?: string;

  @ApiPropertyOptional({ example: 'admin', default: 'admin' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'John Updated' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone number must be a valid 10-digit Indian mobile number' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '9876543211' })
  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Alternate phone number must be a valid 10-digit Indian mobile number' })
  alternatePhoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsUrl({}, { message: 'Photo URL must be valid' })
  photoUrl?: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  currentAddress?: AddressDto;

  @ApiPropertyOptional({ type: [IdentificationDocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdentificationDocumentDto)
  identificationDocuments?: IdentificationDocumentDto[];

  @ApiPropertyOptional({ type: EmploymentDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmploymentDetailsDto)
  employmentDetails?: EmploymentDetailsDto;

  @ApiPropertyOptional({ minimum: 300, maximum: 850 })
  @IsOptional()
  @IsNumber()
  @Min(300)
  @Max(850)
  creditScore?: number;

  @ApiPropertyOptional({ enum: KycStatus })
  @IsOptional()
  @IsEnum(KycStatus)
  kycStatus?: KycStatus;

  @ApiPropertyOptional({ enum: AccountStatus })
  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @ApiPropertyOptional({ example: 'admin', default: 'admin' })
  @IsOptional()
  @IsString()
  lastModifiedBy?: string;
}

export class CustomerResponseDto {
  @ApiProperty({ example: 'HEXACUS00001' })
  customerId: string;

  @ApiProperty({ example: 'Sarah' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Elizabeth' })
  middleName?: string;

  @ApiProperty({ example: 'Johnson' })
  lastName: string;

  @ApiPropertyOptional({ example: '1988-03-15' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Female' })
  gender?: string;

  @ApiPropertyOptional({ example: 'American' })
  nationality?: string;

  @ApiPropertyOptional({ example: 'Married' })
  maritalStatus?: string;

  @ApiPropertyOptional({ example: 'sarah.johnson@email.com' })
  email?: string;

  @ApiProperty({ example: '9876543210' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: '9876543211' })
  alternatePhoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://example.com/customer-photo.jpg' })
  photoUrl?: string;

  @ApiPropertyOptional({ type: AddressDto })
  currentAddress?: AddressDto;

  @ApiPropertyOptional({ type: AddressDto })
  permanentAddress?: AddressDto;

  @ApiPropertyOptional({ type: [IdentificationDocumentDto] })
  identificationDocuments?: IdentificationDocumentDto[];

  @ApiPropertyOptional({ type: EmploymentDetailsDto })
  employmentDetails?: EmploymentDetailsDto;

  @ApiPropertyOptional({ example: 785 })
  creditScore?: number;

  @ApiProperty({ example: 'Pending' })
  kycStatus: string;

  @ApiPropertyOptional({ example: 'Medium' })
  riskProfile?: string;

  @ApiProperty({ example: 'Active' })
  accountStatus: string;

  @ApiPropertyOptional({ example: true })
  fatcaStatus?: boolean;

  @ApiPropertyOptional({ example: false })
  pepStatus?: boolean;

  @ApiPropertyOptional({ example: 'New customer application. Excellent credit history and stable employment.' })
  customerNotes?: string;

  @ApiProperty({ example: '2025-07-30T07:44:37.686Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-07-30T07:44:37.686Z' })
  updatedAt: string;

  @ApiPropertyOptional({ example: 'bank_officer_001' })
  createdBy?: string;
}

export class ListCustomersQueryDto {
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
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ minLength: 1 })
  @IsOptional()
  @IsString()
  @Allow()
  search?: string;
}

export class ListCustomersResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [CustomerResponseDto] })
  customers: CustomerResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
