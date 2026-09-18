import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT ?? 3001);

  app.use((req: any, res: any, next: any) => {
    if (req.originalUrl === '/' || req.originalUrl === '') {
      return res.status(200).json({
        message: `API rodando em http://localhost:${port}`,
      });
    }

    return next();
  });

  await app.listen(port);
  console.log(`API rodando em http://localhost:${port}`);
}

bootstrap();
