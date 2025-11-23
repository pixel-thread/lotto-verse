import z from 'zod';

const drawPrizeSchema = z.object({
  description: z
    .string({ message: 'Prize Description is Required' })
    .min(1, 'Prize Description is Required')
    .trim(),
  amount: z.number({ message: 'Prize Amount is Required' }).min(1, 'Prize Amount is Required'),
});

export const createDrawSchema = z
  .object({
    month: z.coerce.string({ message: 'Month is Required' }).trim(),
    startRange: z.coerce.number({ message: 'Start Range is Required' }),
    endRange: z.coerce.number({ message: 'End Range is Required' }),
    entryFee: z.coerce.number({ message: 'Entry Fee is Required' }),
    prize: drawPrizeSchema,
  })
  .superRefine(({ startRange, endRange }, ctx) => {
    if (startRange > endRange) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start Range must be less than End Range',
        path: ['startRange'],
      });
    }
  });

export type CreateDrawSchemaT = z.infer<typeof createDrawSchema>;
