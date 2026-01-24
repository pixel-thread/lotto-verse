import { z } from "zod";
import { $Enums } from "@/src/lib/db/prisma/generated/prisma";

export const updateSchema = z.object({
  type: z.enum($Enums.AppVersionType), // OTA | PTA

  runtimeVersion: z.string().min(1, "Runtime version is required"),

  releaseName: z.string().optional(), // default handled by backend
  isMandatory: z.boolean().default(false),

  minAppVersion: z.string().nullable().optional(),

  rolloutPercent: z
    .number()
    .min(0, "Min rollout is 0")
    .max(100, "Max rollout is 100"),

  releaseNotes: z.string().nullable().optional(),

  assetUrl: z.url().nullable().optional(),

  // DB: metadata is stored as TEXT, so schema must be string
  metadata: z.string().nullable().optional(),
});

export type UpdateFormT = z.infer<typeof updateSchema>;
