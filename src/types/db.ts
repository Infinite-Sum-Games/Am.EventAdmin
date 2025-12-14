// // This file contains TypeScript types that are generated based on the backend database schema.
// // Do not modify this file manually unless the database schema has changed.

// // --- ENUM Types ---

// export type AccountStatus = 'VERIFIED' | 'DISABLED';
// export type OrganizerType = 'DEPARTMENT' | 'CLUB';
// export type EventType = 'EVENT' | 'WORKSHOP';
// export type EventStatus = 'CLOSED' | 'ACTIVE' | 'COMPLETED';
// export type EventMode = 'ONLINE' | 'OFFLINE';
// export type AttendanceMode = 'SOLO' | 'DUO';

// // --- Table Interfaces ---

// export interface Student {
//   id: string; // UUID
//   name: string;
//   email: string;
//   password?: string; // Often omitted in responses
//   phone_number: string;
//   is_amrita_student: boolean;
//   amrita_roll_number?: string | null;
//   college_name: string;
//   college_city: string;
//   account_status: AccountStatus;
//   refresh_token?: string | null;
//   created_at: string; // ISO 8601 Date string
//   updated_at: string; // ISO 8601 Date string
// }

// export interface Organizer {
//   id: string; // UUID
//   name: string;
//   email: string;
//   org_type: OrganizerType;
//   student_head: string;
//   student_co_head?: string | null;
//   faculty_head: string;
//   created_at: string; // ISO 8601 Date string
//   updated_at: string; // ISO 8601 Date string
// }

// export interface Event {
//   id: string; // UUID
//   name: string;
//   blurb: string;
//   description: string;
//   cover_image_url?: string | null;
//   price: number;
//   is_per_head: boolean;
//   rules: string;
//   event_type: EventType;
//   is_group: boolean;
//   max_teamsize?: number | null;
//   min_teamsize?: number | null;
//   total_seats: number;
//   seats_filled: number;
//   event_status: EventStatus;
//   event_mode: EventMode;
//   attendance_mode: AttendanceMode;
//   created_at: string; // ISO 8601 Date string
//   updated_at: string; // ISO 8601 Date string
// }

// export interface Favourites {
//   id: number;
//   email: string;
//   event_id: string; // UUID
// }

// export interface EventSchedule {
//   id: string; // UUID
//   event_id: string; // UUID
//   event_date: string; // 'YYYY-MM-DD'
//   start_time: string; // ISO 8601 Date string
//   end_time: string; // ISO 8601 Date string
//   venue: string;
//   created_at: string; // ISO 8601 Date string
//   updated_at: string; // ISO 8601 Date string
// }

// export interface Person {
//   id: string; // UUID
//   name: string;
//   phone_number: string;
//   profession?: string | null;
//   email?: string | null;
// }

// export interface PeopleToEventMapping {
//   id: number;
//   event_id: string; // UUID
//   person_id: string; // UUID
// }

// export interface EventToOrganizerMapping {
//   id: number;
//   event_id: string; // UUID
//   organizer_id: string; // UUID
// }

// export interface Tag {
//   id: string; // UUID
//   name: string;
//   abbreviation: string;
// }

// export interface EventTagMapping {
//   id: number;
//   tag_id: string; // UUID
//   event_id: string; // UUID
// }

// export interface Booking {
//   id: string; // UUID
//   txn_id: string;
//   student_id: string; // UUID
//   event_id: string; // UUID
//   registration_fee: number;
//   product_info: string;
//   seats_released: number;
//   txn_status: string;
//   team_details?: Record<string, any> | null; // JSONB
//   metadata?: Record<string, any> | null; // JSONB
//   created_at: string; // ISO 8601 Date string
//   updated_at: string; // ISO 8601 Date string
// }

// export interface Team {
//   id: string; // UUID
//   team_name: string;
//   event_id: string; // UUID
//   leader_name: string;
//   booking_id: string; // UUID
// }

// export interface TeamMember {
//   id: string; // UUID
//   team_id: string; // UUID
//   student_id: string; // UUID
//   student_role: string;
//   student_name: string;
//   student_email: string;
// }

// export interface TeamEventsAttendance {
//   id: string; // UUID
//   student_id: string; // UUID
//   event_schedule_id: string; // UUID
//   check_in?: string | null; // ISO 8601 Date string
//   check_out?: string | null; // ISO 8601 Date string
// }

// export interface SoloEventParticipant {
//   id: number;
//   student_id: string; // UUID
//   event_id: string; // UUID
//   event_schedule_id: string; // UUID
//   booking_id: string; // UUID
//   student_name: string;
//   student_email: string;
//   check_in?: string | null; // ISO 8601 Date string
//   check_out?: string | null; // ISO 8601 Date string
// }
