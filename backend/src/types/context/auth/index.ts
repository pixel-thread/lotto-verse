import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

export type UserT = Prisma.UserGetPayload<{}> | null | undefined;

export interface AuthContextI {
  user: UserT;
  isLoadingAuth: boolean;
  isAdmin: boolean;
}
