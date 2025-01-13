"use strict";
cc._RF.push(module, 'f86a8WABQtAs49nKAukcBxp', 'paiCtrl');
// Rummy/rummyScript/paiCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_lai: cc.Node
  },
  ctor: function ctor() {
    this.isClick = true;
    this.isSelfTurn = false;
  },
  onLoad: function onLoad() {
    this.isCanMove = false;
    this.nodePosY = this.node.y;
  },
  onEnable: function onEnable() {
    this.node.on("touchstart", this.onTouchStart, this);
    this.node.on("touchmove", this.onTouchMove, this);
    this.node.on("touchend", this.onTouchEnd, this);
    this.node.on("touchcancel", this.onTouchCancel, this);
  },
  onDisable: function onDisable() {
    this.node.off("touchstart", this.onTouchStart, this);
    this.node.off("touchmove", this.onTouchMove, this);
    this.node.off("touchend", this.onTouchEnd, this);
    this.node.off("touchcancel", this.onTouchCancel, this);
  },
  onTouchStart: function onTouchStart(event) {
    if (this.isCanMove == false) {
      LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
      return;
    }
    ;
    this.nodePosX = this.node.x;
    this.orginPos = this.node.getPosition();
    this.siblingIndex = this.node.getSiblingIndex();
    this.isClick = true;
  },
  onTouchMove: function onTouchMove(event) {
    if (this.isCanMove == false) {
      LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
      return;
    }
    ;
    this.isClick = false;
    var delta = event.getDelta();
    this.node.x += delta.x;
    this.node.y += delta.y;
    this.node.setSiblingIndex(60);
    if (this.node.y >= this.nodePosY - 5 && this.node.y <= this.nodePosY + 5 && this.node.x >= this.nodePosX - 5 && this.node.x <= this.nodePosX + 5) {
      this.isClick = true;
      this.setOrignStatus();
    }
    if (this.node.y >= this.upLimitDistance) {
      var data = {
        paiValue: this.paiValue,
        groupTag: this.groupTag,
        groupIndex: this.groupIndex
      };
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: "limitTips",
        msgData: data
      });
    }
    if (this.node.y < this.upLimitDistance) {
      var _data = {
        paiValue: this.paiValue,
        groupTag: this.groupTag,
        groupIndex: this.groupIndex
      };
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: "underLimitTips",
        msgData: _data
      });
    }
  },
  onTouchEnd: function onTouchEnd(event) {
    if (this.isCanMove == false) {
      LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
      return;
    }
    ;
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: "touchEnd",
      msgData: {}
    });
    if (this.isClick) {
      // 点击
      GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard");
      this.node.y = this.node.y == this.nodePosY ? this.upClickDistance : this.nodePosY;
      var data = {
        paiValue: this.paiValue,
        groupTag: this.groupTag,
        groupIndex: this.groupIndex,
        isCancal: this.node.y == this.nodePosY
      };
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: "clickPai",
        msgData: data
      });
    } else {
      // 移动
      GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("yipai");
      if (this.node.y <= this.nodePosY + this.upLimitDistance) {
        // 插入牌组
        if (this.node.x >= this.orginPos - this.paiDistance && this.node.x <= this.orginPos + this.paiDistance) {
          this.setOrignStatus();
          return;
        }
        var _data2 = {
          paiValue: this.paiValue,
          groupTag: this.groupTag,
          groupIndex: this.groupIndex,
          posX: this.node.x - this.node.width / 2
        };
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: "insertPai",
          msgData: _data2
        });
      } else {
        // 过了出牌线
        var _data3 = {
          paiValue: this.paiValue,
          groupTag: this.groupTag,
          groupIndex: this.groupIndex
        };
        if (this.node.x < 54 && this.node.x > -49 && this.node.y > 130 && this.node.y < 263) {
          //结算
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: "finisPai",
            msgData: _data3
          });
        } else {
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: "outPai",
            msgData: _data3
          });
        }
      }
    }
    this.isClick = true;
  },
  setOrignStatus: function setOrignStatus() {
    LoggerUtil.getInstance().log("~~~~~~~~~~~", this.node.width);
    this.node.setPosition(this.orginPos);
    this.node.setSiblingIndex(this.siblingIndex);
  },
  setIsCanMove: function setIsCanMove(bool) {
    this.isCanMove = bool;
  },
  onTouchCancel: function onTouchCancel(event) {
    if (this.isCanMove == false) {
      LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
      return;
    }
    this.isClick = true;
    LoggerUtil.getInstance().log("ZZZZZZZZaaaaaaaaaaaaaZZZZZZ", this.orginPos);
    if (!this.orginPos.x) {
      this.orginPos.x = 0;
    }
    if (!this.orginPos.y) {
      this.orginPos.y = 0;
    }
    LoggerUtil.getInstance().log("ZZZZZZZZbbbbbbbbbbbbbZZZZZZ", this.orginPos);
    this.setOrignStatus();
  },
  setUpClickDistance: function setUpClickDistance(upClickDistance) {
    this.upClickDistance = upClickDistance;
  },
  setUpLimitDistance: function setUpLimitDistance(upLimitDistance) {
    this.upLimitDistance = upLimitDistance;
  },
  setPaiDistance: function setPaiDistance(paiDistance) {
    this.paiDistance = paiDistance;
  },
  setLaiActive: function setLaiActive(status) {
    this.node_lai.active = status;
  },
  setPaiSpriteFrame: function setPaiSpriteFrame(spriteFrame) {
    var sprite = this.node.getComponent(cc.Sprite);
    sprite.spriteFrame = spriteFrame;
  },
  setPaiValue: function setPaiValue(paiValue) {
    this.paiValue = paiValue;
    if (paiValue == 52 || paiValue == 53) {
      this.node_lai.getChildByName('img').active = false;
    }
  },
  setGroupTag: function setGroupTag(groupTag, groupIndex) {
    this.groupTag = groupTag;
    this.groupIndex = groupIndex;
  },
  setTurn: function setTurn(bool) {
    this.isSelfTurn = bool;
  },
  getPaiValue: function getPaiValue() {
    return this.paiValue;
  }
});

cc._RF.pop();