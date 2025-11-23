import { prisma } from "@/src/lib/db/prisma";
import { logger } from "@/src/utils/logger";

const addZeros = (num: number, endRange: number) => {
  const targetLength = endRange.toString().length;
  return num.toString().padStart(targetLength, "0");
};

type PrizeT = {
  amount: number;
  description: string;
};

type DataT = {
  startRange: number;
  endRange: number;
  prize: PrizeT;
  createdBy: string;
  month: string;
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
  // 7 days from now
  const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const draw = await prisma.draw.create({
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

async function insertLuckyNumbersInBackground(
  drawId: string,
  startRange: number,
  endRange: number,
) {
  const batchSize = 1000;
  const totalCount = endRange - startRange + 1;

  for (let offset = 0; offset < totalCount; offset += batchSize) {
    const length = Math.min(batchSize, totalCount - offset);
    const batch = Array.from({ length }, (_, j) => {
      const value = startRange + offset + j;
      return {
        // store padded string to preserve zeros
        number: addZeros(value, endRange), // <-- string
        drawId,
      };
    });

    await prisma.luckyNumber.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }
}
