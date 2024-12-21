import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { IoAdapter } from '@nestjs/platform-socket.io';

class CustomSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    // Explicitly allow CORS for WebSocket connections
    options.cors = {
      origin: 'http://localhost:5173', // Allow requests from your frontend
      methods: ['GET', 'POST'],
      credentials: true,
    };
    return super.createIOServer(port, options);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS for HTTP requests
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  // Use custom socket adapter for WebSocket CORS
  app.useWebSocketAdapter(new CustomSocketIoAdapter(app));

  // Apply global authentication guard
  app.useGlobalGuards(app.get(AuthGuard));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
