import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where?: Prisma.DrawWhereInput;
};
export async function getAllDraw({ where }: Props = {}) {
  return await prisma.draw.findMany({
    where,
    orderBy: {
      status: "asc",
    },
    include: { prize: true, winner: true },
  });
}
