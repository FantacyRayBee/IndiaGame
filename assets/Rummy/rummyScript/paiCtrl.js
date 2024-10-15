cc.Class({
    extends: cc.Component,

    properties: {
        node_lai: cc.Node,
    },

    ctor: function () {
        this.isClick = true;
        this.isSelfTurn = false;
    },

    onLoad: function () {
        this.isCanMove = false;
        this.nodePosY = this.node.y;
    },

    onEnable: function () {
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);
        this.node.on("touchcancel", this.onTouchCancel, this);
    },

    onDisable: function () {
        this.node.off("touchstart", this.onTouchStart, this);
        this.node.off("touchmove", this.onTouchMove, this);
        this.node.off("touchend", this.onTouchEnd, this);
        this.node.off("touchcancel", this.onTouchCancel, this);
    },

    onTouchStart: function (event) {
        if (this.isCanMove == false) {
            LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
            return
        };
        this.nodePosX = this.node.x;
        this.orginPos = this.node.getPosition();
        this.siblingIndex = this.node.getSiblingIndex();
        this.isClick = true;
    },

    onTouchMove: function (event) {
        if (this.isCanMove == false) {
            LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
            return
        };
        this.isClick = false;
        let delta = event.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        this.node.setSiblingIndex(60);
        if (this.node.y >= (this.nodePosY - 5) && this.node.y <= (this.nodePosY + 5) && this.node.x >= (this.nodePosX - 5) && this.node.x <= (this.nodePosX + 5)) {
            this.isClick = true;
            this.setOrignStatus();
        }
        if (this.node.y >= this.upLimitDistance) {
            let data = {
                paiValue: this.paiValue,
                groupTag: this.groupTag,
                groupIndex: this.groupIndex,
            }
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "limitTips", msgData: data });
        }
        if (this.node.y < this.upLimitDistance) {
            let data = {
                paiValue: this.paiValue,
                groupTag: this.groupTag,
                groupIndex: this.groupIndex,
            }
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "underLimitTips", msgData: data });
        }
    },

    onTouchEnd: function (event) {
        if (this.isCanMove == false) {
            LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
            return
        };
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "touchEnd", msgData: {} });
        if (this.isClick) {         // 点击
            GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard")
            this.node.y = this.node.y == this.nodePosY ? this.upClickDistance : this.nodePosY;
            let data = {
                paiValue: this.paiValue,
                groupTag: this.groupTag,
                groupIndex: this.groupIndex,
                isCancal: this.node.y == this.nodePosY
            }
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "clickPai", msgData: data });
        } else {                    // 移动
            GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("yipai")
            if (this.node.y <= this.nodePosY + this.upLimitDistance) {             // 插入牌组
                if (this.node.x >= this.orginPos - this.paiDistance && this.node.x <= this.orginPos + this.paiDistance) {
                    this.setOrignStatus();
                    return;
                }

                let data = {
                    paiValue: this.paiValue,
                    groupTag: this.groupTag,
                    groupIndex: this.groupIndex,
                    posX: this.node.x - this.node.width / 2
                }
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "insertPai", msgData: data });
            } else {                                                              // 过了出牌线
                let data = {
                    paiValue: this.paiValue,
                    groupTag: this.groupTag,
                    groupIndex: this.groupIndex,
                }
                if (this.node.x < 54 && this.node.x > -49 && this.node.y > 130 && this.node.y < 263) {  //结算
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "finisPai", msgData: data });
                } else {
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "outPai", msgData: data });
                }
            }
        }
        this.isClick = true;
    },

    setOrignStatus: function () {
        LoggerUtil.getInstance().log("~~~~~~~~~~~", this.node.width);
        this.node.setPosition(this.orginPos);
        this.node.setSiblingIndex(this.siblingIndex);
    },

    setIsCanMove(bool) {
        this.isCanMove = bool;
    },

    onTouchCancel: function (event) {
        if (this.isCanMove == false) {
            LoggerUtil.getInstance().log("~~~~~~~~~~~~~~~~~", false);
            return
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

    setUpClickDistance: function (upClickDistance) {
        this.upClickDistance = upClickDistance;
    },

    setUpLimitDistance: function (upLimitDistance) {
        this.upLimitDistance = upLimitDistance;
    },

    setPaiDistance: function (paiDistance) {
        this.paiDistance = paiDistance;
    },

    setLaiActive: function (status) {
        this.node_lai.active = status;
    },

    setPaiSpriteFrame: function (spriteFrame) {
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
    },

    setPaiValue: function (paiValue) {
        this.paiValue = paiValue;
        if (paiValue == 52 || paiValue == 53) {
            this.node_lai.getChildByName('img').active = false;
        }
    },

    setGroupTag: function (groupTag, groupIndex) {
        this.groupTag = groupTag;
        this.groupIndex = groupIndex;
    },

    setTurn: function (bool) {
        this.isSelfTurn = bool;
    },

    getPaiValue: function () {
        return this.paiValue;
    },
});
