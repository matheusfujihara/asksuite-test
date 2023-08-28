import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { QuotationPageDto } from './dto/quotation-page.dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateUtil } from '../../utils/dateUtil';
import { rejects } from 'assert';

describe('SearchService', () => {
  let searchService: SearchService;
  let logger: Logger;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, Logger, ConfigService],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
    logger = module.get<Logger>(Logger);
    configService = module.get<ConfigService>(ConfigService);
    process.env.BASE_URL = 'https://pratagy.letsbook.com.br/D/Reserva?checkin=$CHECKIN&checkout=$CHECKOUT&cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=&mesCalendario=6%2F14%2F2022'
  });

  it('should be defined', () => {
    expect(SearchService).toBeDefined();
  });

  describe('crawlerQuotation', () => {
    it('should return array data from hotel website', async () => {
      const checkin = '2023-09-03'
      const checkout = '2023-09-07'
      const createScrappingPage: QuotationPageDto[] = [
        {
          "name": "Padrão",
          "description": "Descrição padrão",
          "price": "R$ 50,00",
          "image": "https://imagetest.com/imagePadrao.jpg"
        },
        {
          "name": "Padrao suite",
          "description": "Descrição padrão suite",
          "price": "R$ 100,00",
          "image": "https://imagemtest.com/imageSuitePadrao.jpg"
        },
      ]

      jest.spyOn(searchService, 'scrappingPage').mockImplementationOnce(async () => createScrappingPage)

      const result = await searchService.crawlerQuotation({ checkin, checkout })
      expect(result).toEqual(createScrappingPage)
    })

    it('should return NotFound when does not have hotel', async () => {
      const checkin = '2022-09-03'
      const checkout = '2022-09-07'

      jest.spyOn(searchService, 'scrappingPage').mockReturnValue(new Promise((resolve, reject) => reject(new NotFoundException())))

      const error = searchService.crawlerQuotation({ checkin, checkout })

      await expect(error).rejects.toBeInstanceOf(NotFoundException)
      await expect(error).rejects.toThrow(NotFoundException)
    })
  })

});
