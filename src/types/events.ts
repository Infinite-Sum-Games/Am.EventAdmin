// This type represents the specific shape of the data returned by the `getAllEvents` API call.
export type GetAllEventsResponse = {
  event_id: string;
  event_image_url: string;
  event_name: string;
  event_status: string;
  event_description: string;
  event_date: string;
  is_group: boolean;
  tags: string[];
  event_price: number;
  is_registered: boolean;
  is_starred: boolean;
  max_seats: number;
  seats_filled: number;
};

type Schedule = {
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
};


export type EventFormState = {
  name: string;
  blurb: string;
  description: string;
  cover_image_url: string;
  price: number;
  is_per_head: boolean;
  rules: string;
  event_type: string;
  is_group: boolean;
  max_teamsize: number | null;
  min_teamsize: number | null;
  total_seats: number;
  seats_filled: number;
  event_status: string;
  event_mode: string;
  attendance_mode: string;
  organizer_ids: string[];
  tag_ids: string[];
  people_ids: string[];
  schedules: Schedule[];
};




export type CreateEventFormState = {
  name: string;
  blurb: string;
  description: string;
  cover_image_url: string;

  price: number;
  is_per_head: boolean;

  rules: string;

  event_type: "EVENT" | "WORKSHOP" | "SEMINAR";

  is_group: boolean;
  min_teamsize: number | null;
  max_teamsize: number | null;

  total_seats: number;
  seats_filled: number;

  event_status: "ACTIVE" | "INACTIVE";
  event_mode: "ONLINE" | "OFFLINE";
  attendance_mode: "SOLO" | "TEAM";

  organizer_ids: string[];
  tag_ids: string[];
  people_ids: string[];

  schedule: Schedule;
};
