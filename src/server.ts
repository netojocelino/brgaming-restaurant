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


        const weekdays = [ "mon", "tue", "wed", "thu", "fri", "sat", "sun" ]

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
