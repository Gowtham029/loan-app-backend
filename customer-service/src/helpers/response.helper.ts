export class ResponseHelper {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message,
      error: null
    };
  }

  static error(error: string, data: any = null) {
    return {
      success: false,
      data,
      message: null,
      error
    };
  }

  static transformCustomer(customer: any) {
    if (!customer) return null;
    
    return {
      customerId: customer._id?.toString(),
      firstName: customer.firstName,
      middleName: customer.middleName,
      lastName: customer.lastName,
      dateOfBirth: customer.dateOfBirth?.toISOString(),
      gender: customer.gender,
      nationality: customer.nationality,
      maritalStatus: customer.maritalStatus,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      alternatePhoneNumber: customer.alternatePhoneNumber,
      currentAddress: customer.currentAddress,
      permanentAddress: customer.permanentAddress,
      identificationDocuments: customer.identificationDocuments,
      employmentDetails: customer.employmentDetails,
      bankingHistory: customer.bankingHistory,
      creditScore: customer.creditScore,
      existingLoans: customer.existingLoans,
      emergencyContact: customer.emergencyContact,
      kycStatus: customer.kycStatus,
      riskProfile: customer.riskProfile,
      accountStatus: customer.accountStatus,
      fatcaStatus: customer.fatcaStatus,
      pepStatus: customer.pepStatus,
      amlScreeningStatus: customer.amlScreeningStatus,
      communicationPreferences: customer.communicationPreferences,
      customerNotes: customer.customerNotes,
      internalRemarks: customer.internalRemarks,
      createdAt: customer.createdAt?.toISOString(),
      updatedAt: customer.updatedAt?.toISOString(),
      createdBy: customer.createdBy,
      lastModifiedBy: customer.lastModifiedBy
    };
  }
}