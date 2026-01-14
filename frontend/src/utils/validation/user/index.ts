import z from 'zod';

export const userSchema = z.object({
  phoneNo: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .max(10, { message: 'Phone number must be at most 10 characters' })
    .regex(/^\d+$/, { message: 'Phone number must be a number' }),
});
