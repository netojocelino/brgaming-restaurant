import { expect, test } from "vitest"

// Entity
type RestaurantTypes = 'SnackBar' | 'IceCreamParlor'

const restaurantTypes = ['SnackBar', 'IceCreamParlor']
const isRestaurantType = (input: string): input is RestaurantTypes => restaurantTypes.includes(input)

interface RestaurantProps {
    name: string,
    document_id: string,
    type: RestaurantTypes
    // etc...
}

class Restaurant {
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

test('Should create a new restaurant successfully', () => {
    const restaurant = {
        name: 'Papa\'s Jocelino Restaurant',
        // @TODO: Ask about it, format and validations
        document_id: '1234778-88',
        // @TODO: Ask about it, format and validations
        type: 'SnackBar', // 'IceCreamParlor'
        // etc...
    }

    const sut = new Restaurant(restaurant)

    expect(sut).toBeInstanceOf(Restaurant)
    expect(restaurant.name).toEqual(sut.name)
    expect(restaurant.document_id).toEqual(sut.documentId)
    expect(restaurant.type).toEqual(sut.type)
})

test('Must fails at create a new restaurant when name is empty', () => {
    const restaurant = {
        name: '',
        // @TODO: Ask about it, format and validations
        document_id: '1234778-88',
        // @TODO: Ask about it, format and validations
        type: 'SnackBar', // 'IceCreamParlor'
        // etc...
    }

    expect(() => new Restaurant(restaurant)).toThrowError()
})

test('Must fails at create a new restaurant when name size is greather than 255', () => {
    const name = (new Array(256).fill('a', 0, 256)).join('')
    const restaurant = {
        name,
        // @TODO: Ask about it, format and validations
        document_id: '1234778-88',
        // @TODO: Ask about it, format and validations
        type: 'SnackBar', // 'IceCreamParlor'
        // etc...
    }

    expect(() => new Restaurant(restaurant)).toThrowError('`name` size must be less or equal to 255.')
})

test('Must fails at create a new restaurant when document_id is empty', () => {
    const restaurant = {
        name: 'Papa\'s Jocelino Restaurant',
        // @TODO: Ask about it, format and validations
        document_id: '',
        // @TODO: Ask about it, format and validations
        type: 'SnackBar', // 'IceCreamParlor'
        // etc...
    }

    expect(() => new Restaurant(restaurant)).toThrowError()
})

test('Must fails at create a new restaurant when document_id size is greather than 20', () => {
    const document_id = (new Array(21).fill('a')).join('')
    const restaurant = {
        name: 'Papa\'s Jocelino Restaurant',
        document_id,
        // @TODO: Ask about it, format and validations
        type: 'SnackBar', // 'IceCreamParlor'
        // etc...
    }

    expect(() => new Restaurant(restaurant))
        .toThrowError('`document_id` size must be less or equal to 20.')
})

test('Must fails at create a new restaurant when type is invalid', () => {
    const restaurant = {
        name: 'Papa\'s Jocelino Restaurant',
        // @TODO: Ask about it, format and validations
        document_id: '1234778-88',
        // @TODO: Ask about it, format and validations
        type: 'Snack Bar', // 'IceCreamParlor'
        // etc...
    }

    expect(() => new Restaurant(restaurant))
        .toThrowError('`type` must be one of then: SnackBar, IceCreamParlor')
})
