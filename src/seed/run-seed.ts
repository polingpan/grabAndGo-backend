import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed.service';
import { AppModule } from '../app.module';
import 'tsconfig-paths/register';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    await seedService.runSeed();
    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    const connection = app.get<Connection>(getConnectionToken());
    await connection.close();

    await app.close();
    process.exit(0);
  }
}

bootstrap();
