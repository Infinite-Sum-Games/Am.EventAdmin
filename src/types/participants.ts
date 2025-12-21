export interface Participant {
  student_name: string;
  college: string;
  city: string;
  email: string;
  is_amrita_student: boolean;
}

export interface GetAllParticipantsByEventResponse {
  message: string;
  participants: Participant[];
}