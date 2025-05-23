
import { env } from "../../../../script/app/env";
import { cronBalance } from "../../../../script/cron/cron-balance";
import { event } from "../../../../script/event/event";
import { tcLog } from "../../../../script/framework/log/log";
import { Message } from "../../../../script/framework/net/msg";
import { Handler, uNet } from "../../../../script/framework/net/socket";
import { config, gameConfig, gameHelper } from "../../../../script/config/config";
import { GameLoadingHelper, gameLoadType } from "../../../../script/loading/gameLoadingHelper";
import { tcRes } from "../../../../script/framework/res/res";
import { tcStorage } from "../../../../script/framework/storage/storage";
import { uAudio } from "../../../../script/framework/audio/audio";
import { LoginGameMrg } from "../../../../ApiTemplate/script/Scene/LoginGameMrg";
import logger from "../../../../ApiTemplate/script/net/logger";


export class ApiGameLogic implements Handler {
    private curGameId: number = 0;
    private isDemoMode: boolean = false;
    private gameNodeCaches: Map<number, cc.Prefab> = new Map(); // 游戏节点缓存
    private curTableNode: cc.Node | undefined;

    private loadProgressInterval: number = -1;
    private loadProgress: number = 0;
    private _gameData: any;

    private readonly frameSize = cc.view.getFrameSize();

    private isopen: boolean = false;

    constructor() {
        this.bindEvent();
    }

    private bindEvent() {
        cc.systemEvent.on(event.loadGameResOver, this.loadGameResOver, this);
        cc.systemEvent.on(LoginGameMrg.loginStart, this.loginStartHandel, this);

        cc.view.setResizeCallback(this.onViewResize.bind(this));
    }

    public loadNativeGame(gameData: any, mode?: boolean) {
        this._gameData = gameData;
        if (gameData.orientation === 2) {
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            cc.view.setFrameSize(this.frameSize.width, this.frameSize.height);
            cc.view.emit("canvas-resize");
            cc.systemEvent.emit("switch-orientitaion", 2);
        } else if (gameData.orientation === 1) {
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            cc.view.setFrameSize(this.frameSize.height, this.frameSize.width);
            cc.view.emit("canvas-resize");
            cc.systemEvent.emit("switch-orientitaion", 1);
        } else {
            //自适应
            cc.view.setOrientation(cc.macro.ORIENTATION_AUTO);
            cc.view.setFrameSize(this.frameSize.width, this.frameSize.height);
            cc.view.emit("canvas-resize");
        }

        this.startGame(gameData.nativeId, gameData.gameId, mode);
    }

    handler(msg: Message): void {
    }

    //启动游戏,加载游戏节点到config.uiNode.dialog
    //链接服务器，预加载预制等操作
    private startGame(nativeId: number, gameId: number, mode?: boolean) {
        tcLog.debug(`start game , nativeId:${nativeId} isDemoMode:${mode}`);
        this.curGameId = nativeId;
        this.isDemoMode = mode ?? false;

        this.loadGame();
    }


    // private preTime
    /** loading界面 */
    private async loadGame() {
        // this.preTime = new Date().getTime()
        // let time = 1500
        // let _svgDuration = window["_svgDuration"] as number;
        // if (_svgDuration) {
        //     time = _svgDuration
        // }
        // let newTime = new Date().getTime()
        // if ((newTime - this.preTime) > time) {
        //     this.closePG()
        // } else {
        //     setTimeout(() => {
        //         this.closePG()
        //     }, (time - newTime + this.preTime));
        // }


        try {
            this.loadProgress = 0.5
            let loadTableCost = 0;
            tcLog.info(`try  loadGame`);
            // 大厅默认静音，进入游戏恢复设置
            if (tcStorage.readAny(tcStorage.Keys.SoundSwitch) === "off") {
                uAudio.getInstance().setEffectVolume(0);
                uAudio.getInstance().setMusicVolume(0);
            } else {
                uAudio.getInstance().setEffectVolume(1);
                uAudio.getInstance().setMusicVolume(1);
                tcStorage.save(tcStorage.Keys.SoundSwitch, "on");
            }

            const bundleName = this.getCurGameBundleName();
            cronBalance.stop();

            let loadType = this.getGameLoadingViewData(this.curGameId);
            window.switchToLandscape && window.switchToLandscape(); // 切换横屏
            // await GameLoadingHelper.initLoading(); //TEST
            // await GameLoadingHelper.openLoading({ bundleName: bundleName, loadType: loadType }); //TEST

            this.clearLoadProgressInterval();
            this.loadProgressInterval = window.setInterval(() => {
                window.updateProgress && window.updateProgress(this.loadProgress)
                if (this.loadProgress >= 0.6) {
                    this.clearLoadProgressInterval();
                    return;
                }
                this.loadProgress += 0.01;
                GameLoadingHelper.updateLoadProgress(this.loadProgress);
                window.updateProgress && window.updateProgress(this.loadProgress)
            }, 100);

            /** 需要放在它后面 GameLoadingHelper.initLoading() */
            const typeBundle = gameConfig.GAMEID_GAME_BUNDLE[this.curGameId as keyof typeof gameConfig.GAMEID_GAME_BUNDLE];
            for (let index = 0; index < typeBundle.length; index++) {
                const bundle = typeBundle[index];
                await tcRes.loadBundle(bundle);
            }
            tcLog.log("loadBundle over")

            // 发送心跳;
            // window.gameLauncher && window.gameLauncher[this.curGameId] && window.gameLauncher[this.curGameId]?.timerStart();

            //加载游戏主节点（table)
            let nodePrefab = this.gameNodeCaches.get(this.curGameId);
            let startLoadTableTime = Date.now();
            if (!nodePrefab) {
                try {
                    this.clearLoadProgressInterval();
                    const prefab = await tcRes.load<cc.Prefab>(`${bundleName}`, cc.Prefab, "prefab/table", (progreass: number) => {

                        this.loadProgress = 0.6 + progreass * 0.1

                        GameLoadingHelper.updateLoadProgress(this.loadProgress);
                        window.updateProgress && window.updateProgress(this.loadProgress)
                    });

                    loadTableCost = Date.now() - startLoadTableTime;
                    nodePrefab = prefab;
                    this.gameNodeCaches.set(this.curGameId, prefab);
                } catch (err: any) {
                    tcLog.error(`load tips err: ${err.message}`);
                    return;
                }
            }


            if (this.curTableNode) {
                GameLoadingHelper.closeLoading();
                return;
            }

            logger.log(`instantiate table_${bundleName}`);
            this.curTableNode = cc.instantiate(nodePrefab);
            this.curTableNode.name = `table_${bundleName}`;
            this.curTableNode.setParent(config.uiNode.dialog);
            cc.audioEngine.stopMusic();



            this.clearLoadProgressInterval();
            this.loadProgressInterval = window.setInterval(() => {
                if (this.loadProgress >= 0.75) {
                    this.clearLoadProgressInterval();
                    return;
                }
                this.loadProgress += 0.0001;
                GameLoadingHelper.updateLoadProgress(this.loadProgress);
                window.updateProgress && window.updateProgress(this.loadProgress)
            }, 100);

        } catch (err: any) {
            tcLog.error(`gameLogic.loadGame, ${err.message}`);
            this.clearLoadProgressInterval();
        }
    }

    private clearLoadProgressInterval() {
        if (this.loadProgressInterval > -1) {
            window.clearInterval(this.loadProgressInterval);
            this.loadProgressInterval = -1;
        }
    }

    //获取当前游戏bundle名称
    private getCurGameBundleName() {
        const bundleName = gameConfig.GAMEID_2_BUNDLE_NAMES[this.curGameId as keyof typeof gameConfig.GAMEID_2_BUNDLE_NAMES];
        if (env.device.platform === env.PlatformType.Native) {
            return `${jsb.fileUtils.getWritablePath()}remote-assets/assets/${bundleName}`;
        }
        return bundleName;
    }

    private loginStartHandel() {
        this.clearLoadProgressInterval();
        this.loadProgressInterval = window.setInterval(() => {
            if (this.loadProgress >= 0.8) {
                this.clearLoadProgressInterval();
                return;
            }
            this.loadProgress += 0.0001;
            GameLoadingHelper.updateLoadProgress(this.loadProgress);
            window.updateProgress && window.updateProgress(this.loadProgress)
        }, 100);
    }

    /** 准备结束 */
    private loadGameResOver() {
        this.clearLoadProgressInterval();
        this.loadProgress = 1
        GameLoadingHelper.updateLoadProgress(this.loadProgress);
        window.updateProgress && window.updateProgress(this.loadProgress)
    }

    onViewResize() {
        if (env.device.platform != env.PlatformType.H5) {
            return;
        }
        //非自适应类型的不处理屏幕旋转
        if (env.curGameData.data.orientation == 0) {
            let bPortrait = gameHelper.bPortrait();
            cc.systemEvent.emit("switch-orientitaion", bPortrait ? 2 : 1);
        }
    }

    getGameLoadingViewData(gameId: number) {
        if (gameHelper.bPGGame(gameId)) {
            return gameLoadType.GAME_ICON_ANI;
        } else {
            let tags: number[] = env.curGameData.data.tags;
            let bSlot = tags.indexOf(2) >= 0;

            if (bSlot) {
                return gameLoadType.GAME_PROGROGRESS_BTNOK;
            } else {
                return gameLoadType.GAME_PROGROGRESS; // : gameLoadType.GAME_NO_PROGRESS;
            }
        }
    }

    //部分很窄的机型，背景不能铺满全屏，会导致可以看见大厅的bug,所以
    //统一在所有游戏的table节点上添加黑色底图
    async addGameMask() {
        if (!this.curTableNode) {
            return;
        }
        let spriteCom = this.curTableNode.getComponent(cc.Sprite);
        if (!spriteCom) {
            spriteCom = this.curTableNode.addComponent(cc.Sprite);
        }
        try {
            let spriteFrame = await tcRes.load("gameCommon", cc.SpriteFrame, "sprites/default_sprite_splash");
            spriteCom.spriteFrame = spriteFrame;
            this.curTableNode.color = cc.Color.BLACK;
        } catch (err: any) {
            tcLog.error(`gameLogic.addGameMask error:${err.message}`);
        }
    }
}
