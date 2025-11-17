import { prisma } from "@/src/lib/db/prisma";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";
import z from "zod";

const logSchema = z.object({
  type: z.enum(["ERROR", "INFO", "WARN", "LOG"]),
  content: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
});

export async function POST(req: NextRequest) {
  // Validate request body using Lado
  const parseResult = logSchema.parse(await req.json());

  const { type, content, timestamp } = parseResult;

  try {
    await prisma.log.create({
      data: {
        type,
        content,
        timestamp: new Date(timestamp),
      },
    });

    return SuccessResponse({ message: "Log saved successfully" });
  } catch (error) {
    return handleApiErrors(error);
  }
}
