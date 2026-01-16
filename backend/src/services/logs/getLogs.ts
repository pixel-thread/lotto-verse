import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where?: Prisma.LogWhereInput;
};

export async function getLogs({ where }: Props = {}) {
  return await prisma.log.findMany({ where });
}
