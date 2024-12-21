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

  // Store user sockets by userId
  private userSockets: { [userId: string]: Socket } = {}; // Changed to string

  // This function handles the WebSocket connection
  handleConnection(client: Socket): void {
    const userId = client.handshake.query.userId as string; // Ensure it's treated as string
    if (userId) {
      this.userSockets[userId] = client; // Store the socket by userId
      console.log(`User connected with ID: ${userId}`);
    } else {
      console.error('User connection failed: userId is missing');
    }
  }

  // This function sends the reminder to the correct user
  sendReminder(taskId: number, userId: string, title: string): void {
    // Ensure userId is a string
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

  // This function handles the disconnection and removes the user from the sockets list
  handleDisconnect(client: Socket): void {
    const userId = client.handshake.query.userId as string; // Ensure it's treated as string
    if (userId) {
      delete this.userSockets[userId]; // Remove the user socket
      console.log(`User disconnected with ID: ${userId}`);
    } else {
      console.error('User disconnection failed: userId is missing');
    }
  }
}
