import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Inject, OnModuleInit, HttpStatus, HttpException, Logger, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto, ListCustomersQueryDto, ListCustomersResponseDto } from './dto/customer.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

interface CustomerService {
  createCustomer(data: any): any;
  getCustomer(data: any): any;
  updateCustomer(data: any): any;
  deleteCustomer(data: any): any;
  listCustomers(data: any): any;
}

@ApiTags('Customers')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
@UseGuards(AuthGuard, RolesGuard)
export class CustomerController implements OnModuleInit {
  private readonly logger = new Logger(CustomerController.name);
  private customerService: CustomerService;

  constructor(@Inject('CUSTOMER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.customerService = this.client.getService<CustomerService>('CustomerService');
  }

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Customer already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    // Set default createdBy if not provided
    if (!createCustomerDto.createdBy) {
      createCustomerDto.createdBy = 'admin';
    }
    
    const result = await this.customerService.createCustomer(createCustomerDto);
    
    
    
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer found', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getCustomer(@Param('id') id: string) {
    const result = await this.customerService.getCustomer({ customerId: id });
    return result;
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer updated', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  async updateCustomer(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    // Set default lastModifiedBy if not provided
    if (!updateCustomerDto.lastModifiedBy) {
      updateCustomerDto.lastModifiedBy = 'admin';
    }
    const result = await this.customerService.updateCustomer({ customerId: id, ...updateCustomerDto });
    return result;
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async deleteCustomer(@Param('id') id: string) {
    const result = await this.customerService.deleteCustomer({ customerId: id });
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'List customers with pagination and search' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', allowEmptyValue: false })
  @ApiResponse({ status: 200, description: 'Customers list', type: ListCustomersResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async listCustomers(@Query() query: ListCustomersQueryDto) {
    const result = await this.customerService.listCustomers(query);
    return result;
  }
}