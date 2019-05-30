/**
 * 验证时间字符串
 * @description 验证是否为时间字符串, 正确的范围是 00:00 ~ 23:59
 * @param time 时间字符串, 比如 10:32
 * @example isShortTime('24:00') === false
 * @example isShortTime('3:00') === false
 * @example isShortTime('03:00') === true
 */
export function isShortTime(time: string) {
    if (!time) {
        return false;
    }
    return /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])?$/.test(time);
}

/**
 * 解析时间字符串
 * @description 将时间字符串解析成Date对象
 */
export function shortTimeParse(time: string, d?: Date) {
    const date = d || new Date();
    const [hours, minutes] = time.split(":");
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0);
    return date;
}

/**
 * 获取短时间的毫秒数
 * @param date
 */
export function shrotTimeTimestamp(date: Date) {
    const hours = date.getHours() * 60 * 60 * 1000;
    const min = date.getMinutes() * 60 * 1000;
    return hours + min;
}
