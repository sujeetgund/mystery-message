import { z } from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(3, "username or email must be longer than 2 characters"),
  password: z.string().min(6, "password must be at least 6 characters"),
});
