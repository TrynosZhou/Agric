import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column
} from "typeorm";
import { Crop } from "./Crop";
import { Asset } from "./Asset";
import { IrrigationSystem } from "./IrrigationSystem";

@Entity("fields")
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  sizeHectares!: string;

  @Column({ nullable: true })
  location?: string;

  @OneToMany(() => Crop, (crop) => crop.field)
  crops!: Crop[];

  @OneToMany(() => Asset, (asset) => asset.field)
  assets!: Asset[];

  @OneToMany(() => IrrigationSystem, (system) => system.field)
  irrigationSystems!: IrrigationSystem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
