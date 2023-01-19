require('dotenv-safe').config()

import express, { Request, Response } from 'express'
import swagger from 'swagger-ui-express'
import { v4 as uuid_v4  } from 'uuid'

import NotFoundException from './errors/NotFoundException'

import docs from '../docs/swagger.json'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/docs', swagger.serve, swagger.setup(docs))

app.get('/', (_request: Request, response: Response) => response.json({ message: 'Hello World' }))

const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat" ]
const RestaurantsDB: any[] = []
const BusinesshourDB: any = {}

app.post('/v1/restaurant', (request: Request, response: Response) => {
    const error = []
    const supported_types = [
        'iceCreamParlor', 'restaurant', 'snackBar'
    ]

    try {
        const data = request.body

        if (data.name === undefined || data.name.length < 1 ) {
            error.push('NAME_REQUIRED')
        }
        if (data.document_id === undefined || data.document_id.length < 1 ) {
            error.push('DOCUMENT_ID_REQUIRED')
        }
        if (data.type === undefined || data.type.length < 1 || !supported_types.includes(data.type) ) {
            error.push('TYPE_REQUIRED')
        }
        if (error.length > 0) {
            throw new Error('Invalid input')
        }

        const id = uuid_v4()


        const Restaurant = {
            id,
            name: request.body.name,
            document_id: request.body.document_id,
            type: request.body.type,
            created_at: new Date(),
        }

        RestaurantsDB.push(Restaurant)
        return response
            .status(201)
            .json(Restaurant)
    } catch (e) {
        console.error(e)
        return response
            .status(400)
            .json({ error })
    }
})


const buildDate = (date: number[], time: number[], seconds?: number) => {
    const newDate = new Date()
    newDate.setUTCFullYear(date[0], date[1] - 1, date[2])
    newDate.setUTCHours(time[0], time[1], seconds)

    return newDate
}

app.get('/v1/restaurant/:restaurant_id/isOpen', (request: Request, response: Response) => {

    try {
        let finds = false
        const restaurant_id = request.params.restaurant_id

        const restaurantIndex = RestaurantsDB.findIndex(
            (res) => res.id === restaurant_id)

        if (restaurantIndex == -1 || BusinesshourDB[restaurant_id] === undefined) {
            throw new NotFoundException(`Restaurant with id ${restaurant_id} not found`)
        }

        if (
                request.query.date === undefined ||
                typeof request.query.date !== 'string' ||
                !(new RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)).test(request.query.date)
        ) {
            throw new Error('INVALID_DATE')
        }
        if (
                request.query.time === undefined ||
                typeof request.query.time !== 'string' ||
                !(new RegExp(/[0-9]{2}:[0-9]{2}/)).test(request.query.time)
        ) {
            throw new Error('INVALID_TIME')
        }

        const date = request.query.date.split('-').map((v) => +v)
        const time = request.query.time.split(':').map((v) => +v)

        const findDate = buildDate(date, time, 0)

        const shortName = weekdays[findDate.getDay()]
        const hours = BusinesshourDB[restaurant_id][shortName]

        if (hours !== undefined) {
            finds = hours
                .filter((hr: any) => {
                    const tA = hr.startTime.split(':').map((v: any) => +v)
                    const tB = hr.endTime.split(':').map((v: any) => +v)
                    const startTime = buildDate(date, tA, 0)
                    const endTime = buildDate(date, tB, 59)

                    return (+startTime) <= (+findDate)
                            && (+endTime) >= (+findDate)
                })
                .length > 0
        }

        return response
            .status(200)
            .send(finds)
    } catch (er) {
        return response
            .status(400)
            .send(false)
    }
})

app.post('/v1/businesshour/:restaurant_id', (request: Request, response: Response) => {
    const error = []

    try {
        const restaurant_id: string = request.params.restaurant_id
        const data = request.body
        const restaurantIndex = RestaurantsDB.findIndex(
            (res) => res.id === restaurant_id)

        if (restaurantIndex == -1) {
            throw new NotFoundException(`Restaurant with id ${restaurant_id} not found`)
        }


        if (data.weekDay === undefined || !weekdays.includes(data.weekDay)) {
            error.push('INVALID_TIME')
        }

        if (
                data.businessHours === undefined ||
                !Array.isArray(data.businessHours) ||
                data.businessHours.length < 1 ||
                data.businessHours.filter( (bh: any) => !Array.isArray(bh) || bh.length !== 2 ).length > 0
        ) {
            error.push('INVALID_TIME')
        }

        if (BusinesshourDB[restaurant_id] === undefined) {
            BusinesshourDB[restaurant_id] = {}
        }
        if (BusinesshourDB[restaurant_id][data.weekDay] === undefined) {
            BusinesshourDB[restaurant_id][data.weekDay] = []
        }

        BusinesshourDB[restaurant_id][data.weekDay] = data.businessHours

        const output = {
            restaurant_id,
            weekDay: data.weekDay,
            businessHours: data.businessHours
          }

        return response
            .status(201)
            .json({output, BusinesshourDB})

    } catch (e) {
        console.error(error)

        if (e instanceof NotFoundException) {
            return response
                .status(404)
                .json({ error: e.message })
        }


        return response
            .status(400)
            .json({ error })

    }
})

app.listen(port, () => console.log(`Listen port ${port}.`) );
