import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";
import { getPagination } from "@utils/pagination";
type Props = { where: Prisma.LuckyNumberWhereInput; page?: string };

export async function getLuckyNumbers({ where, page = "1" }: Props) {
  const { take, skip } = getPagination({ page });
  return await prisma.$transaction([
    prisma.luckyNumber.findMany({
      where,
      skip,
      take,
      orderBy: { number: "asc" },
    }),
    prisma.luckyNumber.count({ where, orderBy: { number: "asc" } }),
  ]);
}
