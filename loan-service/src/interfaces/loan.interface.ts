export interface ICustomer {
  customerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
}

export interface IInterestRate {
  annualPercentage: number;
  monthlyPercentage: number;
  totalInterestRupees: number;
  monthlyInterestRupees: number;
}

export interface ICompoundingDetails {
  penaltyInterestRate: number;
  compoundedInterest: number;
  principalPenalty: number;
  totalPenaltyAmount: number;
}

export interface ILateFees {
  feePerMonth: number;
  totalLateFees: number;
}

export interface IMissedPayments {
  count: number;
  closed: number;
  totalMissedAmount: number;
  compoundingDetails: ICompoundingDetails;
  lateFees: ILateFees;
}

export interface ICurrentOutstanding {
  remainingPrincipal: number;
  pendingInterest: number;
  penaltyAmount: number;
  lateFees: number;
  totalOutstanding: number;
  lastCalculatedDate: string;
}

export interface ILoanProvider {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ILoan {
  id: string;
  loanId: string;
  customer: ICustomer;
  originalPrincipal: number;
  currentPrincipal: number;
  interestRate: IInterestRate;
  termMonths: number;
  remainingTerms: number;
  repaymentFrequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  type: 'FIXED' | 'FLEXIBLE';
  startDate: string;
  endDate: string;
  expectedMonthlyPayment: number;
  missedPayments: IMissedPayments;
  currentOutstanding: ICurrentOutstanding;
  status: 'ACTIVE' | 'OVERDUE' | 'DEFAULTED' | 'PAID_OFF' | 'RESTRUCTURED';
  substatus: 'CURRENT' | 'GRACE_PERIOD' | 'DELINQUENT';
  loanProvider: ILoanProvider;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}