require('dotenv').config()

import express, { Request, Response } from 'express'
import cors from 'cors'
import swagger from 'swagger-ui-express'

import CreateRestaurant from './routes/create-restaurant.router'
import CheckIsOpen from './routes/check-restaurant-is-open.router'
import CreateBusinessHour from './routes/create-business-hours.router'

import docs from '../docs/swagger.json'
import prisma from './prisma'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/docs', swagger.serve, swagger.setup(docs))

app.get('/', (_request: Request, response: Response) => response.json({ message: 'Hello World' }))

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

app.post('/v1/businesshour/:restaurant_id', CreateBusinessHour)


export default app
