import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Worker } from "./Worker";

export const allocationSystems = ["crop", "livestock"] as const;
export type AllocationSystem = (typeof allocationSystems)[number];

@Entity("worker_attendance")
export class WorkerAttendance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "date" })
  attendanceDate!: string;

  @Column({ type: "decimal", precision: 6, scale: 2, default: 0 })
  hoursWorked!: string;

  @Column({ nullable: true })
  taskPerformed?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  allocationSystem?: AllocationSystem;

  @Column({ nullable: true })
  allocationGroup?: string;

  @Column({ default: false })
  present!: boolean;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Worker, (worker) => worker.attendanceRecords, { onDelete: "CASCADE" })
  worker!: Worker;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
