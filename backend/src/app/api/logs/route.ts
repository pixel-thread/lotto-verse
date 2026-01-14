import { addLogsToDB } from "@/src/services/logs/addLogsToDB";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { logSchema } from "@/src/utils/validation/log";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = logSchema.parse(await req.json());
    await addLogsToDB(body);
    return SuccessResponse({ message: "Log saved successfully" });
  } catch (error) {
    return handleApiErrors(error);
  }
}
