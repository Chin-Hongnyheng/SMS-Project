import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = new Set([
    'http://localhost',
    'http://127.0.0.1',
  ])
  const originPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin) || originPattern.test(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // ---------------------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
