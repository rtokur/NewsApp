import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Index,
    JoinColumn,
    Column,
    Unique,
  } from 'typeorm';
  import { User } from 'src/users/entities/user.entity';
  import { News } from 'src/news/entities/news.entity';
  
  @Entity('reading_history')
  @Unique(['userId', 'newsId'])
  export class ReadingHistory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'news_id' })
  newsId: number;

    @ManyToOne(() => User, (user) => user.readingHistory, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => News, {
      eager: true,
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'news_id' })
    news: News;
  
    @CreateDateColumn()
    readAt: Date;
  }
  