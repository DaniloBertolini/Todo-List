import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AllParameters, QueryTasks, TaskCreateDto, TaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async show(@Query() params: QueryTasks): Promise<TaskDto[]> {
    const response = await this.taskService.show(params);
    return response;
  }

  @Get('/:id')
  async index(@Param('id') id: string): Promise<TaskDto> {
    const response = await this.taskService.index(+id);
    return response;
  }

  @Post()
  async create(@Body() newTask: TaskCreateDto): Promise<TaskDto> {
    const response = await this.taskService.create(newTask);
    return response;
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() taskToUpdate: AllParameters,
  ): Promise<void> {
    await this.taskService.update(+id, taskToUpdate);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.taskService.delete(+id);
  }
}
