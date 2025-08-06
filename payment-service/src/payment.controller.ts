import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto, GetPaymentDto, DeletePaymentDto, ListPaymentsDto } from './dto/payment.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @GrpcMethod('PaymentService', 'CreatePayment')
  async createPayment(data: CreatePaymentDto) {
    return await this.paymentService.create(data);
  }

  @GrpcMethod('PaymentService', 'GetPayment')
  async getPayment(data: GetPaymentDto) {
    return await this.paymentService.findById(data.paymentId);
  }

  @GrpcMethod('PaymentService', 'UpdatePayment')
  async updatePayment(data: UpdatePaymentDto) {
    return await this.paymentService.update(data);
  }

  @GrpcMethod('PaymentService', 'DeletePayment')
  async deletePayment(data: DeletePaymentDto) {
    return await this.paymentService.delete(data);
  }

  @GrpcMethod('PaymentService', 'ListPayments')
  async listPayments(data: ListPaymentsDto) {
    return await this.paymentService.findAll(data);
  }
}