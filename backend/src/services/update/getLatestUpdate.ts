import { prisma } from "@/src/lib/db/prisma";

export async function getLatestUpdate() {
  return await prisma.appVersion.findFirst({
    where: { status: "ACTIVE" },
  });
}
