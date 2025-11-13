import { prisma } from "@/src/lib/db/prisma";

export async function getAllDraw() {
  return await prisma.draw.findMany({
    orderBy: { createdAt: "desc" }, // newest first
  });
}
