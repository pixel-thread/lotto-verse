import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type GetUniqueUserProps = {
  where: Prisma.UserWhereUniqueInput;
};
export async function getUniqueUser({ where }: GetUniqueUserProps) {
  return await prisma.user.findUnique({ where });
}
