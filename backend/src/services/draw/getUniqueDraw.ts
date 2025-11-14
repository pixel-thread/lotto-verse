import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type GetUniqueDrawProps = {
  where: Prisma.DrawWhereUniqueInput;
};
export async function getUniqueDraw({ where }: GetUniqueDrawProps) {
  return await prisma.draw.findUnique({ where, include: { prize: true } });
}
