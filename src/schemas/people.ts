import z from "zod";
export const PeopleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone_number: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^[0-9+\-() ]+$/, "Phone number contains invalid characters"),
    profession: z.string().min(1, "Profession is required"),
    event_id: z.uuid("At least one event must be selected"),
    event_day: z.array(z.number().min(1, "Day must be at least 1")).min(1, "At least one event day is required")
});
