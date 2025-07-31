import { IUser } from '../interfaces/user.interface';

export class ResponseHelper {
  static transformUser(user: any): IUser {
    return {
      id: user._id?.toString() || user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
      updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
      lastLoginAt: user.lastLoginAt instanceof Date ? user.lastLoginAt.toISOString() : user.lastLoginAt,
      profilePicture: user.profilePicture,
      department: user.department,
      phoneNumber: user.phoneNumber,
    };
  }

  static error(message: string) {
    return {
      success: false,
      error: message,
      user: null,
    };
  }
}