import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class RemindersQueue {
  constructor(
    @InjectQueue('reminders') private readonly reminderQueue: Queue,
  ) {}

  async scheduleReminder(
    taskId: number,
    reminderTime: Date,
    assigneeId: number,
    title: string,
  ): Promise<void> {
    await this.reminderQueue.add(
      'sendReminder',
      { taskId, assigneeId, title },
      { delay: reminderTime.getTime() - Date.now() },
    );
  }
}
