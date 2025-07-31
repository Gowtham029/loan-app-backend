import { IsString, IsEmail, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john.doe@company.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'manager', enum: ['admin', 'manager', 'viewer'], description: 'User role' })
  @IsEnum(['admin', 'manager', 'viewer'])
  role: 'admin' | 'manager' | 'viewer';

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'suspended'], required: false, description: 'User status' })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: 'active' | 'inactive' | 'suspended';

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false, description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ example: 'Finance', required: false, description: 'Department name' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: '+1234567890', required: false, description: 'Phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe_updated', required: false, description: 'Updated username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'john.updated@company.com', required: false, description: 'Updated email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'John Updated', required: false, description: 'Updated first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe Updated', required: false, description: 'Updated last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'admin', enum: ['admin', 'manager', 'viewer'], required: false, description: 'Updated role' })
  @IsOptional()
  @IsEnum(['admin', 'manager', 'viewer'])
  role?: 'admin' | 'manager' | 'viewer';

  @ApiProperty({ example: 'suspended', enum: ['active', 'inactive', 'suspended'], required: false, description: 'Updated status' })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: 'active' | 'inactive' | 'suspended';

  @ApiProperty({ example: 'https://example.com/new-profile.jpg', required: false, description: 'Updated profile picture' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ example: 'IT', required: false, description: 'Updated department' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: '+9876543210', required: false, description: 'Updated phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class ListUsersDto {
  @ApiProperty({ example: 1, required: false, description: 'Page number for pagination' })
  @IsOptional()
  page?: number | string = 1;

  @ApiProperty({ example: 10, required: false, description: 'Number of items per page' })
  @IsOptional()
  limit?: number | string = 10;

  @ApiProperty({ example: 'john', required: false, description: 'Search term for filtering users' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: '64f1a2b3c4d5e6f7g8h9i0j1', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john.doe@company.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string;

  @ApiProperty({ example: 'manager', enum: ['admin', 'manager', 'viewer'], description: 'User role' })
  role: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'suspended'], description: 'User status' })
  status: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Last update timestamp' })
  updatedAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', required: false, description: 'Last login timestamp' })
  lastLoginAt?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false, description: 'Profile picture URL' })
  profilePicture?: string;

  @ApiProperty({ example: 'Finance', required: false, description: 'Department' })
  department?: string;

  @ApiProperty({ example: '+1234567890', required: false, description: 'Phone number' })
  phoneNumber?: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({ type: UserResponseDto, description: 'Created user data' })
  user: UserResponseDto;
}

export class ListUsersResponseDto {
  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({ type: [UserResponseDto], description: 'Array of users' })
  users: UserResponseDto[];

  @ApiProperty({ example: 25, description: 'Total number of users' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;
}