import { Favorite } from "src/favorites/entities/favorites.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({name: 'full_name',nullable:true})
    fullName: string;

    @Column({name: 'is_active',default: true})
    isActive: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites: Favorite[];
}