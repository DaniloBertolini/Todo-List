import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { AllParameters, TaskCreateDto, TaskDto } from './task.dto';
import { Formats } from 'src/utils/formats';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
  ) {}

  async showAdm(): Promise<TaskDto[]> {
    const tasks = await this.tasksRepository.find();

    return tasks;
  }

  async show(id: number, params: AllParameters): Promise<TaskDto[]> {
    const searchParams: FindOptionsWhere<TaskEntity> = {};

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    if (params.description) {
      searchParams.description = Like(`%${params.description}%`);
    }

    if (params.status) {
      searchParams.status = Like(`%${params.status}%`);
    }

    searchParams.userId = id;
    const tasks = await this.tasksRepository.find({
      where: searchParams,
    });

    return tasks;
  }

  async index(id: number): Promise<TaskDto> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task)
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );

    return task;
  }

  async create(newTask: TaskCreateDto): Promise<TaskDto> {
    const { title, description, userId } = newTask;

    const taskToSave = Formats.formatTaskCreate(title, description, userId);
    const response = await this.tasksRepository.save(taskToSave);
    return response;
  }

  async update(
    user: { id: number; username: string },
    id: number,
    taskToUpdate: AllParameters,
  ): Promise<void> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (task.userId !== user.id && user.username !== 'admin')
      throw new HttpException(`You can't delete this`, HttpStatus.FORBIDDEN);

    if (!task)
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );

    await this.tasksRepository.update(id, taskToUpdate);
  }

  async delete(
    user: { id: number; username: string },
    id: number,
  ): Promise<void> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (task.userId !== user.id && user.username !== 'admin')
      throw new HttpException(`You can't delete this`, HttpStatus.FORBIDDEN);

    if (!task)
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );

    await this.tasksRepository.delete(id);
  }
}
