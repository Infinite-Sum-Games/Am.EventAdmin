import z from "zod";
export const PeopleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone_number: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^[0-9+\-() ]+$/, "Phone number contains invalid characters"),
    profession: z.string().min(1, "Profession is required"),
});
