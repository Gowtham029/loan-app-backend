import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument } from '../schemas/loan.schema';
import { CreateLoanDto, UpdateLoanDto } from '../dto/loan.dto';

@Injectable()
export class LoanRepository {
  constructor(@InjectModel(Loan.name) private loanModel: Model<LoanDocument>) {}

  async create(loanData: CreateLoanDto): Promise<LoanDocument> {
    try {
      const loanId = this.generateLoanId();
      const loan = new this.loanModel({
        ...loanData,
        loanId,
        balanceRemaining: loanData.balanceRemaining || loanData.principalAmount,
        status: loanData.status || 'ACTIVE',
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
      return await this.loanModel.findOne({ loanId }).exec();
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
      const result = await this.loanModel.deleteOne({ loanId }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete loan: ${error.message}`);
    }
  }

  async findAll(page: number, limit: number, search?: string, customerId?: string, status?: string): Promise<{ loans: LoanDocument[]; total: number }> {
    try {
      const query: any = {};
      
      if (search) {
        query.$or = [
          { loanId: { $regex: search, $options: 'i' } },
          { 'customer.customerId': { $regex: search, $options: 'i' } },
          { 'customer.firstName': { $regex: search, $options: 'i' } },
          { 'customer.lastName': { $regex: search, $options: 'i' } },
          { 'customer.email': { $regex: search, $options: 'i' } }
        ];
      }
      
      if (customerId) {
        query['customer.customerId'] = customerId;
      }
      
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;
      
      // Status priority: ACTIVE > COMPLETED > DEFAULTED > CANCELLED
      const statusOrder = {
        'ACTIVE': 1,
        'COMPLETED': 2,
        'DEFAULTED': 3,
        'CANCELLED': 4
      };
      
      const [loans, total] = await Promise.all([
        this.loanModel.aggregate([
          { $match: query },
          {
            $addFields: {
              statusOrder: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$status', 'ACTIVE'] }, then: 1 },
                    { case: { $eq: ['$status', 'COMPLETED'] }, then: 2 },
                    { case: { $eq: ['$status', 'DEFAULTED'] }, then: 3 },
                    { case: { $eq: ['$status', 'CANCELLED'] }, then: 4 }
                  ],
                  default: 5
                }
              }
            }
          },
          { $sort: { statusOrder: 1, createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          { $project: { statusOrder: 0 } }
        ]).exec(),
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
}