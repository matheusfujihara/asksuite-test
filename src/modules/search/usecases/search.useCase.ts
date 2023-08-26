import { ConflictException, BadRequestException, Inject, Logger } from "@nestjs/common";
import { SearchQuotationDto } from "../dto/search-quotation.dto";
import { SearchService } from "../search.service";

export class SearchUseCase {
    constructor(
        @Inject('SEARCH_SERVICE')
        private readonly searchService: SearchService,
        private readonly logger: Logger
    ) {}

    async execute({ checkin, checkout }: SearchQuotationDto): Promise<any> {
        this.logger.verbose(`Crawler search start`)
        this.logger.verbose(`check in date: ${checkin} and check out date: ${checkout}`)

        this.validateDate(checkin, checkout)

        const convertedCheckIn = this.convertDateToURLenconde(checkin)
        const convertedCheckOut = this.convertDateToURLenconde(checkout)

        return await this.searchService.scrappingPage({ checkin: convertedCheckIn, checkout: convertedCheckOut })
    }

    private normalizeDate(date: string): Date {
        const normalizedDate = new Date(date)

        if (isNaN(normalizedDate.getTime())) {
            throw new ConflictException(`Invalid Date: ${date} on body`)
        }

        normalizedDate.setHours(0, 0, 0, 0)

        return normalizedDate
    }

    private validateDate(checkin: string, checkout: string): void {
        const normalizedCheckIn = this.normalizeDate(checkin)
        const normalizedCheckOut = this.normalizeDate(checkout)

        if (normalizedCheckIn >= normalizedCheckOut) {
            throw new BadRequestException(`The checkout date: ${checkout} is greather than or equal checkin date: ${checkin}`)
        }
    }

    private convertDateToURLenconde(data: string) {
        const date = this.normalizeDate(data)
            .toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })

        return encodeURIComponent(date)
    }
}