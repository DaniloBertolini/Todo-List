import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { AllParameters, TaskCreateDto, TaskDto } from './task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
  ) {}

  formatTaskCreate(title: string, description: string): TaskDto {
    const task = new TaskEntity();

    task.title = title;
    task.description = description;
    task.status = 'todo';

    return task;
  }

  async show(params: AllParameters): Promise<TaskDto[]> {
    const searchPrams: FindOptionsWhere<TaskEntity> = {};

    if (params.title) {
      searchPrams.title = Like(`%${params.title}%`);
    }

    if (params.description) {
      searchPrams.description = Like(`%${params.description}%`);
    }

    if (params.status) {
      searchPrams.status = Like(`%${params.status}%`);
    }

    const tasks = await this.tasksRepository.find({
      where: searchPrams,
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
    const { title, description } = newTask;

    const taskToSave = this.formatTaskCreate(title, description);
    const response = await this.tasksRepository.save(taskToSave);
    return response;
  }

  async update(id: number, taskToUpdate: AllParameters): Promise<void> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task)
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );

    await this.tasksRepository.update(id, taskToUpdate);
  }

  async delete(id: number): Promise<void> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task)
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );

    await this.tasksRepository.delete(id);
  }
}
