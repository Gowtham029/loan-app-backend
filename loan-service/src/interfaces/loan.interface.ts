export interface ICustomer {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ILoanProvider {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IDocument {
  documentType: string;
  documentNumber: string;
  documentUrl: string;
}

export interface ILoan {
  id: string;
  loanId: string;
  customer: ICustomer;
  principalAmount: number;
  interestRateType: 'PERCENTAGE' | 'PAISA';
  interestRate?: number;
  paisaRate?: {
    ratePer100: number;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };
  loanTerm: number;
  repaymentFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CANCELLED';
  balanceRemaining: number;
  loanProvider: ILoanProvider;
  updatedBy?: ILoanProvider;
  documents: IDocument[];
  createdAt: string;
  updatedAt: string;
}