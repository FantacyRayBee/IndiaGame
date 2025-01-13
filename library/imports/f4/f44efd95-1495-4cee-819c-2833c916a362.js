"use strict";
cc._RF.push(module, 'f44ef2VFJVM7oGcKDPJFqNi', 'zooSeatManager');
// zooGame/Scripts/zooSeatManager.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    seatNodeList: {
      "default": [],
      type: cc.Node
    },
    prefabPlayer: cc.Prefab,
    selfSeatId: {
      "default": -1,
      type: cc.Intger,
      tooltip: '自己的座位ID',
      visible: false
    }
  },
  ctor: function ctor() {
    // this.sitePlayerId = [];     // 已上座玩家ID，数组下标对应 seatNodeList 数组下标
  },
  onLoad: function onLoad() {
    var frameSize = cc.view.getFrameSize();
    var w = frameSize.width;
    var h = frameSize.height;
    var bi = w / h;
    if (bi < 2.1) {
      for (var i = 0; i < 3; i++) {
        var node = this.seatNodeList[i];
        var posX = node.x;
        node.x = posX - 50;
      }
      for (var _i = 3; _i < this.seatNodeList.length; _i++) {
        var _node = this.seatNodeList[_i];
        var _posX = _node.x;
        _node.x = _posX + 50;
      }
    }
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
  },
  start: function start() {},
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == "GAME_ZOO_SEAT_Site") {
      // 入座
      var seatId = notify.seatId;
      LoggerUtil.getInstance().log("\u60F3\u8981\u5165\u5EA7" + seatId);
      if (CommonFun.getInstance().isOpenVipModule()) {
        if (GlobalCfg.USER_DATAS.userVip.level == 0) {
          CommonFun.getInstance().showFirstRecharge();
          return;
        }
        ;
        var isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
        if (isCanSitVipSeat) {
          if (self.selfSeatId !== -1) {
            // 自己已入座
            CommonFun.getInstance().showMsgBox("On other VIP seats, are you sure you want to enter this VIP seat?", "YES_NO", function () {
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
          CommonFun.getInstance().showMsgBox("On other VIP seats, are you sure you want to enter this VIP seat?", "YES_NO", function () {
            GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(seatId);
          }, false);
        } else {
          GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(seatId);
        }
      }
    } else if (msgId == "GAME_ZOO_SEAT_Leave") {
      // 离座
      var _seatId = notify.seatId;
      CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", function () {
        GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendJoinVip(-1);
      }, false);
    } else if (msgId == 'GAME_ZOO_SEAT_JOINVIP_ERROR') {
      // gameservice.joinvip , 消息错误返回
      var result = notify.result;
      var message = result.message;

      // CommonFun.getInstance().showTips(msg);
      // CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
      //     CommonFun.getInstance().showSmallAddCash()
      // }, false);
    } else if (msgId == "gameservice.joinvipnotify") {
      var oldSeatId = notify.from;
      var newSeatId = notify.target;
      var UserInfo = notify.user;
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
  initAllPlayer: function initAllPlayer(vips) {
    var arr = [];
    for (var i = 0; i < vips.length; i++) {
      var playerInfo = vips[i];
      var userInfo = playerInfo.userInfo;
      var chipArr = playerInfo.chip;
      var pos = userInfo.pos;
      if (typeof pos == 'number') {
        this.enterSeat(pos, userInfo);
        arr[pos] = pos;
      }
    }
    LoggerUtil.getInstance().warn("初始化VIP", arr);
    for (var _i2 = 0; _i2 < this.seatNodeList.length; _i2++) {
      var seatNode = this.seatNodeList[_i2];
      if (arr[_i2] == undefined) {
        seatNode.removeAllChildren();
      }
    }
  },
  /**
   * 离座
   * @param {Number} id 座位ID
   * @param {*} UserInfo 玩家信息
   */
  leaveSeat: function leaveSeat(id, UserInfo) {
    if (id < 0) {
      LoggerUtil.getInstance().warn("\u79BB\u5F00\u5EA7\u4F4DID" + id + "\u9519\u8BEF");
      return;
    }
    var userId = UserInfo.uid;
    if (userId == GlobalCfg.USER_DATAS.userId) {
      // 玩家自己
      this.seatNodeList[id].getComponent('zooSeatCtrl').isSelf = false;
      this.selfSeatId = -1;
    }
    this.seatNodeList[id].removeAllChildren();
  },
  /**
   * 入座
   * @param {Number} id 座位ID
   * @param {*} UserInfo 玩家信息
   */
  enterSeat: function enterSeat(id, UserInfo) {
    if (id < 0) {
      LoggerUtil.getInstance().warn("\u5165\u5EA7ID" + id + "\u9519\u8BEF");
      return;
    }
    if (this.seatNodeList[id].childrenCount > 0) {
      LoggerUtil.getInstance().log("\u5DF2\u6709\u73A9\u5BB6\u5728\u5EA7\u4F4D" + id);
      return;
    }
    var playerNode = cc.instantiate(this.prefabPlayer);
    var playerCtrl = playerNode.getComponent("zooPlayerCtrl");
    playerCtrl.setPlayerInfo(UserInfo);
    var userId = UserInfo.uid;
    if (userId == GlobalCfg.USER_DATAS.userId) {
      // 玩家自己
      this.seatNodeList[id].getComponent('zooSeatCtrl').isSelf = true;
      this.selfSeatId = id;
    }
    this.seatNodeList[id].addChild(playerNode);
  },
  /**
   * 通过座位ID获取玩家节点
   * @param {Number} id 座位ID pos
   * @returns cc.Node
   */
  getPlayerBySeatId: function getPlayerBySeatId(id) {
    var node = this.getSeatNodeBySeatId(id);
    if (node.childrenCount == 0) {
      LoggerUtil.getInstance().warn("\u5EA7\u4F4Did:" + id + "\u6CA1\u6709\u73A9\u5BB6");
      return null;
    }
    return node.children[0];
  },
  /**
   * 通过座位ID获取玩家节点脚本
   * @param {*} id 
   * @returns 
   */
  getPlayerCtrlBySeatId: function getPlayerCtrlBySeatId(id) {
    var playerNode = this.getPlayerBySeatId(id);
    if (playerNode == null) {
      LoggerUtil.getInstance().warn("\u5EA7\u4F4Did:" + id + "\u6CA1\u6709\u73A9\u5BB6");
      return null;
    }
    return playerNode.getComponent("zooPlayerCtrl");
  },
  /**
   * 通过座位ID获取座位节点
   * @param {Number} id 座位ID pos
   * @returns 
   */
  getSeatNodeBySeatId: function getSeatNodeBySeatId(id) {
    if (id < 0) {
      LoggerUtil.getInstance().warn("\u5EA7\u4F4Did:" + id + "\u5C0F\u4E8E0,\u65E0\u6CD5\u83B7\u53D6\u73A9\u5BB6");
      return null;
    }
    return this.seatNodeList[id];
  },
  /**
   * 通过座位ID获取座位节点脚本
   * @param {Number} id 
   */
  getSeatNodeCtrlBySeatId: function getSeatNodeCtrlBySeatId(id) {
    var node = this.getSeatNodeBySeatId(id);
    if (node == null) {
      LoggerUtil.getInstance().warn("\u5EA7\u4F4Did:" + id + "\u6CA1\u6709\u73A9\u5BB6");
      return null;
    }
    return node.getComponent("zooSeatCtrl");
  } // update (dt) {},
});

cc._RF.pop();