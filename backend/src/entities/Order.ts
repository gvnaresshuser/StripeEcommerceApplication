import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "orders",
  schema: "ecommerce",
})
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "user_id",
    type: "integer",
  })
  userId!: number;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  totalAmount!: string;

  @Column({
    type: "varchar",
    length: 20,
    default: "PENDING",
  })
  status!: string;

  @Column({
    name: "stripe_session_id",
    type: "varchar",
    length: 255,
    nullable: true,
    unique: true,
  })
  stripeSessionId!: string | null;

  @Column({
    name: "stripe_payment_intent_id",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  stripePaymentIntentId!: string | null;

  @Column({
    name: "payment_status",
    type: "varchar",
    length: 20,
    default: "PENDING",
  })
  paymentStatus!: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
  })
  updatedAt!: Date;
}