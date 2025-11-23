import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.WinnerWhereInput;
};

export async function getWinners({ where }: Props = { where: {} }) {
  return await prisma.winner.findMany({
    where,
    include: {
      draw: { include: { prize: true } },
      user: true,
      luckyNumber: true,
    },
  });
}
