import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  data: Prisma.PushTicketCreateInput;
};

export async function createPushTicket({ data }: Props) {
  return await prisma.pushTicket.create({ data });
}
