/**
 * 获取文档document
 * TODO: 稳定后移动到 utils-dom 库
 * @param node
 */
export function getDocument(node: HTMLElement | Window) {
    const nodeWin = node as Window;
    const nodeEle = node as HTMLElement;
    if (nodeWin === nodeWin.window) {
        return nodeWin.document;
    }
    if (nodeEle.nodeType === 9) {
        return node;
    }
    return nodeEle.ownerDocument;
}

/**
 * 获取视窗大小
 * @returns [viewportWidth, viewportHeight]
 */
export function getViewportSize(): number[] {
    return ["Width", "Height"].map((field) => {
        var prop = `client${field}`;
        var doc = window.document;
        var body = doc.body;
        var documentElement = doc.documentElement;
        var documentElementProp = documentElement[prop];
        // 标准模式取 documentElement
        // backcompat 取 body
        return (doc.compatMode === "CSS1Compat" && documentElementProp) || (body && body[prop]) || documentElementProp;
    });
}

/**
 * 判断元素是否是window
 * @param obj
 */
export function isWindow(obj: any) {
    return obj !== null && obj !== undefined && obj == obj.window;
}
