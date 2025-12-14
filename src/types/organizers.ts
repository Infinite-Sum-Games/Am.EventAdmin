export type OrganizerType = "DEPARTMENT" | "CLUB";

export type Organizer = {
  id: string;
  name: string;
  email: string;
  org_type: OrganizerType;
  student_head: string;
  student_co_head: string | null;
  faculty_head: string;
};

export type GetAllOrganizersResponse = {
  message: string;
  organizers: Organizer[];
};
