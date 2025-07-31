export interface IAuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

export interface ILoginResponse {
  success: boolean;
  token?: string;
  user?: IAuthUser;
  error?: string;
}

export interface IValidateResponse {
  success: boolean;
  user?: IAuthUser;
  error?: string;
}

export interface ILogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}