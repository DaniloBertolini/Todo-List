import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ default: 'todo' })
  status: string;

  @Column({ type: 'varchar' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user: UserEntity;
}
