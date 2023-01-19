export const buildDate = (date: number[], time: number[], seconds?: number) => {
    const newDate = new Date()
    newDate.setUTCFullYear(date[0], date[1] - 1, date[2])
    newDate.setUTCHours(time[0], time[1], seconds)

    return newDate
}

export const isFilledString = (data: any): data is string =>
{
    if (data === undefined) return false
    if (typeof data !== 'string') return false
    if (data.length < 1) return false
    return true
}

export const arrayToNumber = (data: any[]) => data.map((item) => +item)

export const splitStrToNum = (data: string, separator = '') => arrayToNumber(data.split(separator))
