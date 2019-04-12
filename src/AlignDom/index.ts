import { getDocumentSize, getViewportSize } from "../Dom";
import { OverFlow, AlignPointType, PointSuite, Point, Region, Round, RevisePoint, DomAlignOption } from "./interface";
import { getRegion, calcPoint, accPoint, calcOffset, clacOverFlowSize, adjustPoint, flipPoint, accRevisePoint, resizeSource } from "./utils";

/**
 * 元素对齐
 * @param sourceNode    要移动元素
 * @param targetNode    被对齐目标
 * @param option
 */
export function alignElement(sourceNode: HTMLElement, targetNode: HTMLElement | AlignPointType, option: DomAlignOption) {
    const { points } = option;
    sourceNode.style.display = "block";

    const sourceRegion = getRegion(sourceNode);
    const targetRegion = getRegion(targetNode, true);
    const sourcePoint = calcPoint(sourceRegion, points[0]);
    const targetPoint = calcPoint(targetRegion, points[1]);
    const alignPoint: Point = { x: targetPoint.x - sourcePoint.x, y: targetPoint.y - sourcePoint.y };

    /**
     * 将对齐点叠加偏移量
     * @param point   对齐点
     * @param allowX    允许x轴叠加
     * @param allowY    允许x轴叠加
     */
    function accOffset(point: Point, allowX = true, allowY = true) {
        var p: Point;
        // 累加上 Source 偏移量
        p = accPoint(point, calcOffset(sourceRegion, option.offset, allowX, allowY));
        // 累加 Target 偏移量
        p = accPoint(p, calcOffset(targetRegion, option.targetOffset, allowX, allowY));
        return p;
    }

    // 叠加偏移量后的对齐点
    let finallyPoint = accOffset(alignPoint);

    // 是否微调或者反转了
    let needAccOffset: RevisePoint = { x: false, y: false };
    // 微调
    if (option.overflow.adjust) {
        needAccOffset = adjustPoint(finallyPoint, sourceRegion);
    }

    // 反转
    if (option.overflow.flip) {
        const flipRevise = flipPoint(finallyPoint, sourceRegion, targetRegion);
        needAccOffset = accRevisePoint(needAccOffset, flipRevise);
    }

    // 累加偏移量(微调或反转后，需要重新累加偏移量)
    finallyPoint = accOffset(finallyPoint, needAccOffset.x, needAccOffset.y);

    const region = resizeSource(finallyPoint, sourceRegion);

    sourceNode.style.position = "absolute";
    sourceNode.style.left = `${region.left}px`;
    sourceNode.style.top = `${region.top}px`;
    if (region.width) {
        sourceNode.style.width = `${region.width}px`;
    }
    if (region.height) {
        sourceNode.style.height = `${region.height}px`;
    }
    sourceNode.style.display = null;
}
