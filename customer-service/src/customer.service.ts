import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './repositories/customer.repository';
import { ICustomer } from './interfaces/customer.interface';
import { CreateCustomerDto, UpdateCustomerDto, ListCustomersDto } from './dto/customer.dto';
import { ValidationHelper } from './helpers/validation.helper';
import { createCustomerSchema, updateCustomerSchema, paginationSchema } from './validators/customer.validator';
import { PAGINATION_DEFAULTS } from './constants/customer.constants';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async create(customerData: CreateCustomerDto): Promise<{ customer?: ICustomer; error?: string }> {
    const { value, error } = ValidationHelper.validate<CreateCustomerDto>(createCustomerSchema, customerData);
    if (error || !value) {
      return { error: error || 'Validation failed' };
    }

    // Check for duplicate email if provided
    if (value.email) {
      const existingCustomer = await this.customerRepository.findByEmail(value.email);
      if (existingCustomer) {
        return { error: 'Customer with this email already exists' };
      }
    }

    const customer = await this.customerRepository.create(value);
    return { customer };
  }

  async findById(customerId: string): Promise<{ customer?: ICustomer; error?: string }> {
    if (!customerId) {
      return { error: 'Customer ID is required' };
    }

    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      return { error: 'Customer not found' };
    }

    return { customer };
  }

  async update(updateData: UpdateCustomerDto): Promise<{ customer?: ICustomer; error?: string }> {
    const { value, error } = ValidationHelper.validate<UpdateCustomerDto>(updateCustomerSchema, updateData);
    if (error || !value) {
      return { error: error || 'Validation failed' };
    }

    const { customerId, ...updateFields } = value;
    const customer = await this.customerRepository.update(customerId, updateFields);
    if (!customer) {
      return { error: 'Customer not found' };
    }

    return { customer };
  }

  async delete(customerId: string): Promise<{ success: boolean; error?: string }> {
    if (!customerId) {
      return { success: false, error: 'Customer ID is required' };
    }

    const deleted = await this.customerRepository.delete(customerId);
    if (!deleted) {
      return { success: false, error: 'Customer not found' };
    }

    return { success: true };
  }

  async findAll(queryData: ListCustomersDto): Promise<{ customers?: ICustomer[]; total?: number; page?: number; limit?: number; error?: string }> {
    const { value, error } = ValidationHelper.validate<ListCustomersDto>(paginationSchema, queryData);
    if (error || !value) {
      return { error: error || 'Validation failed' };
    }

    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT, search } = value;
    const result = await this.customerRepository.findAll(page, limit, search);
    
    return {
      customers: result.customers,
      total: result.total,
      page,
      limit
    };
  }
}