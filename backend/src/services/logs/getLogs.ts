import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where?: Prisma.LogWhereInput;
  orderBy?: Prisma.LogOrderByWithRelationInput;
  take?: number;
};

export async function getLogs({ where, orderBy, take }: Props = {}) {
  return await prisma.log.findMany({ where, orderBy, take });
}
