import { getViewportSize } from "./Dom";

export type OverFlow = { adjustX: boolean; adjustY: boolean };
export type AlignPointType = { pageX: number; pageY: number } | { clientX: number; clientY: number };
export type PointSuite = "tl" | "tc" | "tr" | "cl" | "cc" | "cr" | "bl" | "bc" | "br";
export type Point = { x: number; y: number };

export interface IDomAlignOption {
    /**
     * 移动源节点与目标节点对齐，如['tr'，'cc']，将源节点的右上角与目标节点的中心点对齐。 点可以是't'（顶部），'b'（底部），'c'（中心），'l'（左），'r'（右）
     */
    points: [PointSuite, PointSuite];
    /**
     * 偏移量
     * @example [10, 20],  ['5%', '50%']
     */
    offset?: any[];
    /**
     * 偏移量(相对目标节点)
     * @example [10, 20],  ['5%', '50%']
     */
    targetOffset?: any[];
    /**
     * 溢出调整
     * @description 如果adjustX字段为true，那么如果源节点不可见，则将在x方向上调整源节点。 如果adjustY字段为true，则如果源节点不可见，则将在y方向上调整源节点。
     */
    overflow?: OverFlow;
}

export interface Region {
    top: number;
    left: number;
    height: number;
    width: number;
}

function getRegion(element: HTMLElement | AlignPointType, setDirection = false) {
    var region: Region = { left: 0, top: 0, width: 0, height: 0 };
    let bound = { top: 0, left: 0, width: 0, height: 0 };

    if ("pageX" in element) {
        bound.left = element.pageX;
        bound.top = element.pageY;
    } else if ("clientX" in element) {
        bound.left = element.clientX + window.pageXOffset;
        bound.top = element.clientY + window.pageYOffset;
    } else {
        const bound = element.getBoundingClientRect();
        region.width = bound.width;
        region.height = bound.height;
        if (setDirection) {
            region.top = bound.top + window.pageYOffset;
            region.left += bound.left + window.pageXOffset;
        }
    }

    return region;
}

/**
 * 计算坐标
 * @param region
 * @param pointSuite
 */
function calcPoint(region: Region, pointSuite: PointSuite) {
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
 * @param element
 * @param offset
 */
function calcOffset(region: Region, offset: number[] | string[], allowX = true, allowY = true): Point {
    const distance: Point = { x: 0, y: 0 };
    if (!offset) {
        return distance;
    }
    if (allowX) {
        distance.x = typeof offset[0] === "string" ? coverPercentage(offset[0] as string) * region.width : (offset[0] as number);
    }
    if (allowY) {
        distance.y = typeof offset[1] === "string" ? coverPercentage(offset[1] as string) * region.height : (offset[1] as number);
    }
    return distance;
}

/**
 * 累加坐标
 * @param p1
 * @param p2
 */
function accPoint(p1: Point, p2: Point) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}

/**
 * 元素对齐
 * @param sourceNode    要移动元素
 * @param targetNode    被对齐目标
 * @param option
 */
export function alignElement(sourceNode: HTMLElement, targetNode: HTMLElement | AlignPointType, option: IDomAlignOption) {
    const { points } = option;
    var flipX = false,
        flipY = false;

    sourceNode.style.display = "block";

    const sourceRegion = getRegion(sourceNode);
    const targetRegion = getRegion(targetNode, true);
    const targetPoint = calcPoint(targetRegion, points[1]);
    const sourcePoint = calcPoint(sourceRegion, points[0]);
    let alignPoint: Point = { x: targetPoint.x - sourcePoint.x, y: targetPoint.y - sourcePoint.y };

    function accOffset(point: Point, allowX = true, allowY = true) {
        var p;
        // 累加上Source偏移量
        p = alignPoint = accPoint(point, calcOffset(sourceRegion, option.offset, allowX, allowY));
        // 累加Target偏移量
        p = alignPoint = accPoint(point, calcOffset(targetRegion, option.targetOffset, allowX, allowY));

        return p;
    }

    alignPoint = accOffset(alignPoint);

    // 判断对齐点是否还有空间, 否则flip翻转方向去对齐
    if (option.overflow) {
        let [viewportWidth, viewportHeight] = getViewportSize();
        viewportWidth += window.pageXOffset;
        viewportHeight += window.pageYOffset;

        if (option.overflow.adjustX) {
            const rightOffsetX = viewportWidth - (alignPoint.x + sourceRegion.width);
            if (alignPoint.x < 0) {
                // 左边界溢出

                // 溢出的距离超过 targetRegion.width的一半, 则反转
                if (Math.abs(alignPoint.x) <= sourceRegion.width / 2) {
                    alignPoint.x = 0;
                } else {
                    // 反转
                    alignPoint.x = targetRegion.left + targetRegion.width;
                    flipX = true;
                }
            } else if (rightOffsetX < 0) {
                // 右边界溢出

                // 溢出的距离超过 targetRegion.width的一半, 则反转
                if (Math.abs(rightOffsetX) <= sourceRegion.width / 2) {
                    alignPoint.x = alignPoint.x + rightOffsetX;
                } else {
                    // 反转
                    alignPoint.x = targetRegion.left - sourceRegion.width;
                    flipX = true;
                }
            }
        }
        if (option.overflow.adjustY) {
            const bottomOffsetY = viewportHeight - (alignPoint.y + sourceRegion.height);

            if (alignPoint.y < 0) {
                // 上边界溢出

                // 溢出的距离超过 targetRegion.height的一半, 则反转
                if (Math.abs(alignPoint.y) <= sourceRegion.height / 2) {
                    alignPoint.y = 0;
                } else {
                    // 反转
                    alignPoint.y = targetRegion.top + targetRegion.height;
                    flipY = true;
                }
            } else if (bottomOffsetY < 0) {
                // 下边界溢出

                // 溢出的距离超过 targetRegion.height的一半, 则反转
                if (Math.abs(bottomOffsetY) <= sourceRegion.height / 2) {
                    alignPoint.y = alignPoint.y + bottomOffsetY;
                } else {
                    // 反转
                    alignPoint.y = targetRegion.top - sourceRegion.height;
                    flipY = true;
                }
            }
        }

        // 只有x轴反转就只再次累加x轴的偏移量, 某则就重复累加了, Y轴也如此
        alignPoint = accOffset(alignPoint, flipX, flipY);
    }
    sourceNode.style.position = "absolute";
    sourceNode.style.left = `${alignPoint.x}px`;
    sourceNode.style.top = `${alignPoint.y}px`;
    sourceNode.style.display = null;
    return { flipX, flipY };
}

export const PointMap: { [key: string]: [PointSuite, PointSuite] } = {
    top: ["bc", "tc"],
    left: ["cr", "cl"],
    right: ["cl", "cr"],
    bottom: ["tc", "bc"],
    topLeft: ["bl", "tl"],
    topRight: ["br", "tr"],
    bottomLeft: ["tl", "bl"],
    bottomRight: ["tr", "br"]
};
