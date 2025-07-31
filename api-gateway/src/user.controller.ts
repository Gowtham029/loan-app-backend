import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, ListUsersDto, CreateUserResponseDto, UserResponseDto, ListUsersResponseDto } from './dto/user.dto';
import { AuthGuard } from './guards/auth.guard';

interface UserService {
  CreateUser(data: CreateUserDto): Promise<any>;
  GetUser(data: { userId: string }): Promise<any>;
  UpdateUser(data: UpdateUserDto & { userId: string }): Promise<any>;
  DeleteUser(data: { userId: string }): Promise<any>;
  ListUsers(data: ListUsersDto): Promise<any>;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  private userService: UserService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: CreateUserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or user already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.CreateUser(createUserDto);
      
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
      const result = await this.userService.GetUser({ userId: id });
      
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
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userService.UpdateUser({ ...updateUserDto, userId: id });
      
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
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await this.userService.DeleteUser({ userId: id });
      
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
    try {
      const result = await this.userService.ListUsers(query);
      
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