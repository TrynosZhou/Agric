export type FinanceType = "income" | "expense";
export type FinanceCategory =
  | "seeds"
  | "fertilizer"
  | "labour"
  | "fuel"
  | "feed"
  | "livestock sale"
  | "crop sale"
  | "hay bale sale"
  | "maintenance";

export interface FinanceTransaction {
  id: string;
  entryType: FinanceType;
  category: FinanceCategory;
  amount: string;
  date: string;
  notes?: string;
  livestockGroup?: string;
  crop?: { id: string; fieldName: string; cropType: string };
}

export interface FinanceSummary {
  from: string | null;
  to: string | null;
  totalIncome: number;
  totalExpense: number;
  netProfitLoss: number;
}
