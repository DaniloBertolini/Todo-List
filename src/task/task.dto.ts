import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

export enum TaskStatusEnum {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class TaskDto {
  @IsInt()
  id: number;

  @IsString()
  @Length(2, 30)
  title: string;

  @IsString()
  @Length(2, 150)
  description: string;

  @IsEnum(TaskStatusEnum)
  @IsString()
  status: string;
}

export class TaskCreateDto {
  @IsString()
  @Length(2, 30)
  title: string;

  @IsString()
  @Length(2, 150)
  description: string;
}

export class AllParameters {
  @IsString()
  @Length(2, 30)
  @IsOptional()
  title: string;

  @IsString()
  @Length(2, 150)
  @IsOptional()
  description: string;

  @IsEnum(TaskStatusEnum)
  @IsString()
  @IsOptional()
  status: string;
}

export class QueryTasks {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatusEnum)
  @IsString()
  @IsOptional()
  status: string;
}
