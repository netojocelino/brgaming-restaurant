require('dotenv-safe').config()

import express, { Request, Response } from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (_request: Request, response: Response) => response.json({ message: 'Hello World' }))

app.listen(port, () => console.log(`Listen port ${port}.`) );
