// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export interface IView {
    /**
     * 打开页面
     * @param params 页面参数
     */
    open(params?: any): void;

    /**
     * 关闭页面
     */
    close(): void;

    /**
     * 是否能响应返回键，一般用于特殊的弹窗
     */
    canPop(): boolean;
}

export class Navigator {
    private static instance: Navigator;
    public static getInstance(): Navigator {
        if (this.instance == null) {
            this.instance = new Navigator();
        }

        return this.instance;
    }

    private constructor() {}

    private views: Array<IView> = [];

    protected register(name: string, view: IView) {}

    public canPop(): boolean {
        if (this.views.length === 0) {
            return true;
        }

        return this.views[this.views.length - 1].canPop();
    }

    public pop(): void {
        const view = this.views.pop();
        if (!view) {
            return;
        }

        if (!view.canPop()) {
            this.views.push(view);
            return;
        }

        view.close();
    }

    public push(view: IView, params?: any): void {
        this.views.push(view);
        view.open(params);
    }

    public pushByName(name: string, params?: any) {}

    public popAll(force?: boolean) {
        const removes: Array<number> = [];
        for (let i = this.views.length - 1; i >= 0; i++) {
            if (this.views[i].canPop()) {
                this.views[i].close();
                removes.push(i);
            } else {
                if (force) {
                    this.views[i].close();
                    removes.push(i);
                } else {
                    break;
                }
            }
        }

        if (removes.length === this.views.length) {
            this.views.length = 0; // 直接清空
            return;
        }

        for (let i = 0; i < removes.length; i++) {
            this.views.splice(removes[i], 1);
        }
    }
}

export class ViewBase extends cc.Component implements IView {
    open(params?: any): void {}

    close(): void {}

    canPop(): boolean {
        return true;
    }
}

export class DemoView extends ViewBase {
    override open(params?: any): void {}

    override close(): void {}

    override canPop(): boolean {
        return super.canPop();
    }
}
