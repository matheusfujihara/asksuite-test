import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { SearchQuotationDto } from './dto/search-quotation.dto';
import { SearchUseCase } from './usecases/search.useCase';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchUseCase: SearchUseCase
  ) { }

  @Post()
  @HttpCode(200)
  async create(@Body() searchQuotationDto: SearchQuotationDto) {
    return await this.searchUseCase.execute(searchQuotationDto);
  }

  @Get()
  async find(@Body() searchQuotationDto: SearchQuotationDto) {
    return 'find success'
  }
}
