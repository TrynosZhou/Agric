import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Crop } from "./Crop";
import { LivestockBatch } from "./LivestockBatch";
import { HayBaleCustomer } from "./HayBaleCustomer";
import { FinanceEntry } from "./FinanceEntry";

@Entity("sale_records")
export class SaleRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "date" })
  saleDate!: string;

  @Column("decimal", { precision: 12, scale: 2 })
  amount!: string;

  @Column()
  itemDescription!: string;

  @ManyToOne(() => Crop, (crop) => crop.saleRecords, { onDelete: "SET NULL" })
  crop?: Crop;

  @ManyToOne(() => LivestockBatch, (batch) => batch.saleRecords, { onDelete: "SET NULL" })
  livestockBatch?: LivestockBatch;

  @ManyToOne(() => HayBaleCustomer, (customer) => customer.saleRecords, { onDelete: "SET NULL" })
  customer?: HayBaleCustomer;

  @OneToMany(() => FinanceEntry, (financeEntry) => financeEntry.saleRecord)
  financeEntries!: FinanceEntry[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
