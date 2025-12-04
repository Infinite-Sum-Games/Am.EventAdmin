import { z } from "zod";

const scheduleSchema = z.object({
  event_date: z.string().min(1, "Event date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  venue: z.string().min(1, "Venue is required"),
});

export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  blurb: z.string().min(5, "Blurb is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cover_image_url: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")),
  price: z.number().min(0),
  is_per_head: z.boolean(),
  rules: z.string(),

  event_type: z.enum(["EVENT", "WORKSHOP"]),
  event_status: z.enum(["ACTIVE", "COMPLETED", "CLOSED"]),
  event_mode: z.enum(["ONLINE", "OFFLINE"]),
  attendance_mode: z.enum(["SOLO", "DUO"]),

  is_group: z.boolean(),
  min_teamsize: z.number().nullable(),
  max_teamsize: z.number().nullable(),

  total_seats: z.number().min(1, "Total seats is required"),
  seats_filled: z.number(),

  organizer_ids: z.array(z.string()).min(1, "Select at least 1 organizer"),
  tag_ids: z.array(z.string()).min(1, "Select at least 1 tag"),
  people_ids: z.array(z.string()).min(1, "Select at least 1 person"),

  schedules: z
    .array(scheduleSchema)
    .min(1, "At least one schedule is required"),
});
