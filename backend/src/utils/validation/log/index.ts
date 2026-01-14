import z from "zod";

export const logSchema = z.object({
  type: z.enum(["ERROR", "INFO", "WARN", "LOG"], {
    message: "Invalid log type",
  }),
  content: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  message: z.string().default("Unknown message"),
});
