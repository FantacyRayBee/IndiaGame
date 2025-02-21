cc.Class({
    extends: cc.Component,

    properties: {
        toggle_my: cc.Toggle,
        toggle_friend: cc.Toggle,

        btn_whatsapp: cc.Button,
        btn_telegram: cc.Button,
        btn_fb: cc.Button,
        btn_share: cc.Button,
        btn_last: cc.Button,
        btn_next: cc.Button,

        total_num:cc.Label,
        today_num:cc.Label,
        yeshu_num:cc.Label,

        referItem:cc.Node,
        content:cc.Node,
    },

    ctor: function () {
        this.promoterData = null;
        this.userList = [];
        this.dateIndex = 0
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
    },

    onLoad: function () {
        this.btn_whatsapp.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_telegram.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_fb.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_share.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.toggle_my.node.on('toggle', this.toggleClick, this);
        this.toggle_friend.node.on('toggle', this.toggleClick, this);
        this.insPlayerRecords()

        if (GlobalCfg.USER_DATAS.promoterReferralData == null) {
            let httpUrl2 = GlobalCfg.HTTP_SERVER + "/v1/promoter/makemoneyreferrals";
            CommonFun.getInstance().httpGet(httpUrl2, (msg) => {
                if (msg.result == 0) {
                    GlobalCfg.USER_DATAS.promoterReferralData = msg.data
                    this.promoterData = GlobalCfg.USER_DATAS.promoterReferralData.my_referrals
                    this.setData()
                    this.setPanel()
                }
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                }
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        }
    },
    
    start: function() {
        this.NowToggleName = "tog_my"
        if (GlobalCfg.USER_DATAS.promoterReferralData == null) {
            return
        }
        this.promoterData = GlobalCfg.USER_DATAS.promoterReferralData.my_referrals
        this.setData()
        this.setPanel()
    },

    setData:function(){
        if (GlobalCfg.USER_DATAS.promoterReferralData.rank) {
            let userList = GlobalCfg.USER_DATAS.promoterReferralData.rank;
            //按照7个一组分
            let tmpUser = []
            for (let index = 0; index < userList.length; index++) {
                tmpUser.push(userList[index]);
                if (index % 10 == 7) {
                    this.userList.push(tmpUser)
                    tmpUser = []
                }
            }
            this.userList.push(tmpUser)
            LoggerUtil.getInstance().log("caojun promoterreferral this.userList", this.userList);
        }
        this.setRank()
    },

    insPlayerRecords:function(){
        this.playerData = []
        for (let i = 0; i < 10; i++) {
            let pab_player = cc.instantiate(this.referItem);
            pab_player.setPosition(0, 0);
            this.content.addChild(pab_player);
            let player = this.getItem(pab_player);
            this.playerData.push(player)
        }
    },
    
    getItem:function(node){
        let gid = node.getChildByName("gid").getComponent(cc.Label);
        let refer = node.getChildByName("refer").getComponent(cc.Label);
        let total = node.getChildByName("total").getComponent(cc.Label);
        let user = {
            obj: node,
            gid: gid,
            refer: refer,
            total: total
        };
        return user
    },

    setRank:function(){
        let dataIndex = this.dateIndex
        for (let index = 0; index < this.playerData.length; index++) {
            this.playerData[index].obj.active = false
        }
        if(this.userList == null || this.userList.length == 0 || dataIndex > this.userList.length || dataIndex < 0){
            this.yeshu_num.string = `1/1`
            return
        }
        this.yeshu_num.string = `${dataIndex + 1}/${this.userList.length}`

        for (let index = 0; index < this.userList[dataIndex].length; index++) {
            this.playerData[index].obj.active = true 
            this.playerData[index].gid.string = this.userList[dataIndex][index].uid 
            this.playerData[index].refer.string = this.userList[dataIndex][index].refer_date  
            this.playerData[index].total.string = CommonFun.getInstance().numberToShow(this.userList[dataIndex][index].total_income / 100);
        }
    },


    setPanel:function(){
        this.total_num.string = this.promoterData.total_referrals
        this.today_num.string = this.promoterData.today_referrals
    },

    onDestroy: function () {
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_last") {
            this.dealChangeIndexEvent(1)
        } 
        if (btnName === "btn_next") {
            this.dealChangeIndexEvent(2)
        } 
        if (btnName == 'btn_telegram') {
            APPManager.skipToOtherApp('org.telegram.messenger', this.shareStr);
        } 
        if (btnName == 'btn_whatsapp') {
            APPManager.skipToOtherApp("com.whatsapp", this.shareStr);
        }
        if (btnName == 'btn_share') {
            APPManager.Share(this.shareStr);
        }
    },

    dealChangeIndexEvent: function (type) {
        if(type == 1){
            if (this.dateIndex == 0) 
                return
            this.dateIndex -= 1
        }else{
            if (this.dateIndex == (this.userList.length - 1)) 
                return
            this.dateIndex += 1
        }
        this.setRank()
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    setViewByToggleName(toggleName) {
        if (toggleName == "tog_my") {
            this.promoterData = GlobalCfg.USER_DATAS.promoterReferralData.my_referrals;
        }
        else{
            this.promoterData = GlobalCfg.USER_DATAS.promoterReferralData.friends_referrals;
        }
        this.setPanel()
    },
});