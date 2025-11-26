import { prisma } from "@/src/lib/db/prisma";
type Props = {
  id: string;
};
export async function deleteDrawById({ id }: Props) {
  return await prisma.$transaction(async (tx) => {
    return await tx.draw.update({
      where: { id },
      data: { status: "DELETED" },
    });
  });
}
