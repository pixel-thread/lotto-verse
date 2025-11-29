import z from "zod";

export const registerPushSchema = z.object({
  token: z.string(),
  userId: z.uuid().optional(),
  platform: z.string(),
});

export const sendPushSchema = z.object({
  userId: z.uuid().optional(),
  title: z.string(),
  message: z.string(),
});
