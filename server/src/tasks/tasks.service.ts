import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskWithTempId } from './interface/task-interface';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Create a new task
  async create(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<TaskWithTempId> {
    const assignee =
      createTaskDto.assignee.firstName || createTaskDto.assignee.lastName
        ? createTaskDto.assignee
        : {
            id: user.id,
            firstName: user.firstName,
            email: user.email,
            lastName: user.lastName,
          };
    const task = this.taskRepository.create({
      ...createTaskDto,
      assignee: assignee.id,
      userId: user.id,
    });

    const savedTask = await this.taskRepository.save(task);

    return {
      ...savedTask,
      assignee: assignee,
      tempId: createTaskDto.tempId,
    };
  }

  // Get all tasks
  // Assuming you have access to the current user's ID (e.g., via a request context or authentication token)
  async findAll(userId: number): Promise<any[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .select([
        'task.id',
        'task.title',
        'task.userId',
        'task.reminder',
        'task.status',
        'task.createdAt',
        'task.updatedAt',
        'assignee.id',
        'assignee.firstName',
        'assignee.lastName',
        'assignee.email',
      ])
      .where('task.userId = :userId', { userId })
      .orderBy('task.createdAt', 'DESC')
      .getMany();
  }

  // Get task by ID
  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskWithTempId> {
    // First, update the task in the database
    await this.taskRepository.update(id, {
      ...updateTaskDto,
      assignee: updateTaskDto.assignee?.id, // Only store assignee's ID in the database
      updatedAt: new Date(),
    });

    // Retrieve the updated task
    const updatedTask = await this.findOne(id); // Assuming `findOne` fetches the task by its ID

    // Return the updated task with full assignee object and tempId
    return {
      ...updatedTask, // Include all properties from the updated task
      assignee: updateTaskDto.assignee, // Include the full assignee object in the response
    };
  }

  // Delete task
  async remove(id: number): Promise<{ id: number; deleted: boolean }> {
    await this.taskRepository.delete(id);
    return { id, deleted: true };
  }

  async updateStatus(id: number, status: boolean): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new Error('Task not found');
    }

    task.status = status; // Set status
    task.updatedAt = new Date(); // Update timestamp

    await this.taskRepository.save(task);

    return task;
  }
}
