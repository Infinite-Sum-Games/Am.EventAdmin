import z from "zod";

export const PeopleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone_number: z.string().min(10, "Phone number must be valid"),
    profession: z.string(),
    event_id: z.uuid(),
    event_day: z.array(z.number())
});
