import { expect, test } from "vitest";

type ShortWeekDayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
type LongWeekDayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

class WeekDayNames {
    private props: Record<ShortWeekDayName, LongWeekDayName> = {
        'mon': 'monday',
        'tue': 'tuesday',
        'wed': 'wednesday',
        'thu': 'thursday',
        'fri': 'friday',
        'sat': 'saturday',
        'sun': 'sunday',
    }

    public getByShortName (shortName: ShortWeekDayName) {
        return this.props[shortName]
    }

    public isValidShortName (name: string) : name is ShortWeekDayName {
        return Object.getOwnPropertyNames(this.props).includes(name)
    }
}

interface BusinessHourProps {
    name: string // ShortWeekDayName
    startTime: string
    endTime: string
}

class BusinessHour {
    private props: BusinessHourProps
    private readonly weekdayManager = new WeekDayNames()

    constructor (input: {
        dayOfWeek: string,
        startTime: string,
        endTime: string,
    }) {

        if (!this.weekdayManager.isValidShortName(input.dayOfWeek)) {
            throw new Error('`dayOfWeek` have a invalid format.')
        }

        this.props = {...input, name: this.weekdayManager.getByShortName(input.dayOfWeek) }
    }

    get name () {
        return this.props.name
    }

    get startAt () {
        return this.props.startTime
    }

    get endsAt () {
        return this.props.endTime
    }
}


test('Should create one business hour successfully', async () => {
    const businessHour = {
        dayOfWeek: 'mon',
        startTime: '10:00',
        endTime: '18:00',
    }

    const sut = new BusinessHour(businessHour)

    expect(sut).toBeInstanceOf(BusinessHour)
    expect(sut.name).toEqual('monday')
    expect(sut.startAt).toEqual('10:00')
    expect(sut.endsAt).toEqual('18:00')
})

test('Should fails when dayOfWeek is an invalid format', async () => {
    const businessHour = {
        dayOfWeek: 'seg',
        startTime: '10:00',
        endTime: '18:00',
    }

    expect(() => new BusinessHour(businessHour))
        .toThrowError('`dayOfWeek` have a invalid format.')
})
