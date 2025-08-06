import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { ICustomer, ICustomerRepository } from '../interfaces/customer.interface';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  private generateCustomerId(): string {
    const random = Math.floor(Math.random() * 99999) + 1;
    const paddedNumber = random.toString().padStart(5, '0');
    return `HEXACUS${paddedNumber}`;
  }

  async create(customerData: ICustomer): Promise<ICustomer> {
    const customerId = this.generateCustomerId();
    const customer = new this.customerModel({ ...customerData, customerId });
    return customer.save();
  }

  async findById(customerId: string): Promise<ICustomer | null> {
    return this.customerModel.findOne({ customerId }).exec();
  }

  async update(customerId: string, updateData: Partial<ICustomer>): Promise<ICustomer | null> {
    return this.customerModel.findOneAndUpdate(
      { customerId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async delete(customerId: string): Promise<boolean> {
    const result = await this.customerModel.findOneAndDelete({ customerId }).exec();
    return !!result;
  }

  async findAll(page: number, limit: number, search?: string): Promise<{ customers: ICustomer[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const [customers, total] = await Promise.all([
      this.customerModel.find(filter).skip(skip).limit(limit).exec(),
      this.customerModel.countDocuments(filter).exec()
    ]);

    return { customers, total };
  }

  async findByEmail(email: string): Promise<ICustomer | null> {
    return this.customerModel.findOne({ email }).exec();
  }

  async findByPhone(phoneNumber: string): Promise<ICustomer | null> {
    return this.customerModel.findOne({ phoneNumber }).exec();
  }
}