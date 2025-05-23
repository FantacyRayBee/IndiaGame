// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

/**
 * PG  slot游戏自动选自弹框
 */

import { AudioClipName, uAudio } from "../../../../../script/framework/audio/audio";
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../../script/framework/log/log";
import { currency } from "../../../../../script/pkg/currency";
import { pgGameEvent } from "./PgEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PgGameAutorotationView extends cc.Component {
    private layoutAutoRotaion: cc.Layout | undefined;
    private btnOutClose: cc.Node | undefined;
    private btnClose: cc.Node | undefined;
    private labelBonus: cc.Label | undefined;
    private labelBet: cc.Label | undefined;
    private labelWin: cc.Label | undefined;
    private maskBtnStart: cc.Node | undefined;
    private clickBtns: cc.Node | undefined;
    private startBtn: cc.Node | undefined;
    private startMask: cc.Node | undefined;
    private threeNode: cc.Node | undefined;
    private fourNode: cc.Node | undefined;
    private showHideBtn: cc.Node | undefined;
    private slider1: cc.Slider | undefined;
    private slider2: cc.Slider | undefined;
    private slider3: cc.Slider | undefined;
    private slider1Handle: cc.Node | undefined;
    private slider2Handle: cc.Node | undefined;
    private slider3Handle: cc.Node | undefined;

    private callBack: Function | undefined;
    private btnClickSound: string | undefined;
    private clickNums = [10, 30, 50, 80, 100];
    private labColor = {
        select: cc.color(255, 178, 103, 255),
        unselect: cc.color(128, 128, 128, 255),
    };
    private showType: boolean = false;
    private spinNum: number = 0;
    private BetCount: number | undefined;
    private slider1Mum: number = 0;
    private slider2Mum: number = 0;
    private slider3Mum: number = 0;
    private sliderMumChangeCallback: Function | undefined;

    private playedSlider1Sound: boolean = false;
    private playedSlider2Sound: boolean = false;
    private playedSlider3Sound: boolean = false;

    private clickSliderSoundName: string = AudioClipName.CLICKBTN;

    onLoad(): void {
        this.layoutAutoRotaion = cc.find("body/autorotation", this.node).getComponent(cc.Layout);
        this.btnOutClose = cc.find("body/btnOutClose", this.node);
        this.btnClose = cc.find("body/autorotation/top/btnClose", this.node);
        this.maskBtnStart = cc.find("body/maskBtnStart", this.node);
        this.labelBonus = cc.find("body/autorotation/down/nodeBonus/label", this.node).getComponent(cc.Label);
        this.labelBet = cc.find("body/autorotation/down/nodeBet/label", this.node).getComponent(cc.Label);
        this.labelWin = cc.find("body/autorotation/down/nodeWin/label", this.node).getComponent(cc.Label);
        this.clickBtns = cc.find("body/autorotation/mid/one/buttons", this.node);
        this.startBtn = cc.find("body/autorotation/down/startBtn", this.node);
        this.startMask = cc.find("body/mask", this.node);
        this.threeNode = cc.find("body/autorotation/mid/three", this.node);
        this.fourNode = cc.find("body/autorotation/mid/four", this.node);
        this.showHideBtn = cc.find("body/autorotation/down/showHideBtn", this.node);
        this.slider1 = cc.find("body/autorotation/mid/tow/btnSlider", this.node).getComponent(cc.Slider);
        this.slider1Handle = cc.find("body/autorotation/mid/tow/btnSlider/Handle", this.node);
        this.slider2Handle = cc.find("body/autorotation/mid/three/btnSlider/Handle", this.node);
        this.slider3Handle = cc.find("body/autorotation/mid/four/btnSlider/Handle", this.node);
        this.slider2 = cc.find("body/autorotation/mid/three/btnSlider", this.node).getComponent(cc.Slider);
        this.slider3 = cc.find("body/autorotation/mid/four/btnSlider", this.node).getComponent(cc.Slider);
        this.slider1.node.on("slide", this.onSlider1Active, this);
        this.slider2.node.on("slide", this.slider2Fun, this);
        this.slider3.node.on("slide", this.slider3Fun, this);
        this.showType = false;
        this.startMask!.active = false;
        this.maskBtnStart!.active = true;
        this.moveUp();
        this.btnClose.on("click", () => {
            uAudio.getInstance().playEffect(this.btnClickSound || AudioClipName.CLICKBTN);
            this.moveDown();
        });
        this.btnOutClose.on("click", () => {
            uAudio.getInstance().playEffect(this.btnClickSound || AudioClipName.CLICKBTN);
            this.moveDown();
        });
        this.updateSliderActive(this.slider1Handle, this.slider1, false);
        this.updateSliderActive(this.slider2Handle, this.slider2, false);
        this.updateSliderActive(this.slider3Handle, this.slider3, false);
        this.clickBtns?.children.forEach((tog, index) => {
            tog.on(
                "click",
                () => {
                    uAudio.getInstance().playEffect(this.btnClickSound || AudioClipName.CLICKBTN);
                    tcLog.log(index);
                    this.updateAutoCountBtnsTransition(index);
                    this.spinNum = this.clickNums[index];
                    this.updateSliderActive(this.slider1Handle, this.slider1, true);
                    this.updateSliderActive(this.slider2Handle, this.slider2, true);
                    this.updateSliderActive(this.slider3Handle, this.slider3, true);
                    this.onSetColor(index);
                    this.slider1Mum > 0 && this.slider1Deal(this.slider1);
                },
                this
            );
        });

        this.startBtn.on("click", () => {
            uAudio.getInstance().playEffect(this.btnClickSound || AudioClipName.CLICKBTN);
            this.callBack && this.callBack(this.spinNum);
            if (this.sliderMumChangeCallback) {
                this.sliderMumChangeCallback({ slider1Mum: this.slider1Mum, slider2Mum: this.slider2Mum, slider3Mum: this.slider3Mum });
            }
            cc.systemEvent.emit(pgGameEvent.startAutoSpin);
            this.moveDown();
        });

        this.showHideBtn.on("click", () => {
            uAudio.getInstance().playEffect(this.btnClickSound || AudioClipName.CLICKBTN);
            if (this.showType === false) {
                this.showType = true;
                this.threeNode!.active = true;
                this.fourNode!.active = true;
                let opacity = this.threeNode!.opacity;
                this.threeNode!.opacity = 0;
                this.fourNode!.opacity = 0;
                this.btnOutClose.y = 188
                this.scheduleOnce(() => {
                    this.threeNode!.opacity = opacity;
                    this.fourNode!.opacity = opacity;
                }, 0.1);
                this.showHideBtn!.getChildByName("des").getComponent(cc.Label).string = tcI18n.i18nLabel("v2_pgGame_menu_auto_hide");
            } else {
                this.showType = false;
                this.threeNode!.active = false;
                this.fourNode!.active = false;
                this.btnOutClose.y = -210
                this.showHideBtn!.getChildByName("des").getComponent(cc.Label).string = tcI18n.i18nLabel("v2_pgGame_menu_auto_more");
            }
            this.layoutAutoRotaion?.updateLayout();
        });

        this.slider1Handle.on("click", () => {
            if (this.spinNum > 0) {
                this.onSlider1Active();
            }
        });
    }

    private onSlider1Active() {
        this.slider1Fun(this.slider1);
        this.updateSliderActive(this.slider2Handle!, this.slider2!, true);
        this.updateSliderActive(this.slider3Handle!, this.slider3!, true);
    }

    private updateSliderActive(sliderHandle: cc.Node, slider: cc.Slider, bActive: boolean) {
        slider!.node.parent.opacity = bActive ? 255 : 150;
        slider!.enabled = bActive;
        sliderHandle!.getComponent(cc.Button).interactable = bActive;
    }

    //刷新自动次数按钮交互状态
    private updateAutoCountBtnsTransition(selectIndex: number) {
        this.clickBtns?.children.forEach((btn, index) => {
            btn.getComponent(cc.Button).transition = index == selectIndex ? cc.Button.Transition.NONE : cc.Button.Transition.COLOR;
        });
    }

    public init(bonusCount: number, BetCount: number, WinCount: number, callback?: Function, btnClickSound?: string) {
        tcLog.info("autoRotation", bonusCount, BetCount, WinCount);
        this.labelBonus && (this.labelBonus.string = `${currency.formatWithSymbol(bonusCount)}`);
        this.labelBet && (this.labelBet.string = `${currency.formatWithSymbol(BetCount)}`);
        this.labelWin && (this.labelWin.string = `${currency.formatWithSymbol(WinCount)}`);
        this.BetCount = BetCount;
        this.callBack = callback;
        this.btnClickSound = btnClickSound;
    }

    public setAutoSettingSliderClickSound(soundName: string) {
        this.clickSliderSoundName = soundName;
    }
    public setSliderCallback(callback?: Function) {
        this.sliderMumChangeCallback = callback;
    }

    //设置累计输钱停止
    private slider1Fun(slider?: cc.Slider) {
        if (!slider) {
            return;
        }
        this.maskBtnStart!.active = false;
        if (!this.playedSlider1Sound) {
            this.playedSlider1Sound = true;
            uAudio.getInstance().playEffect(this.clickSliderSoundName);
        }
        this.slider1Deal(slider);
    }

    private slider1Deal(slider?: cc.Slider) {
        let count = slider!.node.getComponent(cc.Slider).progress * slider!.node.width;
        this.slider1!.node.getChildByName("jdt").width = count;
        let len = (this.BetCount! * this.spinNum!) / 2;
        this.slider1Mum = len;
        this.slider1Mum += (count / 700) * len;
        if (this.slider1Mum == 0) {
            this.slider1!.node.getChildByName("num").getComponent(cc.Label).string = tcI18n.i18nLabel("v2_pgGame_menu_auto_none");
        } else {
            this.slider1Mum = Math.round(this.slider1Mum / 10000) * 10000
            this.slider1!.node.getChildByName("num").getComponent(cc.Label).string = currency.formatWithSymbol(this.slider1Mum);
        }
    }

    //设置累计赢钱停止
    private slider2Fun(slider: cc.Slider) {
        if (!this.playedSlider2Sound) {
            this.playedSlider2Sound = true;
            uAudio.getInstance().playEffect(this.clickSliderSoundName);
        }
        this.maskBtnStart!.active = false;
        let count = slider.node.getComponent(cc.Slider).progress * slider.node.width;
        this.slider2!.node.getChildByName("jdt").width = count;
        this.slider2Mum = Number(((count / 700) * (5000 * this.BetCount!)).toFixed(2));
        if (this.slider2Mum == 0) {
            this.slider2!.node.getChildByName("num").getComponent(cc.Label).string = tcI18n.i18nLabel("v2_pgGame_menu_auto_none");
        } else {
            this.slider2Mum = Math.round(this.slider2Mum / 10000) * 10000
            this.slider2!.node.getChildByName("num").getComponent(cc.Label).string = currency.formatWithSymbol(this.slider2Mum);
        }
    }

    //单局（旋转一次赢钱停止）
    private slider3Fun(slider: cc.Slider) {
        if (!this.playedSlider3Sound) {
            this.playedSlider3Sound = true;
            uAudio.getInstance().playEffect(this.clickSliderSoundName);
        }
        this.maskBtnStart!.active = false;
        let count = slider.node.getComponent(cc.Slider).progress * slider.node.width;
        this.slider3!.node.getChildByName("jdt").width = count;
        this.slider3Mum = Number(((count / 700) * (500 * this.BetCount!)).toFixed(2));
        if (this.slider3Mum == 0) {
            this.slider3!.node.getChildByName("num").getComponent(cc.Label).string = tcI18n.i18nLabel("v2_pgGame_menu_auto_none");
        } else {
            this.slider3Mum = Math.round(this.slider3Mum / 10000) * 10000
            this.slider3!.node.getChildByName("num").getComponent(cc.Label).string = currency.formatWithSymbol(this.slider3Mum);
        }
    }

    private onSetColor(index: number) {
        this.clickBtns?.children?.forEach((node, idx) => {
            if (idx == index) {
                node.getChildByName("num").color = this.labColor.select;
            } else {
                node.getChildByName("num").color = this.labColor.unselect;
            }
        });
    }

    private moveUp() {
        // cc.Tween.stopAllByTarget(this.node.getChildByName("body"));
        // const size = cc.view.getVisibleSize();
        // this.node.getChildByName("body").setPosition(0, -size.height, 0);
        // cc.tween(this.node.getChildByName("body"))
        //     .to(0.3, { position: cc.Vec3.ZERO }, { easing: "quintOut" })
        //     .call(() => {})
        //     .start();
        // creatorUtils.moveInv2(this.node.getChildByName("body"), () => {});
    }

    private moveDown() {
        // cc.Tween.stopAllByTarget(this.node.getChildByName("body"));
        // const size = cc.view.getVisibleSize();
        // cc.tween(this.body)
        //     .to(0.3, { position: cc.v3(0, -size.height, 0) }, { easing: "quintOut" })
        //     .call(() => {
        this.node.destroy();
        this.playedSlider1Sound = false;
        // })
        // .start();
    }
}
