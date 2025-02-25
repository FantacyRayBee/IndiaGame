

cc.Class({
    extends: cc.Component,

    properties: {
        lab_name : cc.Label,
        lab_coin : cc.Label,
        lab_winCoin : cc.Label,
        btn_gift : cc.Button,
        headSp : cc.Sprite,
        bg_js : cc.Node,
        chat_bg_01 :cc.Node,
        bqAtlas : cc.SpriteAtlas,
        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
    },

    ctor: function () {
        this.Wincoin = 0;
        this.diamond = 0;
        this.userSeatSort = [cc.v2(567, -185), cc.v2(567, -5), cc.v2(567, 172), cc.v2(-568, 172),cc.v2(-568, -5),cc.v2(-568, -185)];
    },

    onDestroy: function () {
        this.node_chatArr = GlobalCfg.ACT_SCENE_CTRL.node_chat.children;
        if( this.node_chatArr && this.node_chatArr[this.pos]){
            this.node_chatArr[this.pos].active = false;
        };
    },

    // 设置玩家数据
    setUserData :function(date, pos) {
        LoggerUtil.getInstance().log("setUserData date", date);
        this.playerid = date.playerId;
        this.imgurl = date.imgUrl;
        this.nickname = date.nickname;
        this.diamond = date.diamond;
        this.displayname = date.displayName;
        this.pos = pos;
        this.seatid = pos;

        this.curSeat = pos;
        this.pos = pos;
        this.nodePos = this.userSeatSort[this.pos];

        this.setVIPSeat(this.curSeat);
        this.inItPlayerDate();
        this.setUserBgOraLab();

        if (date.vipLevel >= 1 && date.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${date.vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(date.vipLevel);
        if (isCanShowVIPFont) {
            this.lab_name.node.color = new cc.Color(250, 225, 76); 
        }
        else {
            this.lab_name.node.color = new cc.Color(255, 255, 255);
        };
    },

    // 设置玩家状态
    inItPlayerDate:function(){
        this.lab_name.string =  CommonFun.getInstance().getStrByLength(this.nickname, 8);
        this.lab_coin.string = CommonFun.getInstance().numberToShow(this.diamond/100);


        GlobalCfg.ACT_SCENE_CTRL.loadHeadSp(this.imgurl, 90, this.headSp);
        if(GlobalCfg.ACT_SCENE_CTRL.my_playerId == this.playerid) {
            GlobalCfg.USER_DATAS.userDiamond = this.diamond; 
        }
    },

    //设置VIP的位置
    setVIPSeat:function(pos){
        if(this.pos !=-1){  
            this.nodePos = this.userSeatSort[pos];
            this.node.setPosition(this.nodePos);
        }
    },

    getSeatPos:function(){
        return this.pos ? this.pos: -1
    },

    // 获取当前节点坐标
    setNodePos:function(){
        return this.userSeatSort[this.pos]
    },

    // 显示玩家赢钱的漂分
    showPlayWinCion:function(coin,score){
        if( this.lab_winCoin && score > 0 ){
            this.diamond = coin;
            this.lab_coin.string = CommonFun.getInstance().numberToShow(this.diamond/100);
            this.lab_winCoin.string = "+"+score/100;
            this.bg_js.setPosition(0,40);  
            this.bg_js.active = true;
            cc.tween(this.bg_js)
            .to(1, { position: cc.v2(0, 90)})
            .delay(1)
            .call(() => { 
                this.bg_js.active = false;
                })
            .start()
        }

        if(GlobalCfg.ACT_SCENE_CTRL.my_playerId == this.playerid) {
            GlobalCfg.USER_DATAS.userDiamond = this.diamond; 
        }
    },

    // 玩家金币显示
    showPlayCion :function (coin) {
        this.diamond = coin;
        this.lab_coin.string = CommonFun.getInstance().numberToShow(this.diamond/100);
        if(GlobalCfg.ACT_SCENE_CTRL.my_playerId == this.playerid) {
            GlobalCfg.USER_DATAS.userDiamond = this.diamond; 
        }
    },

     //设置自己金币
    shePlayCion(coin){
        if (GlobalCfg.ACT_SCENE_CTRL.my_playerId == this.playerid) {
            this.diamond = coin;
            this.lab_coin.string = CommonFun.getInstance().numberToShow(this.diamond / 100);
            GlobalCfg.USER_DATAS.userDiamond = coin;
        }
    },

    coin:function(coin,sender) {
        if(sender == this.seatid) {
            this.diamond -= coin;
            this.lab_coin.string = CommonFun.getInstance().numberToShow(this.diamond/100);
            GlobalCfg.USER_DATAS.userDiamond = this.diamond; 
        }
    },

    // 设置玩家投金币抖动   me 自己
    headAct:function(str){
        let nodePos = null;
        if(str == "me"){
            nodePos = cc.v2(-343, -304)
        } else {
            nodePos = this.nodePos;
            if(this.pos!=-1 &&  GlobalCfg.ACT_SCENE_CTRL.ruZuoBtnArr[this.pos]){
                let node = GlobalCfg.ACT_SCENE_CTRL.ruZuoBtnArr[this.pos]
                cc.tween(node)
                .to(0.1, { position: cc.v2(nodePos.x, nodePos.y+15)})
                .to(0.1, { position: cc.v2(nodePos.x, nodePos.y)})
                .start()
            }
        }
        cc.tween(this.node)
        .to(0.1, { position: cc.v2(nodePos.x, nodePos.y+15)})
        .to(0.1, { position: cc.v2(nodePos.x, nodePos.y)})
        .start()
    },

    // 设置玩家输赢金币
    setPlayerWinCion:function(coin){
        this.Wincoin = coin;
    },

    // 初始化节点
    setUserBgOraLab :function() {
        this.emotion = this.node.getChildByName("emotion");
        this.userQph =  this.node.getChildByName("chat_bg");
        this.lab_qph = this.node.getChildByName("chat_bg").getChildByName("lab_qph");
        if( this.curSeat == 0 || this.curSeat == 1 || this.curSeat == 2) {
            this.btn_gift.node.setPosition(48,0);
            this.sprite_vipLevelIcon.node.setPosition(-48, 0);
            this.chat_bg_01.scaleX = -1;
            this.userQph.setPosition(-188,100);
            this.emotion.setPosition(-100,50);
        } 
        else if ( this.curSeat == 3 || this.curSeat == 4 || this.curSeat == 5) {
            this.btn_gift.node.setPosition(-48,0);
            this.sprite_vipLevelIcon.node.setPosition(48, 0);
            this.chat_bg_01.scaleX = 1;
            this.userQph.setPosition(188,100);
            this.emotion.setPosition(100,50);
        }
    },

    onLoad () {
        this.btn_gift.node.on('click',this.btnClick,this);
    },


     // 发送表情  消息类型 0短语 1表情
     face:function(notify){
        let data = notify;
        let msgtype = notify.msgType;
        let msgid = data.name;
        this.node_chatArr = cc.find('Canvas/node_chat').children;
        let lab_qph = this.node_chatArr[this.pos].getChildByName("lab_qph")

        if ( msgtype == 0){
            this.userQph.active = true;
            this.node_chatArr[this.pos].stopAllActions()
            this.node_chatArr[this.pos].active = true;
            lab_qph.setPosition(156,6)
            lab_qph.getComponent(cc.Label).string = msgid;
          
            cc.tween(lab_qph)
            .to(3, { position: cc.v2(-105, 6) })
            .call(() => {
                this.node_chatArr[this.pos].active = false;
                this.userQph.active = false;
            })
            .start()

        }else if( msgtype == 1 ) {
            this.emotion.stopAllActions()
            this.emotion.active = true
            this.emotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);
            cc.tween(this.emotion)
            .repeat(4,cc.tween().by(0.5, { position: cc.v2(0,-5) }).by(0.5, { position: cc.v2(0,5) }))
            .call(() => {
                this.emotion.getComponent(cc.Sprite).spriteFrame = null
            })
            .start()
        }
    },


    btnClick:function(button){
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let ctrl = GlobalCfg.ACT_SCENE_CTRL.setNodeCtrl(GlobalCfg.ACT_SCENE_CTRL.my_playerId);
        let myPos = GlobalCfg.ACT_SCENE_CTRL.setMyVIPPos()
        if (ctrl && myPos !== null) {
            CommonFun.getInstance().showGameGifInteraction(this.seatid);
        } 
        else {
            CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
        };
    },

    start () {

    },

    // update (dt) {},
});
