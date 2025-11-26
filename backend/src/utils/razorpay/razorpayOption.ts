import { env } from "@/src/env";
import { clerk } from "@/src/lib/clerk";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  order: Prisma.PurchaseGetPayload<{ include: {} }>;
  desc?: string;
  userId: string;
};

// @ts-nocheck
export type RazorpayOptions = {
  description: string;
  image?: string;
  currency: string;
  key: string;
  amount: string | number;
  name: string;
  order_id: string;
  prefill: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
};

export const razorPayOptions = async ({
  order,
  userId,
  desc = "Pay for test order",
}: Props): Promise<RazorpayOptions> => {
  const user = await clerk.users.getUser(userId);
  const logo = `${env.NEXT_PUBLIC_API_BASE_URL.slice(0, -4)}/public/icons/web/icon-512.png`;
  return {
    prefill: {
      email: user.primaryEmailAddress?.emailAddress,
      contact: user.primaryPhoneNumber?.phoneNumber,
    },
    image: logo,
    description: desc,
    currency: "INR",
    key: env.RAZORPAY_KEY_ID,
    amount: order.amount,
    order_id: order.razorpayId,
    name: env.NEXT_PUBLIC_APP_NAME,
    theme: { color: "#000" },
  };
};
