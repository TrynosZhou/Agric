import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { HayBaleCustomer } from "./HayBaleCustomer";

export const paymentStatuses = ["paid", "pending"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

@Entity("hay_bale_sales")
export class HayBaleSale {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => HayBaleCustomer, (customer) => customer.hayBaleSales, { onDelete: "SET NULL" })
  customer?: HayBaleCustomer;

  @Column("int")
  quantity!: number;

  @Column("decimal", { precision: 12, scale: 2 })
  price!: string;

  @Column({ type: "date" })
  saleDate!: string;

  @Column({ type: "varchar", length: 20, default: "pending" })
  paymentStatus!: PaymentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

