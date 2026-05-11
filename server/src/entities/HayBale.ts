import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("hay_bales")
export class HayBale {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Legacy per-bale fields kept for compatibility with existing DB
  @Column({ nullable: true })
  baleCode?: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  weightKg?: string;

  // Inventory fields (single "current stock" record recommended)
  @Column("int", { default: 0 })
  totalBalesProduced!: number;

  @Column("int", { default: 0 })
  balesInStock!: number;

  @Column("int", { default: 0 })
  balesSold!: number;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  pricePerBale!: string;

  @Column("int", { default: 50 })
  lowStockThreshold!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
