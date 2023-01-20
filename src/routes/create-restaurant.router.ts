import { Request, Response } from 'express'
import { v4 as uuid_v4  } from 'uuid'

import { isFilledString } from '../utils'
import { supported_types } from '../constants'
import prisma from '../prisma'


export default async function (request: Request, response: Response) {

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
}
