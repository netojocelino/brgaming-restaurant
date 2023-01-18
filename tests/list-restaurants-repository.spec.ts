import { expect, test } from "vitest";

import Restaurant from "../src/entity/Restaurant";

interface IRestaurantRepository<T> {
    save(item: T): Promise<T>
    listAll(): Promise<T[]>
}


class RestaurantRepository implements IRestaurantRepository<Restaurant> {
    items: Restaurant[] = []

    async save (item: Restaurant) : Promise<Restaurant> {
        throw new Error('Not implemented yet')
    }

    async listAll(): Promise<Restaurant[]> {
        return this.items
    }
}

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
