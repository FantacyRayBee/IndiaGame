cc.Class({
    extends: cc.Component,

    properties: {
        tog_total: cc.Toggle,
        tog_yesterday: cc.Toggle,

        btn_whatsapp: cc.Button,
        btn_telegram: cc.Button,
        btn_fb: cc.Button,
        btn_share: cc.Button,
        btn_claim: cc.Button,
        btn_last: cc.Button,
        btn_next: cc.Button,

        total_num:cc.Label,
        tax_num:cc.Label,
        bet_num:cc.Label,
        invited_num:cc.Label,
        welcome_num:cc.Label,
        claim_num:cc.Label,
        yeshu_num:cc.Label,

        item:cc.Node,
        content:cc.Node
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
        this.btn_claim.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.tog_total.node.on('toggle', this.toggleClick, this);
        this.tog_yesterday.node.on('toggle', this.toggleClick, this);
        this.insPlayerRecords()

        if (GlobalCfg.USER_DATAS.promoterRewardsData == null) {
            let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/income/recordV1";
            CommonFun.getInstance().httpGet(httpUrl, (msg) => {
                if (msg.result == 0) {
                    GlobalCfg.USER_DATAS.promoterRewardsData = msg.data
                    this.setViewByToggleName(this.NowToggleName)
                    this.setData()
                }
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                }
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        }
    },
    start: function() {
        this.NowToggleName = "tog_yesterday"
        this.tog_yesterday.isChecked = true;
        if (GlobalCfg.USER_DATAS.promoterRewardsData == null) {
            return;
        }
        this.setViewByToggleName(this.NowToggleName)
        this.setData()
    },

    setPanel:function(){
        CommonFun.getInstance().numberToShow_byColor(this.total_num, this.promoterData.total_income)
        CommonFun.getInstance().numberToShow_byColor(this.tax_num, this.promoterData.tax_income)
        this.bet_num.string =  CommonFun.getInstance().numberToShow(this.promoterData.betting_income / 100);
        this.invited_num.string =  CommonFun.getInstance().numberToShow(this.promoterData.invite_income / 100);
        this.welcome_num.string =  CommonFun.getInstance().numberToShow(this.promoterData.welcome_income / 100);
    },

    //生成当天的随机测试数据
    setData:function(){
        if (GlobalCfg.USER_DATAS.promoterRewardsData.daily_income_details) {
            let userList = GlobalCfg.USER_DATAS.promoterRewardsData.daily_income_details;
            //按照10个一组分
            let tmpUser = []
            for (let index = 0; index < userList.length; index++) {
                tmpUser.push(userList[index]);
                if (index % 10 == 9) {
                    this.userList.push(tmpUser)
                    tmpUser = []
                }
            }
            this.userList.push(tmpUser)
            LoggerUtil.getInstance().log("caojun promoterreward this.userList", this.userList);
        }
        this.setRank()
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
            this.playerData[index].date.string = this.userList[dataIndex][index].date
            this.playerData[index].total.string = CommonFun.getInstance().numberToShow(this.userList[dataIndex][index].total_income / 100); 
            this.playerData[index].invited.string = this.userList[dataIndex][index].invited
        }
    },

    insPlayerRecords:function(){
        this.playerData = []
        for (let i = 0; i < 10; i++) {
            let pab_player = cc.instantiate(this.item);
            pab_player.setPosition(0, 0);
            this.content.addChild(pab_player);
            let player = this.getItem(pab_player);
            this.playerData.push(player)
        }
    },
    
    getItem:function(node){
        let date = node.getChildByName("date").getComponent(cc.Label);
        let total = node.getChildByName("total").getComponent(cc.Label);
        let invited = node.getChildByName("invited").getComponent(cc.Label);
        let user = {
            obj: node,
            date: date,
            total: total,
            invited: invited
        };
        return user
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
        if (btnName === "btn_claim") {
            this.dealBtnGetEvent();
        } 
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
    },

    dealBtnGetEvent: function () {
        let self = this;
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/income/receiveV1";
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            if (msg.result == 0) {
                if (msg.data && CommonFun.getInstance().isValidForScr(self)) {
                    self.setGetBonusResult(msg.data);
                };
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    setGetBonusResult: function (data) {
        if (!data) {
            return;
        };

        let income = data.income;
        let diamond = data.diamond;
        GlobalCfg.USER_DATAS.promoterRewardsData.current_cash = 0;
        this.claim_num.string = 0;
        this.btn_claim.interactable = false;
        if (income > 0) {
            GlobalCfg.USER_DATAS.userDiamond = diamond;
            CommonFun.getInstance().showRewardsTips([{ id: 10, amount: income / 100 }]);
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.GET_TGY_REWARD,
                msgData: {price: 0}
            });
        } 
        else {
            CommonFun.getInstance().showTips("No rewards currently, Pick it up tomorrow");
        }

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.HIDE_TGY_REDPOINT, msgData: {}});
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
        this.setData()
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    setViewByToggleName(toggleName) {
        if (toggleName == "tog_today") {
            this.promoterData = GlobalCfg.USER_DATAS.promoterRewardsData.total
            CommonFun.getInstance().numberToShow_byColor(this.claim_num, GlobalCfg.USER_DATAS.promoterRewardsData.total.total_income)
            this.btn_claim.node.active = false;
        }
        else{
            this.promoterData = GlobalCfg.USER_DATAS.promoterRewardsData.yesterday
            CommonFun.getInstance().numberToShow_byColor(this.claim_num, GlobalCfg.USER_DATAS.promoterRewardsData.current_cash)
            this.btn_claim.node.active = true;
            this.btn_claim.interactable = GlobalCfg.USER_DATAS.promoterRewardsData.current_cash > 0;
        }
        this.setPanel()
    },

});