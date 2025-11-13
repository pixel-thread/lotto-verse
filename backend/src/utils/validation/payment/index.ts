import z from "zod";

export const createPaymentSchema = z.object({ luckyNumberId: z.string() });
