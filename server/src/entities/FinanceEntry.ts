import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { SaleRecord } from "./SaleRecord";
import { Crop } from "./Crop";

export const financeCategories = [
  "seeds",
  "fertilizer",
  "labour",
  "fuel",
  "feed",
  "livestock sale",
  "crop sale",
  "hay bale sale",
  "maintenance"
] as const;
export type FinanceCategory = (typeof financeCategories)[number];

@Entity("finance_entries")
export class FinanceEntry {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  entryType!: "income" | "expense";

  @Column({ type: "varchar", length: 40 })
  category!: FinanceCategory;

  @Column("decimal", { precision: 12, scale: 2 })
  amount!: string;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @ManyToOne(() => SaleRecord, (saleRecord) => saleRecord.financeEntries, { onDelete: "SET NULL" })
  saleRecord?: SaleRecord;

  @ManyToOne(() => Crop, { onDelete: "SET NULL", nullable: true })
  crop?: Crop;

  @Column({ nullable: true })
  livestockGroup?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
