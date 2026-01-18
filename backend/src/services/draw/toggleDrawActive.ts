import { prisma } from "@/src/lib/db/prisma";

export async function toggleDrawActive({ id }: { id: string }) {
  return await prisma.$transaction(async (tx) => {
    const draw = await tx.draw.findUnique({ where: { id } });
    const isDrawActive = draw?.status === "ACTIVE";

    if (isDrawActive) {
      await tx.draw.updateMany({
        where: {
          id: { not: id },
          status: "ACTIVE",
        },
        data: { status: "INACTIVE" },
      });
    }

    return await prisma.draw.update({
      where: { id },
      data: { status: isDrawActive ? "INACTIVE" : "ACTIVE" },
    });
  });
}
