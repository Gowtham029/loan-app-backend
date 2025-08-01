import { ILoan } from '../interfaces/loan.interface';

export class ResponseHelper {
  static transformLoan(loan: any): ILoan {
    return {
      id: loan._id?.toString() || loan.id,
      loanId: loan.loanId,
      customer: loan.customer,
      principalAmount: loan.principalAmount,
      interestRateType: loan.interestRateType,
      interestRate: loan.interestRate,
      paisaRate: loan.paisaRate,
      loanTerm: loan.loanTerm,
      repaymentFrequency: loan.repaymentFrequency,
      startDate: loan.startDate instanceof Date ? loan.startDate.toISOString() : loan.startDate,
      endDate: loan.endDate instanceof Date ? loan.endDate.toISOString() : loan.endDate,
      status: loan.status,
      balanceRemaining: loan.balanceRemaining,
      loanProvider: loan.loanProvider,
      updatedBy: loan.updatedBy,
      documents: loan.documents || [],
      createdAt: loan.createdAt instanceof Date ? loan.createdAt.toISOString() : loan.createdAt,
      updatedAt: loan.updatedAt instanceof Date ? loan.updatedAt.toISOString() : loan.updatedAt,
    };
  }

  static error(message: string) {
    return {
      success: false,
      error: message,
      loan: null,
    };
  }
}