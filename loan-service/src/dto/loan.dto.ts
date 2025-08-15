export class CreateLoanDto {
  customer: {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  originalPrincipal: number;
  interestRate: {
    annualPercentage: number;
    monthlyPercentage: number;
  };
  termMonths: number;
  repaymentFrequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  type: 'FIXED' | 'FLEXIBLE';
  startDate: string;
  endDate: string;
}

export class UpdateLoanDto {
  loanId: string;
  currentPrincipal?: number;
  remainingTerms?: number;
  missedPayments?: {
    count: number;
    closed: number;
    totalMissedAmount: number;
    compoundingDetails?: {
      penaltyInterestRate: number;
      compoundedInterest: number;
      principalPenalty: number;
      totalPenaltyAmount: number;
    };
    lateFees?: {
      feePerMonth: number;
      totalLateFees: number;
    };
  };
  currentOutstanding?: {
    remainingPrincipal: number;
    pendingInterest: number;
    penaltyAmount: number;
    lateFees: number;
    totalOutstanding: number;
    lastCalculatedDate: string;
  };
  status?: 'ACTIVE' | 'OVERDUE' | 'DEFAULTED' | 'PAID_OFF' | 'RESTRUCTURED';
  substatus?: 'CURRENT' | 'GRACE_PERIOD' | 'DELINQUENT';
}

export class GetLoanDto {
  loanId: string;
}

export class DeleteLoanDto {
  loanId: string;
}

export class ListLoansDto {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: string;
  substatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}