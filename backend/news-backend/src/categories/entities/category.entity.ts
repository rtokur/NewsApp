import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { News } from '../../news/entities/news.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => News, (news) => news.category)
  news: News[];
}