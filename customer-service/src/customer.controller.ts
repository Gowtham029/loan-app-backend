import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto, GetCustomerDto, DeleteCustomerDto, ListCustomersDto } from './dto/customer.dto';
import { ResponseHelper } from './helpers/response.helper';

@Controller()
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);
  
  constructor(private readonly customerService: CustomerService) {}

  @GrpcMethod('CustomerService', 'CreateCustomer')
  async createCustomer(data: CreateCustomerDto) {
    this.logger.log(`CreateCustomer: ${JSON.stringify(data)}`);
    try {
      const result = await this.customerService.create(data);
      
      if (result.error) {
        this.logger.error(JSON.stringify({
          method: 'CreateCustomer',
          error: result.error,
          data: { email: data.email, firstName: data.firstName },
          timestamp: new Date().toISOString()
        }));
        return ResponseHelper.error(result.error);
      }
      
      return {
        success: true,
        customer: ResponseHelper.transformCustomer(result.customer),
        error: null
      };
    } catch (error) {
      this.logger.error(JSON.stringify({
        method: 'CreateCustomer',
        error: error.message,
        stack: error.stack,
        data: { email: data.email, firstName: data.firstName },
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(error.message || 'Internal server error');
    }
  }

  @GrpcMethod('CustomerService', 'GetCustomer')
  async getCustomer(data: GetCustomerDto) {
    const result = await this.customerService.findById(data.customerId);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'GetCustomer',
        error: result.error,
        customerId: data.customerId,
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      customer: ResponseHelper.transformCustomer(result.customer),
      error: null
    };
  }

  @GrpcMethod('CustomerService', 'UpdateCustomer')
  async updateCustomer(data: UpdateCustomerDto) {
    const result = await this.customerService.update(data);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'UpdateCustomer',
        error: result.error,
        customerId: data.customerId,
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      customer: ResponseHelper.transformCustomer(result.customer),
      error: null
    };
  }

  @GrpcMethod('CustomerService', 'DeleteCustomer')
  async deleteCustomer(data: DeleteCustomerDto) {
    const result = await this.customerService.delete(data.customerId);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'DeleteCustomer',
        error: result.error,
        customerId: data.customerId,
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      message: 'Customer deleted successfully',
      error: null
    };
  }

  @GrpcMethod('CustomerService', 'ListCustomers')
  async listCustomers(data: ListCustomersDto) {
    this.logger.log(`ListCustomers: ${JSON.stringify(data)}`);
    const result = await this.customerService.findAll(data);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'ListCustomers',
        error: result.error,
        query: data,
        timestamp: new Date().toISOString()
      }));
      return {
        success: false,
        customers: [],
        total: 0,
        page: 1,
        limit: 10,
        error: result.error
      };
    }
    
    return {
      success: true,
      customers: result.customers.map(c => ResponseHelper.transformCustomer(c)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      error: null
    };
  }
}