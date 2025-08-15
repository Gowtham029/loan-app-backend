import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoanService } from './loan.service';
import { CreateLoanDto, UpdateLoanDto, GetLoanDto, DeleteLoanDto, ListLoansDto } from './dto/loan.dto';
import { ResponseHelper } from './helpers/response.helper';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class LoanController {
  private readonly logger = new Logger(LoanController.name);
  
  constructor(private readonly loanService: LoanService) {}

  @GrpcMethod('LoanService', 'CreateLoan')
  async createLoan(data: any) {
    const { loanProvider, ...loanData } = data;
    return await this.loanService.create(loanData, loanProvider);
  }

  @GrpcMethod('LoanService', 'GetLoan')
  async getLoan(data: any) {
    return await this.loanService.findById(data.loanId);
  }

  @GrpcMethod('LoanService', 'UpdateLoan')
  async updateLoan(data: UpdateLoanDto) {
    return await this.loanService.update(data);
  }

  @GrpcMethod('LoanService', 'DeleteLoan')
  async deleteLoan(data: any) {
    return await this.loanService.delete(data.loanId);
  }

  @GrpcMethod('LoanService', 'ListLoans')
  async listLoans(data: any) {
    return await this.loanService.findAll(data);
  }
}