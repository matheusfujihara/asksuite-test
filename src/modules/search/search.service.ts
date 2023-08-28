import puppeteer from 'puppeteer';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QuotationPageDto } from './dto/quotation-page.dto';
import { SearchQuotationDto } from './dto/search-quotation.dto';
import { DateUtil } from '../../utils/dateUtil';

@Injectable()
export class SearchService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) { }

  async crawlerQuotation({ checkin, checkout }: SearchQuotationDto): Promise<QuotationPageDto[]> {
    this.logger.verbose(`Crawler search start`)
    this.logger.verbose(`Check in date: ${checkin} and check out date: ${checkout}`)

    DateUtil.validateDate(checkin, checkout)

    const convertedCheckIn = DateUtil.convertDateToURLenconde(checkin)
    const convertedCheckOut = DateUtil.convertDateToURLenconde(checkout)

    const result = await this.scrappingPage({ checkin: convertedCheckIn, checkout: convertedCheckOut })

    this.logger.verbose(`${SearchService.name}.CrawlerQuotation process finish`)

    return result
  }

  async scrappingPage({ checkin, checkout }: SearchQuotationDto): Promise<QuotationPageDto[]> {
    this.logger.verbose(`Starting scrappingPage`)

    const { page, browser } = await this.browserBuild(checkin, checkout)

    try {
      this.logger.verbose(`Start Scrapping`)

      const info = await page.evaluate(async () => {
        const nodeList = document.querySelectorAll('#tblAcomodacoes .row-quarto')
        const quotationList: Array<QuotationPageDto> = []

        for (const item of nodeList) {
          const quotation: QuotationPageDto = {
            name: item.querySelector(`#tblAcomodacoes > tbody tr > td.tdQuarto > div > div.flex-table-row > span.quartoNome`)?.textContent,
            description: item.querySelector(`#tblAcomodacoes > tbody tr > td.tdQuarto > div > div.quartoContent > div > div > p`)?.textContent,
            price: item.querySelector(`#tblAcomodacoes > tbody tr > td.precoQuarto > div.relative > div.flex-price > span.valorFinal.valorFinalDiscounted`)?.textContent,
            image: item.querySelector(`.tdQuarto .flex-table .left-col .slider-min.slick-initialized.slick-slider .slick-list.draggable .slick-track .slick-slide.slick-current.slick-active .room--image`)?.getAttribute('data-src'),
          }
          
          quotationList.push(quotation)
        }

        return quotationList
      })

      if (!info.length)
        throw new NotFoundException(`Room unavaiable in period '${decodeURIComponent(checkin)}' to '${decodeURIComponent(checkout)}'`)

      this.logger.verbose(`Finishing scrappingPage`)

      return info
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new Error(`An error occurred: ${error?.message}`)
      }
    } finally {
      await browser.close()
    }
  }

  async browserBuild(checkin: string, checkout: string) {

    this.logger.verbose(`Creating puppeteer browser`)

    const URL = this.configService.get<string>('BASE_URL').replace('$CHECKIN', checkin).replace('$CHECKOUT', checkout)
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()

    await page.goto(URL, {
      waitUntil: 'networkidle2'
    })

    return { page, browser }
  }

}
