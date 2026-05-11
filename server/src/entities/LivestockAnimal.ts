import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export const individualSpecies = ["cattle", "goats", "pigs"] as const;
export type IndividualSpecies = (typeof individualSpecies)[number];

type WeightRecord = {
  date: string;
  weightKg: string;
};

type VaccinationRecord = {
  date: string;
  vaccineType: string;
  nextDueDate?: string;
  notes?: string;
};

type DippingRecord = {
  date: string;
  product: string;
  notes?: string;
};

type TreatmentRecord = {
  date: string;
  treatment: string;
  diagnosis?: string;
  notes?: string;
};

type MilkRecord = {
  date: string;
  liters: string;
};

@Entity("livestock_animals")
export class LivestockAnimal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  tagIdNumber!: string;

  @Column({ type: "varchar", length: 20 })
  species!: IndividualSpecies;

  @Column({ type: "date" })
  dateOfBirth!: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  weightHistory!: WeightRecord[];

  @Column({ type: "jsonb", default: () => "'[]'" })
  vaccinationRecords!: VaccinationRecord[];

  @Column({ type: "jsonb", default: () => "'[]'" })
  dippingRecords!: DippingRecord[];

  @Column({ type: "jsonb", default: () => "'[]'" })
  treatmentHistory!: TreatmentRecord[];

  @Column({ default: false })
  isDead!: boolean;

  @Column({ type: "date", nullable: true })
  mortalityDate?: string;

  @Column({ type: "text", nullable: true })
  mortalityNotes?: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  dailyMilkProduction!: MilkRecord[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
