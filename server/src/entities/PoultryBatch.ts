import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("poultry_batches")
export class PoultryBatch {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  batchCode!: string;

  @Column("int")
  flockSize!: number;

  @Column("int", { default: 0 })
  mortalityCount!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  feedConsumptionKg!: string;

  @Column("int", { default: 0 })
  eggProduction!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
