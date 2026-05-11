import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { SaleRecord } from "./SaleRecord";
import { HayBaleSale } from "./HayBaleSale";

@Entity("hay_bale_customers")
export class HayBaleCustomer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @OneToMany(() => HayBaleSale, (sale) => sale.customer)
  hayBaleSales!: HayBaleSale[];

  @OneToMany(() => SaleRecord, (saleRecord) => saleRecord.customer)
  saleRecords!: SaleRecord[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
