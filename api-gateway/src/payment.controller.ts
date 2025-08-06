import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, Inject, UseGuards, OnModuleInit, Request } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentDto, UpdatePaymentDto, ListPaymentsDto, PaymentResponseDto, ListPaymentsResponseDto } from './dto/payment.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

interface PaymentService {
  CreatePayment(data: any): any;
  GetPayment(data: { paymentId: string }): any;
  UpdatePayment(data: any): any;
  DeletePayment(data: { paymentId: string }): any;
  ListPayments(data: any): any;
}

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentController implements OnModuleInit {
  private paymentService: PaymentService;

  constructor(@Inject('PAYMENT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.paymentService = this.client.getService<PaymentService>('PaymentService');
  }

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req: any) {
    try {
      const paymentData = {
        ...createPaymentDto,
        processedBy: req.user?.id || req.user?.sub
      };
      
      const result = await firstValueFrom(this.paymentService.CreatePayment(paymentData)) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to create payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment found', type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPayment(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(this.paymentService.GetPayment({ paymentId: id })) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to get payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  async updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @Request() req: any) {
    try {
      const paymentData = {
        ...updatePaymentDto,
        paymentId: id,
        processedBy: req.user?.id || req.user?.sub
      };
      
      const result = await firstValueFrom(this.paymentService.UpdatePayment(paymentData)) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to update payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async deletePayment(@Param('id') id: string, @Request() req: any) {
    try {
      const result = await firstValueFrom(this.paymentService.DeletePayment({ 
        paymentId: id,
        // reason: 'Deleted by admin',
        // deletedBy: req.user?.id || req.user?.sub
      })) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to delete payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List payments with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'loanId', required: false, description: 'Filter by loan ID' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filter by customer ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'paymentType', required: false, description: 'Filter by payment type' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc/desc)' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully', type: ListPaymentsResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listPayments(@Query() query: ListPaymentsDto) {
    try {
      const transformedQuery = {
        ...query,
        page: query.page ? parseInt(query.page as any, 10) : 1,
        limit: query.limit ? parseInt(query.limit as any, 10) : 10
      };
      
      const result = await firstValueFrom(this.paymentService.ListPayments(transformedQuery)) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to list payments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}