require('dotenv-safe').config()

import express, { Request, Response } from 'express'
import swagger from 'swagger-ui-express'

import docs from '../docs/swagger.json'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/docs', swagger.serve, swagger.setup(docs))

app.get('/', (_request: Request, response: Response) => response.json({ message: 'Hello World' }))

app.listen(port, () => console.log(`Listen port ${port}.`) );
