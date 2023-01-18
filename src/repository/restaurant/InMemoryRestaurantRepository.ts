import Restaurant from "../../entity/Restaurant"
import IRestaurantRepository from "../IRestaurantRepository"

export default class InMemoryRestaurantRepository implements IRestaurantRepository<Restaurant> {
    items: Restaurant[] = []

    async save (item: Restaurant) : Promise<Restaurant> {
        throw new Error('Not implemented yet')
    }

    async listAll(): Promise<Restaurant[]> {
        return this.items
    }
}
