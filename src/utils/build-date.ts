export const buildDate = (date: number[], time: number[], seconds?: number) => {
    const newDate = new Date()
    newDate.setUTCFullYear(date[0], date[1] - 1, date[2])
    newDate.setUTCHours(time[0], time[1], seconds)

    return newDate
}
