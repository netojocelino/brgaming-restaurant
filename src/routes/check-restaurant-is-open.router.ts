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
    try {
        let finds = false;
        const restaurant_id = request.params.restaurant_id;

        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: restaurant_id,
            },
        });

        if (restaurant == null) {
            throw new NotFoundException(
                `Restaurant with id ${restaurant_id} not found`
            );
        }

        if (
            !isFilledString(request.query.date) ||
            !isDateFormat(request.query.date)
        ) {
            throw new Error("INVALID_DATE");
        }
        if (
            !isFilledString(request.query.time) ||
            !isTimeFormat(request.query.time)
        ) {
            throw new Error("INVALID_TIME");
        }

        const date = splitStrToNum(request.query.date, "-");
        const time = splitStrToNum(request.query.time, ":");

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
        return response.status(400).send(er);
    }
}
