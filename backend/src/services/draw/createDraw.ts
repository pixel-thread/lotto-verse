import { prisma } from "@/src/lib/db/prisma";
import { logger } from "@/src/utils/logger";

type PrizeT = {
  amount: number;
  description: string;
};

type DataT = {
  startRange: number;
  endRange: number;
  digitsCount: number;
  prize: PrizeT;
  createdBy: string;
};

type Props = {
  data: DataT;
};

export async function createDraw({ data }: Props) {
  const { startRange, endRange } = data;

  if (startRange > endRange) {
    throw new Error("startRange must be less than or equal to endRange");
  }

  if (startRange < 0) {
    throw new Error("startRange must be a non-negative number");
  }

  // Step 1: Create the draw and prize without lucky numbers
  const now = new Date();
  const month = `${now.getFullYear()}-${now.getMonth()}`;
  // 7 days from now
  const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const draw = await prisma.draw.create({
    data: {
      month,
      startRange,
      endRange,
      endDate,
      prize: {
        create: {
          amount: data.prize.amount,
          description: data.prize.description,
        },
      },
      createdBy: data.createdBy,
    },
  });

  // Step 2: Start background insertion of lucky numbers (non-blocking)
  insertLuckyNumbersInBackground(draw.id, startRange, endRange).catch((err) => {
    logger.error({
      message: "Failed to insert lucky numbers in background",
      error: err,
    });
  });

  // Step 3: Return the draw immediately without luckyNumbers populated
  return draw;
}

// Async function to insert lucky numbers in batches
async function insertLuckyNumbersInBackground(
  drawId: string,
  startRange: number,
  endRange: number,
) {
  const batchSize = 1000;
  const totalCount = endRange - startRange + 1;

  for (let i = 0; i < totalCount; i += batchSize) {
    const batch = Array.from(
      { length: Math.min(batchSize, totalCount - i) },
      (_, j) => ({
        number: startRange + i + j,
        drawId,
      }),
    );

    await prisma.luckyNumber.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }
}
