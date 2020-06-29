import { isTime, timeParse } from "./time";
import { daysInMonth } from "./calendar";

/**
 * 格式化日期字符串
 * @param t 日期
 * @param format 格式化字符串
 * @example formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
 */
export function formatDate(t: Date, format = "yyyy-MM-dd HH:mm:ss") {
    const tf = function (i: number) {
        return (i < 10 ? "0" : "") + i;
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (token) => {
        switch (token) {
            case "yyyy":
                return tf(t.getFullYear());
            case "MM":
                return tf(t.getMonth() + 1);
            case "mm":
                return tf(t.getMinutes());
            case "dd":
                return tf(t.getDate());
            case "HH":
                return tf(t.getHours());
            case "ss":
                return tf(t.getSeconds());
        }
    });
}

/**
 * 验证日期字符串格式
 * @description 例如: 2018-03-26
 * @param date 日期字符串
 */
export function isDateFormat(date: string): boolean {
    if (!date) {
        return false;
    }
    var status = true;
    var regexp = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    var matches = regexp.exec(date);
    if (matches == null) {
        return false;
    }
    var matches3 = parseInt(matches[3]);
    if (matches3 <= 0 || matches3 > 12) {
        return false;
    }
    var matches4 = parseInt(matches[4]);
    if (!matches) {
        status = false;
    }
    if (status && matches4 > 31) {
        status = false;
    }
    if (status && matches3 == 2 && matches4 > 28) {
        status = false;
    }
    if (status && (matches3 == 1 || matches3 == 3 || matches3 == 5 || matches3 == 7 || matches3 == 8 || matches3 == 10 || matches3 == 12) && matches4 > 31) {
        status = false;
    }
    return status;
}

/**
 * 验证日期字符串格式
 * @description 例如: 2018-03-26 10:32:33
 * @param date 日期字符串
 */
export function isDateISO(date: string): boolean {
    if (!date) {
        return false;
    }
    var status = true;
    var regexp = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) ((\d{1,2}):(\d{1,2}):(\d{1,2}))$/;
    var matches = regexp.exec(date);
    if (matches == null) {
        return false;
    }
    var matches3 = parseInt(matches[3]);
    if (matches3 <= 0 || matches3 > 12) {
        return false;
    }
    var matches4 = parseInt(matches[4]);
    if (!matches) {
        status = false;
    }
    if (status && matches4 > 31) {
        status = false;
    }
    if (status && matches3 == 2 && matches4 > 28) {
        status = false;
    }
    if (status && (matches3 == 1 || matches3 == 3 || matches3 == 5 || matches3 == 7 || matches3 == 8 || matches3 == 10 || matches3 == 12) && matches4 > 31) {
        status = false;
    }
    if (status && !isTime(matches[5])) {
        status = false;
    }
    return status;
}

/**
 * 是否日期字符串
 * @param dateVal   日期字符串
 * @param showTime  是否显示时间
 */
export function isDate(dateVal: string, showTime = false) {
    if (showTime) {
        return isDateISO(dateVal);
    } else {
        return isDateFormat(dateVal);
    }
}

/**
 * 验证范围日期字符串
 * @param date
 * @param showTime
 * @param separator
 */
export function isDateRange(date: string, showTime = false, separator: string = " - ") {
    const segments = dateRangeSplit(date, separator);
    return isDate(segments[0], showTime) && isDate(segments[1], showTime) && segments[0] <= segments[1];
}

/**
 * 分解范围日期字符串
 * @param date
 * @param showTime 显示时间
 * @param separator 分隔符
 */
export function dateRangeSplit(date: string, separator: string = " - "): [string, string] {
    if (!date) {
        return [null, null];
    }
    const segments = date.split(separator);
    if (segments.length !== 2) {
        return [null, null];
    }
    return [segments[0], segments[1]];
}

/**
 * 日期范围解析成Date类型
 * @param date
 * @param showTime
 * @param separator
 */
export function dateRangeParse(date: string, showTime = false, separator: string = " - "): [Date, Date] {
    if (isDateRange(date, showTime, separator)) {
        const [start, end] = dateRangeSplit(date, separator);
        return [dateParse(start), dateParse(end)];
    } else {
        return [null, null];
    }
}

/**
 * 验证年月字符串
 * @param date 年月字符串 2018-03 这种格式
 */
export function isYearMonth(date: string) {
    if (!date) {
        return false;
    }
    var regexp = /^(\d{1,4})(-|\/)(\d{1,2})$/;
    var matches = regexp.exec(date);
    if (matches == null) {
        return false;
    }
    var matches3 = parseInt(matches[3]);
    if (matches3 <= 0 || matches3 > 12) {
        return false;
    }
    return true;
}

/**
 * 解析年月字符串
 * @param date 只能是 2018-03 这种字符串
 */
export function yearMonthParse(yearMonth: string) {
    if (isYearMonth(yearMonth)) {
        const [year, month] = yearMonth.split("-");
        const date = new Date();
        date.setFullYear(parseInt(year));
        date.setMonth(parseInt(month) - 1);
        return date;
    } else {
        return null;
    }
}

/**
 * 解析日期字符串
 * @param date 只能是 2018-03-26 这种字符串
 */
export function dateFormatParse(dateStr: string, d?: Date) {
    const date = d || new Date();
    const [year, month, day] = dateStr.split("-");
    date.setFullYear(parseInt(year));
    date.setMonth(parseInt(month) - 1);
    date.setDate(parseInt(day));
    return date;
}

/**
 * 解析日期字符串
 * @param date 只能是 2018-03-26 10:32:33 这种字符串
 */
export function dateISOParse(dateStr: string, d?: Date) {
    const [_date, _time] = dateStr.split(" ");
    const date = dateFormatParse(_date, d);
    const finallyDate = timeParse(_time, date);
    return finallyDate;
}

/**
 * 解析日期字符串
 * @description 可以是2018-03-26 10:32:33，也可以不带时分秒
 */
export function dateParse(dateStr: string) {
    if (isDateFormat(dateStr)) {
        return dateFormatParse(dateStr);
    } else if (isDateISO(dateStr)) {
        return dateISOParse(dateStr);
    } else {
        return null;
    }
}

/**
 * 设置年份, 返回新日期
 * @param d
 * @param year
 */
export function setYear(d: Date, year: number) {
    const date = new Date(d);
    date.setFullYear(year);
    return date;
}

/**
 * 设置月份, 返回新日期
 * @param d
 * @param year
 */
export function setMonth(d: Date, month: number) {
    const date = new Date(d);
    date.setMonth(month);
    return date;
}

/**
 * 累加月份, 返回新日期
 * @param d
 */
export function incrementMonth(d: Date) {
    const date = new Date(d);
    const month = date.getMonth();
    let prevDate: Date;
    switch (month) {
        case 11:
            // 往后翻一年
            prevDate = setYear(date, date.getFullYear() + 1);
            prevDate.setMonth(0);
            break;
        default:
            prevDate = setMonth(date, month + 1);
    }
    return prevDate;
}

/**
 * 累减月份, 返回新日期
 * @param d
 */
export function decreaseMonth(d: Date) {
    const date = new Date(d);
    const month = date.getMonth();
    let prevDate: Date;
    switch (month) {
        case 0:
            // 往前翻一年
            prevDate = setYear(date, date.getFullYear() - 1);
            prevDate.setMonth(11);
            break;
        default:
            prevDate = setMonth(date, month - 1);
    }
    return prevDate;
}

/**
 * 设置日, 返回新日期
 * @param d
 * @param year
 */
export function setDate(d: Date, day: number) {
    const date = new Date(d);
    date.setDate(day);
    return date;
}

/**
 * 累加日, 返回新日期
 * @param d
 */
export function incrementDate(d: Date) {
    const date = new Date(d);
    const day = date.getDate();
    let prevDate: Date;

    if (day >= daysInMonth(date)) {
        // 往后翻一月
        prevDate = setMonth(date, date.getMonth() + 1);
        prevDate.setDate(1);
    } else {
        prevDate = setDate(date, day + 1);
    }
    return prevDate;
}

/**
 * 累减日, 返回新日期
 * @param d
 */
export function decreaseDate(d: Date) {
    const date = new Date(d);
    const day = date.getDate();
    let prevDate: Date;
    switch (day) {
        case 1:
            // 往前翻一月
            prevDate = setMonth(date, date.getMonth() - 1);
            prevDate.setDate(daysInMonth(prevDate));
            break;
        default:
            prevDate = setDate(date, day - 1);
    }
    return prevDate;
}

/**
 * 设置年月日, 返回新日期
 * @param d
 * @param year
 */
export function setYearMonthDay(d: Date, other: Date) {
    const date = new Date(d);
    date.setFullYear(other.getFullYear());
    date.setMonth(other.getMonth());
    date.setDate(other.getDate());
    return date;
}
