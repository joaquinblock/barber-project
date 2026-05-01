import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('barber-project-jb/api'); // Prefijo global para todas las rutas

  app.enableCors(); //Habilita CORS para permitir solicitudes desde el frontend. PERO ES SOLO PARA DESARROLLO ASI QUE NO SE OLVIDEN DE CONFIGURARLO BIEN PARA PRODUCCIÓN

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en los DTOs
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas
    transform: true, // Transforma los payloads a los tipos definidos en los DTOs
    transformOptions: { enableImplicitConversion: false }, // Permite la conversión implícita de tipos (ej: string a number). Lo pongo en false porque no funciona bien con los booleanos, así que uso un transform específico para eso en los DTOs (ver src/common/helpers/transforms/to-boolean.transform.ts)
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
