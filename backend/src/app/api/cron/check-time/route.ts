import { SuccessResponse } from "@/src/utils/next-response";

const now = new Date();

const convertUTCToIST = (utcDate: Date): Date => {
  // IST = UTC + 5:30
  const istOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 min
  return new Date(utcDate.getTime() + istOffsetMs);
};

export async function GET() {
  const utcNow = new Date();
  const istNow = convertUTCToIST(utcNow);

  return SuccessResponse({
    data: {
      utc: utcNow.toISOString(),
      ist: istNow.toISOString(),
      utcTimestamp: utcNow.getTime(),
      istTimestamp: istNow.getTime(),
      readable: {
        utc: utcNow.toLocaleString("en-US", { timeZone: "UTC" }),
        ist: istNow.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      },
    },
  });
}
