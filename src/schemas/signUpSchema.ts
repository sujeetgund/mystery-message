import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, "username must be longer than 2 characters")
  .max(20, "username must be shorter than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "username must be alphanumeric and may include underscores"
  );

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email(),
  password: z.string().min(6, "password must be at least 6 characters"),
});
