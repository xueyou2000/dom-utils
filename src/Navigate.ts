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
                    config.onEnter();
                }
                break;
            // Space
            case 32:
                if (config.onShow) {
                    config.onShow();
                }
                break;
            // 上方向
            case 38:
                if (config.onPrev) {
                    config.onPrev();
                }
                e.preventDefault();
                break;
            // 下方向
            case 40:
                if (config.onNext) {
                    config.onNext();
                }
                e.preventDefault();
                break;
            // 取消
            case 27:
                if (config.onHide) {
                    config.onHide();
                }
                break;
        }
    }

    return handleKeyDown;
}
