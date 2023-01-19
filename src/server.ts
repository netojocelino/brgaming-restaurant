require('dotenv-safe').config()

import express, { Request, Response } from 'express'
import swagger from 'swagger-ui-express'
import { v4 as uuid_v4  } from 'uuid'

import docs from '../docs/swagger.json'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/docs', swagger.serve, swagger.setup(docs))

app.get('/', (_request: Request, response: Response) => response.json({ message: 'Hello World' }))

app.post('/v1/restaurant', (request: Request, response: Response) => {
    const errors = []
    const supported_types = [
        'iceCreamParlor', 'restaurant', 'snackBar'
    ]

    try {
        const data = request.body

        if (data.name === undefined || data.name.length < 1 ) {
            errors.push('NAME_REQUIRED')
        }
        if (data.document_id === undefined || data.document_id.length < 1 ) {
            errors.push('DOCUMENT_ID_REQUIRED')
        }
        if (data.type === undefined || data.type.length < 1 || !supported_types.includes(data.type) ) {
            errors.push('TYPE_REQUIRED')
        }
        if (errors.length > 0) {
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

        return response
            .status(201)
            .json(Restaurant)
    } catch (error) {
        console.error(error)
        return response
            .status(400)
            .json({ errors })
    }
})

app.listen(port, () => console.log(`Listen port ${port}.`) );
