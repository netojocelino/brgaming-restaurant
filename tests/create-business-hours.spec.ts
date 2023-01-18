import { expect, test } from "vitest";

import BusinessHour, { WorkHour } from "../src/entity/BusinessHour";

test('Should create one business hour successfully', async () => {
    const workAt: WorkHour = ['10:00', '18:00']
    const businessHour = {
        dayOfWeek: 'mon',
        worksAt: [workAt],
    }

    const sut = new BusinessHour(businessHour)

    expect(sut).toBeInstanceOf(BusinessHour)
    expect(sut.name).toEqual('monday')
})

test('Should fails when dayOfWeek is an invalid format', async () => {
    const workAt: WorkHour = ['10:00', '18:00']
    const businessHour = {
        dayOfWeek: 'seg',
        worksAt: [workAt],
    }

    expect(() => new BusinessHour(businessHour))
        .toThrowError('`dayOfWeek` have a invalid format.')
})

test('Should fails when hours was overlapping', async () => {
    const workAt: WorkHour = ['12:00', '11:00']
    const businessHour = {
        dayOfWeek: 'mon',
        worksAt: [workAt],
    }

    expect(() => new BusinessHour(businessHour))
        .toThrowError('`worksAt` must be formated as [[`startAtHour`, `endAtHour`]], with moment startAt past than endAtHour.')

})

test('Should fails when hours start and ends same moment', async () => {
    const workAt: WorkHour = ['12:00', '12:00']
    const businessHour = {
        dayOfWeek: 'mon',
        worksAt: [workAt],
    }

    expect(() => new BusinessHour(businessHour))
        .toThrowError('`worksAt` must be formated as [[`startAtHour`, `endAtHour`]], with moment startAt past than endAtHour.')
})
