import { Controller, Post, Body, HttpException, HttpStatus, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { LoginDto, LogoutDto, LoginResponseDto, LogoutResponseDto } from './dto/auth.dto';

interface AuthService {
  Login(data: LoginDto): any;
  Logout(data: LogoutDto): any;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    console.log('Initializing Auth Controller...');
    try {
      this.authService = this.client.getService<AuthService>('AuthService');
      console.log('Auth service client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize auth service client:', error);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async login(@Body() loginDto: LoginDto) {
    console.log('Login request received:', loginDto);
    try {
      if (!this.authService) {
        console.error('Auth service not initialized');
        throw new HttpException('Auth service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }
      
      console.log('Calling auth service...', loginDto);
      const result = await firstValueFrom(this.authService.Login(loginDto)) as any;
      console.log('Auth service response:', result);
      if (!result.success) {
        throw new HttpException("Invalid username or password", HttpStatus.UNAUTHORIZED);
      }

      return {
        success: true,
        token: result.token,
        user: result.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Invalid username or password', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful', type: LogoutResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async logout(@Body() logoutDto: LogoutDto) {
    try {
      const result = await firstValueFrom(this.authService.Logout(logoutDto)) as any;
      console.log('Logout result:', result);
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Logout failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}