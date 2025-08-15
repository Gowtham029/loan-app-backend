import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, HttpException, HttpStatus, Inject, UseGuards, OnModuleInit, Request } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateLoanDto, UpdateLoanDto, ListLoansQueryDto, LoanResponseDto, ListLoansResponseDto } from './dto/loan.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

interface LoanService {
  CreateLoan(data: any): any;
  GetLoan(data: { loanId: string }): any;
  UpdateLoan(data: any): any;
  DeleteLoan(data: { loanId: string }): any;
  ListLoans(data: any): any;
}

@ApiTags('Loans')
@ApiBearerAuth('JWT-auth')
@Controller('loans')
@UseGuards(AuthGuard, RolesGuard)
export class LoanController implements OnModuleInit {
  private loanService: LoanService;

  constructor(@Inject('LOAN_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.loanService = this.client.getService<LoanService>('LoanService');
  }

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiResponse({ status: 201, description: 'Loan created successfully', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  async createLoan(@Body() createLoanDto: CreateLoanDto, @Request() req: any) {
    try {
      const loanProvider = {
        userId: req.user?.id || req.user?.sub,
        username: req.user?.username,
        firstName: req.user?.firstName,
        lastName: req.user?.lastName,
        email: req.user?.email
      };
      
      const loanData = {
        ...createLoanDto,
        loanProvider
      };
      
      const result = await firstValueFrom(this.loanService.CreateLoan(loanData)) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to create loan', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan found', type: LoanResponseDto })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoan(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(this.loanService.GetLoan({ loanId: id })) as any;
      
      // if (!result.success) {
      //   throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      // }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to get loan', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update loan by ID' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan updated successfully', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  async updateLoan(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto, @Request() req: any) {
    try {
      const loanData = {
        ...updateLoanDto,
        loanId: id,
        updatedBy: {
          userId: req.user?.id || req.user?.sub,
          username: req.user?.username,
          firstName: req.user?.firstName,
          lastName: req.user?.lastName,
          email: req.user?.email
        }
      };
      
      const result = await firstValueFrom(this.loanService.UpdateLoan(loanData)) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to update loan', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete loan by ID' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async deleteLoan(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(this.loanService.DeleteLoan({ loanId: id })) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to delete loan', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List loans with pagination and search' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filter by customer ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'substatus', required: false, description: 'Filter by substatus' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Loans retrieved successfully', type: ListLoansResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listLoans(@Query() query: ListLoansQueryDto) {
    try {
      const transformedQuery = {
        ...query,
        page: query.page ? parseInt(query.page as any, 10) : 1,
        limit: query.limit ? parseInt(query.limit as any, 10) : 10
      };
      
      const result = await firstValueFrom(this.loanService.ListLoans(transformedQuery)) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to list loans', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}