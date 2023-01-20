require('dotenv-safe').config()

import express, { Request, Response } from 'express'
import swagger from 'swagger-ui-express'

import NotFoundException from './errors/NotFoundException'

import { weekdays } from './constants'

import CreateRestaurant from './routes/create-restaurant.router'
import CheckIsOpen from './routes/check-restaurant-is-open'

import docs from '../docs/swagger.json'
import prisma from './prisma'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/docs', swagger.serve, swagger.setup(docs))

app.get('/', (_request: Request, response: Response) => response.json({ message: 'Hello World' }))

const RestaurantsDB: any[] = []
const BusinesshourDB: any = {}


app.get('/v1/restaurants', async (_req: Request, response: Response) => {
    const restaurants = await prisma.restaurant.findMany({
        include: {
            BusinessHours: true,
        }
    })

    return response
        .json(restaurants)
})

app.post('/v1/restaurant', CreateRestaurant)

app.get('/v1/restaurant/:restaurant_id/isOpen', CheckIsOpen)

app.post('/v1/businesshour/:restaurant_id', async (request: Request, response: Response) => {
    type ErrorStatus = 'RESTAURANT_NOT_FOUND' | 'INVALID_WEEK_DAY' | 'INVALID_TIME'
    const error: ErrorStatus[]  = []

    try {
        const restaurant_id: string = request.params.restaurant_id
        const data = request.body

        const restaurant = await prisma.restaurant.findFirst({
            where: { id: restaurant_id }
        })

        if (restaurant == null) {
            error.push('RESTAURANT_NOT_FOUND')
        }

        if (data.weekDay === undefined || !weekdays.includes(data.weekDay)) {
            error.push('INVALID_WEEK_DAY')
        }

        if (
                data.businessHours === undefined ||
                !Array.isArray(data.businessHours) ||
                data.businessHours.length < 1 ||
                data.businessHours.filter( (bh: any) => (typeof bh !== 'object') || Object.keys(bh).length != 2 ).length > 0
        ) {
            error.push('INVALID_TIME')
        }

        if(error.length > 0) {
            throw new Error('invalid input data')
        }

        await prisma.businessHour.deleteMany({
            where: {
                restaurant_id,
                weekDay: data.weekDay
            }
        })

        const toCreate = data.businessHours
            .map((business: {startTime: string, endTime: string}) => {
                return {
                    startTime: business.startTime,
                    endTime: business.endTime,
                    weekDay: data.weekDay,
                    restaurant_id,
                }
            })

        await prisma.businessHour.createMany({
            data: toCreate
        })

        const output = {
            restaurant_id,
            weekDay: data.weekDay,
            businessHours: data.businessHours
          }

        return response
            .status(201)
            .json(output)

    } catch (e) {
        console.error(error)

        if (e instanceof NotFoundException) {
            return response
                .status(404)
                .json({ error: [error] })
        }


        return response
            .status(400)
            .json({ error })

    }
})

app.listen(port, () => console.log(`Listen port ${port}.`) );
