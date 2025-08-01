import { Injectable } from '@nestjs/common';
import { LoanRepository } from './repositories/loan.repository';
import { ILoan } from './interfaces/loan.interface';
import { CreateLoanDto, UpdateLoanDto, ListLoansDto } from './dto/loan.dto';
import { ResponseHelper } from './helpers/response.helper';

@Injectable()
export class LoanService {
  constructor(private readonly loanRepository: LoanRepository) {}

  async create(loanData: CreateLoanDto): Promise<{ loan?: ILoan; error?: string }> {
    try {
      // Validate business rules
      if (loanData.interestRateType === 'PERCENTAGE' && !loanData.interestRate) {
        return { error: 'Interest rate is required for PERCENTAGE type' };
      }
      if (loanData.interestRateType === 'PAISA' && !loanData.paisaRate) {
        return { error: 'Paisa rate is required for PAISA type' };
      }
      if (new Date(loanData.startDate) >= new Date(loanData.endDate)) {
        return { error: 'End date must be after start date' };
      }
      
      const loan = await this.loanRepository.create(loanData);
      return { loan: ResponseHelper.transformLoan(loan) };
    } catch (error) {
      if (error.code === 11000) {
        return { error: 'Loan ID already exists' };
      }
      if (error.name === 'ValidationError') {
        return { error: `Validation failed: ${error.message}` };
      }
      return { error: error.message || 'Failed to create loan' };
    }
  }

  async findById(loanId: string): Promise<{ loan?: ILoan; error?: string }> {
    if (!loanId) {
      return { error: 'Loan ID is required' };
    }

    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      return { error: 'Loan not found' };
    }

    return { loan: ResponseHelper.transformLoan(loan) };
  }

  async update(updateData: UpdateLoanDto): Promise<{ loan?: ILoan; error?: string }> {
    try {
      const { loanId, ...updateFields } = updateData;
      
      // Validate business rules for updates
      if (updateFields.interestRateType === 'PERCENTAGE' && !updateFields.interestRate) {
        return { error: 'Interest rate is required for PERCENTAGE type' };
      }
      if (updateFields.interestRateType === 'PAISA' && !updateFields.paisaRate) {
        return { error: 'Paisa rate is required for PAISA type' };
      }
      if (updateFields.startDate && updateFields.endDate && 
          new Date(updateFields.startDate) >= new Date(updateFields.endDate)) {
        return { error: 'End date must be after start date' };
      }
      
      const loan = await this.loanRepository.update(loanId, updateFields);
      if (!loan) {
        return { error: 'Loan not found' };
      }

      return { loan: ResponseHelper.transformLoan(loan) };
    } catch (error) {
      if (error.name === 'ValidationError') {
        return { error: `Validation failed: ${error.message}` };
      }
      return { error: error.message || 'Failed to update loan' };
    }
  }

  async delete(loanId: string): Promise<{ success: boolean; error?: string }> {
    if (!loanId) {
      return { success: false, error: 'Loan ID is required' };
    }

    const deleted = await this.loanRepository.delete(loanId);
    if (!deleted) {
      return { success: false, error: 'Loan not found' };
    }

    return { success: true };
  }

  async findAll(queryData: ListLoansDto): Promise<{ loans?: ILoan[]; total?: number; page?: number; limit?: number; error?: string }> {
    const { page = 1, limit = 10, search, customerId, status } = queryData;
    const result = await this.loanRepository.findAll(page, limit, search, customerId, status);
    
    return {
      loans: result.loans.map(loan => ResponseHelper.transformLoan(loan)),
      total: result.total,
      page,
      limit
    };
  }
}