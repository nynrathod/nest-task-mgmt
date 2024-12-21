import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskWithTempId } from './interface/task-interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskReminderService } from '../reminders/reminder.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskReminderService: TaskReminderService, // Inject the service
  ) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<TaskWithTempId> {
    const task = await this.tasksService.create(createTaskDto, req.user);
    await this.taskReminderService.scheduleReminderIfExists(task);
    console.log('in last');
    return task;
  }

  // In your controller
  @Get()
  async findAll(@Request() req): Promise<Task[]> {
    const userId = req.user.id; // Assuming user ID is available in the request object (e.g., from JWT token)
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskWithTempId> {
    // Use TaskWithTempId in the return type
    const task = await this.tasksService.update(id, updateTaskDto);
    console.log('updating task', task);
    await this.taskReminderService.scheduleReminderIfExists(task);
    return task;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
  ): Promise<{ id: number; deleted: boolean }> {
    return this.tasksService.remove(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() status: { status: boolean },
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, status.status);
  }
}