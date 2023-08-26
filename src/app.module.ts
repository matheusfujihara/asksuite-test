import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './modules/search/search.module';
import { CrawlerModule } from './modules/crawler/crawler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchModule,
    CrawlerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
