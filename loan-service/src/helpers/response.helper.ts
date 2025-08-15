import { ILoan } from '../interfaces/loan.interface';

export class ResponseHelper {
  static transformLoan(loan: any): ILoan {
    return {
      id: loan._id?.toString() || loan.id,
      loanId: loan.loanId,
      customer: loan.customer,
      originalPrincipal: loan.originalPrincipal,
      currentPrincipal: loan.currentPrincipal,
      interestRate: {
        annualPercentage: loan.interestRate?.annualPercentage,
        monthlyPercentage: loan.interestRate?.monthlyPercentage,
        totalInterestRupees: loan.interestRate?.totalInterestRupees,
        monthlyInterestRupees: loan.interestRate?.monthlyInterestRupees
      },
      termMonths: loan.termMonths,
      remainingTerms: loan.remainingTerms,
      repaymentFrequency: loan.repaymentFrequency,
      type: loan.type,
      startDate: loan.startDate instanceof Date ? loan.startDate.toISOString() : loan.startDate,
      endDate: loan.endDate instanceof Date ? loan.endDate.toISOString() : loan.endDate,
      expectedMonthlyPayment: loan.expectedMonthlyPayment,
      missedPayments: loan.missedPayments,
      currentOutstanding: {
        ...loan.currentOutstanding,
        lastCalculatedDate: loan.currentOutstanding?.lastCalculatedDate instanceof Date 
          ? loan.currentOutstanding.lastCalculatedDate.toISOString() 
          : loan.currentOutstanding?.lastCalculatedDate
      },
      status: loan.status,
      substatus: loan.substatus,
      loanProvider: loan.loanProvider,
      isDeleted: loan.isDeleted || false,
      createdAt: loan.createdAt instanceof Date ? loan.createdAt.toISOString() : loan.createdAt,
      updatedAt: loan.updatedAt instanceof Date ? loan.updatedAt.toISOString() : loan.updatedAt,
    };
  }

  static error(message: string) {
    return {
      success: false,
      error: message
    };
  }
}