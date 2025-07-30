export class CustomerNotFoundException extends Error {
  constructor(customerId: string) {
    super(`Customer with ID ${customerId} not found`);
    this.name = 'CustomerNotFoundException';
  }
}

export class CustomerAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`Customer with email ${email} already exists`);
    this.name = 'CustomerAlreadyExistsException';
  }
}

export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}