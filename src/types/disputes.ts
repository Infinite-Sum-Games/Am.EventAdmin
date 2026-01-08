export type DisputeStatusEnum = 'OPEN' | 'CLOSED_AS_TRUE' | 'CLOSED_AS_FALSE';

export interface DisputeStatus {
  dispute_status_enum: DisputeStatusEnum;
  valid: boolean;
}

export interface Dispute {
  id: string;
  txn_id: string;
  student_email: string | null;
  description: string | null;
  event_id: string;
  dispute_status: DisputeStatus;
}

export interface GetDisputesResponse {
  message: string;
  disputes: Dispute[];
}