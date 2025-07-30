export const CUSTOMER_CONSTANTS = {
  GENDER: {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
  },
  MARITAL_STATUS: {
    SINGLE: 'Single',
    MARRIED: 'Married',
    DIVORCED: 'Divorced',
    WIDOWED: 'Widowed'
  },
  EMPLOYMENT_STATUS: {
    EMPLOYED: 'Employed',
    SELF_EMPLOYED: 'Self-Employed',
    UNEMPLOYED: 'Unemployed',
    RETIRED: 'Retired'
  },
  KYC_STATUS: {
    PENDING: 'Pending',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected'
  },
  RISK_PROFILE: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
  },
  ACCOUNT_STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SUSPENDED: 'Suspended',
    CLOSED: 'Closed'
  },
  DOCUMENT_TYPES: {
    PASSPORT: 'Passport',
    NATIONAL_ID: 'National ID',
    DRIVERS_LICENSE: 'Driver\'s License',
    SSN: 'SSN'
  },
  ADDRESS_TYPES: {
    PERMANENT: 'Permanent',
    TEMPORARY: 'Temporary'
  }
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
};