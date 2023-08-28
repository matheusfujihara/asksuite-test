import { Controller, Post, Body, HttpCode, Inject, Logger } from '@nestjs/common';
import { SearchQuotationDto } from './dto/search-quotation.dto';
import { SearchService } from './search.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    @Inject('SEARCH_SERVICE')
    private readonly searchService: SearchService,
    private readonly logger: Logger
  ) { }

  @ApiOperation({ summary: 'Returns Crawler Search by period' })
  @ApiBody({ type: SearchQuotationDto })
  @ApiResponse({ status: 201, description: 'Success' })
  @Post()
  @HttpCode(200)
  async crawlerSearch(@Body() searchQuotationDto: SearchQuotationDto) {
    this.logger.verbose(`Starting crawlerSearch on ${SearchController.name}`)
    
    const result = await this.searchService.crawlerQuotation(searchQuotationDto)
    
    return result
  }
}
