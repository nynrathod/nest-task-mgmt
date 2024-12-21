import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'assignee' })
  assignee: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  reminder: Date;

  @Column({ default: false })
  status: boolean;

  @CreateDateColumn() // Automatically sets the current date/time when the task is created
  createdAt: Date;

  @UpdateDateColumn({ nullable: true }) // Automatically updates the date/time on each update
  updatedAt: Date;
}
