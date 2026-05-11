import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Field } from "./Field";

export const irrigationTypes = ["center pivot", "pump"] as const;
export type IrrigationType = (typeof irrigationTypes)[number];
export const powerSources = ["diesel", "electric", "solar"] as const;
export type PowerSource = (typeof powerSources)[number];
export const irrigationStatuses = ["active", "faulty", "inactive"] as const;
export type IrrigationStatus = (typeof irrigationStatuses)[number];

type WaterUsageLog = {
  date: string;
  usageLiters: string;
};

type FuelUsageLog = {
  date: string;
  amount: string;
  unit: "liters" | "kwh";
};

@Entity("irrigation_systems")
export class IrrigationSystem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 20 })
  systemType!: IrrigationType;

  @Column({ nullable: true })
  coverageAreaOrCapacity?: string;

  @Column({ type: "varchar", length: 20 })
  powerSource!: PowerSource;

  @Column({ type: "varchar", length: 20, default: "inactive" })
  status!: IrrigationStatus;

  @Column({ type: "jsonb", default: () => "'[]'" })
  waterUsageLog!: WaterUsageLog[];

  @Column({ type: "jsonb", default: () => "'[]'" })
  fuelUsageLog!: FuelUsageLog[];

  @Column({ type: "jsonb", default: () => "'[]'" })
  scheduledMaintenanceDates!: string[];

  @ManyToOne(() => Field, (field) => field.irrigationSystems, { onDelete: "SET NULL" })
  field?: Field;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
