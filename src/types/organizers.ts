export type Organizer = {
  id: string;
  organizer_name: string;
  organizer_email: string;
  organizer_type: "DEPARTMENT" | "CLUB";
  student_head: string;
  student_co_head: string | null;
  faculty_head: string;
};

export type GetAllOrganizersResponse = {
  message: string;
  organizers: Organizer[];
};
