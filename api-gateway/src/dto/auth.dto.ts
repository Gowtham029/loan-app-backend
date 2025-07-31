import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username for login' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password for login' })
  @IsString()
  password: string;
}

export class LogoutDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT token to logout' })
  @IsString()
  token: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  token: string;

  @ApiProperty({
    example: {
      id: '64f1a2b3c4d5e6f7g8h9i0j1',
      username: 'admin',
      email: 'admin@microfinance.com',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      status: 'active'
    },
    description: 'User information'
  })
  user: object;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({ example: 'Logged out successfully', description: 'Success message' })
  message: string;
}