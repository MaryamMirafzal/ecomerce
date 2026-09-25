import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookmarkProduct } from './bookmark-product.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  price!: number;

  @Column({ nullable: false })
  stock!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_category',
    joinColumns: [{ name: 'product_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'category_id', referencedColumnName: 'id' }],
  })
  categories!: Category[];

  @OneToMany(() => BookmarkProduct, (bookmark) => bookmark.product)
  bookmarks!: BookmarkProduct[];
}
