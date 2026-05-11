import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Field } from "./Field";

export const assetCategories = ["machinery", "tool", "vehicle", "irrigation"] as const;
export type AssetCategory = (typeof assetCategories)[number];
export const assetConditions = ["good", "fair", "damaged"] as const;
export type AssetCondition = (typeof assetConditions)[number];

type MaintenanceLogEntry = {
  date: string;
  description: string;
  performedBy?: string;
  nextDueDate?: string;
};

@Entity("assets")
export class Asset {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "varchar", length: 20 })
  category!: AssetCategory;

  @Column("int", { default: 0 })
  quantityAvailable!: number;

  @Column("int", { default: 0 })
  quantityInUse!: number;

  @Column({ type: "varchar", length: 20, default: "good" })
  condition!: AssetCondition;

  @Column({ nullable: true })
  currentAssignedUser?: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  maintenanceLogEntries!: MaintenanceLogEntry[];

  @ManyToOne(() => Field, (field) => field.assets, { onDelete: "SET NULL" })
  field?: Field;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
