import z from "zod";

const drawPrizeSchema = z.object({
  description: z.string("Prize Description is Required").min(1),
  amount: z.number("Prize Amount is Required").min(1),
});

export const createDrawSchema = z.object({
  month: z.coerce.string("Month is Required").optional(),
  startRange: z.number("Start Range is Required").min(1).default(1000),
  endRange: z.number().min(1).default(9999),
  digitsCount: z.number("Digits Count is Required").min(1).default(4),
  prize: drawPrizeSchema,
});
