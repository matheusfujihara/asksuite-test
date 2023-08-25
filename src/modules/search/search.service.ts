import { Injectable, Logger } from '@nestjs/common';
import { SearchQuotationDto } from './dto/search-quotation.dto';
import puppeteer from 'puppeteer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) { }
  async findQuotation(data: SearchQuotationDto) {
    const { checkin, checkout } = data
    const URL = this.configService.get<string>('BASE_URL').replace('$CHECKIN', checkin).replace('$CHECKOUT', checkout)
    this.logger.verbose(`checkinURL: ${checkin} checkoutURL: ${checkout}`)

    const browser = await puppeteer.launch({
      headless: false
    })

    const page = await browser.newPage()
    await page.goto(URL, {
      waitUntil: 'networkidle2'
    })

    const info = await page.evaluate(() => {
      const nodeList = document.querySelectorAll(
        '#tblAcomodacoes > tbody tr.row-quarto',
      );
    })

    return;
  }
}
