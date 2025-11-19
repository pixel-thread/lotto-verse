import { prisma } from "@/src/lib/db/prisma";
import z from "zod";

const logSchema = z.object({
  type: z.enum(["ERROR", "INFO", "WARN", "LOG"]),
  content: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  isBackend: z.boolean().default(false).optional(),
  message: z.string(),
});
type Log = z.infer<typeof logSchema>;

export async function addLogsToDB({
  type,
  content,
  timestamp,
  isBackend,
  message,
}: Log) {
  return await prisma.log.create({
    data: {
      type,
      content,
      message: message.split(",")[0],
      isBackend,
      timestamp: new Date(timestamp),
    },
  });
}
