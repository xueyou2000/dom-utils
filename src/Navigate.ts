export interface NnavigateConfig {
    onEnter?: Function;
    onShow?: Function;
    onHide?: Function;
    onPrev?: Function;
    onNext?: Function;
}

/**
 * 生成键盘导航处理函数
 * @param config
 */
export function CreateNnavigateHandle(config: NnavigateConfig) {
    function handleKeyDown(e: any) {
        switch (e.keyCode) {
            // Enter
            case 13:
                if (config.onEnter) {
                    config.onEnter(e);
                }
                e.stopPropagation();
                e.preventDefault();
                break;
            // Space
            case 32:
                if (config.onShow) {
                    config.onShow(e);
                }
                e.stopPropagation();
                break;
            // 上方向
            case 38:
                if (config.onPrev) {
                    config.onPrev(e);
                }
                e.preventDefault();
                break;
            // 下方向
            case 40:
                if (config.onNext) {
                    config.onNext(e);
                }
                e.preventDefault();
                break;
            // 取消
            case 27:
                if (config.onHide) {
                    config.onHide(e);
                }
                e.stopPropagation();
                e.preventDefault();
                break;
        }
    }

    return handleKeyDown;
}
