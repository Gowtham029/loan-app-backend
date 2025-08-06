export interface IPaymentBreakdown {
  principalPortion: number;
  interestPortion: number;
  penaltyPortion: number;
  lateFeesPortion: number;
  savingsFromEarlyPayment?: number;
}

export interface IPaymentDetails {
  dueDate: string;
  paidDate?: string;
  expectedAmount: number;
  paidAmount: number;
  breakdown: IPaymentBreakdown;
}

export interface IPaymentMethod {
  type: string;
  reference: string;
  bankName?: string;
  accountNumber?: string;
}

export interface IOutstandingAfterPayment {
  remainingPrincipal: number;
  remainingInterest: number;
  totalRemaining: number;
}

export interface IPayment {
  id: string;
  paymentId: string;
  loanId: string;
  customerId: string;
  paymentDetails: IPaymentDetails;
  paymentMethod: IPaymentMethod;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING_VERIFICATION';
  paymentType: 'REGULAR' | 'FULL_SETTLEMENT' | 'PARTIAL' | 'PENALTY';
  isPartialPayment: boolean;
  daysPastDue: number;
  outstandingAfterPayment: IOutstandingAfterPayment;
  processedBy: string;
  processedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}