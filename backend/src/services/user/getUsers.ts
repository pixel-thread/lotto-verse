import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where?: Prisma.UserWhereUniqueInput;
};

export async function getUsers({ where }: Props = {}) {
  return await prisma.user.findMany({ where });
}
