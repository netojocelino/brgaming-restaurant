export type RestaurantTypes = 'SnackBar' | 'IceCreamParlor'

const restaurantTypes = ['SnackBar', 'IceCreamParlor']
const isRestaurantType = (input: string): input is RestaurantTypes => restaurantTypes.includes(input)

export interface RestaurantProps {
    name: string,
    document_id: string,
    type: RestaurantTypes
    // etc...
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
        }
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
}
