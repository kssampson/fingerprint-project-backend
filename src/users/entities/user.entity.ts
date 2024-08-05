import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VisitorId } from './visitorId.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => VisitorId, (visitorId) => visitorId.user)
  visitorIds: VisitorId[];
}
