import { z } from "zod";

export const TagSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(3).max(50),
  abbreviation: z.string().min(3).max(10).regex(/^[A-Za-z]+$/, "Abbreviation must contain only letters"),
});