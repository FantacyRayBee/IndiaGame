cc.Class({
    extends: cc.Component,

    properties: {
        //root_record
        btn_close: cc.Button,
        btn_search_record: cc.Button,
        btn_last_record: cc.Button,
        btn_next_record: cc.Button,
        node_record_content: cc.Node,
        node_record_item: cc.Node,
        editBox_record:cc.EditBox,
        lb_yeshu_record: cc.Label,
    },

    ctor: function () {
        this.prefabMaxNum = 10; //预制体最大数量
        this.isAllData = true;
        this.records = {};
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_search_record.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last_record.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next_record.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },
    
    initData: function () {
        this.userList = []; //用户列表
        this.node_record_content.removeAllChildren();
        this.node_record_item.active = false;
        this.editBox_record.string = "";
        this.pageIndex = 0; //当前页码
        this.insPlayerRecords();
        this.setData();
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnCloseEvent();
            return;
        } 
        if (btnName === "btn_search_record") {
            this.dealSearchEvent();
        } 
        if (btnName === "btn_last_record") {
            this.dealChangeIndexEvent(1)
        } 
        if (btnName === "btn_next_record") {
            this.dealChangeIndexEvent(2)
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnCloseEvent: function () {
        this.node.active = false
    },

    //搜索用户
    dealSearchEvent: function () {
        let userID = this.editBox_record.string;
        if (this.isAllData){
            if (userID == "") return;
            this.searchData(userID, 0);
        }
        else{
            if (userID == "") {//如果输入框为空，则重新加载全部数据
                this.pageIndex = 0;
                this.isAllData = true;
                this.setData();
            }else{
                this.searchData(userID, 0);  
            }
        }
    },
    
    searchData: function(userId, pageIndex) {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/get_transfer_record`;
        let httpData = {
            page: pageIndex,
            find_uid: userId,
        }
        CommonFun.getInstance().httpPost(httpUrl, httpData, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                if (msg.data.infos.length > 0) 
                    this.pageIndex = pageIndex;
                else
                    this.pageIndex = 0;
                
                GlobalCfg.USER_DATAS.clubRecords = msg.data.infos;
                GlobalCfg.USER_DATAS.clubRecordCount = msg.data.count;
                this.isAllData = false;
                this.setData()
            } else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    setData:function(){
        this.userList = GlobalCfg.USER_DATAS.clubRecords;
        let allCount = Math.ceil(GlobalCfg.USER_DATAS.clubRecordCount / this.prefabMaxNum); //总页数
        this.lb_yeshu_record.string = `${this.pageIndex + 1}/${allCount>0 ? allCount : 1}`
        this.setItem()
    },

    //实例化玩家预制
    insPlayerRecords:function(){
        this.playerData = []
        for (let i = 0; i < this.prefabMaxNum; i++) {
            let pab_player = cc.instantiate(this.node_record_item);
            pab_player.setPosition(0, 0);
            this.node_record_content.addChild(pab_player);
            let player = this.getItem(pab_player);
            this.playerData.push(player)
        }
    },

    getItem:function(node){
        let obj = {}
        obj.obj = node;
        obj.imgHead = node.getChildByName("tx").getChildByName("img_head").getComponent(cc.Sprite);
        obj.opor = node.getChildByName("opor").getComponent(cc.Label);
        obj.oped = node.getChildByName("oped").getComponent(cc.Label);
        obj.bf_coin = node.getChildByName("bf_coin").getComponent(cc.Label);
        obj.cg_coin = node.getChildByName("cg_coin").getComponent(cc.Label);
        obj.af_coin = node.getChildByName("af_coin").getComponent(cc.Label);
        obj.jointime = node.getChildByName("jointime").getComponent(cc.Label);
        obj.self = this;
        obj.data = {}
        
        obj.setData = function(data){
            obj.data = data;
            obj.obj.active = true;
            obj.self.loadHeadSp(data.to_head, 200, obj.imgHead);
            obj.jointime.string = data.creationTime.split('T')[0];
            obj.bf_coin.string = CommonFun.getInstance().numberToShow(data.beforeCoins / 100);
            obj.cg_coin.string = CommonFun.getInstance().numberToShow(data.amount / 100);
            obj.af_coin.string = CommonFun.getInstance().numberToShow(data.afterCoins / 100);
            obj.opor.string = CommonFun.getInstance().getStrByLength("Operator:" + data.from_nickname, 24);
            obj.oped.string = CommonFun.getInstance().getStrByLength("Operated:" + data.to_nickname, 24);
        }
        return obj;
    },

    setItem:function(){
        for (let index = 0; index < this.playerData.length; index++) {
            this.playerData[index].obj.active = false
        }
        if(this.userList == null || this.userList.length == 0 || this.pageIndex > this.userList.length || this.pageIndex < 0){
            this.lb_yeshu_record.string = `1/1`
            return
        }
        let allCount = Math.ceil(GlobalCfg.USER_DATAS.clubRecordCount / this.prefabMaxNum); //总页数
        this.lb_yeshu_record.string = `${this.pageIndex + 1}/${allCount>0 ? allCount : 1}`
        for (let index = 0; index < this.userList.length; index++) {
            this.playerData[index].setData(this.userList[index])
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

    //切页获取数据
    getRecordInfo: function () {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/get_transfer_record`;
        let httpData = {
            page: this.pageIndex,
            find_uid: "0",
        }
        CommonFun.getInstance().httpPost(httpUrl, httpData, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                GlobalCfg.USER_DATAS.clubRecords = msg.data.infos;
                GlobalCfg.USER_DATAS.clubRecordCount = msg.data.count;
                this.setData()
            } else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    dealChangeIndexEvent: function (type) {
        if(type == 1){
            if (this.pageIndex == 0) 
                return
            this.pageIndex -= 1
        }else{
            let allCount = Math.ceil(GlobalCfg.USER_DATAS.clubRecordCount / this.prefabMaxNum); //总页数
            allCount = allCount > 0 ? allCount : 1
            if (this.pageIndex == (allCount - 1)) 
                return
            this.pageIndex += 1
        }
        if (this.isAllData) {
            this.getRecordInfo();
        }
        else{
            let userID = this.editBox_record.string;
            this.searchData(userID, this.pageIndex);
        }
    },
});