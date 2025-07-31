import * as jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';
import { IAuthUser } from '../interfaces/auth.interface';

export class JwtHelper {
  static generateToken(user: IAuthUser): string {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return jwt.sign(payload, JWT_CONFIG.secret, { expiresIn: JWT_CONFIG.expiresIn });
  }

  static verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
    try {
      const payload = jwt.verify(token, JWT_CONFIG.secret);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}