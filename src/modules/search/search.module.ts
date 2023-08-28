import { Logger, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  providers: [
    {
      provide: 'SEARCH_SERVICE',
      useClass: SearchService,
    },
    Logger
  ]
})
export class SearchModule {}
