import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "./task.entity";
import { Role } from "../helper/state.enum";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({select : false})
  password: string;

  @Column({ default: Role.USER, select : false })
  role: Role;

  @CreateDateColumn({select : false})
  created_at: Date;

  @Column({ default: true, select : false })
  is_active: boolean;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  task: Task;
}
