import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AllParameters,
  QueryTasks,
  QueryUserId,
  TaskCreateDto,
  TaskDto,
} from './task.dto';
import { TaskService } from './task.service';
import { AuthGuardAdmin, AuthGuardUser } from 'src/user/user.guard';

@UseGuards(AuthGuardUser)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuardAdmin)
  @Get('/admin')
  async showAdmin(@Query() params: QueryUserId): Promise<TaskDto[]> {
    const response = await this.taskService.showAdm(params);
    return response;
  }

  @Get()
  async show(
    @Req() request: any,
    @Query() params: QueryTasks,
  ): Promise<TaskDto[]> {
    const response = await this.taskService.show(request.user.id, params);
    return response;
  }

  @Get('/:id')
  async index(@Param('id') id: string): Promise<TaskDto> {
    const response = await this.taskService.index(+id);
    return response;
  }

  @Post()
  async create(
    @Req() request: any,
    @Body() newTask: TaskCreateDto,
  ): Promise<TaskDto> {
    newTask.userId = +request.user.id;
    const response = await this.taskService.create(newTask);
    return response;
  }

  @Put('/:id')
  async update(
    @Req() request: any,
    @Param('id') id: string,
    @Body() taskToUpdate: AllParameters,
  ): Promise<void> {
    await this.taskService.update(
      { id: request.user.id, username: request.user.username },
      +id,
      taskToUpdate,
    );
  }

  @Delete('/:id')
  async delete(@Req() request: any, @Param('id') id: string): Promise<void> {
    await this.taskService.delete(
      { id: request.user.id, username: request.user.username },
      +id,
    );
  }
}
