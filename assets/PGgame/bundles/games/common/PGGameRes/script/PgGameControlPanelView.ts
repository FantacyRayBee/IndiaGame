// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

/**
 * PG  slot游戏底部公共控制节点
 */

import logger from "../../../../../ApiTemplate/script/net/logger";
import { SelectGameMrg } from "../../../../../ApiTemplate/script/tools/SelectGameMrg";
import { event } from "../../../../../script/event/event";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
import { tcStorage } from "../../../../../script/framework/storage/storage";
import { creatorUtils } from "../../../../../script/pkg/creator";
import { currency } from "../../../../../script/pkg/currency";
import { FortuneRabbitDefine } from "../../../fortuneRabbit/script/fortune-rabbit-define";
import { pgGameEvent } from "./PgEvent";
import { EBtnSpineStatus } from "./PgGameControlPanelLogic";
import btnSpineRotateAni from "./btnSpineRotateAni";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PgGameControlPanelView extends cc.Component {
    private btnBonus: cc.Button | undefined;
    private btnWin: cc.Button | undefined;
    private btnBet: cc.Button | undefined;
    private labelCurBonus: cc.Label | undefined;
    private labelCurBet: cc.Label | undefined;
    private labelCurWin: cc.Label | undefined;
    private iconBet: cc.Node | undefined;

    private btnExit: cc.Button | undefined;
    private btnSound: cc.Button | undefined;
    private spriteBtnSound: cc.Sprite | undefined;
    private nodeSoundOff: cc.Node | undefined;

    private nodeSetting: cc.Node | undefined;
    private nodeSetbg: cc.Node | undefined;
    private btnPaytable: cc.Button | undefined;
    private btnRule: cc.Button | undefined;
    private btnHistory: cc.Button | undefined;
    private btnCloseSetting: cc.Button | undefined;
    private btnOpenSetting: cc.Button | undefined;

    private nodeSpine: cc.Node | undefined;
    private btnQickMode: cc.Button | undefined;
    private nodeBtnQickLight: cc.Node | undefined;
    private nodeQuickEffect: cc.Node | undefined;
    private activeBtnQuicMode: cc.Node | undefined;
    private unActiveBtnQuicMode: cc.Node | undefined;
    private btnSubBet: cc.Button | undefined;
    private btnAddBet: cc.Button | undefined;
    private btnStartAutoMode: cc.Button | undefined;
    private btnSpin: cc.Button | undefined;
    private btnStopAutoMode: cc.Button | undefined;
    private nodeBtnStartAutoEffect: sp.Skeleton | undefined;
    private labelAutoCount: cc.Label | undefined;
    //控制spin按钮选择速度
    private btnSpinRotateAni: btnSpineRotateAni | undefined;
    private spriteBtnSpinNormal: cc.Sprite | undefined;
    private spriteBtnSpineRun: cc.Sprite | undefined;
    private spriteBtnSpin: cc.Sprite | undefined;
    private btnSpinHoverEffect: sp.Skeleton | undefined;
    private btnStopHoverEffect: sp.Skeleton | undefined;
    private btnRotation: btnSpineRotateAni | undefined;

    private curBtnSpinStatus: EBtnSpineStatus = EBtnSpineStatus.ACTIVE_NORMAL;

    private sp_btnSpinEffect: sp.Skeleton | undefined;
    private bMinBet: boolean = false;
    private bMaxBet: boolean = false;

    private curShowBonus: number = 0;
    private curBonus: number = 0;
    private addBonusStep: number = 0;

    private bAutoEffectPlaying: boolean = false;
    private isHovering: boolean = false;

    onLoad(): void {
        this.btnBonus = cc.find("nodeBonus", this.node).getComponent(cc.Button);
        this.btnWin = cc.find("nodeWin", this.node).getComponent(cc.Button);
        this.btnBet = cc.find("nodeBet", this.node).getComponent(cc.Button);
        this.labelCurBonus = cc.find("nodeBonus/label", this.node).getComponent(cc.Label); //当前玩家货币数量
        this.labelCurBet = cc.find("nodeBet/label", this.node).getComponent(cc.Label); //当前下注额度
        this.iconBet = cc.find("nodeBet/icon", this.node);
        this.labelCurWin = cc.find("nodeWin/label", this.node).getComponent(cc.Label); //当前中奖额度

        this.nodeSetting = cc.find("nodeSetting", this.node);
        this.nodeSetbg = cc.find("nodeSetting/bg", this.node);
        this.nodeSetbg.addComponent(cc.Button);
        this.nodeSpine = cc.find("nodeSpine", this.node);
        this.btnExit = cc.find("nodeSetting/btnExit", this.node).getComponent(cc.Button);
        this.btnSound = cc.find("nodeSetting/btnSound", this.node).getComponent(cc.Button);
        this.spriteBtnSound = cc.find("nodeSetting/btnSound/Background", this.node).getComponent(cc.Sprite);
        this.nodeSoundOff = cc.find("nodeSoundClose", this.node);
        this.btnPaytable = cc.find("nodeSetting/btnPaytable", this.node).getComponent(cc.Button);
        this.btnRule = cc.find("nodeSetting/btnRule", this.node).getComponent(cc.Button);
        this.btnHistory = cc.find("nodeSetting/btnHistory", this.node).getComponent(cc.Button);
        this.btnCloseSetting = cc.find("nodeSetting/btnClose", this.node).getComponent(cc.Button);
        this.btnOpenSetting = cc.find("nodeSpine/btnOpenSetting", this.node).getComponent(cc.Button);
        this.btnQickMode = cc.find("nodeSpine/btnQickMode", this.node).getComponent(cc.Button);
        this.nodeBtnQickLight = cc.find("nodeSpine/btnQickMode/active/active", this.node);
        this.nodeQuickEffect = cc.find("nodeSpine/btnQickMode/turbo_yellow_rabbit", this.node);
        this.activeBtnQuicMode = this.btnQickMode?.node.getChildByName("active");
        this.unActiveBtnQuicMode = this.btnQickMode?.node.getChildByName("unActive");
        this.btnSubBet = cc.find("nodeSpine/btnSub", this.node).getComponent(cc.Button);
        this.btnAddBet = cc.find("nodeSpine/btnAdd", this.node).getComponent(cc.Button);
        this.btnStartAutoMode = cc.find("nodeSpine/btnAuto", this.node).getComponent(cc.Button);
        this.btnSpin = cc.find("btnSpine", this.node).getComponent(cc.Button);
        this.btnStopAutoMode = cc.find("btnAutostop", this.node).getComponent(cc.Button);
        this.nodeBtnStartAutoEffect = cc.find("nodeSpine/btnAuto/Automaticbutton", this.node).getComponent(sp.Skeleton);
        this.labelAutoCount = cc.find("btnAutostop/label", this.node).getComponent(cc.Label);

        this.btnSpinRotateAni = cc.find("Background/icon", this.btnSpin.node).getComponent(btnSpineRotateAni);
        this.spriteBtnSpin = cc.find("Background/icon", this.btnSpin.node).getComponent(cc.Sprite);
        this.spriteBtnSpinNormal = cc.find("btnSpine/Background/icon/normal", this.node).getComponent(cc.Sprite);
        this.spriteBtnSpineRun = cc.find("btnSpine/Background/icon/run", this.node).getComponent(cc.Sprite);
        this.sp_btnSpinEffect = cc.find("btnSpine/effect/anniu", this.node).getComponent(sp.Skeleton);
        this.btnSpinHoverEffect = cc.find("btnSpine/spin", this.node).getComponent(sp.Skeleton);
        this.btnStopHoverEffect = cc.find("btnAutostop/spin", this.node).getComponent(sp.Skeleton);
        this.btnRotation = this.btnSpin.node.getComponentInChildren(btnSpineRotateAni);

        this.btnStopHoverEffect.setCompleteListener(() => {
            this.scheduleOnce(() => {
                this.playStopHoverEffect();
            }, 1);
        });
    }

    protected start(): void {
        cc.systemEvent.on(pgGameEvent.updateBonus, this.updateBouns, this);
        cc.systemEvent.on(pgGameEvent.updateCurBet, this.updateCurBet, this);
        cc.systemEvent.on(pgGameEvent.updateCurWinCount, this.updateCurWinCount, this);
    }

    protected onEnable(): void {
        this.updateNodeBtnsStatus(true, 0);
        this.initSoundIconStatus();
        this.btnSpin!.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.btnSpin!.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.btnStopAutoMode!.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnterBtnStopAuto, this);
        this.btnStopAutoMode!.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeaveBtnStopAuto, this);
        cc.systemEvent.on(pgGameEvent.openBetPanel, this.openBetPanel, this);
    }

    protected onDisable(): void {
        this.btnSpin!.node.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.btnSpin!.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.btnStopAutoMode!.node.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnterBtnStopAuto, this);
        this.btnStopAutoMode!.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeaveBtnStopAuto, this);
        cc.systemEvent.off(pgGameEvent.openBetPanel, this.openBetPanel, this);
    }

    private openBetPanel() {
        cc.Tween.stopAllByTarget(this.iconBet)
        cc.tween(this.iconBet)
            .set({ opacity: 100 })
            .delay(0.1)
            .set({ opacity: 255 })
            .start()
    }


    public BounsObj = { score: 0 }
    /**刷新玩家当前bonus */
    public updateBouns(value?: number, playAni: boolean = false, lastBonus: number = 0) {
        if (value == null) {
            return;
        }

        // this.curBonus = value;
        if (playAni) {
            // this.curShowBonus = 0;
            // this.curShowBonus = lastBonus; //FortuneRabbitTable.tabelInfo.lastBonus;
            // let addedValue = value - this.curShowBonus;
            // this.addBonusStep = addedValue / 5;
            logger.purple(` start UpdateBonusAni`, lastBonus);
            this.labelCurBonus!.string = `${currency.formatWithSymbol(lastBonus)}`;
            // this.schedule(this.playUpdateBonusAni, 0.1, 5, 0.01);


            cc.Tween.stopAllByTarget(this.BounsObj)
            this.BounsObj.score = 0
            cc.tween(this.BounsObj)
                .to(0.5, { score: value }, {
                    progress: (start, end, current, ratio) => {
                        // console.log("progress score:", start + (end - start) * ratio);

                        let tmp = start + (end - start) * ratio
                        this.labelCurBonus!.string = `${currency.formatWithSymbol(tmp)}`;
                        return start + (end - start) * ratio;
                    }
                })
                .call(() => {
                    logger.purple(` end score`, value);
                    this.labelCurBonus!.string = `${currency.formatWithSymbol(value)}`;
                })
                .start()


        } else {
            // this.curShowBonus = value;
            // this.unschedule(this.playUpdateBonusAni);

            cc.Tween.stopAllByTarget(this.BounsObj)

            logger.purple(` end UpdateBonusAni`, value);
            this.labelCurBonus!.string = `${currency.formatWithSymbol(value)}`;
        }
    }


    // private playUpdateBonusAni() {
    //     logger.purple(` playUpdateBonusAni curShowBonus:`, this.curShowBonus, `  curBonus:`, this.curBonus);
    //     if (this.curShowBonus < this.curBonus) {
    //         this.curShowBonus += this.addBonusStep;
    //     }

    //     this.curShowBonus = Math.min(this.curShowBonus, this.curBonus);
    //     logger.purple(` playUpdateBonusAni end curShowBonus:`, this.curShowBonus, `  curBonus:`, this.curBonus);
    //     this.labelCurBonus!.string = `${currency.formatWithSymbol(this.curShowBonus)}`;
    // }

    /**刷新当前下注额度 */
    public updateCurBet(value: number, bMin: boolean, bMax: boolean, showAni: boolean = true) {
        if (value == null) {
            return;
        }
        this.bMaxBet = bMax;
        this.bMinBet = bMin;
        this.setBtnBetSubGray(bMin);
        this.setBtnBetAddGray(bMax);
        cc.systemEvent.emit(event.UPDATEBET);
        this.labelCurBet!.string = `${currency.formatWithSymbol(value)}`;
        showAni && this.shakeCurBetLabel();
    }

    public shakeCurBetLabel() {
        cc.tween(this.labelCurBet?.node)
            .to(0.1, { scale: 1.5 })
            .to(0.25, { scale: 1 }, { easing: cc.easing.backOut })
            .start();
    }
    /**刷新玩家当局赢得的额度 */
    public updateCurWinCount(value?: number) {
        if (value == null) {
            return;
        }
        this.labelCurWin!.string = `${currency.formatWithSymbol(value)}`;
    }
    public bindClickBtnSetbg(callback: Function) {
        this.nodeSetbg?.on("click", callback, this);
    }

    public bindClickBtnOpenSetting(callback: Function) {
        this.btnOpenSetting?.node.on("click", callback, this);
    }
    public bindClickBtnCloseSetting(callback: Function) {
        this.btnCloseSetting?.node.on("click", callback, this);
    }

    public bindClickBtnBonus(callback: Function) {
        this.btnBonus?.node.on("click", callback, this);
    }
    public bindClickBtnWin(callback: Function) {
        this.btnWin?.node.on("click", callback, this);
    }
    public bindClickBtnBet(callback: Function) {
        this.btnBet?.node.on("click", callback, this);
    }
    public bindClickBtnExit(callback: Function) {
        this.btnExit?.node.on("click", callback, this);
    }
    public bindClickBtnSound(callback: Function) {
        this.btnSound?.node.on("click", callback, this);
    }
    public bindClickBtnPaytable(callback: Function) {
        this.btnPaytable?.node.on("click", callback, this);
    }
    public bindClickBtnRule(callback: Function) {
        this.btnRule?.node.on("click", callback, this);
    }
    public bindClickBtnHistory(callback: Function) {
        this.btnHistory?.node.on("click", callback, this);
    }
    // public bindClickBtnClose(callback: Function) {
    //     this.btnClose?.node.on("click", callback, this);
    // }
    public bindClickBtnQickMode(callback: Function) {
        this.btnQickMode?.node.on("click", callback, this);
    }
    public bindClickBtnSubBet(callback: Function) {
        this.btnSubBet?.node.on("click", callback, this);
    }
    public bindClickBtnAddBet(callback: Function) {
        this.btnAddBet?.node.on("click", callback, this);
    }
    public bindClickBtnStartAutoMode(callback: Function) {
        this.btnStartAutoMode?.node.on("click", callback, this);
    }
    public bindClickBtnSpin(callback: Function) {
        this.btnSpin?.node.on("click", callback, this);
    }
    public bindClickBtnStopAutoMode(callback: Function) {
        this.btnStopAutoMode?.node.on("click", callback, this);
    }

    public async onClickBtnSound(bSoundOn: boolean) {
        try {
            let sprite = await tcRes.load("PGGameRes", cc.SpriteFrame, bSoundOn ? "artwork/icon_sound_open" : "artwork/icon_sound_close");
            this.spriteBtnSound!.spriteFrame = sprite;
        } catch (err: any) {
            tcLog.error(`PgGameControlPanelView.onClickBtnSound load soundSPrite err:${err}`);
        }
    }

    /**切换按钮组状态 */
    public updateNodeBtnsStatus(showSpineNode: boolean, duration: number = 0.2) {
        let soundSwitch = tcStorage.readAny(tcStorage.Keys.SoundSwitch) ?? "on";
        let bSoundOpen = soundSwitch === "on";
        this.nodeSoundOff!.active = showSpineNode && !bSoundOpen;
        let showPosTween = cc.tween().to(duration, { position: cc.v3(0, 151, 0) });
        let showFadeTween = cc.tween().to(duration, { opacity: 255 });
        let hidePosTween = cc.tween().to(duration, { position: cc.v3(0, 0, 0) });
        let hideFadeTween = cc.tween().to(duration, { opacity: 0 }).set({ active: false });
        cc.Tween.stopAllByTarget(this.nodeSetting);
        cc.Tween.stopAllByTarget(this.nodeSpine);
        cc.Tween.stopAllByTarget(this.btnSpin?.node);
        if (showSpineNode) {
            cc.tween(this.nodeSetting).set({ active: true }).parallel(hidePosTween, hideFadeTween).start();
            cc.tween(this.nodeSpine).set({ active: true }).parallel(showPosTween, showFadeTween).start();
            cc.tween(this.btnSpin?.node).set({ active: true }).to(0.1, { opacity: 255 }).start();
            this.btnSpinRotateAni?.startRotate(4);
        } else {
            cc.tween(this.nodeSetting).set({ active: true }).parallel(showPosTween, showFadeTween).start();
            cc.tween(this.nodeSpine).set({ active: true }).parallel(hidePosTween, hideFadeTween).start();
            cc.tween(this.btnSpin?.node).to(0.1, { opacity: 0 }).set({ active: false }).start();
        }
    }

    //刷新快速模式按钮状态
    public updateBtnQuickModeStatus(showQuickStatus: boolean, bQuickMode: boolean) {
        this.activeBtnQuicMode && (this.activeBtnQuicMode.active = showQuickStatus);
        bQuickMode && (this.nodeBtnQickLight.scale = 0.9);
        this.unActiveBtnQuicMode && (this.unActiveBtnQuicMode.active = !showQuickStatus);
        if (bQuickMode) {
            //打开状态需要播放特效
            this.nodeQuickEffect && (this.nodeQuickEffect.active = true);
        } else {
            //关闭特效
            this.nodeQuickEffect && (this.nodeQuickEffect.active = false);
        }
    }

    /**更新spine按钮状态 */
    public setBtnSpineStatus(status: EBtnSpineStatus, bQuickMode: boolean = false, unableSpinBtnSpinGray: boolean = true) {
        SelectGameMrg.getInstance().preDoTime = new Date().getTime()
        // console.log("setBtnSpineStatus:", status);


        let colorStr = "#F5F5F5";
        this.curBtnSpinStatus = status;
        let clickEffects;
        switch (status) {
            case EBtnSpineStatus.ACTIVE_NORMAL:
                this.spriteBtnSpin!.spriteFrame = this.spriteBtnSpinNormal!.spriteFrame;
                this.btnSpinRotateAni?.startRotate(4);
                creatorUtils.setNodeGray(this.btnSpinRotateAni?.node!, false);
                this.setBtnOpactivty(this.btnSubBet!.node, this.bMinBet);
                this.setBtnOpactivty(this.btnAddBet!.node, this.bMaxBet);
                this.setBtnOpactivty(this.btnStartAutoMode!.node, false);
                this.setBtnOpactivty(this.btnOpenSetting!.node, false);
                this.btnSpin!.interactable = true;
                this.btnAddBet!.interactable = true;
                this.btnSubBet!.interactable = true;
                this.btnStartAutoMode!.interactable = true;
                this.btnOpenSetting!.interactable = true;
                this.btnBonus!.interactable = true;
                this.btnBet!.interactable = true;
                this.btnWin!.interactable = true;
                colorStr = "#81FFF9";
                this.isHovering && this.onMouseEnter();
                break;
            case EBtnSpineStatus.ACTIVE_RUN:
                this.btnSpinRotateAni?.startRotate(bQuickMode ? 0.3 : 0.4);
                creatorUtils.setNodeGray(this.btnSpinRotateAni?.node!, false);
                this.spriteBtnSpin!.spriteFrame = this.spriteBtnSpineRun!.spriteFrame;
                this.setBtnOpactivty(this.btnSubBet!.node, true);
                this.setBtnOpactivty(this.btnAddBet!.node, true);
                this.setBtnOpactivty(this.btnStartAutoMode!.node, true);
                this.setBtnOpactivty(this.btnOpenSetting!.node, true);

                this.btnAddBet!.interactable = false;
                this.btnSubBet!.interactable = false;
                this.btnStartAutoMode!.interactable = false;
                this.btnOpenSetting!.interactable = false;
                this.btnWin!.interactable = false;
                this.btnBonus!.interactable = false;
                this.btnBet!.interactable = false;
                colorStr = "#FFFFFF";
                this.isHovering && this.onMouseEnter();
                break;
            case EBtnSpineStatus.UNACTIVE_NORMAL:
                this.spriteBtnSpin!.spriteFrame = this.spriteBtnSpinNormal!.spriteFrame;
                this.btnSpinRotateAni?.startRotate(4);
                creatorUtils.setNodeGray(this.btnSpinRotateAni?.node!, true);

                this.setBtnOpactivty(this.btnSubBet!.node, true);
                this.setBtnOpactivty(this.btnAddBet!.node, true);
                this.setBtnOpactivty(this.btnStartAutoMode!.node, true);
                this.setBtnOpactivty(this.btnOpenSetting!.node, true);

                this.btnSpin!.interactable = false;
                this.btnAddBet!.interactable = false;
                this.btnSubBet!.interactable = false;
                this.btnStartAutoMode!.interactable = false;
                this.btnOpenSetting!.interactable = false;
                this.btnBonus!.interactable = false;
                this.btnBet!.interactable = false;
                colorStr = "#FFFFFF";
                this.hideBtnSpinHoverEfect();
                clickEffects = this.btnSpin?.getComponentsInChildren(sp.Skeleton);
                clickEffects &&
                    clickEffects.forEach((ani) => {
                        ani.clearTracks();
                    });
                break;
            case EBtnSpineStatus.UNACTIVE_RUN:
                this.spriteBtnSpin!.spriteFrame = this.spriteBtnSpineRun!.spriteFrame;
                this.btnSpinRotateAni?.startRotate(bQuickMode ? 0.3 : 0.4);
                creatorUtils.setNodeGray(this.btnSpinRotateAni?.node!, unableSpinBtnSpinGray);
                this.setBtnOpactivty(this.btnSubBet!.node, true);
                this.setBtnOpactivty(this.btnAddBet!.node, true);
                this.setBtnOpactivty(this.btnStartAutoMode!.node, true);
                this.setBtnOpactivty(this.btnOpenSetting!.node, true);

                this.btnSpin!.interactable = false;
                this.btnAddBet!.interactable = false;
                this.btnSubBet!.interactable = false;
                this.btnStartAutoMode!.interactable = false;
                this.btnOpenSetting!.interactable = false;
                this.btnBonus!.interactable = false;
                this.btnBet!.interactable = false;
                colorStr = "#FFFFFF";
                this.hideBtnSpinHoverEfect();
                break;
            case EBtnSpineStatus.UNACTIVE_STOP:
                this.spriteBtnSpin!.spriteFrame = this.spriteBtnSpinNormal!.spriteFrame;
                creatorUtils.setNodeGray(this.btnSpinRotateAni?.node!, true);
                this.btnRotation!.stopRotate();
                this.btnSpin!.interactable = false;
                this.btnAddBet!.interactable = false;
                this.btnSubBet!.interactable = false;
                this.btnStartAutoMode!.interactable = false;
                this.btnOpenSetting!.interactable = false;
                this.btnBonus!.interactable = false;
                this.btnBet!.interactable = false;
                this.hideBtnSpinHoverEfect();
            default:
                break;
        }
        this.updateLabelColor(colorStr);
    }

    public setBtnsInterable() { }

    public setBtnBetAddGray(bGray: boolean) {
        let opacity = bGray ? 70 : 255;
        this.btnAddBet!.node.opacity = opacity;
        this.btnAddBet!.transition = bGray ? cc.Button.Transition.NONE : cc.Button.Transition.COLOR;
    }

    public setBtnBetSubGray(bGray: boolean) {
        let opacity = bGray ? 70 : 255;
        this.btnSubBet!.node.opacity = opacity;
        this.btnSubBet!.transition = bGray ? cc.Button.Transition.NONE : cc.Button.Transition.COLOR;
    }

    private setBtnOpactivty(btnNode: cc.Node, active: boolean) {
        let opacity = active ? 70 : 255;
        btnNode!.opacity = opacity;
    }

    private updateLabelColor(colorStr: string = "F5F5F5") {
        this.labelCurBet!.node.color = cc.Color.fromHEX(new cc.Color(), colorStr);
        this.labelCurBonus!.node.color = cc.Color.fromHEX(new cc.Color(), colorStr);
        this.labelCurWin!.node.color = cc.Color.fromHEX(new cc.Color(), colorStr);
    }

    //刷新剩余自动spin次数
    public setLeftAutoSpinCount(autoSpinCount: number) {
        this.labelAutoCount!.string = autoSpinCount.toString();
    }
    //设置自动和手动按钮状态
    public setBtnSpinStatus(showBtnSpin: boolean, autoSpinCount: number = 0) {
        this.btnStopAutoMode!.node.active = !showBtnSpin;
        this.nodeBtnStartAutoEffect!.node.active = !showBtnSpin;
        if (!showBtnSpin && !this.bAutoEffectPlaying) {
            this.bAutoEffectPlaying = true;
            this.nodeBtnStartAutoEffect?.setAnimation(0, "animation", true);
        }
        this.btnSpin!.node.active = showBtnSpin;
        if (showBtnSpin) {
            this.setBtnSpineStatus(EBtnSpineStatus.ACTIVE_NORMAL);
        } else {
            this.updateLabelColor("#F5F5F5");
            this.setLeftAutoSpinCount(autoSpinCount);
        }
    }

    private initSoundIconStatus() {
        let soundSwitch = tcStorage.readAny(tcStorage.Keys.SoundSwitch) ?? "on";
        let bSoundOpen = soundSwitch === "on";
        this.onClickBtnSound(bSoundOpen);
    }

    public playBtnSpinEffect() {
        if (this.btnSpin) {
            this.btnSpin.node.scale = 1;
            cc.tween(this.btnSpin?.node).to(0.12, { scale: 0.95 }).to(0.07, { scale: 1 }).start();
        }

        this.sp_btnSpinEffect.setAnimation(0, "animation", false);

        // let allSkeletions = this.btnSpin?.getComponentsInChildren(sp.Skeleton);
        // if (allSkeletions) {
        //     allSkeletions.forEach((ani) => {
        //         ani.setAnimation(0, "animation", false);
        //     });
        // }
    }

    public startFeatureStatus(bAutoMode: boolean) {
        this.nodeSoundOff!.active = false;
        this.btnSpin!.node.active = false;
        this.btnStopAutoMode!.node.active = false;
        this.nodeSpine!.active = false;
    }

    public existFeatureStatus(bAutoMode: boolean) {
        let soundSwitch = tcStorage.readAny(tcStorage.Keys.SoundSwitch) ?? "on";
        let bSoundOpen = soundSwitch === "on";
        this.nodeSoundOff!.active = !bSoundOpen;
        !bAutoMode && (this.btnSpin!.node.active = true);
        bAutoMode && (this.btnStopAutoMode!.node.active = true);
        this.nodeSpine!.active = true;
    }

    private onMouseEnter() {
        this.isHovering = true;
        if (this.curBtnSpinStatus != EBtnSpineStatus.ACTIVE_NORMAL && this.curBtnSpinStatus != EBtnSpineStatus.ACTIVE_RUN) {
            return;
        }

        if (this.btnSpinHoverEffect!.node.active) {
            return;
        }
        this.btnSpinHoverEffect!.node.active = true;
        this.playSpinHoverEffect();
    }

    private onMouseLeave() {
        this.isHovering = false;
        this.hideBtnSpinHoverEfect();
    }

    private playSpinHoverEffect() {
        this.btnSpinHoverEffect!.setAnimation(0, "animation", false);
        this.unscheduleAllCallbacks();
        this.scheduleOnce(() => {
            if (!this.isHovering) {
                return;
            }
            this.playSpinHoverEffect();
        }, 1.5);
    }

    private hideBtnSpinHoverEfect() {
        this.btnSpinHoverEffect!.node.active = false;
    }

    private onMouseLeaveBtnStopAuto() {
        this.btnStopHoverEffect!.node.active = false;
    }

    private onMouseEnterBtnStopAuto() {
        this.btnStopHoverEffect!.node.active = true;
        this.playStopHoverEffect();
    }

    private playStopHoverEffect() {
        this.btnStopHoverEffect!.node.active && this.btnStopHoverEffect!.setAnimation(0, "animation2", false);
    }
}
