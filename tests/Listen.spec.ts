import { render, fireEvent } from "react-testing-library";
import { listenClick, listenContextMenu, listenFocus, listenHover } from "../src";

describe("ListenEvent", () => {
    test("listenClick", () => {
        const fn = jest.fn((clicked: boolean, event: MouseEvent) => {
            expect(clicked).toBeTruthy();
        });
        const div = document.createElement("div");
        document.body.append(div);

        const cancel = listenClick(div, fn, () => false);

        fireEvent.click(div);

        expect(fn).toBeCalled();

        cancel();

        fireEvent.click(div);

        expect(fn.mock.calls.length).toBe(1);
    });

    test("listenContextMenu", () => {
        const fn = jest.fn((clicked: boolean, event: MouseEvent) => {
            expect(clicked).toBeTruthy();
        });
        const div = document.createElement("div");
        document.body.append(div);

        const cancel = listenContextMenu(div, fn);

        fireEvent.contextMenu(div);

        expect(fn).toBeCalled();

        cancel();

        fireEvent.contextMenu(div);

        expect(fn.mock.calls.length).toBe(1);
    });

    test("listenFocus", () => {
        var state = false;
        const fn = jest.fn((clicked: boolean, event: MouseEvent) => {
            state = clicked;
        });
        const div = document.createElement("div");
        document.body.append(div);

        const cancel = listenFocus(div, fn);

        fireEvent.focus(div);
        expect(state).toBeTruthy();
        expect(fn).toBeCalled();

        fireEvent.blur(div);
        expect(state).toBeFalsy();

        cancel();

        fireEvent.focus(div);

        expect(fn.mock.calls.length).toBe(2);
    });

    test("listenHover", () => {
        var state = false;
        const fn = jest.fn((clicked: boolean) => {
            console.log("事件调用", clicked);
            state = clicked;
        });
        const div = document.createElement("div");
        document.body.append(div);

        const cancel = listenHover(div, fn);

        console.log("开始模拟onMouseEnter");

        // fireEvent.mouseEnter 无效
        // React event system tracks native mouseOver/mouseOut events for
        // running onMouseEnter/onMouseLeave handlers
        // @link https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/events/EnterLeaveEventPlugin.js#L24-L31
        // fireEvent.mouseEnter(div);
        fireEvent(
            div,
            new MouseEvent("mouseenter", {
                bubbles: true,
                cancelable: true
            })
        );

        expect(state).toBeTruthy();
        expect(fn).toBeCalled();

        // fireEvent.mouseLeave 无效
        // React event system tracks native mouseOver/mouseOut events for
        // running onMouseEnter/onMouseLeave handlers
        // @link https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/events/EnterLeaveEventPlugin.js#L24-L31
        // fireEvent.mouseleave(div);
        fireEvent(
            div,
            new MouseEvent("mouseleave", {
                bubbles: true,
                cancelable: true
            })
        );

        expect(state).toBeFalsy();

        cancel();

        fireEvent.mouseEnter(div);

        expect(fn.mock.calls.length).toBe(2);
    });
});
