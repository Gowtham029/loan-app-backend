import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ _id: false })
export class Address {
  @Prop() street: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() postalCode: string;
  @Prop() country: string;
  @Prop() addressType: string;
  @Prop() residenceSince: Date;
}

@Schema({ _id: false })
export class IdentificationDocument {
  @Prop() documentType: string;
  @Prop() documentNumber: string;
  @Prop() issuingAuthority: string;
  @Prop() issueDate: Date;
  @Prop() expiryDate: Date;
  @Prop() documentImageUrl: string;
}

@Schema({ _id: false })
export class EmploymentDetails {
  @Prop() employmentStatus: string;
  @Prop() employerName: string;
  @Prop() designation: string;
  @Prop() workExperience: number;
  @Prop() monthlyIncome: number;
  @Prop() annualIncome: number;
  @Prop() employerAddress: string;
  @Prop() employerPhoneNumber: string;
}

@Schema({ _id: false })
export class BankingHistory {
  @Prop() bankName: string;
  @Prop() accountNumber: string;
  @Prop() accountType: string;
  @Prop() relationshipDuration: number;
}

@Schema({ _id: false })
export class ExistingLoan {
  @Prop() loanType: string;
  @Prop() lender: string;
  @Prop() outstandingAmount: number;
  @Prop() monthlyEMI: number;
}

@Schema({ _id: false })
export class EmergencyContact {
  @Prop() name: string;
  @Prop() relationship: string;
  @Prop() phoneNumber: string;
  @Prop() address: string;
}

@Schema({ _id: false })
export class CommunicationPreferences {
  @Prop() emailNotifications: boolean;
  @Prop() smsNotifications: boolean;
  @Prop() marketingConsent: boolean;
  @Prop() preferredLanguage: string;
}

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true }) firstName: string;
  @Prop() middleName: string;
  @Prop({ required: true }) lastName: string;
  @Prop() dateOfBirth: Date;
  @Prop() gender: string;
  @Prop() nationality: string;
  @Prop() maritalStatus: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) phoneNumber: string;
  @Prop() alternatePhoneNumber: string;
  @Prop({ type: Address }) currentAddress: Address;
  @Prop({ type: Address }) permanentAddress: Address;
  @Prop([IdentificationDocument]) identificationDocuments: IdentificationDocument[];
  @Prop({ type: EmploymentDetails }) employmentDetails: EmploymentDetails;
  @Prop([BankingHistory]) bankingHistory: BankingHistory[];
  @Prop() creditScore: number;
  @Prop([ExistingLoan]) existingLoans: ExistingLoan[];
  @Prop({ type: EmergencyContact }) emergencyContact: EmergencyContact;
  @Prop({ default: 'Pending' }) kycStatus: string;
  @Prop({ default: 'Medium' }) riskProfile: string;
  @Prop({ default: 'Active' }) accountStatus: string;
  @Prop({ default: false }) fatcaStatus: boolean;
  @Prop({ default: false }) pepStatus: boolean;
  @Prop() amlScreeningStatus: string;
  @Prop({ type: CommunicationPreferences }) communicationPreferences: CommunicationPreferences;
  @Prop() customerNotes: string;
  @Prop() internalRemarks: string;
  @Prop() createdBy: string;
  @Prop() lastModifiedBy: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);