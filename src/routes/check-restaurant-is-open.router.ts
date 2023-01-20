import { Request, Response } from "express";

import NotFoundException from "../errors/NotFoundException";
import { weekdays } from "../constants";
import {
    buildDate,
    isDateFormat,
    isFilledString,
    isTimeFormat,
    splitStrToNum,
} from "../utils";
import prisma from "../prisma";

export default async function (request: Request, response: Response) {
    type ErrorStatus = 'RESTAURANT_NOT_FOUND' | 'INVALID_DATE' | 'INVALID_TIME' | 'INVALID_WEEK_DAY'

    const errors: ErrorStatus[] = []
    try {
        let finds = false;
        const restaurant_id = request.params.restaurant_id;

        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: restaurant_id,
            },
        });

        if (restaurant == null) {
            errors.push('RESTAURANT_NOT_FOUND')
        }

        if (
            !isFilledString(request.query.date) ||
            !isDateFormat(request.query.date)
        ) {
            errors.push('INVALID_DATE');
        }

        if (
            !isFilledString(request.query.time) ||
            !isTimeFormat(request.query.time)
        ) {
            errors.push('INVALID_TIME');
        }

        if (errors.length > 0) {
            throw new Error('Invalid input')
        }

        const date = splitStrToNum(request.query.date as string, "-");
        const time = splitStrToNum(request.query.time as string, ":");

        const findDate = buildDate(date, time, 0);

        const shortName = weekdays[findDate.getDay()];
        const hours = await prisma.businessHour.findMany({
            where: {
                restaurant_id: restaurant_id,
                weekDay: shortName,
            },
        });

        if (hours !== null && hours.length > 0) {
            finds =
                hours.filter((hr: any) => {
                    const tA = splitStrToNum(hr.startTime, ":");
                    const tB = splitStrToNum(hr.endTime, ":");
                    const startTime = buildDate(date, tA, 0);
                    const endTime = buildDate(date, tB, 59);

                    return +startTime <= +findDate && +endTime >= +findDate;
                }).length > 0;
        }

        return response.status(200).send(finds);
    } catch (er) {
        if (er instanceof NotFoundException) {
            return response.status(404).send(false);
        }
        return response.status(400).json(errors);
    }
}
