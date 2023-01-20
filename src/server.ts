require('dotenv-safe').config()

import express, { Request, Response } from 'express'
import swagger from 'swagger-ui-express'
import { v4 as uuid_v4  } from 'uuid'

import NotFoundException from './errors/NotFoundException'

import { weekdays, supported_types } from './constants'
import { buildDate, isDateFormat, isFilledString, isTimeFormat, splitStrToNum } from './utils'

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

app.post('/v1/restaurant', async (request: Request, response: Response) => {
    const error = []

    try {
        const data = request.body

        if (!isFilledString(data.name)) {
            error.push('NAME_REQUIRED')
        }
        if (!isFilledString(data.document_id) ) {
            error.push('DOCUMENT_ID_REQUIRED')
        }
        if (!isFilledString(data.type) || !supported_types.includes(data.type) ) {
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
        }
        const rest = await prisma.restaurant.create({ data: Restaurant })

        return response
            .status(201)
            .json(rest)
    } catch (e) {
        console.error(e)
        return response
            .status(400)
            .json({ error })
    }
})

app.get('/v1/restaurant/:restaurant_id/isOpen', async (request: Request, response: Response) => {

    try {
        let finds = false
        const restaurant_id = request.params.restaurant_id

        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: restaurant_id
            }
        })

        if (restaurant == null) {
            throw new NotFoundException(`Restaurant with id ${restaurant_id} not found`)
        }

        if (
                !isFilledString(request.query.date) ||
                !isDateFormat(request.query.date)
        ) {
            throw new Error('INVALID_DATE')
        }
        if (
                !isFilledString(request.query.time) ||
                !isTimeFormat(request.query.time)
        ) {
            throw new Error('INVALID_TIME')
        }

        const date = splitStrToNum(request.query.date, '-')
        const time = splitStrToNum(request.query.time, ':')

        const findDate = buildDate(date, time, 0)

        const shortName = weekdays[findDate.getDay()]
        const hours = await prisma.businessHour.findMany({
            where: {
                restaurant_id: restaurant_id,
                weekDay: shortName,
            }
        })

        if (hours !== null && hours.length > 0) {
            finds = hours
                .filter((hr: any) => {
                    const tA = splitStrToNum(hr.startTime,':')
                    const tB = splitStrToNum(hr.endTime, ':')
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
        if (er instanceof NotFoundException) {
            return response
                .status(404)
                .send(false)
        }
        return response
            .status(400)
            .send(er)
    }
})

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
