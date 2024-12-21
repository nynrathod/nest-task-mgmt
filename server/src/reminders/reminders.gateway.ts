import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RemindersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private userSockets: { [userId: string]: Socket } = {};

  handleConnection(client: Socket): void {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets[userId] = client;
      console.log(`User connected with ID: ${userId}`);
    } else {
      console.error('User connection failed: userId is missing');
    }
  }

  sendReminder(taskId: number, userId: string, title: string): void {
    const socket = this.userSockets[userId];
    if (socket) {
      console.log(`Sending reminder to user ${userId} for task ${taskId}`);
      socket.emit('taskReminder', {
        message: `You have a reminder for Task: ${taskId}`,
        title: title,
      });
    } else {
      console.error(
        `Socket not found for user ${userId}. Cannot send reminder for task ${taskId}`,
      );
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      delete this.userSockets[userId];
      console.log(`User disconnected with ID: ${userId}`);
    } else {
      console.error('User disconnection failed: userId is missing');
    }
  }
}
