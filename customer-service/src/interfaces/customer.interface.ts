export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: string;
  residenceSince?: Date;
}

export interface IIdentificationDocument {
  documentType: string;
  documentNumber: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate: Date;
  documentUrl?: string;
}

export interface IEmploymentDetails {
  employmentStatus: string;
  employerName?: string;
  designation?: string;
  workExperience?: number;
  monthlyIncome?: number;
  annualIncome?: number;
  employerAddress?: string;
  employerPhoneNumber?: string;
}

export interface IBankingHistory {
  bankName: string;
  accountNumber: string;
  accountType: string;
  relationshipDuration: number;
}

export interface IExistingLoan {
  loanType: string;
  lender: string;
  outstandingAmount: number;
  monthlyEMI: number;
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  address: string;
}

export interface ICommunicationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingConsent: boolean;
  preferredLanguage: string;
}

export interface ICustomer {
  customerId?: string;
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
  currentAddress?: IAddress;
  permanentAddress?: IAddress;
  identificationDocuments?: IIdentificationDocument[];
  employmentDetails?: IEmploymentDetails;
  bankingHistory?: IBankingHistory[];
  creditScore?: number;
  existingLoans?: IExistingLoan[];
  emergencyContact?: IEmergencyContact;
  kycStatus?: string;
  riskProfile?: string;
  accountStatus?: string;
  fatcaStatus?: boolean;
  pepStatus?: boolean;
  amlScreeningStatus?: string;
  communicationPreferences?: ICommunicationPreferences;
  customerNotes?: string;
  internalRemarks?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICustomerRepository {
  create(customerData: ICustomer): Promise<ICustomer>;
  findById(customerId: string): Promise<ICustomer | null>;
  update(customerId: string, updateData: Partial<ICustomer>): Promise<ICustomer | null>;
  delete(customerId: string): Promise<boolean>;
  findAll(page: number, limit: number, search?: string): Promise<{ customers: ICustomer[]; total: number }>;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}