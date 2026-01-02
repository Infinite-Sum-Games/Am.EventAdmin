export type DisputeStatusEnum = 'OPEN' | 'RESOLVED' | 'REJECTED';

export type DisputeStatus = {
  dispute_status_enum: DisputeStatusEnum;
  valid: boolean;
};

export type Dispute = {
  id: string;
  txn_id: string;
  student_email: string | null;
  description: string | null;
  event_id: string;
  dispute_status: DisputeStatus;
};

export type GetDisputesResponse = {
  message: string;
  disputes: Dispute[];
};