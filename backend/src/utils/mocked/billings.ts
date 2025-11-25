export type BillingDetailT = {
  // Purchase Information
  purchase: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    drawId: string;
    status: string;
    amount: number;
    quantity: number;
  };

  // Payment Information
  payment: {
    paymentId: string;
    orderId: string;
    razorpayId: string;
    transactionId: string;
    method: string;
    status: string;
    currency: string;
    amount: number;
    fee: number;
    tax: number;
    paidAt: Date;
  };

  // User Information
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };

  // Draw Information
  draw: {
    id: string;
    month: string;
    prize: {
      amount: number;
      description: string;
    };
    entryFee: number;
    startRange: number;
    endRange: number;
    endDate: Date;
    isWinnerDecleared: boolean;
  };

  // Lucky Numbers
  luckyNumbers: {
    number: number;
    id: string;
    drawId: string;
    isPurchased: boolean;
    winnerId: string | null;
    isWinner: boolean;
  }[];

  // Winner Information (if applicable)
  winner?: {
    id: string;
    name: string;
    winningNumber: number;
    prizeAmount: number;
    declaredAt: Date;
  };
};

export const MOCK_BILLING_DETAIL: BillingDetailT = {
  purchase: {
    id: "purchase_abc123xyz789",
    createdAt: new Date("2025-11-19T14:32:18Z"),
    updatedAt: new Date("2025-11-19T14:32:45Z"),
    userId: "user_harrison_001",
    drawId: "draw_nov_2025",
    status: "COMPLETED",
    amount: 400,
    quantity: 4,
  },

  payment: {
    paymentId: "pay_NXz9mK8dP5vYQR_01",
    orderId: "order_NXz9mK8dP5vYQR",
    razorpayId: "rzp_live_1234567890",
    transactionId: "txn_NXz9mK8dP5vYQR",
    method: "upi",
    status: "captured",
    currency: "₹",
    amount: 400,
    fee: 8, // 2% payment gateway fee
    tax: 0,
    paidAt: new Date("2025-11-19T14:32:45Z"),
  },

  user: {
    id: "user_harrison_001",
    name: "Harrison Kumar",
    email: "harrison@example.com",
    phone: "+91 9876543210",
  },

  draw: {
    id: "draw_nov_2025",
    month: "2025-11",
    prize: {
      amount: 100000,
      description: "Grand Prize - November 2025 Lucky Draw",
    },
    entryFee: 100,
    startRange: 1,
    endRange: 100,
    endDate: new Date("2025-11-30T18:00:00Z"),
    isWinnerDecleared: false,
  },

  luckyNumbers: [
    {
      number: 42,
      id: "ln_001",
      drawId: "draw_nov_2025",
      isPurchased: true,
      winnerId: null,
      isWinner: false,
    },
    {
      number: 17,
      id: "ln_002",
      drawId: "draw_nov_2025",
      isPurchased: true,
      winnerId: null,
      isWinner: false,
    },
    {
      number: 89,
      id: "ln_003",
      drawId: "draw_nov_2025",
      isPurchased: true,
      winnerId: null,
      isWinner: false,
    },
    {
      number: 23,
      id: "ln_004",
      drawId: "draw_nov_2025",
      isPurchased: true,
      winnerId: null,
      isWinner: false,
    },
  ],
};

// Mock with winning number
export const MOCK_BILLING_DETAIL_WITH_WIN: BillingDetailT = {
  ...MOCK_BILLING_DETAIL,
  purchase: {
    ...MOCK_BILLING_DETAIL.purchase,
    createdAt: new Date("2025-10-15T10:20:00Z"),
  },

  draw: {
    ...MOCK_BILLING_DETAIL.draw,
    month: "2025-10",
    endDate: new Date("2025-10-31T18:00:00Z"),
    isWinnerDecleared: true,
  },

  luckyNumbers: [
    {
      number: 42,
      id: "ln_001",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: "winner_001",
      isWinner: true, // This is the winning number!
    },
    {
      number: 17,
      id: "ln_002",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
      isWinner: false,
    },
    {
      number: 89,
      id: "ln_003",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
      isWinner: false,
    },
  ],
  winner: {
    id: "winner_001",
    name: "Harrison Kumar",
    winningNumber: 42,
    prizeAmount: 100000,
    declaredAt: new Date("2025-10-31T18:00:00Z"),
  },
};
