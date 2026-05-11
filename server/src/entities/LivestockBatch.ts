import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { SaleRecord } from "./SaleRecord";

@Entity("livestock_batches")
export class LivestockBatch {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  batchCode!: string;

  @Column()
  species!: string;

  @Column("int")
  quantity!: number;

  @OneToMany(() => SaleRecord, (saleRecord: SaleRecord) => saleRecord.livestockBatch)
  saleRecords!: SaleRecord[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
