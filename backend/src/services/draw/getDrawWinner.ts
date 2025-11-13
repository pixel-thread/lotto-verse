import { prisma } from "@/src/lib/db/prisma";

type Props = {
  id: string;
};
export async function getDrawWinner({ id }: Props) {
  return await prisma.winner.findUnique({
    where: { drawId: id },
  });
}
