import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = { where: Prisma.TransactionWhereInput };

export async function getTransactions({ where }: Props = { where: {} }) {
  return await prisma.transaction.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}
