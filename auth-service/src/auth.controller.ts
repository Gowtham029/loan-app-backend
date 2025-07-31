import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, ValidateTokenDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginDto) {
    console.log('Auth service received login request:', data);
    this.logger.log(`Login attempt: ${data.username}`);
    try {
      const result = await this.authService.login(data);
      
      console.log('Auth service login result:', result);
      if (!result.success) {
        this.logger.warn(`Login failed for user: ${data.username} - ${result.error}`);
      } else {
        this.logger.log(`Login successful for user: ${data.username}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Login error for user: ${data.username} - ${error.message}`);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: LogoutDto) {
    this.logger.log('Logout request received');
    try {
      const result = await this.authService.logout(data);
      
      if (result.success) {
        this.logger.log('Logout successful');
      } else {
        this.logger.warn(`Logout failed: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: ValidateTokenDto) {
    try {
      const result = await this.authService.validateToken(data);
      
      if (!result.success) {
        this.logger.warn(`Token validation failed: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message}`);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }
}