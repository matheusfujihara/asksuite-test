import { BadRequestException, ConflictException } from "@nestjs/common"

export class DateUtil {
    public static normalizeDate(date: string): Date {
        const normalizedDate = new Date(date)

        if (isNaN(normalizedDate.getTime())) {
            throw new ConflictException(`Invalid Date: ${date} on body`)
        }

        normalizedDate.setHours(0, 0, 0, 0)

        return normalizedDate
    }

    public static validateDate(checkin: string, checkout: string): void {
        const normalizedCheckIn = this.normalizeDate(checkin)
        const normalizedCheckOut = this.normalizeDate(checkout)

        if (normalizedCheckIn >= normalizedCheckOut) {
            throw new BadRequestException(`The checkout date: ${checkout} is greather than or equal checkin date: ${checkin}`)
        }
    }

    public static convertDateToURLenconde(data: string) {
        const date = this.normalizeDate(data)
            .toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })

        return encodeURIComponent(date)
    }
}