import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Crop } from "./Crop";

export const detasselingStatuses = ["pending", "in-progress", "done"] as const;
export type DetasselingStatus = (typeof detasselingStatuses)[number];

@Entity("detasseling_tasks")
export class DetasselingTask {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  assignedWorker!: string;

  @Column({ type: "integer", default: 0 })
  rowsCompleted!: number;

  @Column()
  field!: string;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: DetasselingStatus;

  @ManyToOne(() => Crop, (crop) => crop.detasselingTasks, { onDelete: "CASCADE" })
  crop!: Crop;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
