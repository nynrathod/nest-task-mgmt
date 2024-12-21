import { Injectable } from '@nestjs/common';
import { RemindersQueue } from './reminders.queue';
import { TaskWithTempId } from '../tasks/interface/task-interface';

@Injectable()
export class TaskReminderService {
  constructor(private readonly remindersQueue: RemindersQueue) {}

  async scheduleReminderIfExists(task: TaskWithTempId) {
    if (task.reminder && !isNaN(new Date(task.reminder).getTime())) {
      console.log('Reminder found:', task.reminder);
      try {
        await this.remindersQueue.scheduleReminder(
          task.id,
          new Date(task.reminder),
          task.assignee.id,
          task.title,
        );
        console.log('Reminder scheduled successfully');
      } catch (err) {
        console.error('Error scheduling reminder:', err);
      }
    }
  }
}
