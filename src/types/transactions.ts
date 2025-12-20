export type Transaction = {
  transaction_id: string;
  event_id: string;
  event_name: string;
  student_name: string;
  is_group: boolean;
  email: string;
  student_phone_number: string;
  college_name: string;
  college_city: string;
  is_amrita_student: boolean;
  txn_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  registration_fee: number;
};

export type GetAllTransactionsResponse = {
  message: string;
  transactions: Transaction[];
};