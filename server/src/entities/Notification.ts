import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export const notificationPriorities = ["reminder", "warning", "critical"] as const;
export type NotificationPriority = (typeof notificationPriorities)[number];
export const notificationStatuses = ["unread", "read"] as const;
export type NotificationStatus = (typeof notificationStatuses)[number];

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "varchar", length: 20, default: "reminder" })
  priority!: NotificationPriority;

  @Column({ type: "varchar", length: 20, default: "unread" })
  status!: NotificationStatus;

  @Column({ type: "varchar", length: 30, default: "general" })
  module!: string;

  @Column({ nullable: true })
  dedupeKey?: string;

  // Legacy compatibility column (migrated into status)
  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
