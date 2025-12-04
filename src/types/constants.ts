import type { EventFormState } from "./events";

export const EMPTY_FORM: EventFormState = {
  name: "",
  blurb: "",
  description: "",
  cover_image_url: "",
  price: 0,
  is_per_head: false,
  rules: "",
  event_type: "EVENT",
  is_group: false,
  max_teamsize: null,
  min_teamsize: null,
  total_seats: 0,
  seats_filled: 0,
  event_status: "ACTIVE",
  event_mode: "OFFLINE",
  attendance_mode: "SOLO",
  organizer_ids: [],
  tag_ids: [],
  people_ids: [],
  schedules: [],
};
