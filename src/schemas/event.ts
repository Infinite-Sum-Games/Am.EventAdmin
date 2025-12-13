import { z } from "zod";

export const eventDetailsSchema = z.object({
  event_name: z.string().min(1, "Name must be at least 1 characters").optional(),
  blurb: z.string().max(120, "Blurb must be short (120 chars max)").optional(),
  description: z.string().min(10, "Description is required").max(1500, "Description is too long (1500 chars max)").optional(),
  rules: z.string().max(1500, "Rules is too long (1500 chars max)").optional(),
});

export const posterSchema = z.object({
  event_id: z.uuid("Event ID must be a valid UUID"),
  poster_url: z.url("Poster image must be a valid URL").optional(),
});

export const publishSchema = z.object({
  is_published: z.boolean().default(false),
});