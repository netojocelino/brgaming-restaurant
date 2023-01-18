type ShortWeekDayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
type LongWeekDayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type WorkHour = [string, string]

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

export interface BusinessHourProps {
    name: string // ShortWeekDayName
    worksAt: WorkHour[]
}

export default class BusinessHour {
    private props: BusinessHourProps
    private readonly weekdayManager = new WeekDayNames()

    constructor (input: {
        dayOfWeek: string,
        worksAt: WorkHour[],
    }) {

        if (!this.weekdayManager.isValidShortName(input.dayOfWeek)) {
            throw new Error('`dayOfWeek` have a invalid format.')
        }

        input.worksAt.forEach((workAt: WorkHour) => {
            const [startHr, startMin] = (workAt[0]).split(':')
            const [endHr, endMin] = (workAt[1]).split(':')

            const startsAt = new Date()
            const endsAt = new Date()
            startsAt.setHours(+startHr, +startMin)
            endsAt.setHours(+endHr, +endMin)

            if(startsAt >= endsAt) {
                throw new Error('`worksAt` must be formated as [[`startAtHour`, `endAtHour`]], with moment startAt past than endAtHour.')
            }
        });

        this.props = {...input, name: this.weekdayManager.getByShortName(input.dayOfWeek) }
    }

    get name () {
        return this.props.name
    }

}
