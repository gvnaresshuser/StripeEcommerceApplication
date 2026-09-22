import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "users",
  schema: "ecommerce",
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  password!: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
  })
  mobile!: string | null;

  @Column({
    type: "varchar",
    length: 20,
    default: "CUSTOMER",
  })
  role!: string;

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