import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { State } from "../helper/state.enum";


@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: State.PENDING })
  status: State;

  @Column({ nullable : true})
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, (user) => user.task, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "user",
    referencedColumnName: "id",
  })
  user: User;
}
