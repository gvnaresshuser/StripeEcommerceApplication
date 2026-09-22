import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "cart_items",
  schema: "ecommerce",
})
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "cart_id",
    type: "integer",
  })
  cartId!: number;

  @Column({
    name: "product_id",
    type: "integer",
  })
  productId!: number;

  @Column({
    type: "integer",
  })
  quantity!: number;

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