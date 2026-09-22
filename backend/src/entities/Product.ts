import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "products",
  schema: "ecommerce",
})
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 150,
  })
  name!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description!: string | null;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  price!: string;

  @Column({
    type: "integer",
    default: 0,
  })
  stock!: number;

  @Column({
    name: "image_url",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  imageUrl!: string | null;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  category!: string | null;

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