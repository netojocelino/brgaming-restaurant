import { expect, test } from "vitest";

type ShortWeekDayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
type LongWeekDayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'


interface BusinessHourProps {
    id: number
    name: string // ShortWeekDayName
    startTime: string
    endTime: string
}

class BusinessHour {
    private props: BusinessHourProps

    constructor (input: {
        dayOfWeek: string,
        startTime: string,
        endTime: string,
    }) {
        this.props = {...input, name: input.dayOfWeek, id: -1 }
    }

    get name () {
        const weekDayName: Record<string, string> = {
            'mon': 'monday',
            'tue': 'tuesday',
            'wed': 'wednesday',
            'thu': 'thursday',
            'fri': 'friday',
            'sat': 'saturday',
            'sun': 'sunday',

        }
        return weekDayName[this.props.name]
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
