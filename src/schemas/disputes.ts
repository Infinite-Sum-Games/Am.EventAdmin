import { z } from "zod";

export const updateDisputeSchema = z.object({
  student_email: z.email({ message: "Invalid email address" }).optional().or(z.literal("")),
  description: z.string().optional(),
});

export type UpdateDisputeForm = z.infer<typeof updateDisputeSchema>;
