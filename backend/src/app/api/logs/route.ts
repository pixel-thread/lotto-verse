import { Prisma } from "@/src/lib/db/prisma/generated/prisma";
import { addLogsToDB } from "@/src/services/logs/addLogsToDB";
import { getLogs } from "@/src/services/logs/getLogs";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAdmin } from "@/src/utils/middleware/requireAdmin";
import { SuccessResponse } from "@/src/utils/next-response";
import { logSchema } from "@/src/utils/validation/log";
import { NextRequest } from "next/server";
import z from "zod";

// Define validation schema for query params
const QuerySchema = z.object({
  now: z.string().optional(),
  startTime: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endTime: z
    .string()
    .default(new Date().toISOString())
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  isBackend: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
  type: z.string().optional(),
  message: z.string().optional(),
});

// Type-safe where clause builder
type LogFilters = {
  timestamp?: { gte?: Date; lte?: Date };
  isBackend?: boolean;
  type?: string;
  message?: { contains: string };
};

function buildWhereClause(filters: LogFilters): Prisma.LogWhereInput {
  const where: Prisma.LogWhereInput = {};

  if (filters.timestamp?.gte || filters.timestamp?.lte) {
    where.timestamp = filters.timestamp;
  }

  if (filters.isBackend !== undefined) {
    where.isBackend = filters.isBackend;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.message) {
    where.message = filters.message;
  }

  return where;
}

export async function GET(req: NextRequest) {
  try {
    // Early auth check
    await requireAdmin(req);

    const searchParams = req.nextUrl.searchParams;

    const validated = QuerySchema.safeParse({
      now: searchParams.get("now"),
      startTime: searchParams.get("startTime"),
      endTime: searchParams.get("endTime"),
      isBackend: searchParams.get("isBackend"),
      type: searchParams.get("type"),
      message: searchParams.get("message"),
    });

    if (!validated.success) {
      return handleApiErrors(
        new Error(`Invalid query params: ${validated.error.message}`),
      );
    }

    const { now, startTime, endTime, isBackend, type, message } =
      validated.data;

    // Use now as fallback for both start/end if provided
    const finalStartTime = startTime ?? (now ? new Date(now) : undefined);
    const finalEndTime = endTime ?? (now ? new Date(now) : undefined);

    const filters: LogFilters = {
      timestamp:
        finalStartTime || finalEndTime
          ? {
              gte: finalStartTime,
              lte: finalEndTime,
            }
          : undefined,
      ...(isBackend !== undefined && { isBackend }),
      ...(type && { type }),
      ...(message && { message: { contains: message } }),
    };

    const where = buildWhereClause(filters);

    const logs = await getLogs({ where });

    return SuccessResponse({ data: logs });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = logSchema.parse(await req.json());
    await addLogsToDB(body);
    return SuccessResponse({ message: "Log saved successfully" });
  } catch (error) {
    return handleApiErrors(error);
  }
}
