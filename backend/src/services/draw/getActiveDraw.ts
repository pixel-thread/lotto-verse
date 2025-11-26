import { prisma } from "@/src/lib/db/prisma";

export async function getActiveDraw() {
  return await prisma.draw.findFirst({
    where: { status: "ACTIVE" },
    include: { prize: true, winner: true },
    take: 1,
  });
}
