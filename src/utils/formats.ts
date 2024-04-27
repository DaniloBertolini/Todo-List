import { UserEntity } from 'src/db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskDto } from 'src/task/task.dto';

export class Formats {
  static async formatUserCreate(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const user = new UserEntity();

    const passwordHash = await bcrypt.hash(password, 10);

    user.username = username;
    user.password = passwordHash;

    return user;
  }

  static formatTaskCreate(
    title: string,
    description: string,
    userId: number,
  ): TaskDto {
    const task = new TaskEntity();

    task.title = title;
    task.description = description;
    task.status = 'todo';
    task.userId = userId;

    return task;
  }
}
