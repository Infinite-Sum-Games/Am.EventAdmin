import z from "zod";
export const PeopleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone_number: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits").regex(/^[0-9+\-() ]+$/, "Phone number contains invalid characters"),
    profession: z.string().min(1, "Profession is required"),
    event_id: z.uuid("At least one event must be selected"),
    event_day: z.array(z.number()).min(1, "At least one event day is required")
});
