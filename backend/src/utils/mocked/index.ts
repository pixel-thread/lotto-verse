const MOCK_PURCHASES = [
  {
    luckyNumber: [
      {
        number: 42,
        id: "ln_001",
        drawId: "draw_nov_2025",
        isPurchased: true,
        winnerId: "winner_001", // This is a winning number!
      },
      {
        number: 17,
        id: "ln_002",
        drawId: "draw_nov_2025",
        isPurchased: true,
        winnerId: null,
      },
      {
        number: 89,
        id: "ln_003",
        drawId: "draw_nov_2025",
        isPurchased: true,
        winnerId: null,
      },
      {
        number: 23,
        id: "ln_004",
        drawId: "draw_nov_2025",
        isPurchased: true,
        winnerId: null,
      },
    ],
    id: "purchase_abc123xyz",
    createdAt: new Date("2025-11-19T14:32:18Z"),
    userId: "user_harrison_001",
    luckyNumberId: "ln_001",
    razorpayId: "order_NXz9mK8dP5vYQR",
    paymentId: "pay_NXz9mK8dP5vYQR_01",
    amount: 400, // ₹100 per number x 4 numbers
    drawId: "draw_nov_2025",
    status: "COMPLETED",
  },

  {
    luckyNumber: [
      {
        number: 7,
        id: "ln_005",
        drawId: "draw_nov_2025",
        isPurchased: true,
        winnerId: null,
      },
      {
        number: 55,
        id: "ln_006",
        drawId: "draw_nov_2025",
        isPurchased: true,
        winnerId: null,
      },
    ],
    id: "purchase_def456uvw",
    createdAt: new Date("2025-11-20T08:15:42Z"),
    userId: "user_harrison_001",
    luckyNumberId: "ln_005",
    razorpayId: "order_MYz8nJ7cO4uXPQ",
    paymentId: null, // No payment ID yet because it's pending
    amount: 200, // ₹100 per number x 2 numbers
    drawId: "draw_nov_2025",
    status: "PENDING",
  },
];

// Additional mock examples for different scenarios
export const MOCK_FAILED_PURCHASE = {
  luckyNumber: [
    {
      number: 33,
      id: "ln_007",
      drawId: "draw_nov_2025",
      isPurchased: false,
      winnerId: null,
    },
  ],
  id: "purchase_ghi789rst",
  createdAt: new Date("2025-11-18T16:45:30Z"),
  userId: "user_harrison_001",
  luckyNumberId: "ln_007",
  razorpayId: "order_LXy7mI6bN3tWOP",
  paymentId: null,
  amount: 100,
  drawId: "draw_nov_2025",
  status: "FAILED",
};

export const MOCK_LARGE_PURCHASE = {
  luckyNumber: [
    {
      number: 1,
      id: "ln_008",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
    {
      number: 12,
      id: "ln_009",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
    {
      number: 25,
      id: "ln_010",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
    {
      number: 38,
      id: "ln_011",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
    {
      number: 49,
      id: "ln_012",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
    {
      number: 67,
      id: "ln_013",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
    {
      number: 78,
      id: "ln_014",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
    {
      number: 99,
      id: "ln_015",
      drawId: "draw_oct_2025",
      isPurchased: true,
      winnerId: null,
    },
  ],
  id: "purchase_jkl012mno",
  createdAt: new Date("2025-10-28T11:20:15Z"),
  userId: "user_harrison_001",
  luckyNumberId: "ln_008",
  razorpayId: "order_KWx6lH5aN2sVNO",
  paymentId: "pay_KWx6lH5aN2sVNO_01",
  amount: 800, // ₹100 per number x 8 numbers
  drawId: "draw_oct_2025",
  status: "COMPLETED",
};

export const ALL_MOCK_PURCHASES = [
  ...MOCK_PURCHASES,
  MOCK_FAILED_PURCHASE,
  MOCK_LARGE_PURCHASE,
];

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
