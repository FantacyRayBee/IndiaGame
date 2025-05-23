import * as proto from "./protocol/slot_fortune_rabbit";
import { Handler, uNet } from "../../../../script/framework/net/socket";
import { cmd } from "../../../../script/config/cmd";
import { event } from "../../../../script/event/event";
import { uAudio } from "../../../../script/framework/audio/audio";
import { tcLog } from "../../../../script/framework/log/log";
import { env } from "../../../../script/app/env";
import { Message } from "../../../../script/framework/net/msg";
import { FortuneRabbitView } from "./fortune-rabbit-view";
import { FortuneRabbitSender } from "./fortune-rabbit-sender";
import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { FortuneRabbitTable } from "./fortune-rabbit-table";
import { FortuneRabbitRes } from "./fortune-rabbit-res";
import { FortuneRabbitAnimAlert } from "./fortune-rabbit-anim";
import { config, gameHelper } from "../../../../script/config/config";
import PgGameControlPanelLogic, { EBtnSpineStatus, PgGameLogicHandler } from "../../common/PGGameRes/script/PgGameControlPanelLogic";
import { pgGameEvent } from "../../common/PGGameRes/script/PgEvent";
import { gameData } from "../../../update-v2/script/api/api-config";
import GameNet from "../../../../ApiTemplate/script/net/GameNet";
import { Result } from "../../../../ApiTemplate/script/net/Result";
import { LoginGameMrg } from "../../../../ApiTemplate/script/Scene/LoginGameMrg";
import { currency } from "../../../../script/pkg/currency";
import CocosUtil from "../../common/PGGameRes/history/CocosUtil";
import GameNetEvent from "../../../../ApiTemplate/script/net/GameNetEvent";
import { SelectGameMrg } from "../../../../ApiTemplate/script/tools/SelectGameMrg";
import logger from "../../../../ApiTemplate/script/net/logger";
import { tcRes } from "../../../../script/framework/res/res";
import { ApiTipManage } from "../../../update-v2/script/api/api-tip-manage";

interface Task {
    callback: Function;
    data: any;
}

type ItemNumType = {
    [key: number]: number;
};

export interface CellItemData {
    itemId: number;
    value?: number;
}

export class FortuneRabbitLogic implements Handler, PgGameLogicHandler {
    //view
    private view: FortuneRabbitView | undefined;
    private controlPanelLogic: PgGameControlPanelLogic | undefined;

    private curChipIndex: number = env.curGameData.betIndex;
    private winnerInfo: Array<proto.slot_fortune_rabbit.IHit> | null | undefined = [];
    /** 派彩级别 big superbig ... */
    private winLevel: Array<number> = [];
    public isFreespin: boolean = false;
    public awardAnimCount: number = 0;
    /** 任务队列 */
    private taskQueue: Array<Task> = [];

    private sendHeartBeatIntervalId = 0;
    //当局中奖额
    private totalWinCoin: number = 0;
    //免费模式全局中奖
    private rabbitWin: number = 0;
    //中奖倍数
    private winTimes: number = 0;

    private taskLineTimer: number = -1;
    //是否需要播放ball收集动画
    private waitingShowBallCollectEffect: boolean = false;
    //todo
    enterFeatur: boolean = false;

    static EventSpin = "eventSpin";
    static EventBigWinOver = "EventBigWinOver";

    public constructor(private viewNode: cc.Node) {
        this.view = viewNode?.addComponent(FortuneRabbitView);
        if (!this.view) {
            return;
        }
        this.view.init(this);
        this.controlPanelLogic = new PgGameControlPanelLogic(cmd.SERVER_TYPE_FORTUNE_RABBIT, this);
        this.controlPanelLogic.init();
        uNet.getInstance().bind(cmd.SERVER_TYPE_FORTUNE_RABBIT, this);
        this.initEvent();
        FortuneRabbitSender.reqRoomInfo();
        this.view!.lateUpdate = this.update.bind(this);

        cc.systemEvent.on(FortuneRabbitLogic.EventBigWinOver, this.AnimAlertOver, this);
        // cc.systemEvent.off(FortuneRabbitLogic.EventSpin, this.onEventSpin, this);
        // cc.systemEvent.on(FortuneRabbitLogic.EventSpin, this.onEventSpin, this);
        logger.log("FortuneRabbitLogic constructor")
        cc.systemEvent.on(LoginGameMrg.loginOver, this.loginOverHandel, this);
        LoginGameMrg.getInstance().onLogin()

        cc.systemEvent.emit("showTop");

        window.addEventListener("customEventFromHTML", this.startShowGameView.bind(this));

        if (ApiTipManage.getInstance().isTest) {
            cc.systemEvent.on('endGame', (rtn)=>{
                this.onSpinRps(rtn)
            }, this);
        }
    }

    isStarted: boolean = false

    /** 平台登录流程结束 */
    private async loginOverHandel(data) {
        if (this.isStarted) {
            return
        }
        this.isStarted = true
        logger.log("loginOverHande...")

        await tcRes.load<cc.Prefab>("tip-v2", cc.Prefab, "prefab/tips_bottom");
        await tcRes.load<cc.Prefab>("tip-v2", cc.Prefab, "prefab/tips_code");
        await tcRes.load<cc.Prefab>("tip-v2", cc.Prefab, "prefab/tips");

        if (data && data.tableResult) {
            cc.systemEvent.emit(event.loadGameResOver);
            this.handlerTableInfo(data.tableResult)
        } else {
            GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);
            return
        }

        // let aniLayer = await FortuneRabbitAnimAlert.show();
        // aniLayer?.show(10000, 3000000, 2000);


        //endGame 游戏结算  监听
        GameNet.getInstance().queueNetMsgCallback('endGame', (rtn) => {
            if (rtn.result == Result.Success) {
                logger.purple("endGame ===>", JSON.stringify(rtn.tableResult));
                this.onSpinRps(rtn.tableResult)
            } else {
                tcLog.error("endGame   error ", rtn.tableResult);
            }
        });

        //endRoomt 房间结束，退出游戏
        GameNet.getInstance().queueNetMsgCallback('endRoom', (rtn) => {
            logger.purple("endRoom ", JSON.stringify(rtn.tableResult));
            GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);
        });
    }


    private initEvent(): void {
        cc.systemEvent.on(event.reconnectGame, this.reconnect, this);
        //cc.systemEvent.on(event.existGame, this.backToLobby, this);
        cc.systemEvent.on(FortuneRabbitDefine.events.FortuneRabbitCellEndRoll, this.onOneCellEndRoll, this);
        cc.systemEvent.on(FortuneRabbitDefine.events.wildShow, this.wildShow, this);
        cc.systemEvent.on(pgGameEvent.clickSpin, this.onBtnClickSpin, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(pgGameEvent.startAutoSpin, this.onStartAutoSpin, this);
        cc.systemEvent.on(pgGameEvent.quikStopAutoSpin, this.onStopAutoSpin, this);
        cc.systemEvent.on(FortuneRabbitDefine.events.showItemTip, this.showItemTip, this);
        cc.systemEvent.on(FortuneRabbitDefine.events.hideItem, this.hideItem, this);
        cc.systemEvent.on(FortuneRabbitDefine.events.cellStartRoll, this.onCellStartRoll, this);
        cc.systemEvent.on(event?.showGameView, this.startShowGameView, this);
        cc.systemEvent.on(FortuneRabbitDefine.events.updateWinCount, this.updateWinCount, this);
        cc.systemEvent.on(event.UPDATEBET, this.betChagned, this);
        this.view?.bindClickTableEvent(this.quickStop.bind(this));

        // setTimeout(() => {
        //     this.controlPanelLogic.onClickBtnHistory()  ///TEST
        // }, 1000);
    }

    private backToLobby() {
        cc.Tween.stopAll();
        this.view?.unscheduleAllCallbacks();
        this.stopHeartBeat();
        gameHelper.stopAllEffects();
        uNet.getInstance().unbind(cmd.SERVER_TYPE_FORTUNE_RABBIT, this);
        cc.systemEvent.off(event.reconnectGame, this.reconnect, this);
        // cc.systemEvent.off(event.existGame, this.backToLobby, this);
        cc.systemEvent.off(FortuneRabbitDefine.events.FortuneRabbitCellEndRoll, this.onOneCellEndRoll, this);
        cc.systemEvent.off(FortuneRabbitDefine.events.wildShow, this.wildShow, this);
        cc.systemEvent.off(pgGameEvent.clickSpin, this.onBtnClickSpin, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(pgGameEvent.startAutoSpin, this.onStartAutoSpin, this);
        cc.systemEvent.off(pgGameEvent.quikStopAutoSpin, this.onStopAutoSpin, this);
        cc.systemEvent.off(FortuneRabbitDefine.events.showItemTip, this.showItemTip, this);
        cc.systemEvent.off(FortuneRabbitDefine.events.hideItem, this.hideItem, this);
        cc.systemEvent.off(FortuneRabbitDefine.events.cellStartRoll, this.onCellStartRoll, this);
        cc.systemEvent.off(FortuneRabbitDefine.events.updateWinCount, this.updateWinCount, this);
        cc.systemEvent.off(event?.showGameView, this.startShowGameView, this);
        cc.systemEvent.off(event.UPDATEBET, this.betChagned, this);
        FortuneRabbitTable.reset();
        this.view?.unscheduleAllCallbacks();
        this.view?.node.destroy();
        this.clearAllCache();
        if (this.taskLineTimer != -1) {
            window.clearInterval(this.taskLineTimer);
            this.taskLineTimer = -1;
        }
    }

    private reconnect() {
        this.view?.unscheduleAllCallbacks();
        FortuneRabbitSender.reqRoomInfo();
    }

    private onCellStartRoll() {
        //所有滚轴都开始转动后才能执行立即停止操作
    }

    private updateWinCount() {
        this.controlPanelLogic.setWinCount(this.totalWinCoin);
    }

    public onKeyDown(evt: any): void {
        if (evt.keyCode == cc.macro.KEY.space) {
            this.onBtnClickSpin();
        }
    }

    public setTimeNoen: number = 0
    public setTimeNum: number = 0
    public setTimeConf: number = 0
    //点击一次spin
    public onBtnClickSpin(): void {


        tcLog.log("isAnimEnd:", FortuneRabbitTable.tabelInfo.isAnimEnd,
            "   bWinScoreRuning:", FortuneRabbitTable.tabelInfo.bWinScoreRuning,
            "   bTrigger:", FortuneRabbitTable.tabelInfo.bTrigger,
            "   rollLeftCountForTrigger:", FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger,
        );

        if (env.application.ServerError && !FortuneRabbitTable.tabelInfo.isAnimEnd) {
            cc.systemEvent.emit(event.getEncodeConfirm, true);
            return;
        }

        //点击spine则立即停止滚动
        if (this.quickStop(undefined, false)) {
            return;
        }
        if (!FortuneRabbitTable.tabelInfo.isAnimEnd || FortuneRabbitTable.tabelInfo.bWinScoreRuning) {
            return;
        }

        //免费模式情况下不允许手动spin,避免手速过快导致进入免费模式过程中手动发送了freeSPin
        if (FortuneRabbitTable.tabelInfo.bTrigger && FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger > 0) {
            return;
        }

        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.spin);


        if (GameNet.getInstance().isKick) {
            GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);
            return
        }

        if (FortuneRabbitTable.tabelInfo.bTrigger) {
            FortuneRabbitTable.tabelInfo.wildCount = 0
        }


        FortuneRabbitTable.tabelInfo.startRollTime = new Date().getTime()
        SelectGameMrg.getInstance().preDoTime = new Date().getTime()

        this.setTimeNoen && clearTimeout(this.setTimeNoen);
        this.setTimeConf && clearTimeout(this.setTimeConf)
        this.setTimeNum && clearTimeout(this.setTimeNum);
        this.setTimeNum = setTimeout(() => {
            SelectGameMrg.getInstance().preDoTime = new Date().getTime()
            this.failSpinRps()
            this.setTimeConf && clearTimeout(this.setTimeConf)
            this.setTimeConf = setTimeout(() => {
                console.log("GetGatewayConfirm")
                GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);
            }, 1000);
        }, 60000);

        this.startSpin();
    }



    private quickStop(clickEvent: any, showClickEffect: boolean = true) {
        if (FortuneRabbitTable.tabelInfo.bRolling && !FortuneRabbitTable.tabelInfo.bTrigger &&
            !this.controlPanelLogic?.IsQuickModel() && this.controlPanelLogic.getSpinNum() == 0) {
            FortuneRabbitTable.tabelInfo.bRolling = false;
            cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.UNACTIVE_RUN);
            this.view?.scheduleOnce(() => {
                this.view?.stopQuickly(clickEvent, showClickEffect);
            }, 0.3);
            return true;
        }
    }

    private startSpin() {
        FortuneRabbitTable.tabelInfo.featureData = [];
        FortuneRabbitTable.tabelInfo.bBallWin = false;
        if (FortuneRabbitTable.tabelInfo.bTrigger && FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger > 0) {
            //feature模式spin
            FortuneRabbitSender.reqSpin(this.controlPanelLogic?.getBetNum() || 0, true, this.controlPanelLogic!.getBetSize(), this.controlPanelLogic!.getBetLevel());
        } else {
            let bet = this.controlPanelLogic?.getBetNum() || 0;
            if (FortuneRabbitTable.tabelInfo.bTrigger) {
                //feature模式结束，则需要先重置滚轴数据，将台面图标过渡到正常状态
                FortuneRabbitTable.tabelInfo.bTrigger = false;
                FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger = -1;
                FortuneRabbitTable.setFirstScreen();
                this.view?.hideFortuneRabbitNode(3);
            }
            this.waitingShowBallCollectEffect = false;
            this.view?.startRoll(() => {
                if (bet <= env.curGameData.balance) {
                    FortuneRabbitSender.reqSpin(bet, false, this.controlPanelLogic!.getBetSize(), this.controlPanelLogic!.getBetLevel());
                }
            });
            //spine按钮进入run状态
            //极速模式不可打断，所以进入UNACTIVE_RUN，正常模式可中途打断，进入ACTIVE_RUN
            cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, this.controlPanelLogic.IsQuickModel() ? EBtnSpineStatus.UNACTIVE_RUN : EBtnSpineStatus.ACTIVE_RUN);

            this.taskQueue = [];
            this.view?.reset();
            this.view?.awardLayer?.reset();
            this.view?.unschedule(this.startPlayOnline);
            // if (env.application.ServerError) {
            //     cc.systemEvent.emit(event.getEncodeConfirm, true);
            //     return;
            // }
            this.controlPanelLogic?.setWinCount(0);


            if (bet > env.curGameData.balance) {
                this.setTimeNoen && clearTimeout(this.setTimeNoen);
                this.setTimeNum && clearTimeout(this.setTimeNum);
                this.setTimeConf && clearTimeout(this.setTimeConf)
                this.setTimeNoen = setTimeout(() => {
                    this.controlPanelLogic.setSpinNumFun(0);
                    this.view?.stopRoll();
                    SelectGameMrg.getInstance().preDoTime = new Date().getTime()
                    cc.systemEvent.emit(event.banlanceNoEnough, () => {
                        SelectGameMrg.getInstance().preDoTime = new Date().getTime()
                        console.log("setBtnSpineStatus:  banlanceNoEnough");
                        cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.ACTIVE_NORMAL);
                    });
                }, 3000);
                return;
            }

        }
    }


    private onStartAutoSpin() {
        this.controlPanelLogic?.resetAutoData();
        this.totalWinCoin = 0;
        this.checkIsAutoStart();
    }

    private onStopAutoSpin() { }

    public getWinnerInfo() {
        return this.winnerInfo;
    }

    //是否是快速模式
    public bQuickMode() {
        return this.controlPanelLogic?.IsQuickModel();
    }

    private clearAllCache(): void {
        FortuneRabbitRes.clearCache();
        FortuneRabbitAnimAlert?.clear();
        this.controlPanelLogic?.clear();
    }

    //第2列滚动结束后需要检测是否可能出现全屏中奖
    private onOneCellEndRoll(cellId: number) {
        if (FortuneRabbitTable.tabelInfo.rollendCount == 3) {
            //滚轴滚动全部结束
            FortuneRabbitTable.tabelInfo.rollendCount = 0;
            FortuneRabbitTable.tabelInfo.bWish = false;
            this.listenerRollEnd();
        }
    }

    /**
     * @method 滚动结束检查freespin autospin
     * @returns
     */
    public listenerRollEnd() {
        tcLog.info(`---roll End---,screen:${JSON.stringify(FortuneRabbitTable.tabelInfo.screen)}`);

        if (FortuneRabbitTable.tabelInfo.isRollEnd) {
            return
        }
        FortuneRabbitTable.tabelInfo.isRollEnd = true;


        if (FortuneRabbitTable.tabelInfo.bTrigger) {
            //每轮feature滚动结束，判断是否中奖
            this.onFortuenRollEnd();
        } else {
            let startNextSpinDelayTime = 0;
            let featureData = FortuneRabbitTable.tabelInfo.featureData;
            FortuneRabbitTable.tabelInfo.featureData = [];
            //ball播放收集动画
            if ((featureData && featureData.length > 0) || FortuneRabbitTable.tabelInfo.bWish) {
                startNextSpinDelayTime = 0.5;
            }
            this.view?.scheduleOnce(() => {
                this.gameOver();
            }, startNextSpinDelayTime);
        }
    }

    private async onFortuenRollEnd() {

        let startNextSpinDelayTime = 0;
        let featureData = FortuneRabbitTable.tabelInfo.featureData;
        FortuneRabbitTable.tabelInfo.featureData = [];
        //ball数量超过5个，则构建中线数据
        if (featureData && featureData.length >= 5) {
            let msg = new proto.slot_fortune_rabbit.SpinResp();
            for (let rowIndex = 0; rowIndex < 4; ++rowIndex) {
                for (let cellIndex = 0; cellIndex < 3; ++cellIndex) {
                    msg.screen.push({ id: FortuneRabbitTable.tabelInfo.screen[cellIndex][rowIndex].itemId });
                }
            }
            this.checkBallHits(msg);
            this.winnerInfo = msg.hits;
            this.taskAllLineAnim();
            this.view?.scheduleOnce(() => {
                //播放卡片分数调入分数槽动画
                this.view?.playCollectBallScore();
            }, 1);
            startNextSpinDelayTime = 3;
        }


        let effectIndex = 0;
        FortuneRabbitTable.tabelInfo.screen.forEach((cellDatas, cellIndex) => {
            cellDatas.forEach(async (itemData, itemIndex) => {
                if (itemData.itemId == 9) {
                    effectIndex++
                }
            });
        });
        if (effectIndex >= 5) {
            await CocosUtil.wait(2 + ((effectIndex + 1) * 0.3))
        } else {
            await CocosUtil.wait(1)
        }


        // this.view?.scheduleOnce(() => {
        tcLog.log("继续下一次摇奖", FortuneRabbitTable.tabelInfo.bTrigger, FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger, effectIndex);

        //继续下一次摇奖
        //cc.systemEvent.emit(FortuneRabbitDefine.events.updateWinCount);
        this.winnerInfo = [];
        if (FortuneRabbitTable.tabelInfo.bTrigger && FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger > 0) {
            //继续下一轮feature模式转动
            this.startSpin();
        } else {
            tcLog.log("else ", this.totalWinCoin, this.winTimes);
            if (FortuneRabbitTable.tabelInfo.bTrigger) {
                this.gameOver();

            } else {
                this.view?.showWinNote(this.totalWinCoin, this.winTimes, true, true, true, () => {
                    this.gameOver();
                });
            }
        }
        // }, 1 + ((effectIndex + 1) * 0.4));
    }

    private gameOver() {
        this.view?.getControlPanelNodeCheck()
        tcLog.log("gameOve...");

        if (this.isfailSpin) {
            tcLog.log("isfailSpin  setBonus...", env.curGameData.balance);
            this.controlPanelLogic!.setBonus(env.curGameData.balance);
        }
        //标记游戏状态
        FortuneRabbitTable.tabelInfo.bRolling = false;
        this.view?.setBtnTableActive(false);
        this.view?.awardLayer?.reset();

        this.addTask(this.taskBigWinAnim.bind(this), null);
        this.addTask(this.taskLineAnim.bind(this), null);
        this.view?.scheduleOnce(
            () => {
                FortuneRabbitTable.tabelInfo.task = true;
            },
            this.waitingShowBallCollectEffect ? 0.15 : 0
        );

    }

    private wildShow(wildNode: cc.Node) {
        //检测是否有wild出现
        this.waitingShowBallCollectEffect = true;
        cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.UNACTIVE_STOP);
        this.checkWildShow(wildNode);
    }
    /**
     * @method 检查freespin autospin
     * @returns
     */
    public checkIsAutoStart(): void {
        tcLog.info(`checkIsAutoStart`, "bRolling:", FortuneRabbitTable.tabelInfo.bRolling,
            "getSpinNum:", this.controlPanelLogic!.getSpinNum(),
            "checkBalance:", env.curGameData.balance
        );
        //标记动画结束 可以spin
        //滚动中
        if (FortuneRabbitTable.tabelInfo.bRolling) {
            return;
        }

        tcLog.info(`checkIsAutoStart  isAnimEnd`)
        FortuneRabbitTable.tabelInfo.isAnimEnd = true;
        //剩余自动次数且货币足够才继续下一次摇奖流程，否则停止自动模式
        if (this.controlPanelLogic!.getSpinNum() > 0 && this.checkBalance()) {
            this.startSpin();
            //显示停止自动spin按钮
            this.controlPanelLogic!.showAutoSpin();
        } else {
            console.log("setBtnSpineStatus:  checkIsAutoStart");
            cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.ACTIVE_NORMAL);
            FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger <= 0 && this.controlPanelLogic!.showBtnSpin();
        }
    }
    /**
     * @method autospin检查金币
     * @returns
     */
    private checkBalance(): boolean {
        const betCount = this.controlPanelLogic!.getBetNum();
        if (env.curGameData.balance < betCount) {
            // gameToast.show(tcI18n.i18nLabel("8"));
            // cc.systemEvent.emit(event.banlanceNoEnough);
            this.controlPanelLogic.setSpinNumFun(0);
            return false;
        }
        return true;
    }

    /**
     * @method 切换背景音乐
     * @param musicName
     * @returns
     */
    public changeMusic(musicName: string): void {
        // tcLog.info(`change music: ${musicName}`);
        if (FortuneRabbitTable.tabelInfo.musicName == musicName) {
            return;
        }

        uAudio.getInstance().playMusic(musicName);
        FortuneRabbitTable.tabelInfo.musicName = musicName;
    }

    private initTable(bFreeTotalWin: boolean = false): void {
        this.view?.initCellsItem();
        this.totalWinCoin > 0 && this.view?.showWinNote(this.totalWinCoin, this.winTimes, false, bFreeTotalWin, false);
        this.controlPanelLogic!.setBonus(env.curGameData.balance);
        this.checkIsAutoStart();
        this.view?.initTableView();
    }

    //bigWin动画
    private async taskBigWinAnim() {
        let betNum = this.controlPanelLogic?.getBetNum() || 0;
        if (!betNum || this.totalWinCoin == 0) {
            FortuneRabbitTable.tabelInfo.task = true;
            return;
        }

        let betTimes = this.totalWinCoin / betNum;
        let bigWinlevel = FortuneRabbitTable.tabelInfo.winLevel[0];
        if (betTimes < bigWinlevel) {
            FortuneRabbitTable.tabelInfo.task = true;
            return;
        }
        let delayTime = 0;
        cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.UNACTIVE_STOP);
        if (!FortuneRabbitTable.tabelInfo.bTrigger) {
            //非feature模式大奖之前需要先播放总线
            this.taskAllLineAnim();
            delayTime = 1;
        }
        this.view?.scheduleOnce(async () => {
            SelectGameMrg.getInstance().preDoTime = new Date().getTime()
            let aniLayer = await FortuneRabbitAnimAlert.show();
            aniLayer?.show(this.controlPanelLogic?.getBetNum() || 0, this.totalWinCoin, this.controlPanelLogic.getBetSize());
        }, delayTime);
    }

    public AnimAlertOver(): void {
        logger.log("AnimAlertOve...", this.totalWinCoin, this.winTimes);
        this.view?.showWinNote(this.totalWinCoin, this.winTimes, true, true, true);
        this.view?.scheduleOnce(() => {
            FortuneRabbitTable.tabelInfo.task = true;
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bonus_freeend);
        }, 1.5);
    }

    /**
     * @method 显示所有中奖线
     * @returns
     */
    private taskAllLineAnim(): void {
        let allPoints: { x: number; y: number }[] = [];
        let allLindIds: number[] = [];
        const winnerInfo = this.getWinnerInfo();
        winnerInfo?.forEach((info) => {
            const points = this.view?.getPoint(info);
            if (points) {
                allPoints = allPoints.concat(points);
            }
            info.lineId > 0 && allLindIds.push(info.lineId || 0);
        });

        allPoints = this.view!.pintUnique(allPoints);
        //没中奖清空任务队列 检查是否需要自动开始
        if (allPoints.length == 0) {
            this.view?.unscheduleAllCallbacks();
            FortuneRabbitTable.tabelInfo.task = true;
            return;
        }

        this.view?.showAllLineInfo(allPoints, allLindIds);
    }
    /**
     * @method 中线动画
     * @returns
     */
    private async taskLineAnim(startLineIndex?: number) {
        //更新为最新玩家拥有的金币数
        this.changeMusic(FortuneRabbitDefine.soundNames.bg_music);
        this.controlPanelLogic!.setWinCount(this.totalWinCoin);

        FortuneRabbitTable.tabelInfo.bTrigger && this.view?.hideFortuneRabbitNode(2);

        if (FortuneRabbitTable.tabelInfo.bTrigger && this.totalWinCoin > 0) {
            //如果是feature模式则直接显示分数
            console.log(`taskLineAni setBonus`, env.curGameData.balance, FortuneRabbitTable.tabelInfo.lastBonus);
            this.controlPanelLogic!.setBonus(env.curGameData.balance, true, FortuneRabbitTable.tabelInfo.lastBonus);
            FortuneRabbitTable.tabelInfo.task = true;
            tcLog.info(`taskLineAnim  totalWinCoin > 0 isAnimEnd`)
            FortuneRabbitTable.tabelInfo.isAnimEnd = true;
            return;
        }

        const winnerInfo = this.getWinnerInfo();
        if (!winnerInfo || winnerInfo.length == 0) {
            FortuneRabbitTable.tabelInfo.task = true;
            if (this.controlPanelLogic!.getSpinNum() == 0) {
                this.controlPanelLogic!.showBtnSpin();
            }
            tcLog.info(`taskLineAnim  !winnerInfo isAnimEnd`)
            FortuneRabbitTable.tabelInfo.isAnimEnd = true;
            return;
        }

        let betNum = this.controlPanelLogic?.getBetNum() || 0;
        let betTimes = this.totalWinCoin / betNum;
        let bigWinlevel = FortuneRabbitTable.tabelInfo.winLevel[0];

        this.controlPanelLogic!.setBonus(env.curGameData.balance, true, FortuneRabbitTable.tabelInfo.lastBonus);

        //如果得分是3--5倍，则需要播放得分数字滚动效果，这过程不能打断
        if (this.winTimes >= FortuneRabbitTable.tabelInfo.runScoreLevels[0] && this.winTimes < FortuneRabbitTable.tabelInfo.runScoreLevels[1]) {

            FortuneRabbitTable.tabelInfo.bWinScoreRuning = true;

        } else {
            this.view?.showWinNote(this.totalWinCoin, this.winTimes);
        }

        if (this.winTimes < FortuneRabbitTable.tabelInfo.winLevel[0]) {
            let effectIndex = Math.floor(Math.random() * 4 + 1);
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames[`rabbit_win${effectIndex}`]);
        } else {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.rabbit_win5);
        }

        if (betTimes >= bigWinlevel) {
            FortuneRabbitTable.tabelInfo.bWinScoreRuning = false;
        }


        this.view?.showCongratilationLabelEffect();
        //先显示总线
        this.awardAnimCount = startLineIndex ?? this.winnerInfo?.length;
        //播放总线时需要禁用btnSpin按钮
        cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.UNACTIVE_STOP);
        //中奖后先播放一次总线，如果是自动模式则立即开始下一轮摇奖，否则
        //就开始分线、总线轮流展示
        // await CocosUtil.wait(1)
        //显示单线中奖延时
        tcLog.info(`taskLineAnim  isAnimEnd`)
        FortuneRabbitTable.tabelInfo.isAnimEnd = true;
        this.startPlayOnline();
    }

    startPlayOnline() {
        this.view.scheduleOnce(this.startPlayOnline.bind(this), 2);
        if (this.awardAnimCount == this.winnerInfo?.length) {
            //播放总线
            this.playAllLine();
        } else {
            const info = this.winnerInfo && this.winnerInfo[this.awardAnimCount % this.winnerInfo?.length];
            if (!info) {
                this.view?.unscheduleAllCallbacks();
                FortuneRabbitTable.tabelInfo.task = true;
                return;
            }

            //自动模式不播单线
            if (this.controlPanelLogic!.getSpinNum() == 0) {
                if (FortuneRabbitTable.tabelInfo.bBallWin) {
                    //如果是ball中奖，则只播总线
                    this.playAllLine();
                    console.log("setBtnSpineStatus:  bBallWin");
                    cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.ACTIVE_NORMAL);
                    return;
                    // this.awardAnimCount = this.winnerInfo?.length;
                }
                this.view?.showOneLineInfo(info);
                this.awardAnimCount++;
                this.controlPanelLogic!.showBtnSpin();
                // console.log("setBtnSpineStatus:   == 0");
                cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.ACTIVE_NORMAL);
            } else {
                this.view?.unscheduleAllCallbacks();
                FortuneRabbitTable.tabelInfo.task = true;
            }
        }
    }

    playAllLine() {
        this.awardAnimCount = 0;
        this.taskAllLineAnim();
    }

    public bAutoMode() {
        return this.controlPanelLogic.getSpinNum() > 0;
    }

    public setBonus(value: number, playAni: boolean) {
        console.log("logic setBonus value:", value);
        this.controlPanelLogic.setBonus(value, playAni, FortuneRabbitTable.tabelInfo.lastBonus);
    }

    private taskReset() {
        this.totalWinCoin = 0;
    }

    private addTask(callback: Function, data: any) {
        const task: Task = {
            data,
            callback,
        };
        this.taskQueue.push(task);
    }

    /**
     * @method 桌子信息
     * @param data
     */
    private handlerTableInfo(data: any): void {
        console.log("handlerTableInf...", data);

        // data = {
        //     "screen": [{ "id": 3 }, { "id": 4 }, { "id": 4 },
        //     { "id": 3 }, { "id": 81 }, { "id": 1 },
        //     { "id": 4 }, { "id": 51 }, { "id": 1 },
        //     { "id": 0 }, { "id": 1 }, { "id": 0 }],
        //     "trigger": 0, "bet": 1000, "balance": 978800,
        //     "leftTimes": -1, "priseTrigger": 0, "rabbitWin": 0, "isWish": 0, "totalWin": 0, "money": 978800
        // }

        // data = {
        //     "screen": [{ "id": 9, "multi": 20 }, { "id": 0 }, { "id": 9, "multi": 10 },
        //     { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 },
        //     { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 9, "multi": 5 },
        //     { "id": 0 }, { "id": 9, "multi": 5 }, { "id": 0 }],
        //     "trigger": 0, "bet": 1000, "balance": 964200, "leftTimes": 2, "priseTrigger": 0,
        //     "rabbitWin": 17500, "isWish": 0, "money": 964200
        // }



        const msg = proto.slot_fortune_rabbit.GameGetTableInfoResp.decode(new Uint8Array());
        msg.self = new proto.slot_fortune_rabbit.User()
        msg.desc = new proto.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc()
        msg.self.userId = 123456
        msg.self.balance = data.money * 10
        msg.desc.gameType = 31010
        msg.winLevel = [5, 15, 35]
        msg.lastScreen = new proto.slot_fortune_rabbit.LastScreen()


        if (!data.screen) {  //没有值
            msg.lastScreen.win = 0;
            msg.lastScreen.betSize = gameData.betSizes[0]
            msg.lastScreen.betMul = gameData.betLevels[1]
            msg.lastScreen.amount = msg.lastScreen.betSize * msg.lastScreen.betMul * 10
            msg.lastScreen.hits = []
            msg.lastScreen.leftTimes = -1;
            msg.lastScreen.feature = false
            msg.lastScreen.rabbitWin = 0;
            for (let index = 0; index < 12; index++) {
                let idData: proto.slot_fortune_rabbit.ISymbol = new proto.slot_fortune_rabbit.Symbol()
                if (index == 1) {
                    idData.id = 9
                    idData.multi = msg.lastScreen.amount * 50
                } else if (index == 4) {
                    idData.id = 9
                    idData.multi = msg.lastScreen.amount * 2
                } else if (index == 7) {
                    idData.id = 9
                    idData.multi = currency.accMul(msg.lastScreen.amount, 0.5);
                } else if (index == 10) {
                    idData.id = 9
                    idData.multi = currency.accMul(msg.lastScreen.amount, 0.05);

                } else if (index == 6 || index == 8) {
                    idData.id = 51
                } else {
                    idData.id = 82
                }
                msg.lastScreen.screen.push(idData);
            }

            this.controlPanelLogic.updateBetData(msg.lastScreen?.betSize, msg.lastScreen?.betMul, msg.lastScreen?.amount);
            this.controlPanelLogic?.setBetNum(this.controlPanelLogic?.getBetNum());

        }
        else {
            let betSize = this.getBetSizes[data.betSize ? data.betIndex : 0]
            let betMul = gameData.betLevels[data.mutipleIndex ? data.mutipleIndex : 0]

            msg.lastScreen.win = data.totalWin ? data.totalWin * 10 : 0
            msg.lastScreen.amount = data.bet ? data.bet * 10 : 0
            msg.lastScreen.betSize = betSize ? betSize * 10 : 0
            msg.lastScreen.betMul = betMul ? betMul : 0
            msg.lastScreen.hits = data.hits ? data.hits : []
            msg.lastScreen.leftTimes = data.leftTimes ? data.leftTimes : 0
            msg.lastScreen.feature = data.feature ? true : false
            msg.lastScreen.rabbitWin = data.rabbitWin ? data.rabbitWin * 10 : 0

            for (let index = 0; index < 12; index++) {
                let idData: proto.slot_fortune_rabbit.ISymbol = new proto.slot_fortune_rabbit.Symbol()
                msg.lastScreen.screen[index] = idData
                msg.lastScreen.screen[index].id = data.screen[index].id

                if (data.screen[index].multi) {
                    msg.lastScreen.screen[index].multi = currency.accDiv(data.screen[index].multi * data.bet, 10);

                }
            }

            if (msg.lastScreen.hits && msg.lastScreen.hits.length > 0) {
                for (let index = 0; index < msg.lastScreen.hits.length; index++) {
                    const element = msg.lastScreen.hits[index];
                    element.win = element.win * 10
                    let lineId = element.lineId
                    element.pos = FortuneRabbitTable.lines[lineId]
                }
            }
        }


        tcLog.info(` handlerTableInfo:${JSON.stringify(msg)}`);

        // if (FortuneRabbitTable.tabelInfo.isInit) {
        //     return;
        // }

        // FortuneRabbitTable.tabelInfo.isInit = true;
        FortuneRabbitTable.tabelInfo.bRolling = false;

        this.taskQueue = [];

        this.winnerInfo = msg.lastScreen?.hits;
        this.totalWinCoin = msg.lastScreen?.rabbitWin! || msg.lastScreen?.win;

        env.curGameData.balance = msg.self?.balance!;
        env.user.userId = msg.self?.userId!;
        FortuneRabbitTable.tabelInfo.type = msg.desc?.gameType!;
        FortuneRabbitTable.tabelInfo.winLevel = msg.winLevel;
        this.winLevel = msg.winLevel;
        this.winTimes = Math.floor(msg.lastScreen?.win! / msg.lastScreen?.amount!);

        this.controlPanelLogic.updateBetData(msg.lastScreen?.betSize, msg.lastScreen?.betMul, msg.lastScreen?.amount);


        let bet = this.controlPanelLogic.getBetNum();
        FortuneRabbitTable.tabelInfo.curBet = bet;

        //普通模式把无效item改为有效item，避免滚动时出现空白格子
        let existUnBallElement = false;

        msg.lastScreen?.screen.forEach((element) => {
            existUnBallElement ||= element.id != undefined && element.id != 9 && element.id != 0;
        });
        msg.lastScreen.screen[9].id = existUnBallElement ? 1 : 0;
        msg.lastScreen.screen[11].id = existUnBallElement ? 1 : 0;



        msg.lastScreen?.screen ? FortuneRabbitTable.setScreen(msg.lastScreen?.screen, msg.lastScreen?.amount || bet) : FortuneRabbitTable.setFirstScreen(); //设置首屏 策划写死
        this.checkFeatureMode(msg, msg.lastScreen?.screen, !existUnBallElement, msg.lastScreen?.leftTimes);
        this.initTable(msg.lastScreen?.rabbitWin > 0 && msg.lastScreen?.leftTimes == -1);

        this.controlPanelLogic?.setBetNum(this.controlPanelLogic?.getBetNum());




        if (msg.lastScreen?.leftTimes > 0) {
            for (let index = 0; index < msg.lastScreen?.leftTimes; index++) {
                FortuneRabbitSender.reqSpin(this.controlPanelLogic?.getBetNum() || 0, true, this.controlPanelLogic!.getBetSize(), this.controlPanelLogic!.getBetLevel());
            }
        }
    }

    private isWishCount: number = 0

    public isfailSpin: Boolean = false
    private failSpinRps() {
        let bet = this.controlPanelLogic.getBetNum() / 10
        let balance = (env.curGameData.balance / 10)
        let data = {
            "screen": [
                { "id": 81 }, { "id": 4 }, { "id": 3 },
                { "id": 81 }, { "id": 4 }, { "id": 3 },
                { "id": 81 }, { "id": 4 }, { "id": 3 },
                { "id": 0 }, { "id": 4 }, { "id": 0 }],
            "trigger": 0, "bet": bet, "balance": balance,
            "leftTimes": -1, "priseTrigger": 0, "rabbitWin": 0, "isWish": 0, "totalWin": 0
        }
        tcLog.info(`failSpinRps msg:${JSON.stringify(data)}`);
        this.isfailSpin = true
        this.onSpinRps(data)
    }

    public testCount: number = 0
    private async onSpinRps(data: any) {
        // await CocosUtil.wait(2 + Math.random() * 7) //test
        console.log("onSpinRp...");
        this.isfailSpin = false

        clearTimeout(this.setTimeNum)
        clearTimeout(this.setTimeConf)
        SelectGameMrg.getInstance().preDoTime = new Date().getTime()

        // if (this.testCount == 1) {
        // data = {
        //     "screen": [{ "id": 3 }, { "id": 82 }, { "id": 51 },
        //     { "id": 1 }, { "id": 1 }, { "id": 2 },
        //     { "id": 4 }, { "id": 1 }, { "id": 3 },
        //     { "id": 0 }, { "id": 3 }, { "id": 0 }],
        //     "hits": [{ "lineId": 4, "win": 300, "pos": [4, 5, 3], "symbol": 1 }],
        //     "trigger": 0, "bet": 1500, "balance": 1293250, "leftTimes": -1, "priseTrigger": 0, "rabbitWin": 0, "isWish": 0, "totalWin": 300
        // }

        // } else if (this.testCount >= 2) {
        // data = {
        //     "screen": [{ "id": 4 }, { "id": 51 }, { "id": 4 },
        //     { "id": 51 }, { "id": 3 }, { "id": 51 },
        //     { "id": 1 }, { "id": 81 }, { "id": 2 },
        //     { "id": 0 }, { "id": 2 }, { "id": 0 }],
        //     "hits": [{ "lineId": 1, "win": 1500, "pos": [1, 2, 3], "symbol": 4 },
        //     { "lineId": 5, "win": 750, "pos": [4, 5, 6], "symbol": 3 },
        //     { "lineId": 6, "win": 7500, "pos": [4, 8, 6], "symbol": 81 }],
        //     "trigger": 0, "bet": 1000, "balance": 1301500, "leftTimes": -1,
        //     "priseTrigger": 0, "rabbitWin": 0, "isWish": 0, "totalWin": 5000
        // }
        // }

        //普通出现红包
        // data = {
        //     "screen": [{ "id": 82 }, { "id": 2 }, { "id": 3 },
        //     { "id": 51 }, { "id": 1 }, { "id": 2 },
        //     { "id": 3 }, { "id": 2 }, { "id": 1 },
        //     { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }],
        //     "hits": [{ "lineId": 6, "win": 300, "pos": [4, 8, 6], "symbol": 2 }],
        //     "trigger": 0, "bet": 1000, "balance": 1027400, "leftTimes": -1,
        //     "priseTrigger": 0, "rabbitWin": 0, "isWish": 0, "totalWin": 300
        // }

        // data = {
        //     "screen": [{ "id": 2 }, { "id": 4 }, { "id": 9, "multi": 5 },
        //     { "id": 4 }, { "id": 1 }, { "id": 82 },
        //     { "id": 9, "multi": 10 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 5 },
        //     { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 0 }],
        //     "trigger": 0, "bet": 1000, "balance": 957200, "leftTimes": -1,
        //     "priseTrigger": 1, "rabbitWin": 0, "isWish": 0, "totalWin": 5500
        // }

        // //特殊模式0
        // if (this.testCount == 0) {
        //     data = { "screen": [{ "id": 0 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 1, "bet": 1000, "balance": 1023600, "leftTimes": 7, "priseTrigger": 0, "rabbitWin": 0, "isWish": 1 }
        // } else if (this.testCount == 1) {
        //     data = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 9, "multi": 5 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 6, "priseTrigger": 0, "rabbitWin": 0, "isWish": 0 }
        // } else if (this.testCount == 2) {
        //     data = { "screen": [{ "id": 0 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 9, "multi": 5 }, { "id": 0 }, { "id": 9, "multi": 5 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 5, "priseTrigger": 0, "rabbitWin": 0, "isWish": 0 }
        // } else if (this.testCount == 3) {
        //     data = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 4, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
        // } else if (this.testCount == 4) {
        //     data = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 3, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
        // } else if (this.testCount == 5) {
        //     data = { "screen": [{ "id": 0 }, { "id": 9, "multi": 20 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 0 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 2, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
        // } else if (this.testCount == 6) {
        //     data = { "screen": [{ "id": 0 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 10 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 1, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
        // } else if (this.testCount == 7) {
        //     data = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1039100, "leftTimes": 0, "priseTrigger": 0, "rabbitWin": 15500, "isWish": 0, "totalWin": 15500 }

        // } else if (this.testCount == 8) {

        //     data = {
        //         "screen": [{ "id": 82 }, { "id": 2 }, { "id": 3 },
        //         { "id": 51 }, { "id": 1 }, { "id": 2 },
        //         { "id": 3 }, { "id": 2 }, { "id": 1 },
        //         { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }],
        //         "hits": [{ "lineId": 6, "win": 300, "pos": [4, 8, 6], "symbol": 2 }],
        //         "trigger": 0, "bet": 1000, "balance": 1027400, "leftTimes": -1,
        //         "priseTrigger": 0, "rabbitWin": 0, "isWish": 0, "totalWin": 300
        //     }
        // }
        // this.testCount++


        const msg = proto.slot_fortune_rabbit.SpinResp.decode(new Uint8Array());

        msg.screen = []
        for (let index = 0; index < 12; index++) {
            msg.screen[index] = {
                id: data.screen[index].id
            }
            if (data.screen[index].multi) {
                msg.screen[index].multi = currency.accDiv(data.screen[index].multi * data.bet, 10)
            }
        }
        msg.bet = data.bet ? data.bet * 10 : 0
        msg.balance = data.balance ? data.balance * 10 : 0
        if (msg.leftTimes > -1) {
            msg.leftTimes = data.leftTimes
        } else {
            msg.leftTimes = -1
        }
        msg.rabbitWin = data.rabbitWin * 10
        if (data.totalWin) {
            msg.totalWin = currency.accMul(data.totalWin, 10);
        } else {
            msg.totalWin = 0
        }


        this.isWishCount++
        if (data.trigger == 0 && this.isWishCount >= 20) {
            this.isWishCount = 0
            msg.isWish = true
        } else {
            msg.isWish = false
        }

        if (data.trigger == 1) {
            msg.isWish = true
            msg.trigger = true
        }


        msg.priseTrigger = data.priseTrigger ? true : false


        msg.hits = data.hits ? data.hits : []

        if (msg.hits && msg.hits.length > 0) {
            for (let index = 0; index < msg.hits.length; index++) {
                const element = msg.hits[index];
                // element.win = element.win * data.bet / 10
                element.win = element.win * 10
                let lineId = element.lineId
                element.pos = FortuneRabbitTable.lines[lineId]
            }
        }



        msg.screen[9].id = msg.leftTimes == -1 ? 1 : 0;
        msg.screen[11].id = msg.leftTimes == -1 ? 1 : 0;
        this.totalWinCoin = msg.leftTimes < 0 ? msg.totalWin : msg.rabbitWin;
        this.winTimes = Math.floor(this.totalWinCoin / msg.bet!);
        FortuneRabbitTable.tabelInfo.bWish = msg.isWish;
        FortuneRabbitTable.tabelInfo.rollendCount = 0;
        FortuneRabbitTable.tabelInfo.isQuickModel = this.controlPanelLogic?.IsQuickModel() || false;
        this.checkFeatureMode(msg, msg.screen, msg.leftTimes > -1, msg.leftTimes);

        tcLog.info(`onSpinRps data msg:${JSON.stringify(msg)}`);


        FortuneRabbitTable.setScreen(msg.screen || [], this.controlPanelLogic.getBetNum());
        if (msg.leftTimes > -1 && msg.leftTimes < 7) {
            //兔子模式的非第一次摇奖,第一次的则走正常流程
            env.curGameData.balance = msg.balance || 0;
            this.view?.startFortuneRoll();
        } else {
            FortuneRabbitTable.tabelInfo.lastBonus = env.curGameData.balance - msg.bet;
            console.log("set lastBonus:", FortuneRabbitTable.tabelInfo.lastBonus);
            this.controlPanelLogic!.setBonus(FortuneRabbitTable.tabelInfo.lastBonus);
            env.curGameData.balance = msg.balance || 0;
            msg.priseTrigger && this.checkBallHits(msg);
            this.winnerInfo = msg.hits;
            this.taskQueue = [];
            this.winTimes = Math.floor(this.totalWinCoin / msg.bet!);
            FortuneRabbitTable.tabelInfo.bBallWin = msg.priseTrigger;
            //检测是否是自动模式
            let autoLeftCount = this.controlPanelLogic!.getSpinNum();
            if (autoLeftCount > 0) {
                autoLeftCount--;
                this.controlPanelLogic!.setSpinNumFun(autoLeftCount, this.totalWinCoin);
                this.controlPanelLogic!.showAutoSpin();
            }

            FortuneRabbitTable.tabelInfo.bRolling = true;
            this.awardAnimCount = 0;
            this.view?.awardLayer?.reset();
            this.view?.resetAllAwardInfo();

            FortuneRabbitTable.tabelInfo.rollendCount = 0;
            FortuneRabbitTable.tabelInfo.bWin = (msg.totalWin || 0) > 0;
            this.view?.OnReceiveSpinResult();
        }
    }

    //构建ball的中线数据
    checkBallHits(msg: proto.slot_fortune_rabbit.ISpinResp) {
        let curOnline: proto.slot_fortune_rabbit.IHit;
        msg.screen.forEach((element, index) => {
            let cellIndex = index % 3;
            let rowIndex = Math.floor(index / 3);
            if (cellIndex == 0) {
                //新的单线
                curOnline = new proto.slot_fortune_rabbit.Hit();
                curOnline.pos = [];
                curOnline.lineId = -1;
                msg.hits.push(curOnline);
            }
            element.id == 9 ? curOnline.pos.push(rowIndex) : curOnline.pos.push(-1);
        });
        if (FortuneRabbitTable.tabelInfo.bTrigger) {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_win);
        } else {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bonus5_jackpot);
        }
    }

    //检测feature模式
    private checkFeatureMode(msg: any, screen: proto.slot_fortune_rabbit.ISymbol[], feature: boolean, leftTimes: number) {
        FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger = leftTimes;
        screen.forEach((element) => {
            element.id == 9 && FortuneRabbitTable.tabelInfo.featureData.push(element.multi);
        });
        FortuneRabbitTable.tabelInfo.bTrigger = feature; //msg.lastScreen.feature || msg.trigger || lastGameBFeature;
    }

    private handlerGetCellsMatrixConfig(data: Uint8Array) {
        const msg = proto.slot_fortune_rabbit.GameConfigResp.decode(data);
        const config = JSON.parse(msg.config);

        if (config.PayLines) {
            for (let key in config.PayLines) {
                FortuneRabbitDefine.PayLines.set(key, config.PayLines[key]);
            }
        }
        tcLog.info("handlerRoomConfig:" + JSON.stringify(FortuneRabbitDefine.cellsMatrix), config);
    }

    public setControlBtnsStatus(show: boolean) {
        this.controlPanelLogic.setControlBtnsStatus(show);
    }

    update(deltaTime: number) {
        if (FortuneRabbitTable.tabelInfo.task) {
            //有则执行无则检查是否自动开始
            FortuneRabbitTable.tabelInfo.task = false;

            if (this.taskQueue.length > 0) {
                const task = this.taskQueue.shift();
                task?.callback(task.data);
            } else {
                this.checkIsAutoStart();
            }
        }

        if (this.controlPanelLogic!.getSpinNum() == 0 && (new Date().getTime() > (SelectGameMrg.getInstance().preDoTime + 60000))) {
            console.log("setBtnSpineStatus:  >60000");
            cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.ACTIVE_NORMAL);
        }

    }

    //#endregion

    handler(pkg: Message): void {
    }

    stopHeartBeat() { }

    checkWildShow(wildNode: cc.Node) {
        this.view?.playWildShowEffect(wildNode);
    }

    showItemTip(data: any) {
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.click_element);
        this.view?.showItemTip(data);
    }

    hideItem(point: { x: number; y: number }) {
        this.view?.hideItem(point);
    }

    startShowGameView() {
        if (!this.view) {
            return;
        }
        //关闭了加载界面，开始显示游戏视图
        this.changeMusic(FortuneRabbitDefine.soundNames.bg_music);
        if (FortuneRabbitTable.tabelInfo.bTrigger && FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger > 0) {
            //feature模式还未结束，立即进入feature模式
            this.view.tryStartFortunRabbitMode(false);
            this.setControlBtnsStatus(false);
            this.startSpin();
            this.changeMusic(FortuneRabbitDefine.soundNames.bon_music);
        } else {
            //显示上一局的中奖线
            this.controlPanelLogic!.setWinCount(this.totalWinCoin);
            this.taskLineAnim(0);
        }
    }

    betChagned() {
        FortuneRabbitTable.tabelInfo.curBet = this.controlPanelLogic.getBetNum();
    }



    getBgMusic(): string {
        return FortuneRabbitDefine.soundNames.bg_music;
    }
    getAutoSettingSliderClickSound(): string {
        return FortuneRabbitDefine.soundNames.slider_effect;
    }
    getBetSizes(): number[] {
        return gameData.betSizes;
    }
    getControlPanelNode(): cc.Node | undefined {
        return this.view?.getControlPanelNode();
    }
    getPayTimes(): number {
        return gameData.betLines;
    }
    getPayTableNodeURL(): string {
        return "prefab/nodePayTable";
    }
    getRuleNodeURL() {
        return "prefab/nodeRule";
    }
    getHistoryNodeURL(): string {
        return "prefab/history/UIhistory";
    }
    getHistoryData(): void {
        throw new Error("Method not implemented.");
    }

    getClickBtnSound() {
        return FortuneRabbitDefine.soundNames.click;
    }
}
