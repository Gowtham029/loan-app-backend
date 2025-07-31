export interface LoginDto {
  username: string;
  password: string;
}

export interface LogoutDto {
  token: string;
}

export interface ValidateTokenDto {
  token: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'viewer';
}