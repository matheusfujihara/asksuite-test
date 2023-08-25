import { Logger, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SearchUseCase } from './usecases/search.useCase';

@Module({
  controllers: [SearchController],
  providers: [
    {
      provide: 'SEARCH_SERVICE',
      useClass: SearchService,
    },
    SearchUseCase,
    Logger
  ]
})
export class SearchModule {}
