import { expect, test } from "vitest";

import Restaurant from "./entity/Restaurant";

interface IRestaurantRepository<T> {
    save(item: T): Promise<T>
    listAll(): Promise<T[]>
}


class RestaurantRepository implements IRestaurantRepository<Restaurant> {
    private items: Restaurant[] = []

    async save (item: Restaurant) : Promise<Restaurant> {
        throw new Error('Not implemented yet')
    }

    async listAll(): Promise<Restaurant[]> {
        return []
    }
}

test('Should list empty array when not exists restaurant saved', async () => {
    const repository = new RestaurantRepository()

    const sut = await repository.listAll()

    expect(sut.length).toBe(0)
    expect(sut).instanceOf(Array)
})
