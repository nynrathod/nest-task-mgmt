import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RemindersGateway } from './reminders.gateway';

@Processor('reminders')
export class RemindersProcessor {
  constructor(private readonly remindersGateway: RemindersGateway) {}

  @Process('sendReminder')
  async handleReminder(job: Job): Promise<void> {
    const { taskId, assigneeId, title } = job.data;

    console.log(
      `Processing reminder for task ${taskId} assigned to user ${assigneeId}`,
    );

    try {
      await this.remindersGateway.sendReminder(taskId, assigneeId, title);
      console.log(
        `Reminder sent successfully for task ${taskId} to user ${assigneeId}`,
      );
    } catch (error) {
      console.error(
        `Failed to send reminder for task ${taskId} to user ${assigneeId}:`,
        error,
      );
    }
  }
}
