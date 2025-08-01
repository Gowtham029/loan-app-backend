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
    return await this.loanService.create(data);
  }

  @GrpcMethod('LoanService', 'GetLoan')
  async getLoan(data: GetLoanDto) {
    return await this.loanService.findById(data.loanId);
  }

  @GrpcMethod('LoanService', 'UpdateLoan')
  async updateLoan(data: UpdateLoanDto) {
    return await this.loanService.update(data);
  }

  @GrpcMethod('LoanService', 'DeleteLoan')
  async deleteLoan(data: DeleteLoanDto) {
    return await this.loanService.delete(data.loanId);
  }

  @GrpcMethod('LoanService', 'ListLoans')
  async listLoans(data: ListLoansDto) {
    return await this.loanService.findAll(data);
  }
}