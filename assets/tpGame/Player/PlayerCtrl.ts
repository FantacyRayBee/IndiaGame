import { EnumBattleStatus, EnumPlayStatus, EnumPlayerKuangType } from "../DataDef";
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/PlayerCtrl')
export default class PlayerCtrl extends cc.Component {

    @property(cc.Label)
    private lab_name: cc.Label = null;
    
    @property(cc.Label)
    private lab_coin: cc.Label = null;

    @property(cc.Node)
    private node_state: cc.Node = null;

    @property(cc.Label)
    private lab_stateTip: cc.Label = null;

    @property(cc.Node)
    private node_offLine: cc.Node = null;

    @property(cc.Label)
    private lab_time: cc.Label = null;

    @property(cc.Sprite)
    private sprite_head: cc.Sprite = null;

    @property(cc.Node)
    private node_actTime: cc.Node = null;

    @property(sp.Skeleton)
    private sp_time: sp.Skeleton = null;

    @property(sp.Skeleton)
    private sp_win: sp.Skeleton = null;

    @property(sp.Skeleton)
    private sp_lost: sp.Skeleton = null;

    @property(cc.Node)
    private node_battleAgree: cc.Node = null;

    @property(cc.Node)
    private node_battleRefuse: cc.Node = null;

    @property(cc.Node)
    private node_shop: cc.Node = null;

    @property(cc.Button)
    private btn_gift: cc.Button = null;

    @property(cc.Sprite)
    private sprite_kuang: cc.Sprite = null;

    @property(cc.SpriteFrame)
    private spriteF_withCoin: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private spriteF_withoutCoin: cc.SpriteFrame = null;

    private _playerActTimer: number = 0;

    private _playerPid = -1;

    private _playerName = "";

    private _playerHeadUrl = "";

    private _playerCoin = 0;

    private _playerState = EnumPlayStatus.NORMAL;

    private _playerSeat = -1;


    onLoad() {
        //@ts-ignore
        this.btn_gift.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }

    btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        //@ts-ignore
        CommonFun.getInstance().showGameGifInteraction(this._playerSeat);
    }

    onDestroy(): void {
        this._clearPlayerActTimer();
    }

    initPlayer() {
        this._clearPlayerActTimer();
        this.unscheduleAllCallbacks();
        this.setPlayerSeat(-1);
        this.setPlayerPid(-1);
        this.setPlayerName("");
        this.setPlayerCoin(-1);
        this.setPlayerStateValue(EnumPlayStatus.NORMAL);
        this.setPlayerStatePerformance();
        this.setPlayerActTime(0);
        this._setPlayerWinPerformanceNodeActive(false);
        this._setPlayerLostPerformanceNodeActive(false);
        this.setPlayerBattlePerformance(EnumBattleStatus.NONE);
        this.setPlayerOffLineActive(false);
        this.setPlayerShopActive(false);
        this.setPlayerStyle(0);
        this.setPlayerKuang(EnumPlayerKuangType.WITHCOIN);
    }

    /**
     * 重置玩家表现(除玩家名字和金币以外)
     */
    resetPlayerPerformance() {
        this.unscheduleAllCallbacks();
        this.setPlayerStateValue(EnumPlayStatus.NORMAL);
        this.setPlayerStatePerformance();
        this.setPlayerActTime(0);
        this._setPlayerWinPerformanceNodeActive(false);
        this._setPlayerLostPerformanceNodeActive(false);
        this.setPlayerBattlePerformance(EnumBattleStatus.NONE);
        this.setPlayerShopActive(false);
    }

    /**
     * 设置玩家框的类型
     * @param type 
     */
    setPlayerKuang(type: EnumPlayerKuangType) {
        switch (type) {
            case EnumPlayerKuangType.WITHCOIN:
                this.lab_coin.node.active = true;
                this.sprite_kuang.spriteFrame = this.spriteF_withCoin;
                break;
            case EnumPlayerKuangType.WITHOUTCOIN:
                this.lab_coin.node.active = false;
                this.sprite_kuang.spriteFrame = this.spriteF_withoutCoin;
                break;
            default:
                break;
        }
    }

    /**
     * 设置玩家PlayerId
     * @param pid 玩家PlayerId
     */
    setPlayerPid(pid: number) {
        this._playerPid = pid;
    }

    /**
     * 获取玩家PlayerId
     * @returns 玩家PlayerId
     */
    getPlayerPid() {
        return this._playerPid;
    }

    /**
     * 设置玩家座位号
     * @param seat 座位号
     */
    setPlayerSeat(seat: number) {
        this._playerSeat = seat;
    }

    /**
     * 设置玩家昵称
     * @param name 玩家昵称
     */
    setPlayerName(name: string) {
        //@ts-ignore
        this.lab_name.string = CommonFun.getInstance().getStrByLength(name, 8);
        this._playerName = name;
    }

    /**
     * 获取玩家昵称
     * @returns 玩家昵称
     */
    getPlayerName() {
        return this._playerName;
    }

    /**
     * 设置玩家金币，会进行单位转化，除以100。
     * @param coin 玩家金币
     */
    setPlayerCoin(coin: number) {

        if (coin >= 0) {
            //@ts-ignore
            this.lab_coin.string = `${CommonFun.getInstance().numberToShow(coin / 100)}`;
        }
        else {
            this.lab_coin.string = "";
        };
        this._playerCoin = coin;
    }

    /**
     * 获取玩家金币
     * @returns 玩家金币
     */
    getPlayerCoin() {
        return this._playerCoin;
    }

    /**
     * 设置玩家头像
     * @param headUrl 玩家头像地址
     */
    setPlayerHead(headUrl: string) {
        cc.assetManager.loadRemote(headUrl, {ext: '.png'}, (err, texture: cc.Texture2D) => {
            if (!err && cc.isValid(this, true) && cc.isValid(this.sprite_head, true)) {  
                let spriteFrame = new cc.SpriteFrame(texture);
                this.sprite_head.spriteFrame = spriteFrame;
                this.sprite_head.node.setContentSize(cc.size(105, 105));
            };
        });
        this._playerHeadUrl = headUrl;
    }

    /**
     * 获取玩家头像地址
     * @returns 玩家头像地址
     */
    getPlayerHeadUrl() {
        return this._playerHeadUrl;
    }

    /**
     * 设置玩家状态的值。
     * @param state 指定的播放状态，来自EnumPlayStatus枚举。
     */
    setPlayerStateValue(state: EnumPlayStatus) {
        this._playerState = state;
    }

    /**
     * 获取玩家状态的值。
     * @returns 玩家状态的值。
     */
    getPlayerStateValue() {
        return this._playerState;
    }

    /**
     * 设置玩家状态表现
     */
    setPlayerStatePerformance() {
        let state = this.getPlayerStateValue();
        switch (state) {
            case EnumPlayStatus.NORMAL:
                this.lab_stateTip.string = "";
                this.node_state.active = false;
                break;
            case EnumPlayStatus.DROP:
                this.lab_stateTip.string = "PACKED";
                this.node_state.active = true;
                break;
            case EnumPlayStatus.LOST:
                this.lab_stateTip.string = "LOST";
                this.node_state.active = true;
                break;
            case EnumPlayStatus.WATCH:
                this.lab_stateTip.string = "WATCH";
                this.node_state.active = true;
                break;
            default:
                this.lab_stateTip.string = "";
                this.node_state.active = false;
                break;
        };

        this._playerState = state;
    }

    /**
     * 设置玩家的可操作时间。当时间减少到 0 时，玩家操作将被禁用，界面相应元素将被隐藏。单位为秒
     * @param time 玩家可操作的时间，以秒为单位。如果此值小于等于 0，则立即禁用玩家操作并隐藏相关界面元素。
     */
    setPlayerActTime(time: number) {
        if (time > 0) {
            this._clearPlayerActTimer();
            this.node_actTime.active = true;
            this.lab_time.string = `${time}`;
            this.sp_time.clearTrack(0);
            this.sp_time.setAnimation(0, 'animation', true);

            let actFun = () => {
                time -= 1;
                if ((cc.isValid(this, true) && cc.isValid(this.lab_time, true)) == false) {
                    clearInterval(loaclPlayerActTimer);
                    loaclPlayerActTimer = null;
                    return;
                }; 
                if (time <= 0) {
                    this._clearPlayerActTimer();
                    this.sp_time.clearTrack(0);
                    this.lab_time.string = "";
                    this.node_actTime.active = false;
                    return;
                };
                this.lab_time.string = `${time}`;
            };
            let loaclPlayerActTimer = setInterval(actFun, 1000);
            this._playerActTimer = loaclPlayerActTimer;
        }
        else {
            this._clearPlayerActTimer();
            this.sp_time.clearTrack(0);
            this.lab_time.string = "";
            this.node_actTime.active = false;
            this.lab_time.node.color = new cc.Color(255, 255, 255, 255);
            this.sp_time.node.color = new cc.Color(255, 255, 255, 255);
        };
    }


    private _clearPlayerActTimer() {
        if (this._playerActTimer !== null) {
            clearInterval(this._playerActTimer);
            this._playerActTimer = null;
        };
    }


    private _setPlayerWinPerformanceNodeActive(active: boolean) {
        this.sp_win.clearTracks();
        this.sp_win.node.active = active;
    };

    /**
     * 设置玩家赢牌动画表现（静态的）
     */
    setPlayerWinStaticPerformance() {
        this._setPlayerWinPerformanceNodeActive(true);
        this.sp_win.setAnimation(0, 'loop', true);
    }

    /**
     * 设置玩家赢牌动画表现（动态的）
     */
    setPlayerWinDynamicPerformance() {
        this._setPlayerWinPerformanceNodeActive(true);
        this.sp_win.setAnimation(0, 'star', false);
        this.sp_win.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation.name;
            if (name === "star") {
                this.sp_win.setAnimation(0, 'loop', true);
            };
        });
    }


    private _setPlayerLostPerformanceNodeActive(active: boolean) {
        this.sp_lost.clearTracks();
        this.sp_lost.node.active = active;
    }

    /**
     * 设置玩家输牌动画表现
     */
    setPlayerLostPerformance() {
        this._setPlayerLostPerformanceNodeActive(true);
        this.sp_lost.setAnimation(0, 'animation', false);
        this.sp_lost.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation.name;
            if (name === "animation") {
                this._setPlayerLostPerformanceNodeActive(false);
            };
        });
    }


    /**
     * 设置玩家比牌状态
     * @param battleStatus 比牌状态
     */
    setPlayerBattlePerformance(battleStatus: EnumBattleStatus) {
        this.unschedule(this._setPlayerBattleActiveFalse);
        switch (battleStatus) {
            case EnumBattleStatus.NONE:
                this.node_battleAgree.active = false;
                this.node_battleRefuse.active = false;
                break;
            case EnumBattleStatus.AGREE:
                this.node_battleAgree.active = true;
                this.node_battleRefuse.active = false;
                this.scheduleOnce(this._setPlayerBattleActiveFalse, 2);
                break;
            case EnumBattleStatus.REFUSE:
                this.node_battleAgree.active = false;
                this.node_battleRefuse.active = true;
                this.scheduleOnce(this._setPlayerBattleActiveFalse, 2);
                break;
        };
    }

    private _setPlayerBattleActiveFalse() {
        this.node_battleAgree.active = false;
        this.node_battleRefuse.active = false;
    }

    /**
     * 设置玩家是否显示离线
     * @param active 是否显示
     */
    setPlayerOffLineActive(active: boolean) {
        this.node_offLine.active = active;
    }

    /**
     * 设置玩家是否显示充值
     * @param active 是否显示
     */
    setPlayerShopActive(active: boolean) {
        this.node_shop.active = active;
    }


    setPlayerStyle(posIndex: number) {
        this.btn_gift.node.setPosition(cc.v2((posIndex == 1 || posIndex == 2) ? 54 : -54, 0));
    }
};