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
