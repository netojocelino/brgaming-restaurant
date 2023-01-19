import { ShortWeekDayName, WorkHour } from "./BusinessHour"

export type RestaurantTypes = 'SnackBar' | 'IceCreamParlor'

const restaurantTypes = ['SnackBar', 'IceCreamParlor']
const isRestaurantType = (input: string): input is RestaurantTypes => restaurantTypes.includes(input)


type BusinessRepository = {
    day: ShortWeekDayName,
    hours: WorkHour[]
}

export interface RestaurantProps {
    name: string,
    document_id: string,
    type: RestaurantTypes
    // etc...
    businessHours: BusinessRepository[]

}

export  default class Restaurant {
    private props: RestaurantProps

    constructor (input: {
        name: string,
        document_id: string,
        type: string,
    }) {
        if (input.name.length === 0) {
            throw new Error('`name` cannot be empty.')
        }

        if (input.name.length > 255) {
            throw new Error('`name` size must be less or equal to 255.')
        }

        if (input.document_id.length === 0) {
            throw new Error('`document_id` cannot be empty.')
        }

        if (input.document_id.length > 20) {
            throw new Error('`document_id` size must be less or equal to 20.')
        }

        if (!isRestaurantType(input.type)) {
            throw new Error(`\`type\` must be one of then: ${restaurantTypes.join(', ')}`)
        }

        this.props = {
            name: input.name,
            type: input.type,
            document_id: input.document_id,
            businessHours: [
                { day: 'mon', hours: [] },
                { day: 'tue', hours: [] },
                { day: 'wed', hours: [] },
                { day: 'thu', hours: [] },
                { day: 'fri', hours: [] },
                { day: 'sat', hours: [] },
                { day: 'sun', hours: [] },
            ],
        }
    }

    addBusinessHour(input: { day: ShortWeekDayName, businessHour: WorkHour }) {
        const index = this.props.businessHours.findIndex(({ day }: { day: string }) => day === input.day)

        this.props.businessHours[index].hours.push(input.businessHour)
    }

    isOpenAt(day: string) {
        const hoursFromDay = this.props.businessHours
            .find((input: { day: string }) => input.day === day)

        return (hoursFromDay !== undefined) && hoursFromDay.hours.length > 0
    }

    get name () {
        return this.props.name
    }

    get documentId () {
        return this.props.document_id
    }

    get type () {
        return this.props.type
    }

    get businessHours () {
        return this.props.businessHours
    }
}
