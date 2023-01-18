export default interface IRestaurantRepository<T> {
    save(item: T): Promise<T>
    listAll(): Promise<T[]>
}
