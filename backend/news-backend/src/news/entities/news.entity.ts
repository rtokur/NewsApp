import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities';
import { Source } from 'src/sources/entities/source.entity';

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

  @Column({ type: 'timestamptz'})
  publishedAt: Date;

  @ManyToOne(() => Category, (category) => category.news, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Column()
  isBreaking: boolean;

  @ManyToOne(() => Source, (source) => source.news, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  source: Source;
}
