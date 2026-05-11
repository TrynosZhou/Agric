import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Crop } from "./Crop";

@Entity("tomato_harvest_cycles")
export class TomatoHarvestCycle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "integer" })
  cycleNumber!: number;

  @Column({ type: "date" })
  harvestedOn!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  quantityKg!: string;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Crop, (crop) => crop.harvestCycles, { onDelete: "CASCADE" })
  crop!: Crop;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
