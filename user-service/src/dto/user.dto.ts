export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'viewer';
  status?: 'active' | 'inactive' | 'suspended';
  profilePicture?: string;
  department?: string;
  phoneNumber?: string;
}

export interface UpdateUserDto {
  userId: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'viewer';
  status?: 'active' | 'inactive' | 'suspended';
  profilePicture?: string;
  department?: string;
  phoneNumber?: string;
}

export interface GetUserDto {
  userId: string;
}

export interface DeleteUserDto {
  userId: string;
}

export interface ListUsersDto {
  page?: number;
  limit?: number;
  search?: string;
}