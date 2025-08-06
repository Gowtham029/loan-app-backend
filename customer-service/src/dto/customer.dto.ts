import { ICustomer, IPaginationQuery } from '../interfaces/customer.interface';

export class CreateCustomerDto implements Omit<ICustomer, 'customerId' | 'createdAt' | 'updatedAt'> {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  maritalStatus?: string;
  email?: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  photoUrl?: string;
  currentAddress?: any;
  permanentAddress?: any;
  identificationDocuments?: any[];
  employmentDetails?: any;
  bankingHistory?: any[];
  creditScore?: number;
  existingLoans?: any[];
  emergencyContact?: any;
  kycStatus?: string;
  riskProfile?: string;
  accountStatus?: string;
  fatcaStatus?: boolean;
  pepStatus?: boolean;
  amlScreeningStatus?: string;
  communicationPreferences?: any;
  customerNotes?: string;
  internalRemarks?: string;
  createdBy: string;
  lastModifiedBy?: string;
}

export class UpdateCustomerDto implements Partial<ICustomer> {
  customerId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  maritalStatus?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  photoUrl?: string;
  currentAddress?: any;
  permanentAddress?: any;
  identificationDocuments?: any[];
  employmentDetails?: any;
  bankingHistory?: any[];
  creditScore?: number;
  existingLoans?: any[];
  emergencyContact?: any;
  kycStatus?: string;
  riskProfile?: string;
  accountStatus?: string;
  fatcaStatus?: boolean;
  pepStatus?: boolean;
  amlScreeningStatus?: string;
  communicationPreferences?: any;
  customerNotes?: string;
  internalRemarks?: string;
  lastModifiedBy: string;
}

export class GetCustomerDto {
  customerId: string;
}

export class DeleteCustomerDto {
  customerId: string;
}

export class ListCustomersDto implements IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}