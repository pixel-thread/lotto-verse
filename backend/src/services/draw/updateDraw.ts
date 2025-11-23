import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type PrizeT = {
  amount: number;
  description: string;
};

type DataT = {
  startRange: number;
  endRange: number;
  prize: PrizeT;
  month: string;
};

type Props = {
  where: Prisma.DrawWhereUniqueInput;
  data: DataT;
};

export async function updateDraw({ data, where }: Props) {
  const { startRange, endRange } = data;

  if (startRange > endRange) {
    throw new Error("startRange must be less than or equal to endRange");
  }

  if (startRange < 0) {
    throw new Error("startRange must be a non-negative number");
  }

  // Step 1: Create the draw and prize without lucky numbers
  const now = new Date();
  // 7 days from now
  const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const draw = await prisma.draw.update({
    where,
    data: {
      month: data.month,
      startRange,
      endRange,
      endDate,
      prize: {
        create: {
          amount: data.prize.amount,
          description: data.prize.description,
        },
      },
    },
  });

  return draw;
}
