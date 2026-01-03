import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  imageUrl: string;

  @Column()
  source: string;

  @Column()
  sourceLogoUrl: string;

  @Column({ type: 'timestamptz'})
  publishedAt: Date;

  @ManyToOne(() => Category, (category) => category.news, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;
}
