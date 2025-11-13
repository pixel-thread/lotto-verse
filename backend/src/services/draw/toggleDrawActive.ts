import { prisma } from "@/src/lib/db/prisma";

export async function toggleDrawActive({ id }: { id: string }) {
  return await prisma.$transaction(async (tx) => {
    const draw = await tx.draw.findUnique({ where: { id } });
    const isDrawActive = draw?.isActive;
    if (isDrawActive) {
      await tx.draw.updateMany({
        where: {
          id: { not: id },
          isActive: true,
        },
        data: { isActive: false },
      });
    }
    return await prisma.draw.update({
      where: { id },
      data: { isActive: !isDrawActive },
    });
  });
}
