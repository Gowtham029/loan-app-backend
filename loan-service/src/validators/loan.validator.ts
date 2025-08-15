import * as Joi from 'joi';

const customerSchema = Joi.object({
  customerId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().required()
});

const interestRateSchema = Joi.object({
  annualPercentage: Joi.number().min(0).required(),
  monthlyPercentage: Joi.number().min(0).required(),
  totalInterestRupees: Joi.number().min(0).optional(),
  monthlyInterestRupees: Joi.number().min(0).optional()
});

const compoundingDetailsSchema = Joi.object({
  penaltyInterestRate: Joi.number().min(0).required(),
  compoundedInterest: Joi.number().min(0).required(),
  principalPenalty: Joi.number().min(0).required(),
  totalPenaltyAmount: Joi.number().min(0).required()
});

const lateFeesSchema = Joi.object({
  feePerMonth: Joi.number().min(0).required(),
  totalLateFees: Joi.number().min(0).required()
});

const missedPaymentsSchema = Joi.object({
  count: Joi.number().min(0).required(),
  closed: Joi.number().min(0).required(),
  totalMissedAmount: Joi.number().min(0).required(),
  compoundingDetails: compoundingDetailsSchema.optional(),
  lateFees: lateFeesSchema.optional()
});

const currentOutstandingSchema = Joi.object({
  remainingPrincipal: Joi.number().min(0).required(),
  pendingInterest: Joi.number().min(0).required(),
  penaltyAmount: Joi.number().min(0).required(),
  lateFees: Joi.number().min(0).required(),
  totalOutstanding: Joi.number().min(0).required(),
  lastCalculatedDate: Joi.date().required()
});

const loanProviderSchema = Joi.object({
  userId: Joi.string().required(),
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required()
});

export const createLoanSchema = Joi.object({
  customer: customerSchema.required(),
  originalPrincipal: Joi.number().min(1).required(),
  interestRate: interestRateSchema.required(),
  termMonths: Joi.number().min(1).required(),
  repaymentFrequency: Joi.string().valid('WEEKLY', 'MONTHLY', 'QUARTERLY').required(),
  type: Joi.string().valid('FIXED', 'FLEXIBLE').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  loanProvider: loanProviderSchema.required()
});

export const updateLoanSchema = Joi.object({
  loanId: Joi.string().required(),
  currentPrincipal: Joi.number().min(0).optional(),
  remainingTerms: Joi.number().min(0).optional(),
  missedPayments: missedPaymentsSchema.optional(),
  currentOutstanding: currentOutstandingSchema.optional(),
  status: Joi.string().valid('ACTIVE', 'OVERDUE', 'DEFAULTED', 'PAID_OFF', 'RESTRUCTURED').optional(),
  substatus: Joi.string().valid('CURRENT', 'GRACE_PERIOD', 'DELINQUENT').optional()
});

export const listLoansSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  customerId: Joi.string().optional(),
  status: Joi.string().valid('ACTIVE', 'OVERDUE', 'DEFAULTED', 'PAID_OFF', 'RESTRUCTURED').optional(),
  substatus: Joi.string().valid('CURRENT', 'GRACE_PERIOD', 'DELINQUENT').optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});