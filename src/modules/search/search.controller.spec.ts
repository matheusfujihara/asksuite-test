import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchQuotationDto } from './dto/search-quotation.dto';
import { QuotationPageDto } from './dto/quotation-page.dto';
import { ConflictException, Logger } from '@nestjs/common';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [{
        provide: 'SEARCH_SERVICE',
        useClass: SearchService
      }, Logger],
    }).compile();

    searchService = module.get<SearchService>('SEARCH_SERVICE');
    controller = module.get<SearchController>(SearchController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Search.controller', () => {
    it('shoudl call searchService.crawlerQuotation and return data', async () => {
      const searchQuotationDto: SearchQuotationDto = {
        checkin: '2023-09-01',
        checkout: '2023-09-05'
      }

      const searchQuotationMock: QuotationPageDto[] = [
        {
          name: 'Name hotel',
          description: 'Hotel description',
          price: 'R$ 10.000',
          image: 'http://imagetest.com/image'
        },
      ]

      jest.spyOn(searchService, 'crawlerQuotation').mockImplementationOnce(async () => searchQuotationMock)

      const result = await controller.crawlerSearch(searchQuotationDto)

      await expect(result).toEqual(searchQuotationMock)
    })


  })
});
