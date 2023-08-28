import { ApiProperty } from "@nestjs/swagger";

export class SearchQuotationDto {
    @ApiProperty({ required: true, example: 'YYYY-MM-DD' })
    checkin: string;

    @ApiProperty({ required: true, example: 'YYYY-MM-DD' })
    checkout: string;
}
