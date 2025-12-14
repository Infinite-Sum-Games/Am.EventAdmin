import { z } from "zod";

export const eventDetailsSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters").optional(),
  blurb: z.string().max(120, "Blurb must be short (120 chars max)").optional(),
  description: z.string().max(1500, "Description is too long (1500 chars max)").optional(),
  rules: z.string().max(1500, "Rules is too long (1500 chars max)").optional(),
  price: z.number("Price must be a number.").min(0, "Price cannot be negative").optional(),
  is_per_head: z.boolean().optional(),
});

export type EventDetails = z.infer<typeof eventDetailsSchema>;

export const posterSchema = z.object({
  poster_url: z.url("Poster URL must be a valid URL").optional(),
});

export const isPublishSchema = z.object({
  is_published: z.boolean().default(false),
});

export const eventSizeSchema = z.object({
  is_group: z.boolean().optional(),
  min_teamsize: z.number().min(1, "Minimum team size must be at least 1").default(1).optional(),
  max_teamsize: z.number().min(1, "Maximum team size must be at least 1").default(1).optional(),
  total_seats: z.number().min(1, "Total seats must be at least 1").optional(),
});

export const eventToggleSchema = z.object({
  event_type: z.enum(["EVENT", "WORKSHOP"]).optional(),
  is_offline: z.boolean().optional(),
  attendance_mode: z.enum(["SOLO", "DUO"]).optional(),
  is_technical: z.boolean().optional(),
  is_completed: z.boolean().optional(),
}); 

export const eventOrganizersSchema = z.object({
  id: z.uuid().optional(),
  organizer_id: z.uuid("Organizer ID must be a valid UUID").optional(),
});

export const eventPeopleSchema = z.object({
  id: z.uuid().optional(),
  person_id: z.uuid("Person ID must be a valid UUID").optional(),
});

export const eventTagsSchema = z.object({
  id: z.uuid().optional(),
  tag_id: z.uuid("Tag ID must be a valid UUID").optional(),
});

export const eventScheduleSchema = z.object({
  id: z.uuid().optional(),
  event_date: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Event date must be a valid date string",
  }).optional(),
  start_time: z.string().refine((time) => !isNaN(new Date(`1970-01-01T${time}Z`).getTime()), {
    message: "Start time must be a valid time string",
  }).optional(),
  end_time: z.string().refine((time) => !isNaN(new Date(`1970-01-01T${time}Z`).getTime()), {
    message: "End time must be a valid time string",
  }).optional(),
})
