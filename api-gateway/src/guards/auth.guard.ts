import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

interface AuthService {
  ValidateToken(data: { token: string }): any;
}

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    return this.validateToken(token, request);
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(token: string, request: any): Promise<boolean> {
    try {
      const result = await firstValueFrom(this.authService.ValidateToken({ token })) as any;
      
      if (!result.success) {
        throw new UnauthorizedException(result.error || 'Invalid token');
      }

      request.user = result.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}