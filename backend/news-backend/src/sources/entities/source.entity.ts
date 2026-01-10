import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { News } from '../../news/entities/news.entity';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  logoUrl: string;

  @OneToMany(() => News, (news) => news.source)
  news: News[];
}
