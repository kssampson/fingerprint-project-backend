import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Name {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}