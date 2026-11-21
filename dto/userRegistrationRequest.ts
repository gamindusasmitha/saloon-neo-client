import z, { email } from "zod";

const userRegistrationRequestSchema = z.object({
    email: z.email({
        error: "Invalid email address"
    }),

    firstName: z.string({
        error: "Invalid first name"
    })
    .min(1, {
        error: "First name should be at least one character"
    })
    .max(20, {
        error: "First name cannot exceed 20 characters"
    }),

    lastName: z.string({
        error: "Invalid last name"
    })
    .min(1, {
        error: "Last name should be at least one character"
    })
    .max(20, {
        error: "Last name cannot exceed 20 characters"
    }),

    password: z.string({
        error: "Invalid password"
    })
    .min(8, {
        error: "Password should be at least 8 characters"
    })
    .max(25, {
        error: "Password cannot exceed 25 characters"
    })
});

export default userRegistrationRequestSchema