import { prisma } from "@/src/lib/db/prisma";
type Props = {
  id: string;
};
export async function deleteDrawById({ id }: Props) {
  return await prisma.draw.delete({ where: { id } });
}
