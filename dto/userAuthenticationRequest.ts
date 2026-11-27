import z, { email } from "zod";

const userAuthnticationRequestSchema = z.object({
    email: z.email({
        error: "Invalid email address"
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

export default userAuthnticationRequestSchema