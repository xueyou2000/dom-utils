/**
 * 溢出配置
 */
export interface OverFlow {
    /**
     * 微调
     */
    adjust?: boolean;
    /**
     * 反转
     */
    flip?: boolean;
}

/**
 * 对齐点类型
 */
export type AlignPointType = { pageX: number; pageY: number } | { clientX: number; clientY: number };
/**
 * 对齐类型
 */
export type PointSuite = "tl" | "tc" | "tr" | "cl" | "cc" | "cr" | "bl" | "bc" | "br";

/**
 * 点类型
 */
export type Point = { x: number; y: number };

/**
 * 是否反转
 */
export type RevisePoint = { x: boolean; y: boolean };

/**
 * 区域类型
 */
export interface Region {
    top: number;
    left: number;
    height: number;
    width: number;
}

/**
 * 边界
 */
export interface Round {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

/**
 * DomAlign对齐配置
 */
export interface DomAlignOption {
    /**
     * 移动源节点与目标节点对齐，如['tr'，'cc']，将源节点的右上角与目标节点的中心点对齐。 点可以是't'（顶部），'b'（底部），'c'（中心），'l'（左），'r'（右）
     */
    points?: [PointSuite, PointSuite];
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
    /**
     * 是否包含滚动条检测
     * @description 默认不包含， 元素不在视窗内就翻转
     */
    contaninScroll?: boolean;
}
