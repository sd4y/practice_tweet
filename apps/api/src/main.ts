import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://3.35.10.193:3000'],
    credentials: true,
  });
  console.log('----------------------------------------------------------');
  console.log(`[${new Date().toISOString()}] DEPLOYMENT DEBUG MODE STARTED`);
  console.log('[Main] Server listening on port 3001');
  console.log('[Main] Allowed Origins:', ['http://localhost:3000', 'http://3.35.10.193:3000']);
  console.log('----------------------------------------------------------');
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
