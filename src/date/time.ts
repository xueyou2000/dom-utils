/**
 * 验证时间字符串
 * @description 验证是否为时间字符串, 可以是 (时分秒) 或者 (时分)
 * @param time 时间字符串, 比如 10:32
 * @example isTime('24:00') === false
 * @example isTime('3:00') === false
 * @example isTime('03:00') === true
 * @example isTime('03:00:00') === true
 */
export function isTime(time: string) {
    if (!time) {
        return false;
    }
    return /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/.test(time);
}

/**
 * 验证范围时间字符串
 * @param time 范围时间字符串, 比如 06:00:00 - 18:00:00
 * @param separator 分隔符, 默认 " - "
 */
export function isTimeRange(time: string, separator: string = " - ") {
    const segments = timeRangeSplit(time, separator);
    return isTime(segments[0]) && isTime(segments[1]);
}

/**
 * 解析时间字符串
 * @description 将时间字符串解析成Date对象, 可以是 (时分秒) 或者 (时分)
 */
export function timeParse(time: string, d?: Date) {
    const date = d || new Date();
    const [hours, minutes, seconds] = time.split(":");
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(seconds !== undefined ? parseInt(seconds) : 0);
    return date;
}

/**
 * 分解范围时间字符串
 * @param time
 */
export function timeRangeSplit(time: string, separator: string = " - "): [string, string] {
    if (!time) {
        return [null, null];
    }
    const segments = time.split(separator);
    if (segments.length !== 2) {
        return [null, null];
    }
    return [segments[0], segments[1]];
}

/**
 * 解析范围时间字符串
 * @param time
 * @param separator
 */
export function timeRangeParse(time: string, separator: string = " - "): [Date, Date] {
    const segments = timeRangeSplit(time, separator);
    return [timeParse(segments[0]), timeParse(segments[1])];
}
