import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, Inject, UseGuards, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto, UpdateUserDto, ListUsersDto, CreateUserResponseDto, UserResponseDto, ListUsersResponseDto } from './dto/user.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

interface UserService {
  CreateUser(data: CreateUserDto): any;
  GetUser(data: { userId: string }): any;
  UpdateUser(data: UpdateUserDto & { userId: string }): any;
  DeleteUser(data: { userId: string }): any;
  ListUsers(data: ListUsersDto): any;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController implements OnModuleInit {
  private userService: UserService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    console.log('Initializing User Controller...');
    try {
      this.userService = this.client.getService<UserService>('UserService');
      console.log('User service client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize user service client:', error);
    }
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: CreateUserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or user already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await firstValueFrom(this.userService.CreateUser(createUserDto)) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUser(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(this.userService.GetUser({ userId: id })) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Manager role required' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await firstValueFrom(this.userService.UpdateUser({ ...updateUserDto, userId: id })) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(this.userService.DeleteUser({ userId: id })) as any;
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List users with pagination and search' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: ListUsersResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listUsers(@Query() query: ListUsersDto) {
    console.log('List users request received:', query);
    try {
      if (!this.userService) {
        console.error('User service not initialized');
        throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }
      
      // Transform query parameters to proper types
      const transformedQuery = {
        ...query,
        page: query.page ? parseInt(query.page as any, 10) : 1,
        limit: query.limit ? parseInt(query.limit as any, 10) : 10
      };
      
      console.log('Calling user service ListUsers with transformed query:', transformedQuery);
      const result = await firstValueFrom(this.userService.ListUsers(transformedQuery)) as any;
      console.log('User service response:', result);
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        users: result.users,
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to list users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}