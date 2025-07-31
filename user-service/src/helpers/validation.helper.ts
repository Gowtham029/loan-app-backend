import * as Joi from 'joi';

export class ValidationHelper {
  static validate<T>(schema: Joi.ObjectSchema<T>, data: any): { value?: T; error?: string } {
    const { error, value } = schema.validate(data, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return { error: errorMessage };
    }
    
    return { value };
  }
}