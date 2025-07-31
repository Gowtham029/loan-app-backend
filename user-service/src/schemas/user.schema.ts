import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true }) username: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true, enum: ['admin', 'manager', 'viewer'] }) role: string;
  @Prop({ required: true, enum: ['active', 'inactive', 'suspended'], default: 'active' }) status: string;
  @Prop() lastLoginAt: Date;
  @Prop() profilePicture: string;
  @Prop() department: string;
  @Prop() phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);