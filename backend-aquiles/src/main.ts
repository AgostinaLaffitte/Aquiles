// src/main.ts (Backend)
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 const allowedOrigins = [
  'https://aquiles-three.vercel.app', // Tu frontend en producción
  'http://localhost:5173'             // Tu frontend local
];

app.enableCors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
  // 2. Configurar Pipes Globales
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true 
  }));


  // 4. Escuchar en el puerto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  
  console.log(` CORS habilitado para: ${allowedOrigins.join(', ')}`);
}
bootstrap();