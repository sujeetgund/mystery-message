import { z } from "zod";

export const acceptingMessagesSchema = z.object({
  isAcceptingMessages: z.boolean(),
});
