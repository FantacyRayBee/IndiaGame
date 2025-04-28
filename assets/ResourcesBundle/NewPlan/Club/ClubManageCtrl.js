cc.Class({
    extends: cc.Component,

    properties: {
        //root_manage
        btn_close: cc.Button,
        btn_search_manage: cc.Button,
        btn_last_manage: cc.Button,
        btn_next_manage: cc.Button,
        node_manage_content: cc.Node,
        node_manage_item: cc.Node,
        editBox_manage:cc.EditBox,
        lb_yeshu_manage: cc.Label,
    },

    ctor: function () {
        this.prefabMaxNum = 10; //预制体最大数量
        this.members = {};
        this.isAllData = true; //是否展示所有数据
        this.allMemberCount = 0;
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        //root_manage
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_search_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },
    
    start: function() {
        CommonFun.getInstance().setEditBoxEvent(this.editBox_manage, this.node);
    },

    initData: function () {
        this.userList = []; //用户列表
        this.node_manage_content.removeAllChildren();
        this.node_manage_item.active = false;
        this.editBox_manage.string = "";
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
        if (btnName === "btn_search_manage") {
            this.dealSearchEvent();
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
        this.userList = GlobalCfg.USER_DATAS.clubMembers;
        this.allMemberCount = GlobalCfg.USER_DATAS.clubMemberCount;
        let allCount = Math.ceil(this.allMemberCount / this.prefabMaxNum); //总页数
        this.lb_yeshu_manage.string = `${this.pageIndex + 1}/${allCount = allCount > 0 ? allCount : 1}`
        this.setItem()
    },

    searchData:function(userId){
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            this.setItem();
            return;
        }
        this.userList = [];
        for (let i = 0; i < GlobalCfg.USER_DATAS.clubMembers.length; i++) {
            if (GlobalCfg.USER_DATAS.clubMembers[i].userId === userId) {
                this.userList.push(GlobalCfg.USER_DATAS.clubMembers[i]);
            }
        }
        if (this.userList.length === 0) {
            CommonFun.getInstance().showTips("Invalid Game ID");
        }
        else {
            CommonFun.getInstance().showTips("Search Success");
        }
        this.allMemberCount = 1;
        this.pageIndex = 0; // 重置页码
        this.isAllData = false;
        this.lb_yeshu_manage.string = `${this.pageIndex + 1}/1`;
        this.setItem();
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
        obj.self = this;
        obj.data = {}
        
        obj.setData = function(data){
            obj.data = data;
            obj.obj.active = true;
            obj.self.loadHeadSp(data.head, 200, obj.imgHead);
            obj.id.string = CommonFun.getInstance().getStrByLength("ID:" + data.userId, 12);
            obj.jointime.string = data.creationTime.split('T')[0];
            obj.wallet.string = CommonFun.getInstance().numberToShow(data.safe / 100);
            obj.coin.string = CommonFun.getInstance().numberToShow(data.amount / 100);
            obj.nick.string = data.nickname;
            obj.record.string = data.notes;
        }

        obj.btnClick = function () {
            // CommonFun.getInstance().showProgress();
            // this.getMemberInfo(()=>{ //操作成员之前需要拉取最新的数据
            //     if (this.getDataByUserId(obj.data.userId) != null) {
            //         obj.data = this.getDataByUserId(obj.data.userId);
            //     }
            // });
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
        let allCount = Math.ceil(this.allMemberCount / this.prefabMaxNum); //总页数
        this.lb_yeshu_manage.string = `${this.pageIndex + 1}/${allCount = allCount > 0 ? allCount : 1}`
        for (let index = 0; index < this.userList.length; index++) {
            this.playerData[index].setData(this.userList[index])
        }
    },

    getDataByUserId:function(userId){
        for (let i = 0; i < GlobalCfg.USER_DATAS.clubMembers.length; i++) {
            if (GlobalCfg.USER_DATAS.clubMembers[i].userId === userId) {
                return GlobalCfg.USER_DATAS.clubMembers[i]
            }
        }
        return null;
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

    //搜索用户
    dealSearchEvent: function () {
        let userID = this.editBox_manage.string;
        if (this.isAllData){
            if (userID == "") return;
            this.searchData(userID);
        }
        else{
            if (userID == ""){ //如果输入框为空，则重新加载全部数据
                this.pageIndex = 0;
                this.isAllData = true;
                this.setData();
            }
            else{
                this.searchData(userID);
            }
        }
    },

    //切页获取数据
    getMemberInfo: function (callback) {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/get_down`;
        CommonFun.getInstance().httpPost(httpUrl, {page:this.pageIndex}, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                GlobalCfg.USER_DATAS.clubMembers = msg.data.infos;
                GlobalCfg.USER_DATAS.clubMemberCount = msg.data.count;
                this.allMemberCount = msg.data.count;
                callback && callback();
            } else {
                CommonFun.getInstance().showTips(msg.msg);
                this.node.active = false;
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    dealChangeIndexEvent: function (type) {
        if(type == 1){
            if (this.pageIndex == 0) 
                return
            this.pageIndex -= 1
        }else{
            let allCount = Math.ceil(this.allMemberCount / this.prefabMaxNum); //总页数
            allCount = allCount > 0 ? allCount : 1
            if (this.pageIndex == (allCount - 1)) 
                return
            this.pageIndex += 1
        }
        this.getMemberInfo(()=>{
            this.setData();
        });
    },
});