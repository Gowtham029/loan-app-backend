import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { CreatePaymentDto, UpdatePaymentDto } from '../dto/payment.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  private generatePaymentId(loanId: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PAY_${loanId}_${timestamp}_${random}`;
  }

  async create(paymentData: CreatePaymentDto): Promise<PaymentDocument> {
    try {
      const paymentId = this.generatePaymentId(paymentData.loanId);
      const payment = new this.paymentModel({
        ...paymentData,
        paymentId,
        status: 'PENDING',
        isPartialPayment: paymentData.paymentType === 'PARTIAL',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return await payment.save();
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async findById(paymentId: string): Promise<PaymentDocument | null> {
    try {
      return await this.paymentModel.findOne({ paymentId }).exec();
    } catch (error) {
      throw new Error(`Failed to find payment: ${error.message}`);
    }
  }

  async update(paymentId: string, updateData: Partial<UpdatePaymentDto>): Promise<PaymentDocument | null> {
    try {
      return await this.paymentModel.findOneAndUpdate(
        { paymentId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }

  async delete(paymentId: string): Promise<boolean> {
    try {
      const result = await this.paymentModel.deleteOne({ paymentId }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete payment: ${error.message}`);
    }
  }

  async findAll(page: number, limit: number, loanId?: string, customerId?: string, status?: string, paymentType?: string, sortBy?: string, sortOrder?: string): Promise<{ payments: PaymentDocument[]; total: number }> {
    try {
      const query: any = {};
      
      if (loanId) query.loanId = loanId;
      if (customerId) query.customerId = customerId;
      if (status) query.status = status;
      if (paymentType) query.paymentType = paymentType;

      const skip = (page - 1) * limit;
      const sort: any = {};
      sort[sortBy || 'createdAt'] = sortOrder === 'asc' ? 1 : -1;
      
      const [payments, total] = await Promise.all([
        this.paymentModel.find(query).skip(skip).limit(limit).sort(sort).exec(),
        this.paymentModel.countDocuments(query).exec()
      ]);

      return { payments, total };
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }
  }
}