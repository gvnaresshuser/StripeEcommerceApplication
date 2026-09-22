import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity({
  name: "order_items",
  schema: "ecommerce",
})
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "order_id",
    type: "integer",
  })
  orderId!: number;

  @Column({
    name: "product_id",
    type: "integer",
  })
  productId!: number;

  @Column({
    name: "product_name",
    type: "varchar",
    length: 150,
  })
  productName!: string;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  unitPrice!: string;

  @Column({
    type: "integer",
  })
  quantity!: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  subtotal!: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  createdAt!: Date;
}