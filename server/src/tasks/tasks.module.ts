import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { RemindersModule } from '../reminders/reminders.module';
import { TaskReminderService } from '../reminders/reminder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), RemindersModule],
  providers: [TasksService, TaskReminderService],
  controllers: [TasksController],
})
export class TasksModule {}
