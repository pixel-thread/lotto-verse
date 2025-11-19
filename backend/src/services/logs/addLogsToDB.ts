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
  const [messagePart] = message.split(","); // part before first comma
  const contentParts = content.split(",");
  const contentPart =
    contentParts.length > 1 ? contentParts[1] : contentParts[0]; // part after first comma or whole

  return await prisma.log.create({
    data: {
      type,
      content: contentPart,
      message: messagePart,
      isBackend,
      timestamp: new Date(timestamp),
    },
  });
}
