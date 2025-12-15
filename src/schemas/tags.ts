import { z } from "zod";

export const TagSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters"),
  abbreviation: z.string().min(3, "Abbreviation must be at least 3 characters").max(10, "Abbreviation must be at most 10 characters").regex(/^[a-zA-Z0-9]+$/, "Abbreviation must contain only alphanumeric characters"),
});