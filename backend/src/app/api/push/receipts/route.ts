import { getReceipts } from "@/src/lib/expo";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";

export async function GET() {
  try {
  } catch (error) {
    return handleApiErrors(error);
  }
}
