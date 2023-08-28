import { DateUtil } from './dateUtil'
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('dateUtil test', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('normalizeDate function', () => {
        it('Date - 2023-08-26 - should be success', () => {
            const inputData = new Date('2023-08-26')

            jest.spyOn(DateUtil, 'normalizeDate').mockImplementationOnce(() => new Date('2023-08-26'))

            const normalizeData = DateUtil.normalizeDate('2023-08-26')
            expect(normalizeData).toEqual(inputData)
        })

        it('Date - 2023-08-26 - should return error', () => {

            jest.spyOn(DateUtil, 'normalizeDate').mockImplementationOnce(() => new Date('a'))

            const normalizeData = DateUtil.normalizeDate('a')
            expect(
                isNaN(normalizeData.getTime())
            ).toBe(true)
        })
    })

    describe('validateDate function', () => {
        it('should return void', async () => {
            const checkin = '2023-09-01'
            const checkout = '2023-09-05'
            const mock = jest.fn()

            jest.spyOn(DateUtil, 'validateDate').mockImplementation(mock)

            DateUtil.validateDate(checkin, checkout)

            await expect(mock).toHaveBeenCalledWith(
                checkin,
                checkout
            )
        })

    })

    describe('convertDateToURLenconde function', () => {
        it('Date - 2023-09-01 - should return date converted', async () => {
            const checkin = '2023-09-01'
            await expect(DateUtil.convertDateToURLenconde(checkin)).toEqual('31%2F08%2F2023')
        })
    })
})