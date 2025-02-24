cc.Class({
    extends: cc.Component,

    properties: {
        btn_fb: cc.Button,
        btn_whatsapp: cc.Button,
        btn_telegram: cc.Button,
        btn_share: cc.Button,
        label_arr1: [cc.RichText],
        label_arr2: [cc.RichText],
        label_arr3: [cc.RichText],
        item: cc.Node,
        content: cc.Node,
    },

    ctor: function () {
        this.promoterData = null;
        this.speed = 1;
        this.randomAllNum = 30;
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        this.btn_fb.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_whatsapp.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_telegram.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_share.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.setRandomData()
        this.insPlayerRecords()
    },
    
    start: function() {
        this.NowToggleName = "toggle_rank"
        this.setViewByToggleName(this.NowToggleName)
    },


    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERMAIN);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "ConcactsArrStr") {
            
        }
    },

    //生成当天的随机数据
    setRandomData:function(){
        // let nowTime = Math.floor(new Date().getTime()/1000/3600/24) //以天为单位每天自动生成全新的假数据
        // let PromoterRuleUserList = cc.sys.localStorage.getItem(`PromoterRuleUserList_${nowTime}`);
        // if(PromoterRuleUserList){ //如果缓存有 则不生成
        //     this.userList = JSON.parse(PromoterRuleUserList);
        //     return
        // }
        let miaosData =
        {
            [0]:"Received the recharge reward ",
            [1]:"Received the bet reward ",
            [2]:"Received the tax reward ",
        }
        let userList = [];
        this.userList =[];
        for (let index = 0; index < this.randomAllNum; index++) {
            let imgIndex = Math.floor(Math.random() * 13) + 1; // 1 到 13
            let imgUrl = `https://aug6.s3.ap-south-1.amazonaws.com/avatar/${imgIndex}.png`;
            let randomMsgIndex = Math.floor(Math.random() * 3); // 0 到 2
            let infoNum = this.RandomReferNum(randomMsgIndex);
            let user = {
                imgUrl: imgUrl,
                infoNum: infoNum,
                ms: miaosData[randomMsgIndex]
            };
            userList.push(user);
        }
        this.userList = userList
        // cc.sys.localStorage.setItem(`PromoterRuleUserList_${nowTime}`, JSON.stringify(userList));
    },

    RandomReferNum:function(index){
        let infoNum = 0;
        if(index == 0){ //recharge
            let input = Math.floor(Math.random() * 100) + 1; // 1 到 100
            if(input <= 70){
                infoNum = 10
            }
            else if(input > 70 && input <= 80){
                infoNum = 15
            }
            else if(input > 80 && input <= 90){
                infoNum = 25
            }
            else if(input > 90 && input <= 95){
                infoNum = 50
            }
            else if(input > 95 && input <= 100){
                infoNum = 100
            }
        } else if(index == 1){//bet
            let input = Math.floor(Math.random() * 90) + 1; // 1 到 90
            if(input <= 70){
                infoNum = 5
            }
            else if(input > 70 && input <= 80){
                infoNum = 10
            }
            else if(input > 80 && input <= 90){
                infoNum = 20
            }
        } else if(index == 2){//reward
            let input = Math.floor(Math.random() * 70) + 1; // 1 到 70
            if(input <= 50){
                infoNum = 10
            }
            else if(input > 50 && input <= 60){
                infoNum = 10
            }
            else if(input > 60 && input <= 70){
                infoNum = 20
            }
        }
        return infoNum
    },


    //实例化玩家领奖情况的预制
    insPlayerRecords:function(){
        this.content.removeAllChildren();
        for (let i = 0; i < 30; i++) {
            let pab_player = cc.instantiate(this.item);
            pab_player.setPosition(0, 0);
            this.setItem(pab_player, this.userList[i]);
            this.content.addChild(pab_player);
        }
    },

    setItem:function(node, data){
        let imgHead = node.getChildByName("tx").getChildByName("img_head").getComponent(cc.Sprite);
        let id = node.getChildByName("id").getComponent(cc.Label);
        let info = node.getChildByName("info").getComponent(cc.RichText);
        this.loadHeadSp(data.imgUrl, 120, imgHead);
        info.string = data.ms + "<color=#EFCB29>" + data.infoNum + "</color>"
    },

    //添加加载头像
    loadHeadSp: function (headUrl,realWidth,heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl,{ext: '.png'}, (err, texture) => {
                if(!err && cc.isValid(this) && cc.isValid(heaSprite)){
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth/heaSprite.node.width);
                }
            });
        }
    },


    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == 'btn_fb') {
            CommonFun.getInstance().promoterSkipToOtherApp(btnName);
        } 
        if (btnName == 'btn_telegram') {
            CommonFun.getInstance().promoterSkipToOtherApp(btnName);
        } 
        if (btnName == 'btn_whatsapp') {
            CommonFun.getInstance().promoterSkipToOtherApp(btnName);
        }
        if (btnName == 'btn_share') {
            CommonFun.getInstance().promoterSkipToOtherApp(btnName);
        }
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    setViewByToggleName(toggleName) {
    },

    update() {
        // // 每帧更新位置
        let pos = this.content.position;
        let y = pos.y + this.speed
        this.content.setPosition(cc.v2(0, y));
        if(pos.y > ((this.randomAllNum - 4) * 60)){
            this.content.setPosition(0,0);
        }
    }
});