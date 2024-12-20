"use strict";
cc._RF.push(module, '44b55RfL4RJgaJ8dfM/f8xS', 'gameServiceSendCtrl');
// baccarat3PattiGame/src/gameServiceSendCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  /**
   * 登录
   */
  LoginReq: function LoginReq() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token,
      fromid: GlobalCfg.PRODUCT_ID //平台ID
    });
  },

  QueryGameEndInfoReq: function QueryGameEndInfoReq() {
    GameServerManager.send("gameservice.querygameendinfo", "QueryGameEndInfoReq", {});
  },
  PlayerListReq: function PlayerListReq(page, size) {
    GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
      page: page,
      size: size
    });
  },
  /**
   * 拉取场景信息
   */
  GameSceneReq: function GameSceneReq() {
    GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
  },
  /**
   * 
   * @param {下注金额} amount 
   * @param {下注类型} side 
   */
  CallReq: function CallReq(amount, side) {
    var self = GlobalCfg.ACT_SCENE_CTRL;
    if (self.stopBetState) {
      LoggerUtil.getInstance().log("非下注状态");
      CommonFun.getInstance().showTips('non betting stage');
    } else {
      if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
        //未曾充值
        CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
      } else {
        if (GlobalCfg.USER_DATAS.userDiamond >= amount * 100) {
          GameServerManager.send("gameservice.call", "CallReq", {
            amount: amount * 100,
            side: side
          });
        } else {
          CommonFun.getInstance().showMsgBox(self.tipsLabel[5], "SHOP", function () {
            CommonFun.getInstance().showSmallAddCash();
          }, false);
        }
      }
    }
  },
  /**
   * 退出游戏
   */

  ExitGameReq: function ExitGameReq() {
    if (GlobalCfg.ACT_SCENE_CTRL.myBetStar > 0 && GlobalCfg.ACT_SCENE_CTRL.isGameEndStatus == false) {
      var str = '"Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?"';
      CommonFun.getInstance().showMsgBox(str, "YES_NO", function () {
        GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
      }, false);
    } else {
      GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
    }
  },
  /**
   * 获取VIP列表
   */
  VipPlayerListReq: function VipPlayerListReq() {
    GameServerManager.send("gameservice.vipplayerlist", "VipPlayerListReq", {});
  },
  /**
   * 
   * @param {vip位置} pos 
   * @param {座位状态} strat 
   */
  JoinVipPosReq: function JoinVipPosReq(pos) {
    var _this = this;
    var self = GlobalCfg.ACT_SCENE_CTRL;
    var Act = 1; // 0 离座 1 入座、坐下  2 换座
    var isVip = self.getPlayerInfoByUserId(pos);
    if (isVip && self.myPlayerId == isVip.vipPlayerId) {
      CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", function () {
        Act = 0;
        _this.JoinVipManagerSend(pos, Act);
      }, false);
      return;
    }
    ;
    if (isVip) {
      CommonFun.getInstance().showTips("This seat already has a player, Please select another empty seat!");
      return;
    }
    ;
    var myVipPos = self.getPlayerInfoByUserId(self.myVipPos);
    if (myVipPos) {
      Act = 2;
    }
    ;
    if (CommonFun.getInstance().isOpenVipModule()) {
      if (GlobalCfg.USER_DATAS.userVip.level == 0) {
        CommonFun.getInstance().showFirstRecharge();
        return;
      }
      ;
      var isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
      if (isCanSitVipSeat) {
        this.JoinVipManagerSend(pos, Act);
        return;
      }
      ;
      CommonFun.getInstance().showVipUpgradeToast();
      return;
    }
    ;
    if (GlobalCfg.USER_DATAS.userDiamond <= 10000) {
      CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", function () {
        CommonFun.getInstance().showSmallAddCash();
      }, false);
      return;
    }
    ;
    this.JoinVipManagerSend(pos, Act);
  },
  JoinVipManagerSend: function JoinVipManagerSend(pos, Act) {
    GameServerManager.send("gameservice.joinvippos", "JoinVipPosReq", {
      pos: pos,
      Act: Act
    });
  }
});

cc._RF.pop();