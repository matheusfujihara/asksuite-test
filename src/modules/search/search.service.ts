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

  async crawlerQuotation({ checkin, checkout }: SearchQuotationDto): Promise<any> {
    this.logger.verbose(`Crawler search start`)
    this.logger.verbose(`Check in date: ${checkin} and check out date: ${checkout}`)

    DateUtil.validateDate(checkin, checkout)

    const convertedCheckIn = DateUtil.convertDateToURLenconde(checkin)
    const convertedCheckOut = DateUtil.convertDateToURLenconde(checkout)

    return await this.scrappingPage({ checkin: convertedCheckIn, checkout: convertedCheckOut })
  }

  async scrappingPage({ checkin, checkout }: SearchQuotationDto): Promise<QuotationPageDto[]> {

    this.logger.verbose(`Starting scrappingPage`)

    const { page, browser } = await this.browserBuild(checkin, checkout)

    try {
      const info = await page.evaluate(async () => {

        const node = document.querySelectorAll('#tblAcomodacoes .row-quarto')
        const quotationList: Array<QuotationPageDto> = []

        for (const item of node) {
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
        throw new NotFoundException(`Room unavaiable on the period '${decodeURIComponent(checkin)}' of '${decodeURIComponent(checkout)}'`)

      this.logger.verbose(`Finishing scrappingPage`)

      return info
    } catch (error) {
      throw new Error(error)
    } finally {
      await browser.close()
    }
  }

  async browserBuild(checkin: string, checkout: string) {
    const URL = this.configService.get<string>('BASE_URL').replace('$CHECKIN', checkin).replace('$CHECKOUT', checkout)

    const browser = await puppeteer.launch({
      headless: false
    })
    const page = await browser.newPage()

    await page.goto(URL, {
      waitUntil: 'networkidle2'
    })
    return { page, browser }
  }

}
