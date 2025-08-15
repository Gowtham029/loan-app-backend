import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto, LogoutDto, ValidateTokenDto, RegisterDto } from './dto/auth.dto';
import { ILoginResponse, IValidateResponse, ILogoutResponse, IAuthUser } from './interfaces/auth.interface';
import { JwtHelper } from './helpers/jwt.helper';
import { PasswordHelper } from './helpers/password.helper';

interface UserService {
  GetUser(data: { userId: string }): any;
  GetUserByUsername(data: { username: string }): any;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserService;
  private blacklistedTokens = new Set<string>(); // In production, use Redis

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async login(loginData: LoginDto): Promise<ILoginResponse> {
    try {
      const { username, password } = loginData;

      if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
      }

      // Get user from user service
      const userResponse = await firstValueFrom(this.userService.GetUserByUsername({ username })) as any;
      if (!userResponse.success || !userResponse.user) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      const user = userResponse.user;

      // Check if user is active
      if (user.status !== 'active') {
        return { success: false, error: 'Account is not active' };
      }

      // For demo purposes, we'll use a simple password check
      // In production, you should store hashed passwords
      const isValidPassword = password === 'password123'; // Replace with actual password validation

      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Skip last login update for now

      // Generate JWT token
      const authUser: IAuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      };

      const token = JwtHelper.generateToken(authUser);

      return {
        success: true,
        token,
        user: authUser,
      };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(logoutData: LogoutDto): Promise<ILogoutResponse> {
    try {
      const { token } = logoutData;

      if (!token) {
        return { success: false, error: 'Token is required' };
      }

      // Add token to blacklist
      this.blacklistedTokens.add(token);

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  }

  async validateToken(validateData: ValidateTokenDto): Promise<IValidateResponse> {
    try {
      const { token } = validateData;

      if (!token) {
        return { success: false, error: 'Token is required' };
      }

      // Check if token is blacklisted
      if (this.blacklistedTokens.has(token)) {
        return { success: false, error: 'Token is invalid' };
      }

      // Verify token
      const verification = JwtHelper.verifyToken(token);
      
      if (!verification.valid) {
        return { success: false, error: verification.error || 'Invalid token' };
      }

      const payload = verification.payload;
      const user: IAuthUser = {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        status: 'active', // You might want to verify this with user service
      };

      return {
        success: true,
        user,
      };
    } catch (error) {
      return { success: false, error: 'Token validation failed' };
    }
  }
}