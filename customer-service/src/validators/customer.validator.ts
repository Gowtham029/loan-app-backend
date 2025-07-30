import * as Joi from 'joi';
import { CUSTOMER_CONSTANTS } from '../constants/customer.constants';

const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  addressType: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.ADDRESS_TYPES)).required(),
  residenceSince: Joi.date().optional()
});

const identificationDocumentSchema = Joi.object({
  documentType: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.DOCUMENT_TYPES)).required(),
  documentNumber: Joi.string().required(),
  issuingAuthority: Joi.string().required(),
  issueDate: Joi.date().required(),
  expiryDate: Joi.date().required(),
  documentImageUrl: Joi.string().uri().optional()
});

const employmentDetailsSchema = Joi.object({
  employmentStatus: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.EMPLOYMENT_STATUS)).required(),
  employerName: Joi.string().optional(),
  designation: Joi.string().optional(),
  workExperience: Joi.number().min(0).optional(),
  monthlyIncome: Joi.number().min(0).optional(),
  annualIncome: Joi.number().min(0).optional(),
  employerAddress: Joi.string().optional(),
  employerPhoneNumber: Joi.string().optional()
});

const bankingHistorySchema = Joi.object({
  bankName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  accountType: Joi.string().required(),
  relationshipDuration: Joi.number().min(0).required()
});

const existingLoanSchema = Joi.object({
  loanType: Joi.string().required(),
  lender: Joi.string().required(),
  outstandingAmount: Joi.number().min(0).required(),
  monthlyEMI: Joi.number().min(0).required()
});

const emergencyContactSchema = Joi.object({
  name: Joi.string().required(),
  relationship: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required()
});

const communicationPreferencesSchema = Joi.object({
  emailNotifications: Joi.boolean().default(true),
  smsNotifications: Joi.boolean().default(true),
  marketingConsent: Joi.boolean().default(false),
  preferredLanguage: Joi.string().default('en')
});

export const createCustomerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  middleName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).required(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.GENDER)).optional(),
  nationality: Joi.string().optional(),
  maritalStatus: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.MARITAL_STATUS)).optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  alternatePhoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  currentAddress: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
  identificationDocuments: Joi.array().items(identificationDocumentSchema).optional(),
  employmentDetails: employmentDetailsSchema.optional(),
  bankingHistory: Joi.array().items(bankingHistorySchema).optional(),
  creditScore: Joi.number().min(300).max(850).optional(),
  existingLoans: Joi.array().items(existingLoanSchema).optional(),
  emergencyContact: emergencyContactSchema.optional(),
  kycStatus: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.KYC_STATUS)).default('Pending'),
  riskProfile: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.RISK_PROFILE)).default('Medium'),
  accountStatus: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.ACCOUNT_STATUS)).default('Active'),
  fatcaStatus: Joi.boolean().default(false),
  pepStatus: Joi.boolean().default(false),
  amlScreeningStatus: Joi.string().optional(),
  communicationPreferences: communicationPreferencesSchema.optional(),
  customerNotes: Joi.string().max(1000).optional(),
  internalRemarks: Joi.string().max(1000).optional(),
  createdBy: Joi.string().required()
});

export const updateCustomerSchema = Joi.object({
  customerId: Joi.string().required(),
  firstName: Joi.string().min(2).max(50).optional(),
  middleName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.GENDER)).optional(),
  nationality: Joi.string().optional(),
  maritalStatus: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.MARITAL_STATUS)).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  alternatePhoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  currentAddress: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
  identificationDocuments: Joi.array().items(identificationDocumentSchema).optional(),
  employmentDetails: employmentDetailsSchema.optional(),
  bankingHistory: Joi.array().items(bankingHistorySchema).optional(),
  creditScore: Joi.number().min(300).max(850).optional(),
  existingLoans: Joi.array().items(existingLoanSchema).optional(),
  emergencyContact: emergencyContactSchema.optional(),
  kycStatus: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.KYC_STATUS)).optional(),
  riskProfile: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.RISK_PROFILE)).optional(),
  accountStatus: Joi.string().valid(...Object.values(CUSTOMER_CONSTANTS.ACCOUNT_STATUS)).optional(),
  fatcaStatus: Joi.boolean().optional(),
  pepStatus: Joi.boolean().optional(),
  amlScreeningStatus: Joi.string().optional(),
  communicationPreferences: communicationPreferencesSchema.optional(),
  customerNotes: Joi.string().max(1000).optional(),
  internalRemarks: Joi.string().max(1000).optional(),
  lastModifiedBy: Joi.string().required()
});

export const paginationSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  search: Joi.string().optional()
});