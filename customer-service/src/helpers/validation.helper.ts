import * as Joi from 'joi';

export class ValidationHelper {
  static validate<T>(schema: Joi.ObjectSchema, data: any): { value: T | null; error?: string } {
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return { value: null, error: errorMessage };
    }
    
    return { value: value as T };
  }
}