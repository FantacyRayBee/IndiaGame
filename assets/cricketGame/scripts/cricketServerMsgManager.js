cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);      // 是否开启支付模块
    },

    start() {

    },

    sendLoginMsg() {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            isFree: GlobalCfg.GAME_ENTER_ISFREE,       //是否进入免费场
        });
    },

    // 刷新游戏场景
    sendFreshSceneMsg() {
        GameServerManager.send("gameservice.loadwhole", "LoadWholeReq", {});
    },

    sendExitMsg() {
        if (GlobalCfg.ACT_SCENE_CTRL.curRoundBetData.length > 0) {
            let str = '"Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?"'
            CommonFun.getInstance().showMsgBox(str, "YES_NO", () => {
                GameServerManager.send("gameservice.exit", "ExitReq", {});
            }, false);
        } else {
            GameServerManager.send("gameservice.exit", "ExitReq", {});
        }
    },

    /**
     * 获取玩家列表
     * @param {Number} page 页数，0 开始
     * @param {Number} rows 
     */
    sendGetPlayerListMsg(_page, _rows) {
        GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
            page: _page,
            rows: _rows
        });
    },

    /**
     * 下注
     * @param {Array<{ani,amount}>} chips 
     */
    sendBetMsg(chips) {
        if(GlobalCfg.ACT_SCENE_CTRL.gameState == 0){
            //playnow模式下 首充玩家 弹VIP弹框
            if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.GAME_ENTER_ISFREE == false) {
                CommonFun.getInstance().showVipRechargeToast();
                return;
            }
            // 0 下注中
            let allBet = 0;
            for (let i = 0; i < chips.length; i++) {
                let chip = chips[i];
                let amount = chip.amount;
                allBet += amount;
            }
            if (allBet > GlobalCfg.USER_DATAS.userDiamond) {
                CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash();
                    }
                }, false);
                return;
            }else{
                GameServerManager.send("gameservice.bet", "BetReq", {
                    chip: chips
                }); 
            }
        }else{
            // 1 转动、结算
            CommonFun.getInstance().showTips('non betting stage');
        }
        
    },

    // vip入座
    sendJoinVip(seatId) {
        GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
            pos: seatId
        });
    },


});
