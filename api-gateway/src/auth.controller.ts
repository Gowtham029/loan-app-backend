import { Controller, Post, Body, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto, LogoutDto, LoginResponseDto, LogoutResponseDto } from './dto/auth.dto';

interface AuthService {
  Login(data: LoginDto): Promise<any>;
  Logout(data: LogoutDto): Promise<any>;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.Login(loginDto);
      
      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.UNAUTHORIZED);
      }

      return {
        success: true,
        token: result.token,
        user: result.user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful', type: LogoutResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async logout(@Body() logoutDto: LogoutDto) {
    try {
      const result = await this.authService.Logout(logoutDto);
      
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