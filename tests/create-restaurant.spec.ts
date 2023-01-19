import { expect, test } from "vitest"

import Restaurant from '../src/entity/Restaurant'
import { WorkHour } from '../src/entity/BusinessHour'

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

test('Should create a new restaurant with business hours successfully', () => {
    const restaurant = {
        name: 'Papa\'s Snack',
        document_id: '1234778-88',
        type: 'SnackBar',
    }

    const day = 'mon'
    const businessHour: WorkHour = [
        '10:00',
        '11:00'
    ]

    const sut = new Restaurant(restaurant)
    sut.addBusinessHour({
        day,
        businessHour
    })

    const indexBusiness = sut.businessHours.findIndex((input: { day: string }) =>
        day === input.day
    )


    expect(sut).toBeInstanceOf(Restaurant)
    expect(sut.name).toEqual(restaurant.name)
    expect(sut.businessHours[indexBusiness].hours).contain(businessHour)
    expect(sut.type).toEqual(restaurant.type)
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
