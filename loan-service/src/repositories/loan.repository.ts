import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument } from '../schemas/loan.schema';
import { CreateLoanDto, UpdateLoanDto } from '../dto/loan.dto';

@Injectable()
export class LoanRepository {
  constructor(@InjectModel(Loan.name) private loanModel: Model<LoanDocument>) {}

  async create(loanData: CreateLoanDto, loanProvider: any): Promise<LoanDocument> {
    try {
      const loanId = this.generateLoanId();
      const enrichedLoanData = this.enrichLoanData(loanData, loanProvider);
      const loan = new this.loanModel({
        ...enrichedLoanData,
        loanId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return await loan.save();
    } catch (error) {
      throw new Error(`Failed to create loan: ${error.message}`);
    }
  }

  async findById(loanId: string): Promise<LoanDocument | null> {
    try {
      return await this.loanModel.findOne({ loanId, isDeleted: false }).exec();
    } catch (error) {
      throw new Error(`Failed to find loan: ${error.message}`);
    }
  }

  async update(loanId: string, updateData: Partial<UpdateLoanDto>): Promise<LoanDocument | null> {
    try {
      return await this.loanModel.findOneAndUpdate(
        { loanId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update loan: ${error.message}`);
    }
  }

  async delete(loanId: string): Promise<boolean> {
    try {
      const result = await this.loanModel.findOneAndUpdate(
        { loanId, isDeleted: false },
        { isDeleted: true, updatedAt: new Date() },
        { new: true }
      ).exec();
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete loan: ${error.message}`);
    }
  }

  async findAll(filters: any): Promise<{ loans: LoanDocument[]; total: number }> {
    try {
      const { page = 1, limit = 10, customerId, status, substatus, search, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
      const query: any = { isDeleted: false };
      
      if (search) {
        query.$or = [
          { loanId: { $regex: search, $options: 'i' } },
          { 'customer.customerId': { $regex: search, $options: 'i' } },
          { 'customer.firstName': { $regex: search, $options: 'i' } },
          { 'customer.lastName': { $regex: search, $options: 'i' } },
          { 'customer.email': { $regex: search, $options: 'i' } }
        ];
      }
      
      if (customerId) query['customer.customerId'] = customerId;
      if (status) query.status = status;
      if (substatus) query.substatus = substatus;

      const skip = (page - 1) * limit;
      const sortObj: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
      // Status priority: ACTIVE > COMPLETED > DEFAULTED > CANCELLED
      const statusOrder = {
        'ACTIVE': 1,
        'COMPLETED': 2,
        'DEFAULTED': 3,
        'CANCELLED': 4
      };
      
      const [loans, total] = await Promise.all([
        this.loanModel.find(query).sort(sortObj).skip(skip).limit(limit).exec(),
        this.loanModel.countDocuments(query).exec()
      ]);

      return { loans, total };
    } catch (error) {
      throw new Error(`Failed to fetch loans: ${error.message}`);
    }
  }

  private generateLoanId(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `LN${timestamp}${random}`;
  }

  private enrichLoanData(loanData: CreateLoanDto, loanProvider: any): any {
    const currentPrincipal = loanData.originalPrincipal;
    const totalInterestRupees = Math.round((loanData.originalPrincipal * loanData.interestRate.annualPercentage) / 100);
    const monthlyInterestRupees = Math.round(totalInterestRupees / 12);
    const expectedMonthlyPayment = Math.round((loanData.originalPrincipal + totalInterestRupees) / loanData.termMonths);
    
    return {
      ...loanData,
      currentPrincipal,
      remainingTerms: loanData.termMonths,
      interestRate: {
        ...loanData.interestRate,
        totalInterestRupees,
        monthlyInterestRupees
      },
      expectedMonthlyPayment,
      missedPayments: {
        count: 0,
        closed: 0,
        totalMissedAmount: 0,
        compoundingDetails: {
          penaltyInterestRate: 0,
          compoundedInterest: 0,
          principalPenalty: 0,
          totalPenaltyAmount: 0
        },
        lateFees: {
          feePerMonth: 0,
          totalLateFees: 0
        }
      },
      currentOutstanding: {
        remainingPrincipal: currentPrincipal,
        pendingInterest: 0,
        penaltyAmount: 0,
        lateFees: 0,
        totalOutstanding: currentPrincipal,
        lastCalculatedDate: new Date()
      },
      status: 'ACTIVE',
      substatus: 'CURRENT',
      isDeleted: false,
      loanProvider
    };
  }
}