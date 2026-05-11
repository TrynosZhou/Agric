export type IndividualSpecies = "cattle" | "goats" | "pigs";
export type LivestockTypeFilter = "all" | "individual" | "poultry";

export interface LivestockAnimal {
  id: string;
  species: IndividualSpecies;
  tagIdNumber: string;
  dateOfBirth: string;
  weightHistory: Array<{ date: string; weightKg: string }>;
  vaccinationRecords: Array<{ date: string; vaccineType: string; nextDueDate?: string; notes?: string }>;
  dippingRecords: Array<{ date: string; product: string; notes?: string }>;
  treatmentHistory: Array<{ date: string; treatment: string; diagnosis?: string; notes?: string }>;
  isDead: boolean;
  mortalityDate?: string;
  mortalityNotes?: string;
  dailyMilkProduction: Array<{ date: string; liters: string }>;
}

export interface PoultryBatch {
  id: string;
  batchCode: string;
  flockSize: number;
  mortalityCount: number;
  feedConsumptionKg: string;
  eggProduction: number;
}

export interface LivestockListResponse {
  animals: LivestockAnimal[];
  poultry: PoultryBatch[];
}
