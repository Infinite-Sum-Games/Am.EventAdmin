import { z } from "zod";

export const eventDetailsSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be short (100 chars max)"),
  blurb: z.string().max(120, "Blurb must be short (120 chars max)"),
  description: z.string().max(1500, "Description is too long (1500 chars max)"),
  rules: z.string().max(1500, "Rules is too long (1500 chars max)"),
  price: z.number("Price must be a number.").min(0, "Price cannot be negative"),
  is_per_head: z.boolean()
});

export type EventDetails = z.infer<typeof eventDetailsSchema>;

export const posterSchema = z.object({
  poster_url: z.url("Poster URL must be a valid URL").optional(),
});

export const isPublishSchema = z.object({
  is_published: z.boolean().default(false),
});

export const eventSizeSchema = z.object({
  is_group: z.boolean(),
  min_teamsize: z.number("Minimum team size must be a number").min(1, "Minimum team size must be at least 1").default(1),
  max_teamsize: z.number("Maximum team size must be a number").min(1, "Maximum team size must be at least 1").default(1),
  total_seats: z.number("Total seats must be a number").min(0, "Total seats must be at least 0"),
  is_per_head: z.boolean("Is Per Head must be given"),
}).refine((data) => data.min_teamsize <= data.max_teamsize, {
  message: "Minimum team size must be less than or equal to maximum team size",
  path: ["min_teamsize"],
});

export type EventSize = z.infer<typeof eventSizeSchema>;

export const eventToggleSchema = z.object({
  event_type: z.enum(["EVENT", "WORKSHOP"]),
  is_offline: z.boolean(),
  attendance_mode: z.enum(["SOLO", "DUO"]),
  is_technical: z.boolean(),
});

export type EventModes = z.infer<typeof eventToggleSchema>;

export const eventOrganizersSchema = z.object({
  id: z.uuid(),
  organizer_id: z.uuid("Organizer ID must be a valid UUID"),
});

export type EventOrganizers = z.infer<typeof eventOrganizersSchema>;

export const eventPeopleSchema = z.object({
  id: z.uuid(),
  person_id: z.uuid("Person ID must be a valid UUID")
});

export type EventPeople = z.infer<typeof eventPeopleSchema>;

export const eventTagsSchema = z.object({
  id: z.uuid(),
  tag_id: z.uuid("Tag ID must be a valid UUID")
});

export type EventTags = z.infer<typeof eventTagsSchema>;

export const eventScheduleSchema = z.object({
  id: z.uuid().optional(),
  event_date: z.iso.datetime(),
  start_time: z.iso.datetime(),
  end_time: z.iso.datetime(),
  venue: z.string().max(100, "Venue must be at most 100 characters")
})

export type EventSchedules = z.infer<typeof eventScheduleSchema>;
