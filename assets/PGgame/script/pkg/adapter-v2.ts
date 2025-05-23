// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { tcLog } from "../framework/log/log";

const { ccclass, property } = cc._decorator;

// 竖版适配规则
// 1. 高度永远抵满

@ccclass
export class AdapterV2 extends cc.Component {
    private canvas!: cc.Canvas;
    private readonly designSize = cc.Size.ZERO;
    private nodeScreen: cc.Node | undefined;
    private readonly screenSize = cc.Size.ZERO;
    private statusBarHeight = 0;

    private static instance: AdapterV2;
    public static getInstance(): AdapterV2 {
        if (!this.instance) {
            this.instance = new AdapterV2();
        }
        return this.instance;
    }
    public rootCanvasWidth: number
    public rootCanvasHeight: number
    public winSizeWidth: number
    public winSizeHeight: number

    protected onLoad(): void {
        this.canvas = this.node.getComponent(cc.Canvas);
        this.nodeScreen = cc.find("screen", this.node);
    }

    protected onEnable(): void {
        cc.systemEvent.on("switch-orientitaion", this.switchOrientation, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.off("switch-orientitaion", this.switchOrientation, this);
    }

    public updateAlignment() {
        const screenHeight = cc.winSize.height;
        const saftArea = cc.sys.getSafeAreaRect();
        this.statusBarHeight = screenHeight - saftArea.y - saftArea.height;
        const size = cc.view.getFrameSize();
        const curRatio = size.height / size.width;
        const minRatio = 1440 / 810;
        const maxRatio = 1800 / 810;
        if (curRatio < minRatio) {
            // 屏幕很方
            cc.view.setDesignResolutionSize(810, 1440, cc.ResolutionPolicy.FIXED_HEIGHT);
            this.canvas.designResolution = cc.size(810, 1440);
            this.canvas.fitHeight = true;
            this.nodeScreen?.setContentSize(810, 1440 - this.statusBarHeight);
            this.nodeScreen?.setPosition(0, (this.statusBarHeight / 2) * -1);
        } else {
            cc.view.setDesignResolutionSize(810, curRatio * 810, cc.ResolutionPolicy.FIXED_WIDTH);
            this.canvas.designResolution = cc.size(810, curRatio * 810);
            this.canvas.fitWidth = true;
            this.nodeScreen?.setContentSize(810, curRatio * 810 - this.statusBarHeight);
            this.nodeScreen?.setPosition(0, (this.statusBarHeight / 2) * -1);
        }
        this.designSize.width = this.canvas.designResolution.width;
        this.designSize.height = this.canvas.designResolution.height;
        this.screenSize.width = this.nodeScreen?.getContentSize().width ?? 0;
        this.screenSize.height = this.nodeScreen?.getContentSize().height ?? 0;
        // tcLog.log("updateAlignment:");

        tcLog.log("size:", size, "   screenHeight:", screenHeight);
        AdapterV2.getInstance().winSizeWidth = size.width
        AdapterV2.getInstance().winSizeHeight = size.height
    }

    private switchOrientation(orientaion: number) {
        if (orientaion === 2) {
            // 切换为竖屏
            cc.view.setDesignResolutionSize(this.designSize.width, this.designSize.height, cc.ResolutionPolicy.FIXED_WIDTH);
            this.canvas.designResolution = cc.size(this.designSize.width, this.designSize.height);
            this.canvas.fitWidth = true;
            if (cc.sys.isNative) {
                this.nodeScreen?.setContentSize(this.screenSize.width, this.screenSize.height);
                this.nodeScreen?.setPosition(0, (this.statusBarHeight / 2) * -1);
            } else {
                this.nodeScreen?.setContentSize(this.screenSize.width, this.screenSize.height);
                AdapterV2.getInstance().rootCanvasWidth = this.screenSize.width
                AdapterV2.getInstance().rootCanvasHeight = this.screenSize.height
            }
        } else {
            // 设置为横屏
            cc.view.setDesignResolutionSize(this.designSize.height, this.designSize.width, cc.ResolutionPolicy.FIXED_HEIGHT);
            this.canvas.designResolution = cc.size(this.designSize.height, this.designSize.width);
            this.canvas.fitHeight = true;
            this.nodeScreen?.setContentSize(this.screenSize.height, this.screenSize.width);
            if (cc.sys.isNative) {
                this.nodeScreen?.setContentSize(this.screenSize.height, this.screenSize.width);
                this.nodeScreen?.setPosition(this.statusBarHeight / 2, 0);
            } else {
                this.nodeScreen?.setContentSize(this.screenSize.height, this.screenSize.width);
                AdapterV2.getInstance().rootCanvasWidth = this.screenSize.height
                AdapterV2.getInstance().rootCanvasHeight = this.screenSize.width
            }
        }

        tcLog.log("viewWidth:", AdapterV2.getInstance().rootCanvasWidth,
            "   viewHeight:", AdapterV2.getInstance().rootCanvasHeight);



    }
}
