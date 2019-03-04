import { loadImage } from "../src";

describe("image", () => {
    test("success loadImage", async () => {
        class SuccessImage {
            private _src: string;
            public get src() {
                return this._src;
            }
            public complete: boolean = false;
            public set src(val: string) {
                this._src = val;
                this.complete = true;
                if (this.onload) {
                    this.onload();
                }
            }

            public onload: Function;
            public onerror: Function;
        }

        (global as any).Image = SuccessImage;
        const img = await loadImage("some img url");

        expect(img.src).toBe("some img url");
        expect(img.complete).toBeTruthy();
    });

    test("fail loadImage", async () => {
        class FailImage {
            private _src: string;
            public get src() {
                return this._src;
            }
            public complete: boolean = false;
            public set src(val: string) {
                this._src = val;
                this.complete = false;
                // 模拟延迟
                window.setTimeout(() => {
                    if (this.onerror) {
                        this.onerror(new Error("load fail"));
                    }
                }, 100);
            }

            public onload: Function;
            public onerror: Function;
        }

        (global as any).Image = FailImage;

        try {
            await loadImage("some fail img url");
        } catch (error) {
            expect(error.message).toBe("load fail");
        }
    });
});
