import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Field } from "./Field";
import { SaleRecord } from "./SaleRecord";
import { DetasselingTask } from "./DetasselingTask";
import { TomatoHarvestCycle } from "./TomatoHarvestCycle";

export const cropTypes = ["barley", "seed maize", "tomatoes", "custom"] as const;
export type CropType = (typeof cropTypes)[number];

type ApplicationRecord = {
  date: string;
  product: string;
  quantity: string;
  notes?: string;
};

@Entity("crops")
export class Crop {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 30 })
  cropType!: CropType;

  @Column({ type: "date" })
  plantingDate!: string;

  @Column({ nullable: true })
  customCropType?: string;

  @Column()
  fieldName!: string;

  @Column({ default: "planned" })
  growthStage!: string;

  @Column({ type: "text", nullable: true })
  irrigationSchedule?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  estimatedYield?: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  fertilizerApplications!: ApplicationRecord[];

  @Column({ type: "jsonb", default: () => "'[]'" })
  pesticideApplications!: ApplicationRecord[];

  @ManyToOne(() => Field, (field) => field.crops, { onDelete: "SET NULL" })
  field?: Field;

  @OneToMany(() => SaleRecord, (saleRecord) => saleRecord.crop)
  saleRecords!: SaleRecord[];

  @OneToMany(() => DetasselingTask, (task) => task.crop)
  detasselingTasks!: DetasselingTask[];

  @OneToMany(() => TomatoHarvestCycle, (cycle) => cycle.crop)
  harvestCycles!: TomatoHarvestCycle[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
