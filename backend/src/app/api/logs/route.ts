import { addLogsToDB } from "@/src/services/logs/addLogsToDB";
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
  message: z.string().default("Unknown message"),
});

export async function POST(req: NextRequest) {
  const body = logSchema.parse(await req.json());
  try {
    await addLogsToDB(body);
    return SuccessResponse({ message: "Log saved successfully" });
  } catch (error) {
    return handleApiErrors(error);
  }
}
