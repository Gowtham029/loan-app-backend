import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoanService } from './loan.service';
import { CreateLoanDto, UpdateLoanDto, GetLoanDto, DeleteLoanDto, ListLoansDto } from './dto/loan.dto';
import { ResponseHelper } from './helpers/response.helper';

@Controller()
export class LoanController {
  private readonly logger = new Logger(LoanController.name);
  
  constructor(private readonly loanService: LoanService) {}

  @GrpcMethod('LoanService', 'CreateLoan')
  async createLoan(data: CreateLoanDto) {
    this.logger.log(`CreateLoan received data: ${JSON.stringify(data, null, 2)}`);
    
    // Validate required fields
    if (!data.customer) {
      this.logger.error('Customer object is missing');
      return ResponseHelper.error('Customer is required');
    }
    
    if (!data.loanProvider) {
      this.logger.error('LoanProvider object is missing');
      return ResponseHelper.error('LoanProvider is required');
    }
    
    this.logger.log(`Customer: ${JSON.stringify(data.customer)}`);
    this.logger.log(`LoanProvider: ${JSON.stringify(data.loanProvider)}`);
    try {
      const result = await this.loanService.create(data);
      
      if (result.error) {
        return ResponseHelper.error(result.error);
      }
      
      return {
        success: true,
        loan: result.loan,
        error: null
      };
    } catch (error) {
      this.logger.error(`CreateLoan error: ${error.message}`);
      return ResponseHelper.error(error.message || 'Internal server error');
    }
  }

  @GrpcMethod('LoanService', 'GetLoan')
  async getLoan(data: GetLoanDto) {
    const result = await this.loanService.findById(data.loanId);
    
    if (result.error) {
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      loan: result.loan,
      error: null
    };
  }

  @GrpcMethod('LoanService', 'UpdateLoan')
  async updateLoan(data: UpdateLoanDto) {
    const result = await this.loanService.update(data);
    
    if (result.error) {
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      loan: result.loan,
      error: null
    };
  }

  @GrpcMethod('LoanService', 'DeleteLoan')
  async deleteLoan(data: DeleteLoanDto) {
    const result = await this.loanService.delete(data.loanId);
    
    if (result.error) {
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      message: 'Loan deleted successfully',
      error: null
    };
  }

  @GrpcMethod('LoanService', 'ListLoans')
  async listLoans(data: ListLoansDto) {
    this.logger.log(`ListLoans: ${JSON.stringify(data)}`);
    const result = await this.loanService.findAll(data);
    
    if (result.error) {
      return {
        success: false,
        loans: [],
        total: 0,
        page: 1,
        limit: 10,
        error: result.error
      };
    }
    
    return {
      success: true,
      loans: result.loans,
      total: result.total,
      page: result.page,
      limit: result.limit,
      error: null
    };
  }
}