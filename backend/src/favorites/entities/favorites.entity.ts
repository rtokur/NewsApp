import { News } from 'src/news/entities/news.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('favorites')
@Unique(['user', 'news'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => News, (news) => news.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'news_id' })
  news: News;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
