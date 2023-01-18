import { expect, test } from "vitest";

import Restaurant from "../src/entity/Restaurant";
import RestaurantRepository from "../src/repository/restaurant/InMemoryRestaurantRepository";

test('Should list empty array when not exists restaurant saved', async () => {
    const repository = new RestaurantRepository()

    const sut = await repository.listAll()

    expect(sut.length).toBe(0)
    expect(sut).instanceOf(Array)
})

test('Should list one restaurant when exists on item ', async () => {
    const repository = new RestaurantRepository()
    const restaurant = {
        name: 'Papa\'s Jocelino Restaurant',
        document_id: '1234778-88',
        type: 'SnackBar',
    }

    repository.items.push(new Restaurant(restaurant))

    const sut = await repository.listAll()

    expect(sut.length).toBe(1)
    expect(sut).instanceOf(Array)
})

test('Should list two restaurant rows when exists on item and ensure structure', async () => {
    const repository = new RestaurantRepository()
    const restaurantOne = {
        name: 'Papa\'s Jocelino Restaurant',
        document_id: '1234778-88',
        type: 'SnackBar',
    }
    const restaurantTwo = {
        name: 'iceman',
        document_id: '1234778-88',
        type: 'IceCreamParlor',
    }

    repository.items.push(new Restaurant(restaurantOne))
    repository.items.push(new Restaurant(restaurantTwo))

    const sut = await repository.listAll()

    expect(sut).toHaveLength(2)
    expect(sut).instanceOf(Array)
    expect(sut[0]).instanceOf(Restaurant)
    expect(sut[0]).toHaveProperty('name')
    expect(sut[0]).toHaveProperty('documentId')
    expect(sut[0]).toHaveProperty('type')
    expect(sut[1]).instanceOf(Restaurant)
    expect(sut[1]).toHaveProperty('name')
    expect(sut[1]).toHaveProperty('documentId')
    expect(sut[1]).toHaveProperty('type')
})
