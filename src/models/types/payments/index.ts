export type TBankDetails = {
  bankDetails: {
    accountHolderName: string;
    lastFourDigits: string;
    sortCode: string;
  };
};

export type TPaymentsList = {
  payments: [
    {
      id: string;
      paymentId: string;
      connectedAcountId: string;
      paymentStatus: string;
      payee: string;
      amount: number;
      destinationId: number;
      isEnabled: boolean;
      createdAt: string;
      updatedAt: string;
    },
    {
      id: string;
      paymentId: string;
      connectedAcountId: string;
      paymentStatus: string;
      payee: string;
      amount: number;
      destinationId: number;
      isEnabled: boolean;
      createdAt: string;
      updatedAt: string;
    },
  ];
  balance: number;
  totalPaymentAmount: number;
};

export type TPaymentDetail = {
  payments: [
    {
      id: string;
      transferId: string;
      amount: number;
      patientFirstName: string;
      lastName: string;
      optometristFirstName: string;
      optometristLastName: string;
    },
  ];
  totalPayment: 5;
};
