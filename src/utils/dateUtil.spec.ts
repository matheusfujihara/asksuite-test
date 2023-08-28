import { DateUtil } from './dateUtil'
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('dateUtil test', () => {
    let app: TestingModule;

    beforeAll(async () => {
        process.env.TZ = 'UTC';
        
        app = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('normalizeDate function', () => {
        it('Date - 2023-08-26 - should be success', () => {
            const inputData = new Date('2023-08-26T00:00:00').getTime()
            const normalizeData = DateUtil.normalizeDate('2023-08-26')
            expect(normalizeData).toEqual(inputData)
        })
    })
})