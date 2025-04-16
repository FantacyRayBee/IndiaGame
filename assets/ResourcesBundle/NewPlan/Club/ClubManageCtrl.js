cc.Class({
    extends: cc.Component,

    properties: {
        //root_manage
        btn_manageClose: cc.Button,
        btn_search_manage: cc.Button,
        btn_last_manage: cc.Button,
        btn_next_manage: cc.Button,
        node_manage_content: cc.Node,
        node_manage_item: cc.Node,
        editBox_manage:cc.EditBox,
        lb_yeshu_manage: cc.Label,
    },

    ctor: function () {
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
        this.prefabMaxNum = 10; //预制体最大数量
        this.members = {};
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        //root_manage
        this.btn_manageClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_search_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },
    
    start: function() {
        
    },

    initData: function () {
        this.userList = []; //用户列表
        this.node_manage_content.removeAllChildren();
        this.members = GlobalCfg.USER_DATAS.clubMembers;
        this.node_manage_item.active = false;
        this.editBox_manage.string = "";
        this.pageIndex = 0; //当前页码
        this.insPlayerRecords();
        this.setData();
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERMAIN);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_manageClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnCloseEvent();
            return;
        } 
        if (btnName === "btn_search_manage") {
        } 
        if (btnName === "btn_last_manage") {
            this.dealChangeIndexEvent(1)
        } 
        if (btnName === "btn_next_manage") {
            this.dealChangeIndexEvent(2)
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnCloseEvent: function () {
        this.node.active = false;
    },

    setData:function(){
        if (this.members) {
            let userList = this.members;
            //按照10个一组分
            let tmpUser = []
            for (let index = 0; index < userList.length; index++) {
                tmpUser.push(userList[index]);
                if (index % this.prefabMaxNum == (this.prefabMaxNum - 1)) //每10个一组
                {
                    this.userList.push(tmpUser)
                    tmpUser = []
                }
            }
            this.userList.push(tmpUser)
            LoggerUtil.getInstance().log("caojun promoterreward this.userList", this.userList);
        }
        this.lb_yeshu_manage.string = `${this.pageIndex + 1}/${this.userList.length}`
        this.setItem()
    },


    //实例化玩家预制
    insPlayerRecords:function(){
        this.playerData = []
        for (let i = 0; i < this.prefabMaxNum; i++) {
            let pab_player = cc.instantiate(this.node_manage_item);
            pab_player.setPosition(0, 0);
            this.node_manage_content.addChild(pab_player);
            let player = this.getItem(pab_player);
            this.playerData.push(player)
        }
    },

    getItem:function(node){
        let obj = {}
        obj.obj = node;
        obj.imgHead = node.getChildByName("tx").getChildByName("img_head").getComponent(cc.Sprite);
        obj.nick = node.getChildByName("nick").getComponent(cc.Label);
        obj.id = node.getChildByName("id").getComponent(cc.Label);
        obj.coin = node.getChildByName("coin").getComponent(cc.Label);
        obj.wallet = node.getChildByName("wallet").getComponent(cc.Label);
        obj.record = node.getChildByName("record").getComponent(cc.Label);
        obj.jointime = node.getChildByName("jointime").getComponent(cc.Label);
        obj.state1 = node.getChildByName("state1"); //online
        obj.state2 = node.getChildByName("state2"); //offline
        obj.btn_operate = node.getChildByName("btn_operate").getComponent(cc.Button);

        obj.data = {}
        
        obj.setData = function(data){
            obj.data = data;
            obj.obj.active = true;
            // this.loadHeadSp(data.player_head, 120, imgHead);
            obj.id.string = CommonFun.getInstance().getStrByLength("ID:" + data.userId, 12);
            obj.jointime.string = data.creationTime
            obj.wallet.string = CommonFun.getInstance().numberToShow(data.safe / 100);
        }

        obj.btnClick = function () {
            //打开成员操作界面
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "OPEN_CLUB_MEMBER_OPERATE", msgData: { userData: obj.data} });   
        }
        obj.btn_operate.node.on('click', CommonFun.getInstance().debounce(obj.btnClick, 1), this);
        return obj;
    },

    setItem:function(){
        for (let index = 0; index < this.playerData.length; index++) {
            this.playerData[index].obj.active = false
        }
        if(this.userList == null || this.userList.length == 0 || this.pageIndex > this.userList.length || this.pageIndex < 0){
            this.lb_yeshu_manage.string = `1/1`
            return
        }
        this.lb_yeshu_manage.string = `${this.pageIndex + 1}/${this.userList.length}`
        for (let index = 0; index < this.userList[this.pageIndex].length; index++) {
            this.playerData[index].setData(this.userList[this.pageIndex][index])
        }
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

    dealChangeIndexEvent: function (type) {
        if(type == 1){
            if (this.pageIndex == 0) 
                return
            this.pageIndex -= 1
        }else{
            if (this.pageIndex == (this.userList.length - 1)) 
                return
            this.pageIndex += 1
        }
        this.setData()
    },
});