import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { WorkerAttendance } from "./WorkerAttendance";

export const workerTypes = ["permanent", "casual"] as const;
export type WorkerType = (typeof workerTypes)[number];

@Entity("workers")
export class Worker {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  employeeNumber!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: "varchar", length: 20, default: "casual" })
  type!: WorkerType;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  wageRate?: string;

  @Column({ type: "varchar", length: 20, default: "day" })
  casualPayMode!: "day" | "task";

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  monthlySalary?: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  assignedTasks!: string[];

  @Column({ nullable: true })
  role?: string;

  @OneToMany(() => WorkerAttendance, (attendance) => attendance.worker)
  attendanceRecords!: WorkerAttendance[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
