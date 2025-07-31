import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  role: Joi.string().valid('admin', 'manager', 'viewer').required(),
  status: Joi.string().valid('active', 'inactive', 'suspended').default('active'),
  profilePicture: Joi.string().uri().optional(),
  department: Joi.string().max(100).optional(),
  phoneNumber: Joi.string().pattern(/^[+]?[1-9][\d]{0,15}$/).optional(),
});

export const updateUserSchema = Joi.object({
  userId: Joi.string().required(),
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  role: Joi.string().valid('admin', 'manager', 'viewer').optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  profilePicture: Joi.string().uri().optional(),
  department: Joi.string().max(100).optional(),
  phoneNumber: Joi.string().pattern(/^[+]?[1-9][\d]{0,15}$/).optional(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional(),
});