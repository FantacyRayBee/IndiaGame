
cc.Class({
    extends: cc.Component,

    properties: {
        labName: cc.Label,
        labCoin: cc.Label,
        tx: cc.Sprite,
        btnGift: cc.Button,
        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
        winLabel: cc.Label,
    },

    ctor() {
        this.userId = null;         // 用户id 
    },

    // onLoad () {},

    start() {
        this.winLabel.node.active = false;
        this.btnGift.node.on('click', CommonFun.getInstance().debounce(() => {
            let seatId = this.node.parent.getComponent('zooSeatCtrl').seatId;
            if (GlobalCfg.ACT_SCENE_CTRL.zooSeatManager.selfSeatId != -1) {
                CommonFun.getInstance().showGameGifInteraction(seatId);
            }
            else {
                CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
            };
        }, 1), this);
    },

    setPlayerInfo(UserInfo) {
        // LoggerUtil.getInstance().log("PlayerCtrl中设置用户信息", UserInfo);
        this.userId = UserInfo.uid;
        let userName = UserInfo.nickname;
        let diamond = UserInfo.diamond;
        let imgUrl = UserInfo.imgUrl;
        let vipLevel = UserInfo.vipLevel;
        let pos = UserInfo.pos;
        this.loadHeadSp(imgUrl, 95, this.tx);
        this.labName.string = CommonFun.getInstance().getStrByLength(userName, 8);
        this.labCoin.string = diamond / 100;

        let giftPos = this.btnGift.node.getPosition();
        let vipPos = this.sprite_vipLevelIcon.node.getPosition();
        if (pos >= 3) {
            this.sprite_vipLevelIcon.node.setPosition(giftPos.x, giftPos.y);
            this.btnGift.node.setPosition(vipPos.x, vipPos.y);
        }
        if (vipLevel >= 1 && vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(vipLevel);
        if (isCanShowVIPFont) {
            this.labName.node.color = new cc.Color(250, 225, 76); 
        }
        else {
            this.labName.node.color = new cc.Color(255, 255, 255); 
        };
    },

    loadHeadSp(headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    setUserCoinLabel(diamond) {
        this.labCoin.string = diamond / 100;
        if (this.userId == GlobalCfg.USER_DATAS.userId) {
            // 玩家自己
            GlobalCfg.USER_DATAS.userDiamond = diamond;
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: "GAME_ZOO_GIFT_SEND_COIN_UPDATE",
                msgData: {}
            });
        }
    },

    /**
     * 展示胜利的奖励
     * @param {Number} win 
     */
    showWinLabel(win) {
        if (win > 0) {
            this.winLabel.node.setPosition(cc.v2(0, 0));
            this.winLabel.string = "+" + Math.round(win / 100);
            this.winLabel.node.active = true;
            cc.tween(this.winLabel.node)
                .to(1, { position: cc.v2(0, 100) })
                .delay(0.5)
                .call(() => {
                    this.winLabel.node.active = false;
                })
                .start();
        }
    },

    // update (dt) {},
});
