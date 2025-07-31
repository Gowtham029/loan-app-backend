import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, GetUserDto, DeleteUserDto, ListUsersDto } from './dto/user.dto';
import { ResponseHelper } from './helpers/response.helper';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);
  
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserDto) {
    this.logger.log(`CreateUser: ${JSON.stringify(data)}`);
    try {
      const result = await this.userService.create(data);
      
      if (result.error) {
        this.logger.error(JSON.stringify({
          method: 'CreateUser',
          error: result.error,
          data: { email: data.email, username: data.username },
          timestamp: new Date().toISOString()
        }));
        return ResponseHelper.error(result.error);
      }
      
      return {
        success: true,
        user: ResponseHelper.transformUser(result.user),
        error: null
      };
    } catch (error) {
      this.logger.error(JSON.stringify({
        method: 'CreateUser',
        error: error.message,
        stack: error.stack,
        data: { email: data.email, username: data.username },
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(error.message || 'Internal server error');
    }
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: GetUserDto) {
    const result = await this.userService.findById(data.userId);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'GetUser',
        error: result.error,
        userId: data.userId,
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      user: ResponseHelper.transformUser(result.user),
      error: null
    };
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: UpdateUserDto) {
    const result = await this.userService.update(data);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'UpdateUser',
        error: result.error,
        userId: data.userId,
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      user: ResponseHelper.transformUser(result.user),
      error: null
    };
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(data: DeleteUserDto) {
    const result = await this.userService.delete(data.userId);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'DeleteUser',
        error: result.error,
        userId: data.userId,
        timestamp: new Date().toISOString()
      }));
      return ResponseHelper.error(result.error);
    }
    
    return {
      success: true,
      message: 'User deleted successfully',
      error: null
    };
  }

  @GrpcMethod('UserService', 'ListUsers')
  async listUsers(data: ListUsersDto) {
    this.logger.log(`ListUsers: ${JSON.stringify(data)}`);
    const result = await this.userService.findAll(data);
    
    if (result.error) {
      this.logger.error(JSON.stringify({
        method: 'ListUsers',
        error: result.error,
        query: data,
        timestamp: new Date().toISOString()
      }));
      return {
        success: false,
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        error: result.error
      };
    }
    
    return {
      success: true,
      users: result.users.map(u => ResponseHelper.transformUser(u)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      error: null
    };
  }
}