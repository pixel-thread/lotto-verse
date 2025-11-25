import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.TransactionWhereUniqueInput;
};
export async function getUniqueTransaction({ where }: Props) {
  return await prisma.transaction.findUnique({
    where,
    include: {
      user: true,
      purchase: { include: { draw: true } },
    },
  });
}
