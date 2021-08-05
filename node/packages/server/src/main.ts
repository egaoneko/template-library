import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import Graceful from 'node-graceful';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

Graceful.captureExceptions = true;

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
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('docs', app, document);

  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>('http.port') ?? 8080;
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
