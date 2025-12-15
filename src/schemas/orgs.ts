import z from "zod";

export const createOrganizerSchema = z.object({
    name: z.string().min(3, "Organizer name must be at least 3 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    org_type: z.enum(["DEPARTMENT", "CLUB"], "Organizer type is either Department or Club"),
    student_head: z.string().min(3, "Student head is required").regex(/^[a-zA-Z\s]+$/, "Student head must contain only letters"),
    student_co_head: z.string().optional().refine(val => !val || /^[a-zA-Z\s]+$/.test(val), "Student co-head must contain only letters").optional(),
    faculty_head: z.string().min(3, "Faculty head is required").regex(/^[a-zA-Z\s.]+$/, "Faculty head must contain only letters or symbols like ."),
});

export const updateOrganizerSchema = createOrganizerSchema.omit({ password: true }).extend({
    id: z.uuid("Organizer ID must be a valid UUID"),
});

export type CreateOrganizerInput = z.infer<typeof createOrganizerSchema>;
export type UpdateOrganizerInput = z.infer<typeof updateOrganizerSchema>;