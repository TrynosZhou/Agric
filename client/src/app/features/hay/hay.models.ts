export type PaymentStatus = "paid" | "pending";

export interface HayStock {
  id: string;
  totalBalesProduced: number;
  balesInStock: number;
  balesSold: number;
  pricePerBale: string;
  lowStockThreshold: number;
  lowStock: boolean;
}

export interface HayCustomer {
  id: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
}

export interface HaySale {
  id: string;
  quantity: number;
  price: string;
  saleDate: string;
  paymentStatus: PaymentStatus;
  customer?: HayCustomer;
}

