import { IPayment } from '../interfaces/payment.interface';

export class ResponseHelper {
  static transformPayment(payment: any): IPayment {
    return {
      id: payment._id?.toString() || payment.id,
      paymentId: payment.paymentId,
      loanId: payment.loanId,
      customerId: payment.customerId,
      paymentDetails: payment.paymentDetails,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      paymentType: payment.paymentType,
      isPartialPayment: payment.isPartialPayment,
      daysPastDue: payment.daysPastDue,
      outstandingAfterPayment: payment.outstandingAfterPayment,
      processedBy: payment.processedBy,
      processedAt: payment.processedAt instanceof Date ? payment.processedAt.toISOString() : payment.processedAt,
      failureReason: payment.failureReason,
      createdAt: payment.createdAt instanceof Date ? payment.createdAt.toISOString() : payment.createdAt,
      updatedAt: payment.updatedAt instanceof Date ? payment.updatedAt.toISOString() : payment.updatedAt,
    };
  }

  static error(message: string) {
    return {
      success: false,
      error: message
    };
  }
}