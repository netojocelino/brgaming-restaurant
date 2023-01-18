import { expect, test } from "vitest"

// Entity
interface RestaurantProps {
    name: string,
    document_id: string,
    type: string
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
        this.props = input
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
