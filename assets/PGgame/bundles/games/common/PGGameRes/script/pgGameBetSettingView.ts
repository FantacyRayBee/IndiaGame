// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { env } from "../../../../../script/app/env";
import { AudioClipName, uAudio } from "../../../../../script/framework/audio/audio";
import { currency } from "../../../../../script/pkg/currency";
import { pgGameEvent } from "./PgEvent";

/**
 * PG  slot游戏下注额度设置
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PgGameBetSettingView extends cc.Component {
    private payTimes: number = 0;

    private btnClose: cc.Node | undefined;
    private body: cc.Node | undefined;
    private btnOutClose: cc.Node | undefined;

    private labelCurBonus: cc.Label | undefined;
    private labelCurBet: cc.Label | undefined;
    private labelcurWin: cc.Label | undefined;
    private labelPayTimes: cc.Label | undefined;
    private scrollViewBetSize: cc.ScrollView | undefined;
    private scrollViewBetTimes: cc.ScrollView | undefined;
    private scrollViewBetTotal: cc.ScrollView | undefined;
    private nodeBetSizeItemConatiner: cc.Node | undefined;
    private nodeBetTimesItemConatiner: cc.Node | undefined;
    private nodeBetTotalItemConatiner: cc.Node | undefined;
    private nodeItemTotalScroll: cc.Node | undefined; //
    private nodelItemOtherScroll: cc.Node | undefined;

    private stopBtnBetMask: cc.Node | undefined;
    private stopBtn2Mask: cc.Node | undefined;
    private btnMaxBet: cc.Node | undefined;
    private btnOk: cc.Node | undefined;

    private betChangeCallback: Function | undefined;
    private betSizes: number[] = [];
    private betTimes: number[] = [];
    private betTotals: number[] = [];
    private itemHight = 0;

    public curBetSizeIndex = 0;
    public curBetTimesIndex = 0;
    private curBetTotalIndex = 0;

    private clickBtnSound: string = AudioClipName.CLICKBTN;

    onLoad(): void {
        this.btnClose = cc.find("body/btnClose", this.node);
        this.body = cc.find("body", this.node);
        this.btnOutClose = cc.find("btnOutClose", this.node)
        this.labelCurBonus = cc.find("body/nodeBonus/label", this.node).getComponent(cc.Label);
        this.labelCurBet = cc.find("body/nodeBet/label", this.node).getComponent(cc.Label);
        this.labelcurWin = cc.find("body/nodeWin/label", this.node).getComponent(cc.Label);
        this.labelPayTimes = cc.find("body/scrollView/curSelectNote/labelBetTimes", this.node).getComponent(cc.Label);
        this.scrollViewBetSize = cc.find("body/scrollView/betSize", this.node).getComponent(cc.ScrollView);
        this.scrollViewBetTimes = cc.find("body/scrollView/betTimes", this.node).getComponent(cc.ScrollView);
        this.scrollViewBetTotal = cc.find("body/scrollView/betTotal", this.node).getComponent(cc.ScrollView);
        this.nodeBetSizeItemConatiner = cc.find("body/scrollView/betSize/view/content", this.node);
        this.nodeBetTimesItemConatiner = cc.find("body/scrollView/betTimes/view/content", this.node);
        this.nodeBetTotalItemConatiner = cc.find("body/scrollView/betTotal/view/content", this.node);
        this.nodelItemOtherScroll = cc.find("body/scrollView/itemSelect", this.node);
        this.nodeItemTotalScroll = cc.find("body/scrollView/itemTotal", this.node);

        this.stopBtnBetMask = cc.find("body/stopBtnMask", this.node);
        this.stopBtn2Mask = cc.find("body/stopBtn2Mask", this.node);
        this.btnMaxBet = cc.find("body/BtnMaxBet", this.node);
        this.btnOk = cc.find("body/BtnOk", this.node);

        this.itemHight = this.nodelItemOtherScroll.getContentSize().height;
        this.bindClickEvent();
    }

    bindClickEvent() {
        this.btnClose?.on("click", () => {
            uAudio.getInstance().playEffect(this.clickBtnSound);
            this.moveOut();
        });
        this.btnOutClose.on("click", () => {
            uAudio.getInstance().playEffect(this.clickBtnSound);
            this.moveOut();
        });
        this.btnMaxBet?.on("click", () => {
            uAudio.getInstance().playEffect(this.clickBtnSound);
            this.changeBetSize(this.betSizes.length - 3, 0.2, false);
            this.changeBetTimes(this.betTimes.length - 3);
        });
        this.btnOk?.on("click", () => {
            uAudio.getInstance().playEffect(this.clickBtnSound);
            // cc.systemEvent.emit(pgGameEvent.updateCurBet);
            if (this.betChangeCallback) {
                setTimeout(() => {
                    this.betChangeCallback(this.curBetTotalIndex - 2 || 0, this.curBetTimesIndex - 2 || 0, this.curBetSizeIndex - 2 || 0);
                }, 300);
            }
            this.moveOut();
        });
    }

    moveOut() {
        cc.tween(this.body)
            .to(0.3, { position: cc.v3(0, -685, 0) })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }

    public init(betSizes: number[], betTimes: number[], betTotal: number[], payTimes: number = 0, defaultBetSize: number, defaultBetMul: number, clickBtnSound: string = AudioClipName.CLICKBTN) {
        this.betSizes = betSizes;
        this.betTimes = betTimes;
        this.betTotals = new Array<number>(...betTotal);
        this.clickBtnSound = clickBtnSound;
        //纯展示使用，添加标签项
        this.betSizes.push(...[0, -1]);
        this.betSizes.unshift(...[-1, 0]);
        this.betTimes.push(...[0, -1]);
        this.betTimes.unshift(...[-1, 0]);
        this.betTotals.push(...[0, -1]);
        this.betTotals.unshift(...[-1, 0]);

        this.payTimes = payTimes || 10;

        this.labelPayTimes!.string = this.payTimes.toString();
        this.showBetSizeItems(defaultBetSize);
        this.showBetTimesItems(defaultBetMul);
        this.showBetTotalBetItems();
        this.bindEvent();
    }

    public setBetCallback(callback: Function) {
        this.betChangeCallback = callback;
    }

    private bindEvent() {
        this.scrollViewBetSize?.node.on("scroll-ended", this.onScorllViewBetSizeScrollEnd, this);
        this.scrollViewBetTimes?.node.on("scroll-ended", this.onScorllViewBetTimesScrollEnd, this);
        this.scrollViewBetTotal?.node.on("scroll-ended", this.onScorllViewBetTotalScrollEnd, this);
        this.scrollViewBetSize?.node.on("scrolling", this.onSelecttingBetValue, this);
        this.scrollViewBetTimes?.node.on("scrolling", this.onSelecttingBetValue, this);
        this.scrollViewBetTotal?.node.on("scrolling", this.onSelecttingBetValue, this);
    }

    public show(curBet: number, curWin: number) {
        this.node.active = true;
        cc.tween(this.body)
            .set({ position: cc.v3(0, -685, 0) })
            .to(0.3, { position: cc.v3(0, -22, 0) })
            .start();
        this.initScrollViews(curBet);
        this.labelCurBonus!.string = currency.formatWithSymbol(env.curGameData.balance);
        this.labelCurBet!.string = currency.formatWithSymbol(curBet);
        this.labelcurWin!.string = currency.formatWithSymbol(curWin);
    }
    //投注大小
    private showBetSizeItems(defaultBetSize: number) {
        this.betSizes.forEach((betSize, index) => {
            let item = cc.instantiate(this.nodelItemOtherScroll);
            item!.active = true;
            item!.setParent(this.nodeBetSizeItemConatiner!);
            item!.getComponent(cc.Label).string = betSize < 0 ? "  " : betSize == 0 ? "-" : currency.formatWithSymbol(betSize);
            item!.on(
                "click",
                () => {
                    if (index > 1 && index < this.betSizes.length - 2) {
                        this.checkStopBtnBetMaskStatus(true);
                        this.onClickToChangeBetSize(index);
                    }
                },
                this
            );
        });
        let betIndex = this.betSizes.indexOf(defaultBetSize);
        this.changeBetSize(betIndex);
    }

    //投注倍数
    private showBetTimesItems(defaultBetMul: number) {
        this.betTimes.forEach((betTimes, index) => {
            let item = cc.instantiate(this.nodelItemOtherScroll);
            item!.active = true;
            item!.setParent(this.nodeBetTimesItemConatiner!);

            item!.getComponent(cc.Label).string = betTimes < 0 ? "  " : betTimes == 0 ? "-" : betTimes.toString();
            item!.on(
                "click",
                () => {
                    if (index > 1 && index < this.betTimes.length - 2) {
                        this.checkStopBtnBetMaskStatus(true);
                        this.onClickToChangeBetTimes(index);
                    }
                },
                this
            );
        });
        let betIndex = this.betTimes.indexOf(defaultBetMul);
        this.changeBetTimes(betIndex);
    }

    //投注总额
    private showBetTotalBetItems() {
        this.betTotals.forEach((value, index) => {
            let item = cc.instantiate(this.nodeItemTotalScroll);
            item!.active = true;
            item!.setParent(this.nodeBetTotalItemConatiner!);

            item!.getComponent(cc.Label).string = value < 0 ? " " : value == 0 ? "-" : currency.formatWithSymbol(value);
            item!.on(
                "click",
                () => {
                    if (index > 1 && index < this.betTotals.length - 2) {
                        this.checkStopBtnBetMaskStatus(true);
                        this.onClickToChangeBetTotal(index);
                    }
                },
                this
            );
        });
    }

    //---------------修改投注大小
    private onClickToChangeBetSize(index: number, duration: number = 0.2) {
        uAudio.getInstance().playEffect(this.clickBtnSound);
        this.changeBetSize(index);
    }
    private changeBetSize(index: number, duration: number = 0.2, refreshTotalBet: boolean = true) {
        this.curBetSizeIndex = index;
        this.nodeBetSizeItemConatiner.stopAllActions();
        cc.tween(this.nodeBetSizeItemConatiner)
            .to(duration, { position: cc.v3(0, (index - 2) * this.itemHight, 0) })
            .call(() => {
                if (refreshTotalBet) {
                    this.upateBetTotalByBetSizeAndTimes();
                } else {
                    this.checkStopBtnBetMaskStatus(false);
                }
            })
            .start();
    }
    //------------------

    //-----------修改投注倍数
    private onClickToChangeBetTimes(index: number, duration: number = 0.2) {
        uAudio.getInstance().playEffect(this.clickBtnSound);
        this.changeBetTimes(index);
    }
    private changeBetTimes(index: number, duration: number = 0.2, refreshTotalBet: boolean = true) {
        this.curBetTimesIndex = index;
        this.nodeBetTimesItemConatiner.stopAllActions();
        cc.tween(this.nodeBetTimesItemConatiner)
            .to(duration, { position: cc.v3(0, (index - 2) * this.itemHight, 0) })
            .call(() => {
                if (refreshTotalBet) {
                    this.upateBetTotalByBetSizeAndTimes();
                } else {
                    this.checkStopBtnBetMaskStatus(false);
                }
            })
            .start();
    }
    //-----------

    //----------修改投注额度
    private onClickToChangeBetTotal(index: number, duration: number = 0.2) {
        uAudio.getInstance().playEffect(this.clickBtnSound);
        this.changeBetTotal(index, duration);
    }
    private changeBetTotal(index: number, duration: number = 0.2, refreshBetSizeAndTimes: boolean = true) {
        this.curBetTotalIndex = index;
        this.btnMaxBet!.getComponent(cc.Button).interactable = index != this.betTotals.length - 3;
        this.btnMaxBet!.opacity = index != this.betTotals.length - 3 ? 255 : 128;
        cc.tween(this.nodeBetTotalItemConatiner)
            .to(duration, { position: cc.v3(0, (index - 2) * this.itemHight, 0) })
            .call(() => {
                if (refreshBetSizeAndTimes) {
                    this.changeBetSizeAndTimesScrollView(index);
                } else {
                    this.checkStopBtnBetMaskStatus(false);
                }
            })
            .start();
    }
    //根据下注大小和下注额度修改下注总额
    private upateBetTotalByBetSizeAndTimes(duration: number = 0.2) {
        let num = currency.accMul(this.betSizes[this.curBetSizeIndex], this.betTimes[this.curBetTimesIndex]);
        num = currency.accMul(num, this.payTimes);
        let value = this.betSizes[this.curBetSizeIndex] * this.betTimes[this.curBetTimesIndex] * this.payTimes;
        let totalBet: number = Number.parseFloat(value.toFixed(2));
        let totalBetIndex = this.betTotals.indexOf(totalBet);
        if (totalBetIndex != this.curBetTotalIndex) {
            this.changeBetTotal(totalBetIndex, duration, false);
        }
    }
    //-------------

    //手动滑动下注大小滚轴结束
    private onScorllViewBetSizeScrollEnd() {
        let contentPos = this.scrollViewBetSize?.getContentPosition() || cc.v2(0, 0);
        let selectItemIndex = Math.floor(contentPos.y / this.itemHight) + 2;
        selectItemIndex = Math.max(2, selectItemIndex);
        selectItemIndex = Math.min(this.betSizes.length - 2, selectItemIndex);
        this.checkStopBtnBetMaskStatus(this.curBetSizeIndex != selectItemIndex);
        this.changeBetSize(selectItemIndex);
    }
    //手动滑动下注倍数滚轴结束
    private onScorllViewBetTimesScrollEnd() {
        let contentPos = this.scrollViewBetTimes?.getContentPosition() || cc.v2(0, 0);
        let selectItemIndex = Math.floor(contentPos.y / this.itemHight) + 2;
        selectItemIndex = Math.max(2, selectItemIndex);
        selectItemIndex = Math.min(this.betTimes.length - 2, selectItemIndex);
        this.checkStopBtnBetMaskStatus(this.curBetTimesIndex != selectItemIndex);

        this.changeBetTimes(selectItemIndex);
    }
    //手动滑动下注总额滚轴结束
    private onScorllViewBetTotalScrollEnd() {
        let contentPos = this.scrollViewBetTotal?.getContentPosition() || cc.v2(0, 0);
        let selectItemIndex = Math.floor(contentPos.y / this.itemHight) + 2;
        selectItemIndex = Math.max(2, selectItemIndex);
        selectItemIndex = Math.min(this.betTotals.length - 2, selectItemIndex);
        this.checkStopBtnBetMaskStatus(this.curBetTotalIndex != selectItemIndex);
        this.changeBetTotal(selectItemIndex);
    }

    //刷新下注大小和下注倍数
    private changeBetSizeAndTimesScrollView(betTotalSelectIndex: number) {
        let curBetSizeIndex = -1;
        let curBetTimesIndex = -1;
        for (let i = 2; i < this.betSizes.length - 2; ++i) {
            for (let j = 2; j < this.betTimes.length - 2; ++j) {
                let num = currency.accMul(this.betSizes[i], this.betTimes[j]);
                num = currency.accMul(num, this.payTimes);
                if (num == this.betTotals[betTotalSelectIndex]) {
                    curBetSizeIndex = i;
                    curBetTimesIndex = j;
                    break;
                }
            }
        }
        if (this.curBetSizeIndex != curBetSizeIndex && curBetSizeIndex > -1) {
            this.changeBetSize(curBetSizeIndex, 0.2, false);
        }
        if (this.curBetTimesIndex != curBetTimesIndex && curBetTimesIndex > -1) {
            this.changeBetTimes(curBetTimesIndex, 0.2, false);
        }
    }

    //初始化各滚轴
    public initScrollViews(curBet: number) {
        for (let i = 2; i < this.betSizes.length - 2; ++i) {
            for (let j = 2; j < this.betTimes.length - 2; ++j) {
                let num = currency.accMul(this.betSizes[i], this.betTimes[j]);
                num = currency.accMul(num, this.payTimes);
                if (num == curBet) {
                    this.curBetSizeIndex = i;
                    this.curBetTimesIndex = j;
                    break;
                }
            }
        }
        if (this.curBetSizeIndex < 2) {
            this.curBetSizeIndex = 2;
        }
        if (this.curBetTimesIndex < 2) {
            this.curBetTimesIndex = 2;
        }
        this.changeBetSize(this.curBetSizeIndex, 0, false);
        this.changeBetTimes(this.curBetTimesIndex, 0, false);
        this.upateBetTotalByBetSizeAndTimes(0);
    }

    //拖动任何一个滚轴时
    private onSelecttingBetValue() {
        this.checkStopBtnBetMaskStatus(true);
    }

    private checkStopBtnBetMaskStatus(bShow: boolean) {
        this.stopBtnBetMask!.active = bShow;
        this.stopBtn2Mask!.active = bShow;
        this.btnClose.getComponent(cc.Button).interactable = !bShow;
        this.btnClose.opacity = bShow ? 128 : 255;
    }
}
