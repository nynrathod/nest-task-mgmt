import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { IoAdapter } from '@nestjs/platform-socket.io';

class CustomSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    options.cors = {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    };
    return super.createIOServer(port, options);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  app.useWebSocketAdapter(new CustomSocketIoAdapter(app));
  app.useGlobalGuards(app.get(AuthGuard));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
