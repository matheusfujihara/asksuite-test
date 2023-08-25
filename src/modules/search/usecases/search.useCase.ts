import { ConflictException, BadRequestException, Inject, Logger } from "@nestjs/common";
import { SearchQuotationDto } from "../dto/search-quotation.dto";
import { SearchService } from "../search.service";

export class SearchUseCase {
    constructor(
        @Inject('SEARCH_SERVICE')
        private readonly searchService: SearchService,
        private readonly logger: Logger
    ) { }
    async execute(data: SearchQuotationDto): Promise<any> {
        const { checkin, checkout } = data
        this.logger.verbose(`Crawler search start`)
        this.logger.verbose(`check in date: ${checkin} and check out date: ${checkout}`)
        try {
            this.validateDate(checkin, checkout)
            const convertedCheckIn = this.convertDateToURLenconde(checkin)
            const convertedCheckOut = this.convertDateToURLenconde(checkout)
            return await this.searchService.findQuotation({ checkin: convertedCheckIn, checkout: convertedCheckOut })
        } catch (error) {
            this.logger.error(error)
        }
    }

    normalizeDate(date: string): Date {
        const normalizedDate = new Date(date)
        if (isNaN(normalizedDate.getTime())) {
            throw new ConflictException(`Invalid Date: ${date} on body`)
        }
        normalizedDate.setHours(0, 0, 0, 0)
        return normalizedDate
    }

    validateDate(checkin: string, checkout: string): void {
        const normalizedCheckIn = this.normalizeDate(checkin)
        const normalizedCheckOut = this.normalizeDate(checkout)
        if (normalizedCheckIn >= normalizedCheckOut) {
            throw new BadRequestException(`The checkout date: ${checkout} is greather than or equal checkin date: ${checkin}`)
        }
    }

    convertDateToURLenconde(data: string) {
        const date = this.normalizeDate(data)
            .toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })
        return encodeURIComponent(date)
    }
}