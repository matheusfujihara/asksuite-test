import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import env from './config/env'

async function bootstrap() {
  process.env.TZ = 'UTC';
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Crawler API')
    .setDescription('API to scrapping a hotel websites')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/api', app, document);

  await app.listen(env.port);

  const { address } = app.getHttpServer().address();

  console.log(`Application running on ${address}:${env.port}`);
  console.log(`Swagger running on ${address}:${env.port}/swagger/api`);

}
bootstrap();
