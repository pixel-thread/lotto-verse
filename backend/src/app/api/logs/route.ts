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
// 1. Fix LogFilters type to support case-insensitive search
type LogFilters = {
  timestamp?: { gte?: Date; lte?: Date };
  isBackend?: boolean;
  type?: "INFO" | "ERROR" | "WARNING" | "DEBUG";
  message?: { contains: string; mode?: "insensitive" }; // ✅ Added mode
};

// 2. Update buildWhereClause to handle mode properly
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
    where.message = {
      contains: filters.message.contains,
      mode: filters.message.mode || "default",
    };
  }

  return where;
}

// 3. Fix Zod schema - transform AFTER parsing strings
const QuerySchema = z
  .object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    isBackend: z
      .string()
      .optional()
      .transform((val) => val === "true"),
    type: z.enum(["INFO", "ERROR", "WARNING", "DEBUG"]).optional(),
    message: z.string("please enter a message").optional(),
  })
  .transform((data) => ({
    ...data,
    // ✅ Transform strings to Dates AFTER Zod parsing
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
  }));

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const searchParams = req.nextUrl.searchParams;

    const validated = QuerySchema.safeParse({
      startTime: searchParams.get("startTime"),
      endTime: searchParams.get("endTime"),
      isBackend: searchParams.get("isBackend"),
      type: searchParams.get("type"),
      message: searchParams.get("message") || "",
    });

    if (!validated.success) {
      throw new Error(validated.error.message);
    }

    const { startTime, endTime, isBackend, type, message } = validated.data;

    // ✅ Safe date handling with fallbacks
    const now = new Date();
    const safeStartTime =
      startTime ?? new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const safeEndTime = endTime ?? now;

    const filters: LogFilters = {
      timestamp: {
        gte: safeStartTime,
        lte: safeEndTime,
      },
      ...(isBackend !== undefined && { isBackend }),
      ...(type && { type }),
      ...(message && {
        message: {
          contains: message,
          mode: "insensitive" as const,
        },
      }),
    };

    const logs = await getLogs({
      where: buildWhereClause(filters),
      orderBy: { timestamp: "desc" },
      take: 1000,
    });

    return SuccessResponse({
      data: logs,
      message: "Successfully fetched logs",
    });
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
