import { Exclude } from "class-transformer";
import { timeStamp } from "console";
import { Product } from "src/products/product.entity";
import { Review } from "src/reviews/review.entity";
import { CURENT_TIMESTAMP } from "src/utils/constant";
import { Role } from "src/utils/enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: "150", nullable: true })
  full_name: string;

  @Column({ type: "varchar", length: "250", unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.User })
  role: Role;

  @Exclude()
  @Column({ type: "boolean", default: false })
  isAccountVerify: boolean;

  @Column({ type: "varchar", nullable: true, length: 255 })
  otp: string | null;
  @Column({ type: "timestamp", nullable: true })
  otpExpiredAt: Date | null;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  passwordChangedAt: Date | null;

  @Column({ type: "boolean", default: false })
  isForgetPassword: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => CURENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => CURENT_TIMESTAMP,
    onUpdate: CURENT_TIMESTAMP,
  })
  updatedAt: Date;

  @Column({ type: "varchar", nullable: true, default: null })
  avatar: string | null;

  // relationships

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
