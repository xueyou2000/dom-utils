import { getDocumentSize } from "..";
import { AlignPointType, Point, PointSuite, Region, RevisePoint, Round } from "./interface";

/**
 * 获取区域
 * @param element   dom元素
 * @param setDirection 是否叠加窗口滚动条距离
 */
export function getRegion(element: HTMLElement | AlignPointType, setDirection = false) {
    var region: Region = { left: 0, top: 0, width: 0, height: 0 };

    if ("pageX" in element) {
        region.left = element.pageX;
        region.top = element.pageY;
    } else if ("clientX" in element) {
        region.left = element.clientX + window.pageXOffset;
        region.top = element.clientY + window.pageYOffset;
    } else {
        const bound = element.getBoundingClientRect();
        region.left = bound.left;
        region.top = bound.top;
        region.width = bound.width;
        region.height = bound.height;

        if (setDirection) {
            region.left += window.pageXOffset;
            region.top += window.pageYOffset;
        }
    }
    return region;
}

/**
 * 计算点对齐后的坐标点
 * @param region    区域
 * @param pointSuite    对齐类型
 */
export function calcPoint(region: Region, pointSuite: PointSuite) {
    const point: Point = { x: 0, y: 0 };
    // 处理 y 轴
    switch (pointSuite[0]) {
        case "t":
            point.y = region.top;
            break;
        case "c":
            point.y = region.top + region.height / 2;
            break;
        case "b":
            point.y = region.top + region.height;
            break;
    }

    // 处理 x 轴
    switch (pointSuite[1]) {
        case "l":
            point.x = region.left;
            break;
        case "c":
            point.x = region.left + region.width / 2;
            break;
        case "r":
            point.x = region.left + region.width;
            break;
    }

    return point;
}

/**
 * 将百分比字符串转换为数值
 * @param ratio 百分比字符串 例如: 10%
 */
export function coverPercentage(ratio: string) {
    if (!ratio || ratio.indexOf("%") === -1) {
        return 0;
    }
    return parseFloat(ratio.replace("%", "")) / 100;
}

/**
 * 计算偏移量
 * @param region    区域
 * @param offset    偏移量
 * @param allowX    允许x轴偏移
 * @param allowY    允许y轴偏移
 */
export function calcOffset(region: Region, offset: number[] | string[], allow: RevisePoint = { x: true, y: true }): Point {
    const distance: Point = { x: 0, y: 0 };
    if (!offset) {
        return distance;
    }
    if (allow.x) {
        distance.x = typeof offset[0] === "string" ? coverPercentage(offset[0] as string) * region.width : (offset[0] as number);
    }
    if (allow.y) {
        distance.y = typeof offset[1] === "string" ? coverPercentage(offset[1] as string) * region.height : (offset[1] as number);
    }
    return distance;
}

/**
 * 反转百分比字符串
 * @param rate
 */
function reversePercentage(rate: string) {
    if (rate.indexOf("-") !== -1) {
        return rate.replace("-", "");
    } else {
        return "-" + rate;
    }
}

/**
 * 反转偏移量
 * @param offset
 */
export function flipOffset(offset: any[]) {
    if (!offset) {
        return offset;
    }
    const result = [];

    if (offset.length >= 1) {
        result[0] = typeof offset[0] === "string" ? reversePercentage(offset[0]) : -offset[0];
    }

    if (offset.length >= 2) {
        result[1] = typeof offset[1] === "string" ? reversePercentage(offset[1]) : -offset[1];
    }

    return result;
}

/**
 * 累加坐标
 * @param p1
 * @param p2
 */
export function accPoint(p1: Point, p2: Point) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}

/**
 * 累加反转状态
 * @param p1
 * @param p2
 */
export function accRevisePoint(p1: RevisePoint, p2: RevisePoint) {
    return { x: p1.x || p2.x, y: p1.y || p2.y };
}

/**
 * 计算四周溢出距离
 * @param point
 * @param sourceRegion
 * @param targetRegion
 */
export function clacOverFlowSize(point: Point, sourceRegion: Region): Round {
    const [documentWidth, documentHeight] = getDocumentSize();
    const left = point.x < 0 ? Math.abs(point.x) : 0;
    const right = point.x + sourceRegion.width > documentWidth ? point.x + sourceRegion.width - documentWidth : 0;
    const top = point.y < 0 ? Math.abs(point.y) : 0;
    const bottom = point.y + sourceRegion.height > documentHeight ? point.y + sourceRegion.height - documentHeight : 0;

    return { left, right, top, bottom };
}

/**
 * 微调点
 * @description 返回微调后的坐标
 * @param point
 * @param overflow
 */
export function adjustPoint(point: Point, sourceRegion: Region): RevisePoint {
    const [documentWidth, documentHeight] = getDocumentSize();
    const overflow: Round = clacOverFlowSize(point, sourceRegion);
    let adjustX = false;
    let adjustY = false;

    if (overflow.left > 0 && sourceRegion.width <= documentWidth) {
        point.x = 0;
        adjustX = true;
    }
    if (overflow.top > 0 && sourceRegion.height <= documentHeight) {
        point.y = 0;
        adjustY = true;
    }
    if (overflow.right > 0 && documentWidth >= sourceRegion.width) {
        point.x = documentWidth - sourceRegion.width;
        adjustX = true;
    }
    if (overflow.bottom > 0 && documentHeight >= sourceRegion.height) {
        point.y = documentHeight - sourceRegion.height;
        adjustY = true;
    }

    if (overflow.left > 0 && overflow.right > 0) {
        point.x = 0;
        adjustX = true;
    }

    if (overflow.top > 0 && overflow.bottom > 0) {
        point.y = 0;
        adjustY = true;
    }

    return { x: adjustX, y: adjustY };
}

/**
 * 反转点
 * @param point
 * @param sourceRegion
 * @param overflow
 */
export function flipPoint(point: Point, sourceRegion: Region, targetRegion: Region): RevisePoint {
    const overflow: Round = clacOverFlowSize(point, sourceRegion);
    const [documentWidth, documentHeight] = getDocumentSize();
    const targetRight = targetRegion.left + targetRegion.width;
    const targetBottom = targetRegion.top + targetRegion.height;
    let adjustX = false;
    let adjustY = false;

    if (overflow.left > 0 && targetRight + sourceRegion.width <= documentWidth) {
        // 反转到  targetRegion 右边
        point.x = targetRight;
        adjustX = true;
    }

    if (overflow.right > 0 && targetRegion.left - sourceRegion.width >= 0) {
        point.x = targetRegion.left - sourceRegion.width;
        adjustX = true;
    }

    if (overflow.top > 0 && targetBottom + sourceRegion.height <= documentHeight) {
        point.y = targetBottom;
        adjustY = true;
    }

    if (overflow.bottom > 0 && targetRegion.top - sourceRegion.height >= 0) {
        point.y = targetRegion.top - sourceRegion.height;
        adjustY = true;
    }

    return { x: adjustX, y: adjustY };
}

/**
 * 调整source尺寸
 * @param point
 * @param sourceRegion
 * @param targetRegion
 * @param overflow
 */
export function resizeSource(point: Point, sourceRegion: Region) {
    const [documentWidth, documentHeight] = getDocumentSize();
    const overflow: Round = clacOverFlowSize(point, sourceRegion);
    const region: Region = { top: point.y, left: point.x, height: null, width: null };

    // TODO：#1 严重BUG， 当 sourceRegion, 大于文档尺寸时候, overflow.left溢出计算了width宽度, overflow.right也溢出，又设置了一次宽度

    if (overflow.left > 0) {
        region.left = 0;
        region.width = sourceRegion.width - overflow.left;
    }

    if (overflow.top > 0) {
        region.top = 0;
        region.height = sourceRegion.height - overflow.top;
    }

    if (overflow.right > 0) {
        region.width = sourceRegion.width - overflow.right;
    }

    if (overflow.bottom > 0) {
        region.height = sourceRegion.height - overflow.bottom;
    }

    if (sourceRegion.width > documentWidth) {
        region.width = documentWidth;
    }

    if (sourceRegion.height > documentHeight) {
        region.height = documentHeight;
    }

    return region;
}
