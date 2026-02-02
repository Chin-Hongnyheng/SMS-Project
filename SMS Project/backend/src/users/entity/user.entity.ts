import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class Users{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default:'user'})
    role: string;
}