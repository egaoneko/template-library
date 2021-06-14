import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import Graceful from 'node-graceful';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

Graceful.captureExceptions = true;
const port = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Real World API')
    .setDescription('Real World API documents')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('api', app, document);

  const server = await app.listen(port, () => console.log(`Service listening on port ${port}!`));

  Graceful.on('exit', async () => {
    if (server) {
      await server.close();
    }
    console.log(`Gracefully closed listening on port ${port}!`);
  });

  process.on('SIGINT', async () => {
    Graceful.exit(1);
  });
}

bootstrap();
