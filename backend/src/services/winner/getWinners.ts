import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.WinnerWhereInput;
};

export async function getWinners({ where }: Props) {
  return await prisma.winner.findMany({ where });
}
