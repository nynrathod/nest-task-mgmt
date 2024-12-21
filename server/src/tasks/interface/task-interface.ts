import { Task } from '../entities/task.entity';
import { UserResponseDto } from '../../auth/dto/user.dto';

export interface TaskWithTempId extends Omit<Task, 'assignee'> {
  assignee?: UserResponseDto;
  tempId?: string;
}
