import { prisma } from "@/src/lib/db/prisma";
type Props = {
  id: string;
};
export async function deleteDrawById({ id }: Props) {
  return await prisma.$transaction(
    async (tx) => {
      await tx.luckyNumber.deleteMany({ where: { drawId: id } });
      await tx.prize.deleteMany({ where: { drawId: id } });
      await tx.winner.deleteMany({ where: { drawId: id } });
      return await tx.draw.delete({ where: { id } });
    },
    {
      maxWait: 20000,
      timeout: 30000,
    },
  );
}
