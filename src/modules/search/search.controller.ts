import { Controller, Post, Body, HttpCode, Inject } from '@nestjs/common';
import { SearchQuotationDto } from './dto/search-quotation.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    @Inject('SEARCH_SERVICE')
    private readonly searchService: SearchService
  ) { }

  @Post()
  @HttpCode(200)
  async create(@Body() searchQuotationDto: SearchQuotationDto) {
    return await this.searchService.crawlerQuotation(searchQuotationDto);
  }
}
