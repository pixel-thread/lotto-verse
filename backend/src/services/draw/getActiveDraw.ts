import { prisma } from "@/src/lib/db/prisma";

export async function getActiveDraw() {
  return await prisma.draw.findFirst({
    where: { isActive: true },
    take: 1,
    include: { prize: true, winner: true },
  });
}
