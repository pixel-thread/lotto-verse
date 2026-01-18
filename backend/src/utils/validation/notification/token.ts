import { $Enums } from "@/src/lib/db/prisma/generated/prisma";
import z from "zod";

export const TokenSchema = z.object({
  token: z.string(),
  userId: z.string(),
  deviceId: z.string().optional(),
  platform: z.enum([
    $Enums.AppVersionPlatform.IOS,
    $Enums.AppVersionPlatform.ANDROID,
  ]),
});
