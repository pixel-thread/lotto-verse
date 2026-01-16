import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.WinnerWhereUniqueInput;
  data: Prisma.WinnerUpdateInput;
};
export async function updateWinner({ where, data }: Props) {
  return await prisma.winner.update({ where, data });
}
