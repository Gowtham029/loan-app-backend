import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { CreatePaymentDto, UpdatePaymentDto, DeletePaymentDto, ListPaymentsDto } from './dto/payment.dto';
import { ResponseHelper } from './helpers/response.helper';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(paymentData: CreatePaymentDto): Promise<any> {
    try {
      // Validate required fields
      if (!paymentData.loanId) {
        return ResponseHelper.error('Loan ID is required');
      }
      if (!paymentData.customerId) {
        return ResponseHelper.error('Customer ID is required');
      }
      if (!paymentData.paymentDetails || paymentData.paymentDetails.paidAmount <= 0) {
        return ResponseHelper.error('Valid payment amount is required');
      }

      const payment = await this.paymentRepository.create(paymentData);
      return {
        success: true,
        payment: ResponseHelper.transformPayment(payment),
        error: null
      };
    } catch (error) {
      if (error.code === 11000) {
        return ResponseHelper.error('Payment ID already exists');
      }
      if (error.name === 'ValidationError') {
        return ResponseHelper.error(`Validation failed: ${error.message}`);
      }
      return ResponseHelper.error(error.message || 'Failed to create payment');
    }
  }

  async findById(paymentId: string): Promise<any> {
    try {
      if (!paymentId) {
        return ResponseHelper.error('Payment ID is required');
      }

      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        return ResponseHelper.error('Payment not found');
      }

      return {
        success: true,
        payment: ResponseHelper.transformPayment(payment),
        error: null
      };
    } catch (error) {
      return ResponseHelper.error(error.message || 'Failed to find payment');
    }
  }

  async update(updateData: UpdatePaymentDto): Promise<any> {
    try {
      const { paymentId, ...updateFields } = updateData;
      
      const payment = await this.paymentRepository.update(paymentId, updateFields);
      if (!payment) {
        return ResponseHelper.error('Payment not found');
      }

      return {
        success: true,
        payment: ResponseHelper.transformPayment(payment),
        error: null
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ResponseHelper.error(`Validation failed: ${error.message}`);
      }
      return ResponseHelper.error(error.message || 'Failed to update payment');
    }
  }

  async delete(deleteData: DeletePaymentDto): Promise<any> {
    try {
      if (!deleteData.paymentId) {
        return ResponseHelper.error('Payment ID is required');
      }

      const deleted = await this.paymentRepository.delete(deleteData.paymentId);
      if (!deleted) {
        return ResponseHelper.error('Payment not found');
      }

      return {
        success: true,
        message: 'Payment deleted successfully',
        error: null
      };
    } catch (error) {
      return ResponseHelper.error(error.message || 'Failed to delete payment');
    }
  }

  async findAll(queryData: ListPaymentsDto): Promise<any> {
    try {
      const { page = 1, limit = 10, loanId, customerId, status, paymentType, sortBy, sortOrder } = queryData;
      const result = await this.paymentRepository.findAll(page, limit, loanId, customerId, status, paymentType, sortBy, sortOrder);
      
      return {
        success: true,
        payments: result.payments.map(payment => ResponseHelper.transformPayment(payment)),
        total: result.total,
        page,
        limit,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        payments: [],
        total: 0,
        page: 1,
        limit: 10,
        error: error.message || 'Failed to fetch payments'
      };
    }
  }
}