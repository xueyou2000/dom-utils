import "./MockDom";
import { AlignPointType, Region, Point } from "../src/AlignDom/interface";
import { getRegion, calcPoint, coverPercentage, calcOffset, flipOffset, accPoint, accRevisePoint, clacOverFlowSize, adjustPoint, flipPoint, resizeSource } from "../src/AlignDom/utils";

describe("AlignDom - getRegion", () => {
    test("getRegion with AlignPointType by page", () => {
        const mockElement = { pageX: 10, pageY: 20 } as AlignPointType;
        const region = getRegion(mockElement);
        expect(region).toEqual({ left: 10, top: 20, width: 0, height: 0 });
    });

    test("getRegion with AlignPointType by client", () => {
        const mockElement = { clientX: 10, clientY: 20 } as AlignPointType;
        (window as any).pageXOffset = 5;
        (window as any).pageYOffset = 7;
        const region = getRegion(mockElement);
        expect(region).toEqual({ left: 15, top: 27, width: 0, height: 0 });
    });

    test("getRegion with Element", () => {
        const mockElement = { getBoundingClientRect: () => ({ left: 10, top: 15, width: 100, height: 120 }) } as HTMLElement;
        let region = getRegion(mockElement);
        expect(region).toEqual({ left: 10, top: 15, width: 100, height: 120 });

        (window as any).pageXOffset = 5;
        (window as any).pageYOffset = 7;
        region = getRegion(mockElement, true);
        expect(region).toEqual({ left: 15, top: 22, width: 100, height: 120 });
    });
});

describe("AlignDom - calcPoint", () => {
    const region: Region = { left: 10, top: 12, width: 100, height: 120 };

    test("align point TopLeft(tl)", () => {
        const point = calcPoint(region, "tl");
        expect(point).toEqual({ x: region.left, y: region.top });
    });

    test("align point TopCenter(tc)", () => {
        const point = calcPoint(region, "tc");
        expect(point).toEqual({ x: region.left + region.width / 2, y: region.top });
    });

    test("align point TopRight(tr)", () => {
        const point = calcPoint(region, "tr");
        expect(point).toEqual({ x: region.left + region.width, y: region.top });
    });

    test("align point CenterLeft(cl)", () => {
        const point = calcPoint(region, "cl");
        expect(point).toEqual({ x: region.left, y: region.top + region.height / 2 });
    });

    test("align point CenterCenter(cc)", () => {
        const point = calcPoint(region, "cc");
        expect(point).toEqual({ x: region.left + region.width / 2, y: region.top + region.height / 2 });
    });

    test("align point CenterRight(cr)", () => {
        const point = calcPoint(region, "cr");
        expect(point).toEqual({ x: region.left + region.width, y: region.top + region.height / 2 });
    });

    test("align point BottomLeft(bl)", () => {
        const point = calcPoint(region, "bl");
        expect(point).toEqual({ x: region.left, y: region.top + region.height });
    });

    test("align point BottomCenter(bc)", () => {
        const point = calcPoint(region, "bc");
        expect(point).toEqual({ x: region.left + region.width / 2, y: region.top + region.height });
    });

    test("align point BottomRight(br)", () => {
        const point = calcPoint(region, "br");
        expect(point).toEqual({ x: region.left + region.width, y: region.top + region.height });
    });
});

describe("AlignDom - calcOffset", () => {
    test("calcOffset none", () => {
        const region: Region = { left: 10, top: 12, width: 100, height: 120 };
        const point = calcOffset(region, null);

        expect(point).toEqual({ x: 10, y: 12 });
    });

    test("calcOffset wich number", () => {
        const region: Region = { left: 10, top: 12, width: 100, height: 120 };
        const point = calcOffset(region, [10, 12]);

        expect(point).toEqual({ x: 20, y: 24 });
    });

    test("calcOffset wich percentage", () => {
        const region: Region = { left: 10, top: 12, width: 100, height: 120 };
        const point = calcOffset(region, ["10%", "12%"]);

        expect(point).toEqual({ x: 10 + 100 * 0.1, y: 12 + 120 * 0.12 });
    });

    test("calcOffset wich allow", () => {
        const region: Region = { left: 10, top: 12, width: 100, height: 120 };

        let point = calcOffset(region, [10, 12], { x: true, y: false });
        expect(point).toEqual({ x: 20, y: 12 });

        point = calcOffset(region, [10, 12], { x: false, y: true });
        expect(point).toEqual({ x: 10, y: 24 });
    });
});

describe("AlignDom - clacOverFlowSize", () => {
    test("overflow left", () => {
        const point: Point = { x: -10, y: 10 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };
        clacOverFlowSize(point, region);
        expect(clacOverFlowSize(point, region)).toEqual({ left: 10, top: 0, right: 0, bottom: 0 });
    });

    test("overflow top", () => {
        const point: Point = { x: -10, y: -10 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };

        expect(clacOverFlowSize(point, region)).toEqual({ left: 10, top: 10, right: 0, bottom: 0 });
    });

    test("overflow right", () => {
        const point: Point = { x: 490, y: -10 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };
        expect(clacOverFlowSize(point, region)).toEqual({ left: 0, top: 10, right: 90, bottom: 0 });
    });

    test("overflow bottom", () => {
        const point: Point = { x: -10, y: 590 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };
        expect(clacOverFlowSize(point, region)).toEqual({ left: 10, top: 0, right: 0, bottom: 110 });
    });

    test("overflow left and top", () => {
        const point: Point = { x: -10, y: -12 };
        const region: Region = { left: 0, top: 0, width: 500, height: 600 };
        expect(clacOverFlowSize(point, region)).toEqual({ left: 10, top: 12, right: 0, bottom: 0 });
    });

    test("overflow right and bottom", () => {
        const point: Point = { x: 10, y: 12 };
        const region: Region = { left: 0, top: 0, width: 500, height: 600 };
        expect(clacOverFlowSize(point, region)).toEqual({ left: 0, top: 0, right: 10, bottom: 12 });
    });

    test("overflow all", () => {
        const point: Point = { x: -10, y: -12 };
        const region: Region = { left: 0, top: 0, width: 520, height: 622 };
        expect(clacOverFlowSize(point, region)).toEqual({ left: 10, top: 12, right: 10, bottom: 10 });
    });
});

describe("AlignDom - utils", () => {
    test("coverPercentage", () => {
        expect(coverPercentage(null)).toBe(0);
        expect(coverPercentage("33.45")).toBe(0);
        expect(coverPercentage("33.45%")).toBe(0.3345);
    });

    test("flipOffset", () => {
        expect(flipOffset(null)).toBe(null);
        expect(flipOffset([10, 12])).toEqual([-10, -12]);
        expect(flipOffset([-10, -12])).toEqual([10, 12]);
        expect(flipOffset(["10%", "12%"])).toEqual(["-10%", "-12%"]);
        expect(flipOffset(["-10%", "-12%"])).toEqual(["10%", "12%"]);
    });

    test("accPoint", () => {
        expect(accPoint({ x: 5, y: 7 }, { x: 12, y: 16 })).toEqual({ x: 17, y: 23 });
    });

    test("accRevisePoint", () => {
        expect(accRevisePoint({ x: false, y: true }, { x: true, y: false })).toEqual({ x: true, y: true });
        expect(accRevisePoint({ x: false, y: true }, { x: false, y: false })).toEqual({ x: false, y: true });
        expect(accRevisePoint({ x: true, y: false }, { x: false, y: false })).toEqual({ x: true, y: false });
        expect(accRevisePoint({ x: false, y: true }, { x: false, y: false })).toEqual({ x: false, y: true });
    });
});

describe("AlignDom - adjustPoint", () => {
    test("adjust left", () => {
        const point: Point = { x: -10, y: 10 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };

        const result = adjustPoint(point, region);

        expect(point).toEqual({ x: 0, y: 10 });
        expect(result).toEqual({ x: true, y: false });
    });

    test("adjust top", () => {
        const point: Point = { x: 10, y: -10 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };

        const result = adjustPoint(point, region);

        expect(point).toEqual({ x: 10, y: 0 });
        expect(result).toEqual({ x: false, y: true });
    });

    test("adjust right", () => {
        const point: Point = { x: 490, y: 10 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };

        const result = adjustPoint(point, region);

        expect(point).toEqual({ x: 500 - 100, y: 10 });
        expect(result).toEqual({ x: true, y: false });
    });

    test("adjust bottom", () => {
        const point: Point = { x: 10, y: 590 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };

        const result = adjustPoint(point, region);

        expect(point).toEqual({ x: 10, y: 600 - 120 });
        expect(result).toEqual({ x: false, y: true });
    });

    test("adjust left and top", () => {
        const point: Point = { x: -10, y: -12 };
        const region: Region = { left: 0, top: 0, width: 100, height: 120 };

        const result = adjustPoint(point, region);

        expect(point).toEqual({ x: 0, y: 0 });
        expect(result).toEqual({ x: true, y: true });
    });

    test("adjust right and bottom", () => {
        const point: Point = { x: 320, y: 230 };
        const region: Region = { left: 0, top: 0, width: 200, height: 400 };

        const result = adjustPoint(point, region);

        expect(point).toEqual({ x: 500 - 200, y: 600 - 400 });
        expect(result).toEqual({ x: true, y: true });
    });

    test("adjust all", () => {
        const point: Point = { x: -10, y: -12 };
        const region: Region = { left: 0, top: 0, width: 511, height: 613 };

        const result = adjustPoint(point, region);

        expect(point).toEqual({ x: 0, y: 0 });
        expect(result).toEqual({ x: true, y: true });
    });
});

describe("AlignDom - flipPoint", () => {
    test("flip left to right", () => {
        const point: Point = { x: -140, y: 0 };
        const sourceRegion: Region = { left: 0, top: 0, width: 120, height: 80 };
        const targetRegion: Region = { left: 20, top: 0, width: 90, height: 80 };

        const result = flipPoint(point, sourceRegion, targetRegion);
        expect(point).toEqual({ x: targetRegion.left + targetRegion.width, y: 0 });
        expect(result).toEqual({ x: true, y: false });
    });

    test("flip top to bottom", () => {
        const point: Point = { x: 0, y: -60 };
        const sourceRegion: Region = { left: 0, top: 0, width: 120, height: 80 };
        const targetRegion: Region = { left: 0, top: 20, width: 90, height: 80 };

        const result = flipPoint(point, sourceRegion, targetRegion);
        expect(point).toEqual({ x: 0, y: targetRegion.top + targetRegion.height });
        expect(result).toEqual({ x: false, y: true });
    });

    test("flip right to left", () => {
        const point: Point = { x: 480, y: 0 };
        const sourceRegion: Region = { left: 0, top: 0, width: 120, height: 80 };
        const targetRegion: Region = { left: 390, top: 0, width: 90, height: 80 };

        const result = flipPoint(point, sourceRegion, targetRegion);
        expect(point).toEqual({ x: targetRegion.left - sourceRegion.width, y: 0 });
        expect(result).toEqual({ x: true, y: false });
    });

    test("flip bottom to top", () => {
        const point: Point = { x: 0, y: 580 };
        const sourceRegion: Region = { left: 0, top: 0, width: 120, height: 80 };
        const targetRegion: Region = { left: 0, top: 500, width: 90, height: 80 };

        const result = flipPoint(point, sourceRegion, targetRegion);
        expect(point).toEqual({ x: 0, y: targetRegion.top - sourceRegion.height });
        expect(result).toEqual({ x: false, y: true });
    });

    test("flip leftTop to rightBottom", () => {
        const point: Point = { x: -140, y: -60 };
        const sourceRegion: Region = { left: 0, top: 0, width: 120, height: 80 };
        const targetRegion: Region = { left: 20, top: 20, width: 90, height: 80 };

        const result = flipPoint(point, sourceRegion, targetRegion);
        expect(point).toEqual({ x: targetRegion.left + targetRegion.width, y: targetRegion.top + targetRegion.height });
        expect(result).toEqual({ x: true, y: true });
    });

    test("flip rightBottom to leftTop", () => {
        const point: Point = { x: 480, y: 580 };
        const sourceRegion: Region = { left: 0, top: 0, width: 120, height: 80 };
        const targetRegion: Region = { left: 390, top: 500, width: 90, height: 80 };

        const result = flipPoint(point, sourceRegion, targetRegion);
        expect(point).toEqual({ x: targetRegion.left - sourceRegion.width, y: targetRegion.top - sourceRegion.height });
        expect(result).toEqual({ x: true, y: true });
    });

    test(" to big unable flip", () => {
        const point: Point = { x: 20, y: 20 };
        const sourceRegion: Region = { left: 0, top: 0, width: 490, height: 590 };
        const targetRegion: Region = { left: 390, top: 500, width: 90, height: 80 };

        const result = flipPoint(point, sourceRegion, targetRegion);
        expect(point).toEqual({ x: 20, y: 20 });
        expect(result).toEqual({ x: false, y: false });
    });
});

describe("AlignDom - resizeSource", () => {
    test("left overflow to resize", () => {
        const point: Point = { x: -20, y: 0 };
        const region: Region = { left: 0, top: 0, width: 100, height: 80 };

        const round = resizeSource(point, region);
        expect(round).toEqual({ left: 0, top: 0, width: 80, height: null });
    });

    test("right overflow to resize", () => {
        const point: Point = { x: 480, y: 0 };
        const region: Region = { left: 0, top: 0, width: 100, height: 80 };

        const round = resizeSource(point, region);
        expect(round).toEqual({ left: 480, top: 0, width: 20, height: null });
    });

    test("top overflow to resize", () => {
        const point: Point = { x: 0, y: -20 };
        const region: Region = { left: 0, top: 0, width: 100, height: 80 };

        const round = resizeSource(point, region);
        expect(round).toEqual({ left: 0, top: 0, width: null, height: 60 });
    });

    test("bottom overflow to resize", () => {
        const point: Point = { x: 0, y: 540 };
        const region: Region = { left: 0, top: 0, width: 100, height: 80 };

        const round = resizeSource(point, region);
        expect(round).toEqual({ left: 0, top: 540, width: null, height: 60 });
    });

    test("leftTop overflow to resize", () => {
        const point: Point = { x: -20, y: -20 };
        const region: Region = { left: 0, top: 0, width: 100, height: 80 };

        const round = resizeSource(point, region);
        expect(round).toEqual({ left: 0, top: 0, width: 80, height: 60 });
    });

    test("rightBottom overflow to resize", () => {
        const point: Point = { x: 480, y: 540 };
        const region: Region = { left: 0, top: 0, width: 100, height: 80 };

        const round = resizeSource(point, region);
        expect(round).toEqual({ left: 480, top: 540, width: 20, height: 60 });
    });

    test("size exceeds document", () => {
        const point: Point = { x: -10, y: -10 };
        const region: Region = { left: 0, top: 0, width: 520, height: 620 };

        const round = resizeSource(point, region);
        expect(round).toEqual({ left: 0, top: 0, width: 500, height: 600 });
    });
});
