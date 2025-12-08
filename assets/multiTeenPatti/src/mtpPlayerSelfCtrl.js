cc.Class({
    extends: require('UINode'),

    properties: {
        lab_coin: cc.Label,
        lab_id: cc.Label,
        sprite_tx: cc.Sprite,
        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
        btn_add: cc.Button,
        lab_win: cc.Label,
        textBg: cc.Node,
    },
    ctor() {
        this.diamond = 0;
    },

    onLoad() {
        this.posX = this.node.x;
        this.posY = this.node.y;
        let btnArr = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].node.on("click", this.btnClick, this)
        }
    },

    onDestroy: function () {
    },

    start() {

    },

    btnClick: function (button) {
        let btnName = button.node.name;
        if (btnName == "btn_add") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showSmallAddCash()
        }
    },

    setPlayerInfo: function (data, isLogin = false, mainCtrl = null) {
        LoggerUtil.getInstance().log("caojun 收到玩家信息：", data);
        if (isLogin == true) {
            if (GlobalCfg.USER_DATAS.userHeadimgurl !== null) {
                this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 106, this.sprite_tx);
            } else {
                LoggerUtil.getInstance().log("收到的头像URL为空！")
            }
            this.setCoin(data.diamond, true);
            this.setPlayerid(data.playerId);
        } else {
            this.displayName = data.displayName;
            this.setPlayerid(data.playerId);
            if (data.imgUrl) {
                this.loadHeadSp(data.imgUrl, 106, this.sprite_tx);
            }
            this.setCoin(data.diamond, true);
        }
        this.lab_id.string = data.nickname;

        if (data.vipLevel >= 1 && data.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${data.vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };
    },
    setCoin: function (coin, isSelf = false) {
        this.coin = coin / 100;
        if (this.lab_coin && coin != null) {
            if (isSelf == true) {
                GlobalCfg.USER_DATAS.userDiamond = coin;
                if (GlobalCfg.USER_DATAS.isNotCharge){
                    CommonFun.getInstance().refreshWalletData(this.lab_coin);
                    return
                }
            }
            this.lab_coin.string = CommonFun.getInstance().numberToShow(this.coin);
        }
    },
    setWinNum: function (num) {
        if (num <= 0) { return };
        let number = parseFloat((num / 100).toFixed(2));
        this.lab_win.string = "+" + number;
        this.textBg.active = true;
        cc.tween(this.textBg)
            .to(1, { position: cc.v2(-60, 90) })
            .delay(0.5)
            .call(() => {
                this.textBg.position = cc.v2(-60, 30);
                this.textBg.active = false;
            })
            .start();
    },

    setPlayerid: function (playerid) {
        if (!playerid) {
            LoggerUtil.getInstance().error("playerID为空");
            return;
        }
        this.playerid = playerid;
    },

    getPlayerid: function () {
        return this.playerid;
    },

    //下注动作
    betAction: function () {
        let posY = this.posY;
        let posX = this.posX;
        cc.tween(this.node)
            .to(0.1, { position: cc.v2(posX, posY + 15) })
            .to(0.1, { position: cc.v2(posX, posY) })
            .start();
    },
});
