cc.Class({
    extends: cc.Component,

    properties: {
        txt_num: cc.Label,
        txt_date: cc.Label,
        txt_yourRank: cc.Label,
        txt_yourCom: cc.Label,
        toggle_thisweek: cc.Toggle,
        toggle_nextweek: cc.Toggle,

        btn_whatsapp: cc.Button,
        btn_telegram: cc.Button,
        btn_help: cc.Button,

        item: cc.Node,
        content: cc.Node,

        normal_head: cc.SpriteFrame,
        top_head: [cc.Sprite],
        top_id: [cc.Label],
        top_prize: [cc.Label],
        top_commission: [cc.Label],
    },

    ctor: function () {
        this.promoterMainData = null;
        this.userList = null;
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
    },

    onLoad: function () {
        this.setRandomData()
        this.btn_whatsapp.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_telegram.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_help.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.toggle_thisweek.node.on('toggle', this.toggleClick, this);
        this.toggle_nextweek.node.on('toggle', this.toggleClick, this);
    },
    
    start: function() {
        this.NowToggleName = "tog_this"
        this.userList = GlobalCfg.USER_DATAS.promoterMainData.rank
        this.promoterMainData = GlobalCfg.USER_DATAS.promoterMainData.this_week_player
        this.setPanel()
        const mondayDate = this.getMondayOfCurrentWeek();
        const sundayDate = this.getSundayOfCurrentWeek();
        this.txt_date.string = "Time Per: " + mondayDate.toLocaleDateString() + " ~ " + sundayDate.toLocaleDateString()
        this.insPlayerRecords()
    },

    onDestroy: function () {
    },

    setPanel:function(){
        this.insPlayerRecords()
        let yourRank = (this.promoterMainData.rank == 0 || this.promoterMainData.rank > 20) ? "-" :this.promoterMainData.rank; //没排名或者超过20名都显示-
        this.txt_yourRank.string = `Your Rank: ${yourRank}`
        this.txt_yourCom.string = `Commission: ${CommonFun.getInstance().numberToShow(this.promoterMainData.commission / 100)}`
        let prize = 0
        if (this.userList != null) {
            for (let index = 0; index < this.userList.length; index++) {
                prize = prize + this.userList[index].prize
            }
        }
        CommonFun.getInstance().numberToShow_byColor(this.txt_num, prize)
        

        this.setTopRank()
    },

    // 获取当前周的周一 周日 日期
    getMondayOfCurrentWeek:function() {
        const today = new Date(); // 获取当前日期
        const dayOfWeek = today.getDay(); // 获取当前是星期几（0 是周日，1 是周一，...，6 是周六）
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // 计算周一的日期差值

        const monday = new Date(today.setDate(diff)); // 设置日期为周一
        return monday;
    },

    getSundayOfCurrentWeek:function() {
        const today = new Date(); // 获取当前日期
        const dayOfWeek = today.getDay(); // 获取当前是星期几（0 是周日，1 是周一，...，6 是周六）
        const diff = today.getDate() + (6 - dayOfWeek); // 计算周日的日期差值
    
        const sunday = new Date(today.setDate(diff)); // 设置日期为周日
        return sunday;
    },

    //设置前三名
    setTopRank:function(){
        this.InitTopRank()
        if (this.userList == null) return;

        for (let index = 0; index < this.userList.length; index++) {
            this.loadHeadSp(this.userList[index].player_head, 120, this.top_head[index]);
            this.top_id[index].string = CommonFun.getInstance().getStrByLength(this.userList[index].player_name, 11);
            CommonFun.getInstance().numberToShow_byColor(this.top_prize[index], this.userList[index].prize)
            this.top_commission[index].string = CommonFun.getInstance().numberToShow(this.userList[index].commission / 100)
        }
    },

    //初始化前三名数据
    InitTopRank:function(){
        for (let index = 0; index < 3; index++) {
            this.top_head[index].spriteFrame = this.normal_head
            this.top_id[index].string = "--"
            this.top_prize[index].string = ""
            this.top_commission[index].string = "--"
        }
    },

    //生成随机数据 测试用
    setRandomData:function(){
        let num = 20
        let userList = [];
        for (let index = 0; index < num; index++) {
            let imgIndex = Math.floor(Math.random() * 13) + 1; // 1 到 13
            let imgUrl = `https://aug6.s3.ap-south-1.amazonaws.com/avatar/${imgIndex}.png`;
            let infoNum = Math.floor(Math.random() * 900000) + 100000; // 1 到 300
            let randomMsgIndex = Math.floor(Math.random() * 5000) + 1; // 0 到 2
            let prize = Math.random() * (5000.5) + 100.5;
            let user = {
                imgUrl: imgUrl,
                id: "1" + infoNum,
                com: randomMsgIndex,
                rank: index,
                prize:prize.toFixed(1)
            };
            userList.push(user);
        }
        this.userList = userList
    },

    //实例化玩家领奖情况的预制
    insPlayerRecords:function(){
        this.content.removeAllChildren();
        if (this.userList == null) {
            return;
        }
        for (let i = 0; i < this.userList.length; i++) {
            let pab_player = cc.instantiate(this.item);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            this.setItem(pab_player, this.userList[i]);
            this.content.addChild(pab_player);
        }
    },

    setItem:function(node, data){
        let imgHead = node.getChildByName("tx").getChildByName("img_head").getComponent(cc.Sprite);
        let rank = node.getChildByName("rank").getComponent(cc.Label);
        let id = node.getChildByName("id").getComponent(cc.Label);
        let com = node.getChildByName("com").getComponent(cc.Label);
        let prize = node.getChildByName("prize").getComponent(cc.Label);

        this.loadHeadSp(data.player_head, 120, imgHead);
        id.string = CommonFun.getInstance().getStrByLength(data.player_name, 12);
        com.string = CommonFun.getInstance().numberToShow(data.commission / 100);
        rank.string = data.rank
        prize.string = CommonFun.getInstance().numberToShow(data.prize / 100);
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
        if (btnName === "btn_help") {
            let prefabs = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROMOTERRULE);
            prefabs.then((prefab) => {
                let promoterNode = cc.instantiate(prefab);
                CommonFun.getInstance().addToPointParent(promoterNode, GlobalCfg.PREFAB_PARENT.PROMOTERRULE);  
            });
        } 
        if (btnName == 'btn_telegram') {
            // Skip TO Telegram
            APPManager.skipToOtherApp('org.telegram.messenger', this.shareStr);
        } 
        if (btnName == 'btn_whatsapp') {
            APPManager.skipToOtherApp("com.whatsapp", this.shareStr);
        }
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    setViewByToggleName(toggleName) {
        if(toggleName == this.NowToggleName)
            return
        this.NowToggleName = toggleName
        if (toggleName == "tog_this") {
            this.userList = GlobalCfg.USER_DATAS.promoterMainData.rank
            this.promoterMainData = GlobalCfg.USER_DATAS.promoterMainData.this_week_player
        }
        if (toggleName == "tog_last") {
            this.userList = GlobalCfg.USER_DATAS.promoterMainData.last_week
            this.promoterMainData = GlobalCfg.USER_DATAS.promoterMainData.last_week_player
        }
        this.setPanel()
    },

});