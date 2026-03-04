import { NestFactory } from '@nestjs/core';
import { PokedexApiModule } from './pokedex-api.module';

async function bootstrap() {
  const app = await NestFactory.create(PokedexApiModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(3000);
  console.log('Backend running at: http://localhost:3000');
}

bootstrap();
