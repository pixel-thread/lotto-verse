import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  data: Prisma.TransactionCreateInput;
};

export async function createTransaction({ data }: Props) {
  return await prisma.transaction.create({ data });
}
