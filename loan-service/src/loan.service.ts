import { Injectable } from '@nestjs/common';
import { LoanRepository } from './repositories/loan.repository';
import { ILoan } from './interfaces/loan.interface';
import { CreateLoanDto, UpdateLoanDto, ListLoansDto } from './dto/loan.dto';
import { ResponseHelper } from './helpers/response.helper';

@Injectable()
export class LoanService {
  constructor(private readonly loanRepository: LoanRepository) {}

  async create(loanData: CreateLoanDto, loanProvider: any): Promise<any> {
    try {
      // Validate required fields
      if (!loanData.customer) {
        return ResponseHelper.error('Customer is required');
      }
      if (!loanProvider) {
        return ResponseHelper.error('LoanProvider is required');
      }
      
      // Validate business rules
      if (new Date(loanData.startDate) >= new Date(loanData.endDate)) {
        return ResponseHelper.error('End date must be after start date');
      }
      
      const loan = await this.loanRepository.create(loanData, loanProvider);
      return {
        success: true,
        message: 'Loan created successfully',
        data: ResponseHelper.transformLoan(loan)
      };
    } catch (error) {
      if (error.code === 11000) {
        return ResponseHelper.error('Loan ID already exists');
      }
      if (error.name === 'ValidationError') {
        return ResponseHelper.error(`Validation failed: ${error.message}`);
      }
      return ResponseHelper.error(error.message || 'Failed to create loan');
    }
  }

  async findById(loanId: string): Promise<any> {
    try {
      const loan = await this.loanRepository.findById(loanId);
      if (!loan) {
        return ResponseHelper.error('Loan not found');
      }

      return {
        success: true,
        data: ResponseHelper.transformLoan(loan),
        error: null
      };
    } catch (error) {
      return ResponseHelper.error(error.message || 'Failed to find loan');
    }
  }

  async update(updateData: UpdateLoanDto): Promise<any> {
    try {
      const { loanId, ...updateFields } = updateData;
      
      const loan = await this.loanRepository.update(loanId, updateFields);
      if (!loan) {
        return ResponseHelper.error('Loan not found');
      }

      return {
        success: true,
        data: ResponseHelper.transformLoan(loan),
        error: null
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ResponseHelper.error(`Validation failed: ${error.message}`);
      }
      return ResponseHelper.error(error.message || 'Failed to update loan');
    }
  }

  async delete(loanId: string): Promise<any> {
    try {
      const deleted = await this.loanRepository.delete(loanId);
      if (!deleted) {
        return ResponseHelper.error('Loan not found');
      }

      return {
        success: true,
        message: 'Loan deleted successfully',
        error: null
      };
    } catch (error) {
      return ResponseHelper.error(error.message || 'Failed to delete loan');
    }
  }

  async findAll(queryData: ListLoansDto): Promise<any> {
    try {
      const result = await this.loanRepository.findAll(queryData);
      
      return {
        success: true,
        loans: result.loans.map(loan => ResponseHelper.transformLoan(loan)),
        total: result.total,
        page: queryData.page || 1,
        limit: queryData.limit || 10,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        loans: [],
        total: 0,
        page: 1,
        limit: 10,
        error: error.message || 'Failed to fetch loans'
      };
    }
  }
}