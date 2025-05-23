// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

/**PG slot游戏底部公共控制模块逻辑类 */

import { pgGameEvent } from "./PgEvent";
import PgGameAutorotationView from "./PgAutorotation";
import PgGameBetSettingView from "./pgGameBetSettingView";
import PgGameControlPanelView from "./PgGameControlPanelView";
import PgGameWalletView from "./PgGameWalletView";
import { env } from "../../../../../script/app/env";
import { tcLog } from "../../../../../script/framework/log/log";
import { uAudio } from "../../../../../script/framework/audio/audio";
import { config, gameHelper } from "../../../../../script/config/config";
import { tcRes } from "../../../../../script/framework/res/res";
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { throttle } from "../../../../../script/descriptor/descriptor";
import { event } from "../../../../../script/event/event";
import { gameLoadingDialog } from "../../gameCommon/script/game-loading";
import { gameToast } from "../../gameCommon/script/game-toast";
import { RoundTips } from "../../gameCommon/script/round-tips ";
import { currency } from "../../../../../script/pkg/currency";
import { sdk } from "../../../../../script/sdk/sdk";
import { gameData } from "../../../../update-v2/script/api/api-config";
import PgGameRuleView from "./PgGameRuleView";
import PgGameHistoryView from "./PgGameHistoryView";
import logger from "../../../../../ApiTemplate/script/net/logger";

const { ccclass, property } = cc._decorator;

//公用pg底部公共节点logic实现改接口提供数据
export interface PgGameLogicHandler {
    getRuleNodeURL(): string; //规则节点路径（从各游戏bundle下一级开始）
    getHistoryData(): void; //历史记录数据
    getHistoryNodeURL(): string; //规则节点路径（从各游戏bundle下一级开始）
    getPayTableNodeURL(): string; //赔付表节点路径（从各游戏bundle下一级开始）
    getPayTimes(): number; //获取赔率倍数
    getBetSizes(): number[]; //获取最初下注额
    getControlPanelNode(): cc.Node | undefined; //获取游戏场景中公共模块节点
    getClickBtnSound(): string; //点击按钮音效
    getBgMusic(): string; //背景乐
    getAutoSettingSliderClickSound(); //点击自动次数设置滑动条音效
}

//spine按钮4中状态
export enum EBtnSpineStatus {
    ACTIVE_NORMAL,
    ACTIVE_RUN,
    UNACTIVE_NORMAL,
    UNACTIVE_RUN,
    UNACTIVE_STOP,
}

export default class PgGameControlPanelLogic {
    private gameLogic: PgGameLogicHandler | undefined;
    private viewNode: cc.Node | undefined;
    private view: PgGameControlPanelView | undefined;
    //规则弹框
    private ruleView: PgGameRuleView | undefined;
    private payTableView: PgGameRuleView | undefined;
    private historyView: PgGameHistoryView | undefined;
    private payWalletView: PgGameWalletView | undefined;
    private PgAutorotationView: PgGameAutorotationView | undefined;
    private autoSpinNum: number = 0; //自动旋转次数
    private curWin: number = 0; //当前获得
    private betSettingView: PgGameBetSettingView | undefined;
    private bQuickModel: boolean = false; //当前是否是快速模式
    private curGameId: number = 0;
    //下注额度配置
    private betTimes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    private betTotals: number[] = [];
    private curBetIndex: number = env.curGameData.betIndex; //要调整初始下注额度，依据betTotals的值修改该值即可
    private curBetSizeIndex: number = 0; //当前下注大小序号
    private curBetMulIndex: number = 0;
    private defaultBetSize = 0;
    private defaultBetMul = 0;

    //判定 停止旋转的三个条件
    private stopAudioSpinCondition = {
        slider1Mum: 0,
        slider2Mum: 0,
        slider3Mum: 0,
    };

    private autoModeWinAll: number = 0; //自动模式累计输赢钱
    private autoModeWinOnce: number = 0; //自动模式单局赢钱

    constructor(gameId: number, gameLogic: PgGameLogicHandler) {
        this.curGameId = gameId;
        this.gameLogic = gameLogic;
    }

    init() {
        this.show();
        this.initBetData();
        this.createBetSettingView();
        cc.systemEvent.on(event.BTNSPIN_STATUS_CHANGE, this.changeBtnSpinStatus, this);
    }

    public show() {
        this.viewNode = this.gameLogic?.getControlPanelNode();
        if (!this.viewNode) {
            tcLog.error("PgGameControlPanelLogic.show,viewNode = null");
            return;
        }
        // try {
        this.view = this.viewNode.addComponent(PgGameControlPanelView);
        //首次状态为关闭状态，但表现为打开状态
        this.view?.updateBtnQuickModeStatus(true, this.bQuickModel);
        this.setBonus(env.curGameData.balance);
        this.setBetNum(this.getBetNum());
        this.setWinCount(0);
        this.bindClickEvent();
        // } catch (err: any) {
        //     tcLog.error(`PgGameControlPanelLogic.show error:${err}`);
        // }
    }

    private bindClickEvent() {
        this.view?.bindClickBtnBonus(this.onClickBtnBonus.bind(this));
        this.view?.bindClickBtnWin(this.onClickBtnWin.bind(this));
        this.view?.bindClickBtnBet(this.onClickBtnBet.bind(this));
        this.view?.bindClickBtnExit(this.onClickBtnExit.bind(this));
        this.view?.bindClickBtnSound(this.onClickBtnSound.bind(this));
        this.view?.bindClickBtnPaytable(this.onClickBtnPaytable.bind(this));
        this.view?.bindClickBtnRule(this.onClickBtnRule.bind(this));
        this.view?.bindClickBtnHistory(this.onClickBtnHistory.bind(this));
        //this.view?.bindClickBtnClose(this.onClickBtnClose.bind(this));
        this.view?.bindClickBtnQickMode(this.onClickBtnQickMode.bind(this));
        this.view?.bindClickBtnSubBet(this.onClickBtnSubBet.bind(this));
        this.view?.bindClickBtnAddBet(this.onClickBtnAddBet.bind(this));
        this.view?.bindClickBtnStartAutoMode(this.onClickBtnStartAutoMode.bind(this));
        this.view?.bindClickBtnSpin(this.onClickBtnSpin.bind(this));
        this.view?.bindClickBtnStopAutoMode(this.onClickBtnStopAutoMode.bind(this));
        this.view?.bindClickBtnOpenSetting(this.onClickBtnOpenSetting.bind(this));
        this.view?.bindClickBtnCloseSetting(this.onClickBtnCloseSetting.bind(this));
        this.view?.bindClickBtnSetbg(this.onClickBtnSetbg.bind(this));
    }


    private async onClickBtnBonus() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        if (!this.payWalletView) {
            try {
                gameLoadingDialog.show({ duration: 20 });
                let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/pgGameWallet");
                let viewNode = cc.instantiate(node);
                viewNode.setParent(config.uiNode.dialog);
                this.payWalletView = viewNode.addComponent(PgGameWalletView);
                gameLoadingDialog.close();
            } catch (err) {
                tcLog.error(`PgGameControlPanellogic show pgGameWallet error,${err}`);
            }
        }
        this.payWalletView?.show();
    }
    private onClickBtnWin() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        // sdk.openHistoryDialog(env.user.userId, env.user.authorization, tcI18n.curLanguage);
        this.onClickBtnHistory()
    }

    private async createBetSettingView() {
        let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/pgGameBetSetting");
        let viewNode = cc.instantiate(node);
        viewNode.setParent(config.uiNode.dialog);
        this.betSettingView = viewNode.addComponent(PgGameBetSettingView);
        this.betSettingView.init(
            new Array<number>(...this.gameLogic!.getBetSizes()),
            new Array<number>(...this.betTimes),
            new Array<number>(...this.betTotals),
            this.gameLogic?.getPayTimes(),
            this.defaultBetSize,
            this.defaultBetMul,
            this.gameLogic?.getClickBtnSound()
        );
        this.betSettingView.setBetCallback((betValueIndex: number, mulIndex: number, betSizeIndex: number) => {
            this.curBetIndex = betValueIndex;
            this.curBetSizeIndex = betSizeIndex;
            this.curBetMulIndex = mulIndex;
            this.setBetNum(this.getBetNum(), true);
            tcLog.info("PgGameControlPaneLogic bet:", this.curBetIndex);
        });
        viewNode.active = false;
    }

    /**设置下注额 */
    private async onClickBtnBet() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        if (this.getSpinNum() > 0) {
            return;
        }
        if (!this.betSettingView) {
            try {
                gameLoadingDialog.show({ duration: 20 });
                this.createBetSettingView();
                gameLoadingDialog.close();
            } catch (err) {
                tcLog.error(`PgGameControlPanellogic show pgGameWallet error,${err}`);
            }
        }
        cc.systemEvent.emit(pgGameEvent.openBetPanel);
        setTimeout(() => {
            this.betSettingView?.show(this.getBetNum(), this.curWin);
        }, 200);
    }
    //================
    private onClickBtnExit() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        cc.systemEvent.emit(event.sendLeaveGameReq, this.curGameId);
    }
    /**自动旋转 */
    private async onClickBtnStartAutoMode() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        try {
            gameLoadingDialog.show({ duration: 20 });
            let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/pgGameAutorotation");
            let viewNode = cc.instantiate(node);
            viewNode.setParent(config.uiNode.dialog);
            this.PgAutorotationView = viewNode.addComponent(PgGameAutorotationView);
            this.PgAutorotationView.init(env.curGameData.balance, this.getBetNum(), this.curWin, this.setSpinNumFun.bind(this), this.gameLogic!.getClickBtnSound());
            this.PgAutorotationView.setAutoSettingSliderClickSound(this.gameLogic.getAutoSettingSliderClickSound());
            this.PgAutorotationView.setSliderCallback((data: { slider1Mum: number; slider2Mum: number; slider3Mum: number }) => {
                this.stopAudioSpinCondition = data;
            });
            gameLoadingDialog.close();
        } catch (err) {
            tcLog.error(`PgGameControlPanellogic show pgGameWallet error,${err}`);
            uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
            if (!this.PgAutorotationView) {
                try {
                    gameLoadingDialog.show({ duration: 20 });
                    let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/pgGameAutorotation");
                    let viewNode = cc.instantiate(node);
                    viewNode.setParent(config.uiNode.dialog);
                    this.PgAutorotationView = viewNode.addComponent(PgGameAutorotationView);
                    tcLog.log("-----------------------", this.curWin);
                    this.PgAutorotationView.init(env.curGameData.balance, this.getBetNum(), this.curWin, this.setSpinNumFun.bind(this), this.gameLogic!.getClickBtnSound());
                    this.PgAutorotationView.setAutoSettingSliderClickSound(this.gameLogic.getAutoSettingSliderClickSound());
                    this.PgAutorotationView.setSliderCallback((data: { slider1Mum: number; slider2Mum: number; slider3Mum: number }) => {
                        this.stopAudioSpinCondition = data;
                    });
                    gameLoadingDialog.close();
                } catch (err) {
                    tcLog.error(`PgGameControlPanellogic show pgGameWallet error,${err}`);
                }
            } else {
                //this.PgAutorotationView?.show();
            }
        }
    }

    private onClickBtnSound() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        let bSoundOpen = gameHelper.changeSoundStatus(this.gameLogic?.getBgMusic());
        this.view?.onClickBtnSound(bSoundOpen);
    }
    /**赔付表 */
    private async onClickBtnPaytable() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        if (!this.payTableView) {
            try {
                gameLoadingDialog.show({ duration: 20 });
                let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/pgGameRuleView");
                let viewNode = cc.instantiate(node);
                viewNode.setParent(config.uiNode.dialog);
                this.payTableView = viewNode.addComponent(PgGameRuleView);
                if (!this.gameLogic?.getPayTableNodeURL) {
                    tcLog.error(`PgGameContorlPanelLogic Does not implement interface PgGameLogicHandler`);
                    return;
                }
                gameLoadingDialog.close();
                this.payTableView.addContent(this.curGameId, tcI18n.i18nLabel("v2_pgGame_game_paytable"), this.gameLogic?.getPayTableNodeURL(), this.gameLogic?.getClickBtnSound());
            } catch (err) {
                tcLog.error(`PgGameControlPanellogic show pgGameWallet error,${err}`);
            }
        }
        this.payTableView?.show();
    }
    /**规则 */
    private async onClickBtnRule() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        if (!this.ruleView) {
            try {
                gameLoadingDialog.show({ duration: 20 });
                let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/pgGameRuleView");
                let viewNode = cc.instantiate(node);
                viewNode.setParent(config.uiNode.dialog);
                this.ruleView = viewNode.addComponent(PgGameRuleView);
                if (!this.gameLogic?.getRuleNodeURL) {
                    tcLog.error(`PgGameContorlPanelLogic Does not implement interface PgGameLogicHandler`);
                    return;
                }
                gameLoadingDialog.close();
                this.ruleView.addContent(this.curGameId, tcI18n.i18nLabel("v2_pgGame_game_rules"), this.gameLogic?.getRuleNodeURL(), this.gameLogic?.getClickBtnSound());
            } catch (err) {
                tcLog.error(`PgGameControlPanellogic show pgGameWallet error,${err}`);
            }
        }
        this.ruleView?.show();
    }
    /**历史记录 */
    public async onClickBtnHistory() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        // sdk.openHistoryDialog(env.user.userId, env.user.authorization, tcI18n.curLanguage);
        if (!this.historyView) {
            try {
                gameLoadingDialog.show({ duration: 20 });
                let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/history/UIhistory");
                let viewNode = cc.instantiate(node);
                viewNode.setParent(config.uiNode.dialog);
                this.historyView = viewNode.addComponent(PgGameHistoryView);
                if (!this.gameLogic?.getHistoryNodeURL) {
                    tcLog.error(`PgGameContorlPanelLogic Does not implement interface PgGameLogicHandler`);
                    return;
                }
                gameLoadingDialog.close();
                this.historyView.addContent(this.curGameId, tcI18n.i18nLabel("v2_pgGame_bottom_history"), this.gameLogic?.getHistoryNodeURL(), this.gameLogic?.getClickBtnSound());
            } catch (err) {
                tcLog.error(`PgGameControlPanellogic show onClickBtnHistory error,${err}`);
            }
        }
        this.historyView?.show();
    }

    private onClickBtnQickMode() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        this.bQuickModel = !this.bQuickModel;
        this.view?.updateBtnQuickModeStatus(this.bQuickModel, this.bQuickModel);
        RoundTips.show(this.bQuickModel);
    }

    @throttle(300)
    private onClickBtnSubBet() {
        this.view?.shakeCurBetLabel();
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());

        if (this.curBetIndex == 0) {
            gameToast.show(tcI18n.i18nLabel("v2_pgGame_bet_min_note"));
            return;
        }
        let curQuikIndex = 0;
        let curBet = this.betTotals[this.curBetIndex];
        // console.log("onClickBtnSubBet:", gameData.betTotalsForQuickBtn.join(","));
        for (let i = gameData.betTotalsForQuickBtn.length - 1; i >= 0; --i) {
            if (gameData.betTotalsForQuickBtn[i] < curBet) {
                curBet = gameData.betTotalsForQuickBtn[i];
                curQuikIndex = i;
                break;
            }
        }
        this.curBetIndex = this.betTotals.indexOf(curBet);

        let bMin = curBet == gameData.betTotalsForQuickBtn[0];
        let bMax = curBet == gameData.betTotalsForQuickBtn[gameData.betTotalsForQuickBtn.length - 1];

        this.view?.updateCurBet(this.getBetNum(), bMin, bMax, true);
        this.betSettingView?.initScrollViews(this.getBetNum());
        this.updateBetIndexs(curBet);
    }

    @throttle(300)
    private onClickBtnAddBet() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        this.view?.shakeCurBetLabel();
        let curQuikIndex = 0;
        let curBet = this.betTotals[this.curBetIndex];

        // console.log("onClickBtnAddBet:", gameData.betTotalsForQuickBtn.join(","));
        if (curBet >= gameData.betTotalsForQuickBtn[gameData.betTotalsForQuickBtn.length - 1]) {
            gameToast.show(tcI18n.i18nLabel("v2_pgGame_bet_max_note"));
            return;
        }

        for (let i = 0; i < gameData.betTotalsForQuickBtn.length; ++i) {
            if (gameData.betTotalsForQuickBtn[i] > curBet) {
                curBet = gameData.betTotalsForQuickBtn[i];
                curQuikIndex = i;
                break;
            }
        }

        this.curBetIndex = this.betTotals.indexOf(curBet);

        let bMin = curBet == gameData.betTotalsForQuickBtn[0];
        let bMax = curBet == gameData.betTotalsForQuickBtn[gameData.betTotalsForQuickBtn.length - 1];

        this.view?.updateCurBet(this.getBetNum(), bMin, bMax, true);
        this.betSettingView?.initScrollViews(this.getBetNum());
        this.updateBetIndexs(curBet);
    }

    updateBetIndexs(curBet: number) {
        for (let i = 0; i < gameData.betSizes.length; ++i) {
            for (let j = 0; j < this.betTimes.length; ++j) {
                let num = currency.accMul(gameData.betSizes[i], this.betTimes[j]);
                num = currency.accMul(num, gameData.betLines);
                if (num == curBet) {
                    this.curBetSizeIndex = i;
                    this.curBetMulIndex = j;
                    break;
                }
            }
        }
    }

    // private upateBtnAddAndSubBetGray(curQuikIndex: number) {
    //     this.view?.setBtnBetSubGray(this.curBetIndex == 0);
    //     this.view?.setBtnBetAddGray(curQuikIndex == gameData.betTotalsForQuickBtn.length - 1);
    // }

    private onClickBtnSpin() {
        // uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
        this.view?.playBtnSpinEffect();
        cc.systemEvent.emit(pgGameEvent.clickSpin);
    }

    @throttle(300)
    private onClickBtnStopAutoMode() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        this.autoSpinNum = 0;
        this.showBtnSpin();
        cc.systemEvent.emit(pgGameEvent.quikStopAutoSpin);
    }
    @throttle(300)
    onClickBtnOpenSetting() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        this.view?.updateNodeBtnsStatus(false);
    }
    @throttle(300)
    onClickBtnCloseSetting() {
        uAudio.getInstance().playEffect(this.gameLogic!.getClickBtnSound());
        this.view?.updateNodeBtnsStatus(true);
    }

    @throttle(300)
    onClickBtnSetbg() {
    }

    //设置自动spine次数
    public setSpinNumFun(arg0: number, totalWinCount?: number) {
        this.autoSpinNum = arg0 || 0;
        if (totalWinCount != undefined) {
            this.checkStopAutoCondition(totalWinCount);
        }
    }
    public getSpinNum() {
        return this.autoSpinNum;
    }
    public showBtnSpin() {
        this.view?.setBtnSpinStatus(true);
    }
    public showAutoSpin() {
        this.view?.setBtnSpinStatus(false, this.autoSpinNum);
    }

    //获取下注额额度
    public getBetNum() {
        if (this.betTotals.length == 0) {
            this.initBetData();
        }
        return this.betTotals[this.curBetIndex] || 0;
    }

    // private _curBetIndex: number
    // public set curBetIndex(value) {
    //     this._curBetIndex = value
    // }
    // public get curBetIndex(): number {

    //     return this._curBetIndex
    // }

    //获取额度大小
    public getBetSize() {
        return this.gameLogic!.getBetSizes()[this.curBetSizeIndex];
    }

    public getBetLevel() {
        return this.betTimes[this.curBetMulIndex] ?? 0;
    }

    //更新下注额
    public setBetNum(value: number, playAni: boolean = false) {
        let bMin = value == gameData.betTotalsForQuickBtn[0];
        let bMax = value == gameData.betTotalsForQuickBtn[gameData.betTotalsForQuickBtn.length - 1];
        this.view?.updateCurBet(value, bMin, bMax, playAni);
    }

    //更新剩余金额
    public setBonus(value: number, playAni: boolean = false, lastBonus: number = 0) {
        logger.purple(`pg setBonus`, value);

        if (value < 0) {
            tcLog.error(`value`, value);
        }
        this.view?.updateBouns(value, playAni, lastBonus);
    }

    //更新中奖额
    public setWinCount(value: number) {
        this.curWin = value;
        this.view?.updateCurWinCount(value);
    }

    //当前是否是快速模式
    public IsQuickModel() {
        // tcLog.info("IsQuickModel:", this.bQuickModel)
        return this.bQuickModel;
    }

    /**初始化所有可以选择的下注额 */
    private initBetData() {
        if (!this.gameLogic?.getPayTimes) {
            tcLog.error(`PgGameContorlPanelLogic Does not implement interface PgGameLogicHandler`);
            return;
        }
        this.betTotals = [];
        let betSizes = this.gameLogic!.getBetSizes();
        for (let i = 0; i < betSizes.length; ++i) {
            for (let j = 0; j < this.betTimes.length; ++j) {
                let bet = currency.accMul(betSizes[i], this.betTimes[j]);
                bet = currency.accMul(bet, this.gameLogic?.getPayTimes() || 0);
                if (!this.betTotals.includes(bet)) {
                    this.betTotals.push(bet);
                }
            }
        }
        this.betTotals.sort((a, b) => {
            return a - b;
        });

        // for (let i = 0; i < this.betTotals.length; i += 3) {
        //     this.betTotalsForQuickBtn.push(this.betTotals[i]);
        // }
        // if (this.betTotalsForQuickBtn.indexOf(this.betTotals[this.betTotals.length - 1]) == -1) {
        //     this.betTotalsForQuickBtn.push(this.betTotals[this.betTotals.length - 1]);
        // }
    }

    /**设置spine按钮状态 */
    public setBtnSpineStatus(status: EBtnSpineStatus) {
        this.view?.setBtnSpineStatus(status);
    }

    /**检测是否停止自动旋转*
     */
    public checkStopAutoCondition(totalWinCoin: number) {
        tcLog.info(`PgGameContorlPanelLogic.checkStopAduio :${totalWinCoin}`);
        if (totalWinCoin < 0) {
            return;
        }
        let finalyWinCount = totalWinCoin - this.getBetNum();
        this.autoModeWinAll += finalyWinCount; //自动模式累计赢钱
        this.autoModeWinOnce = totalWinCoin; //自动模式单局赢钱

        if (
            (this.stopAudioSpinCondition.slider1Mum !== 0 && this.autoModeWinAll / 100 < -this.stopAudioSpinCondition.slider1Mum) ||
            (this.stopAudioSpinCondition.slider2Mum !== 0 && this.autoModeWinAll / 100 >= this.stopAudioSpinCondition.slider2Mum) ||
            (this.stopAudioSpinCondition.slider3Mum !== 0 && this.autoModeWinOnce / 100 >= this.stopAudioSpinCondition.slider3Mum)
        ) {
            this.autoSpinNum = 0;
            this.showBtnSpin();
            cc.systemEvent.emit(pgGameEvent.quikStopAutoSpin);
        }
    }

    public setControlBtnsStatus(show: boolean) {
        show ? this.view?.existFeatureStatus(this.autoSpinNum > 0) : this.view?.startFeatureStatus(this.autoSpinNum > 0);
    }

    private changeBtnSpinStatus(newStatus: EBtnSpineStatus, unableSpinBtnSpinGray: boolean = true) {
        this.view?.setBtnSpineStatus(newStatus, this.bQuickModel, unableSpinBtnSpinGray);
    }

    /**重置自动模式相关游戏数据 */
    public resetAutoData() {
        this.autoModeWinAll = 0; //自动模式累计赢钱
        this.autoModeWinOnce = 0; //自动模式单局赢钱
    }

    public updateBetData(betSize: number, betMul: number, totalBet: number) {
        console.log("updateBetData betSize:", betSize, "  betMul:", betMul, "  totalBet:", totalBet);
        if (betMul == 0 || betSize == 0) {
            for (let i = 0; i < gameData.betSizes.length; ++i) {
                for (let j = 0; j < this.betTimes.length; ++j) {
                    let num = currency.accMul(gameData.betSizes[i], this.betTimes[j]);
                    num = currency.accMul(num, gameData.betLines);
                    if (num == totalBet) {
                        this.curBetSizeIndex = i;
                        this.curBetMulIndex = j;
                        break;
                    }
                }
            }
        } else {
            let betSizes = this.gameLogic!.getBetSizes();
            this.defaultBetSize = betSize || betSizes[0];
            this.defaultBetMul = betMul || this.betTimes[0];

            this.curBetSizeIndex = betSizes.indexOf(this.defaultBetSize);
            this.curBetMulIndex = this.betTimes.indexOf(this.defaultBetMul);
        }

        this.curBetIndex = this.betTotals.indexOf(totalBet);
    }

    public clear() {
        this.gameLogic = undefined;
        this.viewNode?.destroy();
        this.view = undefined;
        this.payWalletView?.node?.destroy();
        this.PgAutorotationView?.node?.destroy();
        this.autoSpinNum = 0; //自动旋转次数
        this.curWin = 0; //当前获得
        this.betSettingView?.node?.destroy();
        this.bQuickModel = false; //当前是否是快速模式
        this.curGameId = 0;
    }
}
