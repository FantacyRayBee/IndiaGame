
cc.Class({
    extends: cc.Component,

    properties: {
        seatNodeList: {
            default: [],
            type: cc.Node,
        },
        prefabPlayer: cc.Prefab,
        selfSeatId: {
            default: -1,
            type: cc.Intger,
            tooltip: '自己的座位ID',
            visible: false
        },
    },

    ctor() {
        this.seatNodeOriginYList = [];
    },

    onLoad() {
        let frameSize = cc.view.getFrameSize();
        let w = frameSize.width;
        let h = frameSize.height;
        let bi = w / h;
        if (bi < 2.1) {
            for (let i = 0; i < 3; i++) {
                let node = this.seatNodeList[i];
                let posX = node.x;
                node.x = posX - 60;
            }
            for (let i = 3; i < this.seatNodeList.length; i++) {
                let node = this.seatNodeList[i];
                let posX = node.x;
                node.x = posX + 60;
            }
        }
        for (let i = 0; i < this.seatNodeList.length; i++) {
            let seatNode = this.seatNodeList[i];
            this.seatNodeOriginYList[i] = seatNode.y;
        }
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    },


    start() {

    },

    onEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId == "GAME_CRICKET_SEAT_Site") {
            // 入座
            let seatId = notify.seatId;
            LoggerUtil.getInstance().log(`想要入座${seatId}`);
            if (CommonFun.getInstance().isOpenVipModule()) {
                if (GlobalCfg.USER_DATAS.userVip.level == 0) {
                    CommonFun.getInstance().showFirstRecharge();
                    return;
                };
                let isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
                if (isCanSitVipSeat) {
                    if (self.selfSeatId !== -1) {
                        // 自己已入座
                        CommonFun.getInstance().showMsgBox("On other VIP seats, are you sure you want to enter this VIP seat?", "YES_NO", () => {
                            GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(seatId);
                        }, false);
                    } else {
                        GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(seatId);
                    }
                    return;
                }
                CommonFun.getInstance().showVipUpgradeToast();
                return;
            } else {
                if (self.selfSeatId !== -1) {
                    // 自己已入座
                    CommonFun.getInstance().showMsgBox("On other VIP seats, are you sure you want to enter this VIP seat?", "YES_NO", () => {
                        GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(seatId);
                    }, false);
                } else {
                    GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(seatId);
                }
            }
        }
        else if (msgId == "GAME_CRICKET_SEAT_Leave") {
            // 离座
            let seatId = notify.seatId;
            CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", () => {
                GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(-1);
            }, false);
        }
        else if (msgId == 'GAME_CRICKET_SEAT_JOINVIP_ERROR') {
            // gameservice.joinvip , 消息错误返回
            let result = notify.result;
            let message = result.message;

            // CommonFun.getInstance().showTips(msg);
            // CommonFun.getInstance().showMsgBox('You need to become a recharge player , go to recharge?', "SHOP", () => {
            //     CommonFun.getInstance().showSmallAddCash()
            // }, false);

        }
        else if (msgId == "gameservice.joinvipnotify") {
            let oldSeatId = notify.from;
            let newSeatId = notify.target;
            let UserInfo = notify.user;
            if (oldSeatId == -1) {
                // 原座位号为-1，是新入座
                self.enterSeat(newSeatId, UserInfo);
            } else {
                self.leaveSeat(oldSeatId, UserInfo);
            }
            if (newSeatId == -1) {
                // 目标座位号为-1，是离座
                self.leaveSeat(oldSeatId, UserInfo);
            } else {
                self.enterSeat(newSeatId, UserInfo);
            }
        }
    },

    initAllPlayer(vips) {
        let arr = [];
        for (let i = 0; i < vips.length; i++) {
            let playerInfo = vips[i];
            let userInfo = playerInfo.userInfo;
            let chipArr = playerInfo.chip;
            let pos = userInfo.pos;
            if (typeof pos == 'number') {
                this.enterSeat(pos, userInfo);
                arr[pos] = pos;
            }
        }
        LoggerUtil.getInstance().warn("初始化VIP", arr);
        for (let i = 0; i < this.seatNodeList.length; i++) {
            let seatNode = this.seatNodeList[i];
            if (arr[i] == undefined) {
                seatNode.removeAllChildren();
            }
        }
    },

    /**
     * 离座
     * @param {Number} id 座位ID
     * @param {*} UserInfo 玩家信息
     */
    leaveSeat(id, UserInfo) {
        if (id < 0) {
            LoggerUtil.getInstance().warn(`离开座位ID${id}错误`);
            return
        }
        let userId = UserInfo.uid;
        if (userId == GlobalCfg.USER_DATAS.userId) {
            // 玩家自己
            this.seatNodeList[id].getComponent('cricketSeatCtrl').isSelf = false;
            this.selfSeatId = -1;
        }
        this.seatNodeList[id].removeAllChildren();
    },

    /**
     * 入座
     * @param {Number} id 座位ID
     * @param {*} UserInfo 玩家信息
     */
    enterSeat(id, UserInfo) {
        if (id < 0) {
            LoggerUtil.getInstance().warn(`入座ID${id}错误`);
            return
        }
        if (this.seatNodeList[id].childrenCount > 0) {
            LoggerUtil.getInstance().log(`已有玩家在座位${id}`);
            return;
        }
        let playerNode = cc.instantiate(this.prefabPlayer);
        let playerCtrl = playerNode.getComponent("cricketPlayerCtrl");
        playerCtrl.setPlayerInfo(UserInfo);
        let userId = UserInfo.uid;
        if (userId == GlobalCfg.USER_DATAS.userId) {
            // 玩家自己
            this.seatNodeList[id].getComponent('cricketSeatCtrl').isSelf = true;
            this.selfSeatId = id;
        }
        this.seatNodeList[id].addChild(playerNode);
    },

    seatNodePlayerBet(id) {
        let seatNode = this.getSeatNodeBySeatId(id);
        if (seatNode) {
            let y = this.seatNodeOriginYList[id];
            cc.tween(seatNode)
                .to(0.1, { position: cc.v2(seatNode.x, y + 20) })
                .to(0.1, { position: cc.v2(seatNode.x, y) })
                .start();
        }
    },

    /**
     * 通过座位ID获取玩家节点
     * @param {Number} id 座位ID pos
     * @returns cc.Node
     */
    getPlayerBySeatId(id) {
        let node = this.getSeatNodeBySeatId(id);
        if (node.childrenCount == 0) {
            LoggerUtil.getInstance().warn(`座位id:${id}没有玩家`);
            return null;
        }
        return node.children[0];
    },

    /**
     * 通过座位ID获取玩家节点脚本
     * @param {*} id 
     * @returns 
     */
    getPlayerCtrlBySeatId(id) {
        let playerNode = this.getPlayerBySeatId(id);
        if (playerNode == null) {
            LoggerUtil.getInstance().warn(`座位id:${id}没有玩家`);
            return null;
        }
        return playerNode.getComponent("cricketPlayerCtrl");
    },

    /**
     * 通过座位ID获取座位节点
     * @param {Number} id 座位ID pos
     * @returns 
     */
    getSeatNodeBySeatId(id) {
        if (id < 0) {
            LoggerUtil.getInstance().warn(`座位id:${id}小于0,无法获取玩家`);
            return null;
        }
        return this.seatNodeList[id];
    },

    /**
     * 通过座位ID获取座位节点脚本
     * @param {Number} id 
     */
    getSeatNodeCtrlBySeatId(id) {
        let node = this.getSeatNodeBySeatId(id);
        if (node == null) {
            LoggerUtil.getInstance().warn(`座位id:${id}没有玩家`);
            return null;
        }
        return node.getComponent("cricketSeatCtrl");
    }

    // update (dt) {},
});
