import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto, UpdateUserDto, ListUsersDto } from './dto/user.dto';
import { ValidationHelper } from './helpers/validation.helper';
import { ResponseHelper } from './helpers/response.helper';
import { createUserSchema, updateUserSchema, paginationSchema } from './validators/user.validator';
import { PAGINATION_DEFAULTS } from './constants/user.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(userData: CreateUserDto): Promise<{ user?: IUser; error?: string }> {
    const { value, error } = ValidationHelper.validate<CreateUserDto>(createUserSchema, userData);
    if (error || !value) {
      return { error: error || 'Validation failed' };
    }

    const existingUser = await this.userRepository.findByEmail(value.email);
    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    const existingUsername = await this.userRepository.findByUsername(value.username);
    if (existingUsername) {
      return { error: 'Username already exists' };
    }

    const user = await this.userRepository.create(value);
    return { user: ResponseHelper.transformUser(user) };
  }

  async findById(userId: string): Promise<{ user?: IUser; error?: string }> {
    if (!userId) {
      return { error: 'User ID is required' };
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }

    return { user: ResponseHelper.transformUser(user) };
  }

  async update(updateData: UpdateUserDto): Promise<{ user?: IUser; error?: string }> {
    const { value, error } = ValidationHelper.validate<UpdateUserDto>(updateUserSchema, updateData);
    if (error || !value) {
      return { error: error || 'Validation failed' };
    }

    const { userId, ...updateFields } = value;
    const user = await this.userRepository.update(userId, updateFields);
    if (!user) {
      return { error: 'User not found' };
    }

    return { user: ResponseHelper.transformUser(user) };
  }

  async delete(userId: string): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const deleted = await this.userRepository.delete(userId);
    if (!deleted) {
      return { success: false, error: 'User not found' };
    }

    return { success: true };
  }

  async findAll(queryData: ListUsersDto): Promise<{ users?: IUser[]; total?: number; page?: number; limit?: number; error?: string }> {
    const { value, error } = ValidationHelper.validate<ListUsersDto>(paginationSchema, queryData);
    if (error || !value) {
      return { error: error || 'Validation failed' };
    }

    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT, search } = value;
    const result = await this.userRepository.findAll(page, limit, search);
    
    return {
      users: result.users.map(u => ResponseHelper.transformUser(u)),
      total: result.total,
      page,
      limit
    };
  }

  async findByUsername(username: string): Promise<{ user?: IUser; error?: string }> {
    if (!username) {
      return { error: 'Username is required' };
    }

    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return { error: 'User not found' };
    }

    return { user: ResponseHelper.transformUser(user) };
  }
}