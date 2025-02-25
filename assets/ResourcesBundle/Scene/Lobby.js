let GameDownloader = require("GameDownloader");
cc.Class({
    extends: cc.Component,
    properties: {
        /**
         * 用户名字
         */    
        lab_userName: cc.Label,
        /**
         * 用户Id
         */
        lab_userId: cc.Label,
        /**
         * 用户金币
         */
        lab_userDiamond: cc.Label,
        /**
         * 用户Bonus
         */
        lab_userBonus: cc.Label,
        /**
         * 用户头像精灵
         */
        sprite_tx: cc.Sprite,
        /**
         * 头像按钮
         */
        btn_tx: cc.Button,
        /**
         * 安达尔
         */
        btn_miniandar: cc.Button,
        /**
         * 奔驰宝马
         */
        btn_minibenzbmw: cc.Button,
        /**
         * 6个骰子
         */
        btn_minijhandimunda: cc.Button,
        /**
         * 龙虎斗
         */
        btn_minilonghu: cc.Button,
        /**
         * 时时猜
         */
        btn_miniluckyloto: cc.Button,
        /**
         * 拉米
         */
        btn_minirummy: cc.Button,
        /**
         * 赛马
         */
        btn_minisaima: cc.Button,
        /**
         * 七上七下
         */
        btn_miniseven: cc.Button,
        /**
         * 水果机
         */
        btn_minishuiguo: cc.Button,
        /**
         * 玛雅机台
         */
        btn_minimaya: cc.Button,
        /**
         * 印度舞娘机台
         */
        btn_miniindia: cc.Button,
        /**
         * 吸血鬼机台
         */
        btn_minivampire: cc.Button,
        /**
         * TP
         */
        btn_miniteenpatti: cc.Button,
        /**
         * TP2
         */
        btn_miniteenpatti2: cc.Button,
        /**
         * 百人TP
         */
        btn_miniteenpattibaccarat: cc.Button,
        /**
         * 火箭
         */
        btn_minirocket: cc.Button,
        /**
         * 动物园
         */
        btn_minizoo:cc.Button,
        /**
         * 板球
         */
        btn_minicricket: cc.Button,
        /**
         * 宙斯
         */
        btn_minizeus: cc.Button,
        /**
         * 轮播
         */
        node_banner: cc.Node,
        /**
         * 轮播-->推广员
         */
        btn_referEarn: cc.Button,
        /**
         * 轮播-->充值
         */
        btn_quickRecharge: cc.Button,
        /**
         * 轮播-->活动挑战
         */
        btn_getNow: cc.Button,
        /**
         * 充值
         */
        btn_add: cc.Button,
        btn_addCash: cc.Button,
        /**
         * 提现
         */
        btn_withDarw: cc.Button,
        /**
         * 将券兑换活动
         */
        btn_bonusTransfer: cc.Button,
        node_bonusTransferBg: cc.Node,
        /**
         * 客服
         */
        btn_service: cc.Button,
        /**
         * 设置
         */
        btn_setting: cc.Button,
        /**
         * 邮箱
         */
        btn_mail: cc.Button,
        /**
         * VIP
         */
        btn_vip: cc.Button,

        node_gameScollview: cc.Node,
        /**
         * 中间部分父节点
         */
        node_middles: cc.Node,
        /**
         * VIP等级图标
         */
        sprite_vipLevel: cc.Sprite,
        /**
         * VIP等级图标图集
         */
        atlas_levelIcon: cc.SpriteAtlas,
        /**
         * 活动 Go Betting
         */
        btn_goBetiing: cc.Button,
        /**
         * 拼多多
         */
        btn_pdd: cc.Button,
        /**
         * tp引导手指
         */
        node_tpFinger: cc.Node,
    },

    ctor: function() {
        this.isShowGameBtn = false;
        this.is_can_click = true;
        this.is_can_click1 = true;
        this.isLoadHead = false;
        this.updateInval = 0;

        this.teenPatti2Endpoint = "";
    },

    checkShiPei: function() {
        cc.game.setFrameRate(60);

        let w = cc.view.getVisibleSize().width;
        this.node_middles.setContentSize(w, 480);
        this.node_middles.setPosition(0, -20);
        this.node_banner.setPosition(-(w / 2) + 337.83, 0);
        this.node_gameScollview.setPosition(-(w / 2) + 510, 20);
        this.node_gameScollview.setContentSize(w - 510 - 30, 480);
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_LOBBY);
        if (CommonFun.getInstance().isNeewShowSignToast() && GlobalCfg.USER_DATAS.signInfo && GlobalCfg.USER_DATAS.signInfo.done == false && GlobalCfg.USER_DATAS.signInfo.gifts && GlobalCfg.USER_DATAS.signInfo.gifts.length > 0) {
            CommonFun.getInstance().showSignToast();
        };
        /**
         * 配合服务器处理
         */
        if (GlobalCfg.USER_DATAS.reliefGiftDiamond > 0) {
            GlobalCfg.USER_DATAS.userDiamond -= GlobalCfg.USER_DATAS.reliefGiftDiamond; 
        };
        if (GlobalCfg.USER_DATAS.firstGiftDiamond > 0) {
            GlobalCfg.USER_DATAS.userDiamond -= GlobalCfg.USER_DATAS.firstGiftDiamond; 
        };
    
        this.checkShiPei();
        this.setBtnsClick();
        this.setGameOrder();
        this.showUserInfo();
        this.showBanner();
        this.showOtherModules(); 
        this.showVipLevelIcon();
        this.showSmallGameBtns();
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        GlobalCfg.G_COMPONENTS.Audio && GlobalCfg.G_COMPONENTS.Audio.playLobby();
    },


    start: function () {
        CommonFun.getInstance().addCarouselStrip();
        CommonFun.getInstance().addSidebar();
        CommonFun.getInstance().updateSidebarData(true);
        CommonFun.getInstance().showHallTip();
        
        if (window.isNeedShowRoomList) {
            this.showGameRoomList();
        };
        if (GlobalCfg.USER_DATAS.inGame.length > 0) {
            LoggerUtil.getInstance().log("当前处于其他游戏中：",JSON.stringify(GlobalCfg.USER_DATAS.inGame));
            let gameMap = {
                "minirummy": SceneManager.getInstance().sceneType.RUMMY,
                "miniteenpatti": SceneManager.getInstance().sceneType.TEENPATTI
            };
            let gameTypeMap = {
                "minirummy": GlobalCfg.SMALL_GAME_DATAS.rummyData.product,
                "miniteenpatti": GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product,
            };
            let curInGame = String(GlobalCfg.USER_DATAS.inGame[0]);
            if(Reflect.has(gameMap, curInGame) == true){
                let toGame = gameMap[curInGame];
                GlobalCfg.CUR_GAME_TYPE = gameTypeMap[curInGame];
                LoggerUtil.getInstance().warn("Reconnect:", toGame);
                CommonFun.getInstance().showProgress();
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, toGame);
            }
        }
        else {
            this.showTransBounsRedPoint();
            if (GlobalCfg.FIRST_RECHARGE_TIPS_SHOW == true) {
                let shopParentNode = CommonFun.getInstance().getLayerNode(GlobalCfg.PREFAB_PARENT.SHOP);
                if(cc.isValid(shopParentNode.getChildByName("newshop"))){
                    shopParentNode.getChildByName("newshop").destroy(); 
                };
                if(cc.isValid(shopParentNode.getChildByName("newWithdrawal"))){
                    shopParentNode.getChildByName("newWithdrawal").destroy(); 
                };
                this.showFirstRechargeTipPopup();
            };
                  
            if (window["isNeedShowWithDrawPreData"]) {
                window["isNeedShowWithDrawPreData"] = false;
                CommonFun.getInstance().showWithDrawPreData();
            }
            else {
                this.showToastViews();
                this.showActivityGoBetting();
            };
        }
    },

    setGameOrder: function() {
        // 默认游戏按钮顺序
        let defaultGameSiblingIndexObj = {
            "minirocket": 1,
            "minijhandimunda": 2,
            "miniteenpatti": 3,
            "miniteenpattibaccarat": 4,
            "miniandar": 5,
            "minilonghu": 6,
            "minishuiguo": 7,
            "minimaya": 8,
            "miniindia": 9,
            "minisaima": 10,
            "minibenzbmw": 11,
            "minirummy": 12,
            "miniseven": 13,
            "minizoo": 14,
            "minicricket": 15,
            "miniluckyloto": 16,
            "minizeus": 17,
        };
        let getAppConfigValue = CommonFun.getInstance().getAppConfigValueByKey("GAME_LOBBY_BTN_SIBLING_INDEX_DATA", defaultGameSiblingIndexObj);
        if (getAppConfigValue != defaultGameSiblingIndexObj) {
            defaultGameSiblingIndexObj = { ...getAppConfigValue };
        }
        let arr = Object.entries(defaultGameSiblingIndexObj);
        arr.sort((a, b) => a[1] - b[1]);
        this.gameUpdateDownloadOrder = [...arr.map(item => item[0])];     // 小游戏下载更新顺序 
        let btnsMap = {
            "minirocket": this.btn_minirocket,
            "minijhandimunda": this.btn_minijhandimunda,
            "miniteenpatti": this.btn_miniteenpatti,
            "miniteenpattibaccarat": this.btn_miniteenpattibaccarat,
            "miniandar": this.btn_miniandar,
            "minilonghu": this.btn_minilonghu,
            "minishuiguo": this.btn_minishuiguo,
            "minimaya": this.btn_minimaya,
            "miniindia": this.btn_miniindia,
            "minivampire": this.btn_minivampire,
            "minisaima": this.btn_minisaima,
            "minibenzbmw": this.btn_minibenzbmw,
            "minirummy": this.btn_minirummy,
            "miniseven": this.btn_miniseven,
            "minizoo": this.btn_minizoo,
            "minicricket": this.btn_minicricket,
            "minizeus": this.btn_minizeus,
        };
        let func = (indexArr, object) => {
            for (let i = 0; i < indexArr.length; i++) {
                const key = indexArr[i][0];
                const index = indexArr[i][1];
                object[key] && object[key].node.setSiblingIndex(index);
            };
        };
        func(arr, btnsMap);
    },


    /**
     * 设置按钮点击事件监听
     */
    setBtnsClick: function() {
        this.btn_tx.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_add.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_withDarw.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_bonusTransfer.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_service.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_setting.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_mail.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_vip.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_goBetiing.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this)
        this.btn_pdd.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this)

        this.btn_getNow.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_referEarn.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_quickRecharge.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);


        this.btn_miniandar.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minibenzbmw.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minijhandimunda.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minilonghu.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_miniluckyloto.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minirummy.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minisaima.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_miniseven.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minishuiguo.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minimaya.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_miniindia.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minivampire.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_miniteenpatti.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_miniteenpatti2.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_miniteenpattibaccarat.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minirocket.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minizoo.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minicricket.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
        this.btn_minizeus.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    },

    /**
     * 显示玩家信息内容
     */
    showUserInfo: function() {
        this.loadHeadSp();
        this.lab_userId.string = `ID: ${GlobalCfg.USER_DATAS.userId}`;
        this.lab_userName.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 10);
        this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
        this.lab_userBonus.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.bonus / 100);

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(GlobalCfg.USER_DATAS.userVip.level);
        if (isCanShowVIPFont) {
            this.lab_userName.node.color = new cc.Color(250, 225, 76); 
        }
        else {
            this.lab_userName.node.color = new cc.Color(255, 255, 255);
        };
    },

    /**
     * 显示轮播图内容
     */
    showBanner: function() {
        if (GlobalCfg.USER_DATAS.openModules.includes(18)) {
            this.node_banner.active = true;
            let pageView_ads = this.node_banner.getComponent(cc.PageView);
            this.schedule(() => {
                let pageIndex = pageView_ads.getCurrentPageIndex();
                pageIndex += 1;
                if (pageIndex > 2) {
                    pageIndex = 0;
                };
                pageView_ads.scrollToPage(pageIndex);
            }, 3);
        }
        else {
            this.node_banner.active = false; 
        };
    },  

    /**
     * 显示其他模块内容
     */
    showOtherModules: function() {
        /**
         * 充值系统
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(4)) {
            this.btn_add.node.active = true;
            this.btn_addCash.node.active = true;
            this.btn_quickRecharge.node.active = true;

            let languagesType = I18NUtil.getInstance().getLanguageType();
            this.setAddCashBtnByLanguageType(languagesType);
        }
        else {
            this.btn_add.node.active = false;
            this.btn_addCash.node.active = false;
            this.btn_quickRecharge.node.active = false;
        };

        /**
         * 提现
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(5)) {
            this.btn_withDarw.node.active = true;
        }
        else {
            this.btn_withDarw.node.active = false;
        };

        /**
         * 奖券兑换活动
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(12) ) {
            this.btn_bonusTransfer.node.active = true;
            this.node_bonusTransferBg.active = true;
        }
        else {
            this.btn_bonusTransfer.node.active = false;
            this.node_bonusTransferBg.active = false;
        };

        /**
         * 客服
         */
        if (Object.values(GlobalCfg.USER_DATAS.customerService).length > 0 && Object.values(GlobalCfg.USER_DATAS.customerService).join("").length > 0){
            this.btn_service.node.active = true;
        }
        else {
            this.btn_service.node.active = false;
        };

        /**
         * 拼多多
         */
        if (GlobalCfg.USER_DATAS.pddRemainCount != -1 && GlobalCfg.USER_DATAS.openModules.includes(14)) {
            // this.btn_pdd.node.active = true;
        }
        else {
            this.btn_pdd.node.active = false;
        };

        /**
         * 邮箱
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(13)) {
            this.btn_mail.node.active = true;
            this.showNewEmailRedDot(GlobalCfg.USER_DATAS.new_email);
        }
        else {
            this.btn_mail.node.active = false;
        };

        /**
         * VIP系统按钮
         */
        if (GlobalCfg.USER_DATAS.recharged > 0 
            && GlobalCfg.USER_DATAS.userVip.level > 0 
            && CommonFun.getInstance().isOpenVipModule()) { 
            this.btn_vip.node.active = true;
        }
        else {
            this.btn_vip.node.active = false;
        };

        let w = cc.view.getVisibleSize().width;
        this.node_middles.setPosition(cc.v2(-132, -20));
        this.node_gameScollview.setContentSize(w - 510 - 30 + 132, 480);
        this.node_gameScollview.getChildByName("view").setContentSize(w - 510 - 30 + 132, 480);
    },

    /**
     * 处理小游戏按钮逻辑
     */
    showSmallGameBtns: function() {
        this.btn_miniandar.node.active = false;
        this.btn_minibenzbmw.node.active = false;
        this.btn_minijhandimunda.node.active = false;
        this.btn_minilonghu.node.active = false;
        this.btn_miniluckyloto.node.active = false;
        this.btn_minirummy.node.active = false;
        this.btn_minisaima.node.active = false;
        this.btn_miniseven.node.active = false;
        this.btn_minishuiguo.node.active = false;
        this.btn_minimaya.node.active = false;
        this.btn_miniindia.node.active = false;
        this.btn_minivampire.node.active = false;
        this.btn_miniteenpatti.node.active = false;
        this.btn_miniteenpatti2.node.active = false;
        this.btn_miniteenpattibaccarat.node.active = false;
        this.btn_minirocket.node.active = false;
        this.btn_minizoo.node.active = false;
        this.btn_minicricket.node.active = false;
        this.btn_minizeus.node.active = false;

        if (!Array.isArray(GlobalCfg.USER_DATAS.games) || GlobalCfg.USER_DATAS.games.length == 0) {
            return;
        };

        /**
         * 既要判断对应的小游戏模块是否开启，还要判断对应的小游戏参数是否存在
         */
        let needUpdataArr = [];
        LoggerUtil.getInstance().log("22222 GlobalCfg.USER_DATAS.openModules == ", GlobalCfg.USER_DATAS.openModules);
        for (let i = 0, len = GlobalCfg.USER_DATAS.games.length; i < len; i++) {
            let gameData = GlobalCfg.USER_DATAS.games[i];
            let gameProduct = gameData.product;
            let gameHost = gameData.host;
            LoggerUtil.getInstance().log("22222 GlobalCfg.USER_DATAS.gameProduct == ", gameProduct);
            switch (gameProduct) {
                case "miniandar":
                    if (GlobalCfg.USER_DATAS.openModules.includes(104) || GlobalCfg.USER_DATAS.openModules.includes(105)) {
                        this.btn_miniandar.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.andeerData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.andeerData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("andaerGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("andaerGame");
                        }
                    };
                    break;
                case "minibenzbmw":
                    if (GlobalCfg.USER_DATAS.openModules.includes(110)) {
                        this.btn_minibenzbmw.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.benZData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.benZData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("Benz");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("Benz");
                        }
                    };
                    break;
                case "minijhandimunda":
                    if (GlobalCfg.USER_DATAS.openModules.includes(111)) {
                        this.btn_minijhandimunda.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.mundaData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.mundaData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("munda");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("munda");
                        }
                    };
                    break;
                case "minilonghu":
                    if (GlobalCfg.USER_DATAS.openModules.includes(109)) {
                        this.btn_minilonghu.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.lhdData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.lhdData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("lhdGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("lhdGame");
                        }
                    };
                    break;
                case "miniluckyloto":
                    if (GlobalCfg.USER_DATAS.openModules.includes(107)) {
                        this.btn_miniluckyloto.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.sscData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.sscData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("sscGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("sscGame");
                        }
                    };
                    break;
                case "minirummy":
                    if (GlobalCfg.USER_DATAS.openModules.includes(102) || GlobalCfg.USER_DATAS.openModules.includes(103)) {
                        this.btn_minirummy.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.rummyData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.rummyData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("Rummy");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("Rummy");
                        }
                    };
                    break;
                case "minisaima":
                    if (GlobalCfg.USER_DATAS.openModules.includes(112)) {
                        this.btn_minisaima.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.horseRaceData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.horseRaceData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("horseRaceGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("horseRaceGame");
                        }
                    };
                    break;
                case "miniseven":
                    if (GlobalCfg.USER_DATAS.openModules.includes(106)) {
                        this.btn_miniseven.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.upDownData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.upDownData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("7up7downGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("7up7downGame");
                        };
                    };
                    break;
                case "minishuiguo":
                    if (GlobalCfg.USER_DATAS.openModules.includes(113)) {
                        this.btn_minishuiguo.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.fruitMachineData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.fruitMachineData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("fruitMachine");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("fruitMachine");
                        };
                    };
                    break;
                case "minimaya":
                    if (GlobalCfg.USER_DATAS.openModules.includes(119)) {
                        this.btn_minimaya.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.mayaMachineData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.mayaMachineData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("mayaMachine");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("mayaMachine");
                        };
                    };
                    break;
                case "miniindia":
                    if (GlobalCfg.USER_DATAS.openModules.includes(120)) {
                        this.btn_miniindia.node.active = true;
                        GlobalCfg.SMALL_GAME_DATAS.indiaMachineData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.indiaMachineData.product = gameProduct;
                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("indiaMachine");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("indiaMachine");
                        };
                    };
                    break;
                case "minivampire":
                    if (GlobalCfg.USER_DATAS.openModules.includes(121)) {
                        this.btn_minivampire.node.active = true;
                        GlobalCfg.SMALL_GAME_DATAS.vampireMachineData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.vampireMachineData.product = gameProduct;
                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("vampireMachine");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("vampireMachine");
                        };
                    };
                    break;
                case "miniteenpatti":
                    if (GlobalCfg.USER_DATAS.openModules.includes(100) || GlobalCfg.USER_DATAS.openModules.includes(101)) {
                        this.btn_miniteenpatti.node.active = true;
                        if (CommonFun.getInstance().isNeedShowTPFingerTip() && CommonFun.getInstance().isEnteredTPGame() == false && GlobalCfg.USER_DATAS.recharged == 0) {
                            this.node_tpFinger.active = true;
                        }
                        else {
                            this.node_tpFinger.active = false;
                        };
                        this.btn_miniteenpatti2.node.active = false;
                        // if (GlobalCfg.server_id == "0" || GlobalCfg.server_id == "21") {
                        //     this.btn_miniteenpatti2.node.active = true;
                        //     this.teenPatti2Endpoint = GlobalCfg.WEB_SOCKET_GAME + "teenpattip2" + "/echo";
                        // };
                        GlobalCfg.SMALL_GAME_DATAS.teenPattiData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product = gameProduct;
                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("tpGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("tpGame");
                        };
                    };
                    break;
                case "miniteenpattibaccarat":
                    if (GlobalCfg.USER_DATAS.openModules.includes(108)) {
                        this.btn_miniteenpattibaccarat.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.baccaratData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.baccaratData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("baccarat3PattiGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("baccarat3PattiGame");
                        }
                    };
                    break;
                case "minirocket":
                    if (GlobalCfg.USER_DATAS.openModules.includes(115)) {
                        this.btn_minirocket.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.rocketData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.rocketData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("rocket");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("rocket");
                        }
                    }
                    break;
                case "minizoo":
                    if (GlobalCfg.USER_DATAS.openModules.includes(116)) {
                        this.btn_minizoo.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.zooData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.zooData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("zooGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("zooGame");
                        }
                    }
                    break;
                case "minicricket":
                    if (GlobalCfg.USER_DATAS.openModules.includes(117)) {
                        this.btn_minicricket.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.cricketData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.cricketData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("cricketGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("cricketGame");
                        }
                    }
                    break;
                case "minizeus":
                    if (GlobalCfg.USER_DATAS.openModules.includes(118)) {
                        this.btn_minizeus.node.active = true;

                        GlobalCfg.SMALL_GAME_DATAS.zeusData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
                        GlobalCfg.SMALL_GAME_DATAS.zeusData.product = gameProduct;

                        let isNeedUpdata = CommonFun.getInstance().isNeedUpdata("zeusGame");
                        if (isNeedUpdata && cc.sys.isNative) {
                            needUpdataArr.push("zeusGame");
                        }
                    }
                    break;
                default:
                    break; 
                    
            }
        };

        if (needUpdataArr.length > 0) {
            let gameSubPackageNames = {
                "minirocket": "rocket",
                "minijhandimunda": "munda",
                "miniteenpatti": "tpGame",
                "miniteenpattibaccarat": "baccarat3PattiGame",
                "miniandar": "andaerGame",
                "minilonghu": "lhdGame",
                "minishuiguo": "fruitMachine",
                "minimaya": "mayaMachine",
                "miniindia": "indiaMachine",
                "minivampire": "vampireMachine",
                "minisaima": "horseRaceGame",
                "minibenzbmw": "Benz",
                "minirummy": "Rummy",
                "miniseven": "7up7downGame",
                "minizoo": "zooGame",
                "minicricket": "cricketGame",
                "miniluckyloto": "sscGame",
                "minizeus": "zeusGame",
            };
            for (let i = 0, len = this.gameUpdateDownloadOrder.length; i < len; i++) {
                let element = this.gameUpdateDownloadOrder[i];
                if (gameSubPackageNames[element] && needUpdataArr.indexOf(gameSubPackageNames[element]) != -1) {
                    GameDownloader.getInstance().commonLoadGame(gameSubPackageNames[element]);
                };
            };
        };

        let languagesType = I18NUtil.getInstance().getLanguageType();
        this.setSmallGameBtnByLanguageType(languagesType);
    },


    showVipLevelIcon: function() {
        if (CommonFun.getInstance().isOpenVipModule() && GlobalCfg.USER_DATAS.userVip.level > 0) {
            this.sprite_vipLevel.node.active = true;
            this.sprite_vipLevel.spriteFrame = this.atlas_levelIcon.getSpriteFrame(GlobalCfg.USER_DATAS.userVip.level);
        }
        else {
            this.sprite_vipLevel.node.active = false;
        };
    },

    showTransBounsRedPoint: function() {
        if(GlobalCfg.USER_DATAS.recharged <= 0){
            this.btn_bonusTransfer.node.getChildByName('redDot').active = false;
            return;
        }
        let curRecharged = Math.round(GlobalCfg.USER_DATAS.recharged / 100);
        let curCanGet = Math.round(GlobalCfg.USER_DATAS.undraw / 100);
        let arr = [[100, 200], [200, 500], [500, 2000], [2000, 5000], [5000, 10000], [10000, 20000], [20000, Number.MAX_SAFE_INTEGER]];
        let canGetArr = [9, 15, 30, 40, 50, 100, 200];
        let i = 0,len = arr.length;
        while (i < len) {
            let [begin, end] = arr[i];
            if(i == 0){
                if(curRecharged >= begin && curRecharged <= end){
                    break;
                }
            }else{
                if(curRecharged > begin && curRecharged <= end){
                    break;
                }
            }
            i++;
        }
        if(curCanGet >= canGetArr[i]){
            this.btn_bonusTransfer.node.getChildByName('redDot').active = true;
        }else{
            this.btn_bonusTransfer.node.getChildByName('redDot').active = false;
        }
        LoggerUtil.getInstance().log(`CurIndex:${i},range:${arr[i]}，curCanGet:${curCanGet},compare Value:${canGetArr[i]}`);
    },

    /**
     * 处理弹框逻辑
     */
    showToastViews: function() {
        if (GlobalCfg.USER_DATAS.recharged == 0) {
            this.dealNotRechargeToast();
        }
        else {
            this.dealRechargeToast();
        };
    },

    showActivityGoBetting() {
        if(GlobalCfg.USER_DATAS.openModules.includes(22) == false){
            this.btn_goBetiing.node.active = false;
            return;
        }

        function checkActivityGoBettingData(){
            let selfbet = GlobalCfg.USER_DATAS.betrebate.bet;
            let item = GlobalCfg.USER_DATAS.betrebate.item;
            item = item.sort((a,b)=>{
                return a.bet - b.bet;
            });
            for(let i = 0; i < item.length; i++){
                if(selfbet >= item[i].bet && item[i].received == false){
                    return true;
                }
            }
            return false;
        };

        if (GlobalCfg.USER_DATAS.recharged == 0) {
            this.btn_goBetiing.node.active = false;
        } else {
            if(GlobalCfg.USER_DATAS.betrebate.item.length == 0){
                this.btn_goBetiing.node.active = false;
                return;
            }
            this.btn_goBetiing.node.active = true;
            let time = this.btn_goBetiing.node.getChildByName('time').getComponent(cc.Label);
            time.string = CommonFun.getInstance().getTodayCountdown();
            this.scheduleGetTodayTimeCountdown = () => {
                time.string = CommonFun.getInstance().getTodayCountdown();
            }
            this.schedule(this.scheduleGetTodayTimeCountdown, 1);
            let spine = this.btn_goBetiing.node.getChildByName('Background').getComponent(sp.Skeleton);
            if (checkActivityGoBettingData.call(this) == true) {
                spine.setAnimation(0, 'animation2', true);
            } else {
                spine.setAnimation(0, 'animation', true);
            }
        }
    },

    dealNotRechargeToast: function() { 
        /**
         * 新人奖励
         */
        if (GlobalCfg.USER_DATAS.firstGiftDiamond > 0) {
            this.showFirstGiftToast();
            return;
        };

        let defaultPopupWithdrawLimit = CommonFun.getInstance().getAppConfigValueByKey('POPUP_WITHDRAW_DATA', 100);    // 提现弹窗限制默认值
        let func = (date)=>{
            let _date = date * 1000;
            let _curDate = new Date().getTime();
            let _differ = _curDate - _date;
            if(_differ < 24 * 60 * 60 * 1000){
                return Number(30 / 60).toFixed(1);
            }else if(_differ < 3 * 24 * 60 * 60 * 1000){
                return Number(20 / 60).toFixed(1);
            }else if(_differ < 5 * 24 * 60 * 60 * 1000){
                return Number(10 / 60).toFixed(1);
            }else{
                return Number(5 / 60).toFixed(1);
            }
        }
        let toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));

        let popup_BonusCard_Time = CommonFun.getInstance().getAppConfigValueByKey('POPUP_BonusCard_FREQUENCY_TIME_MINUTE', 0);
        let BonusCardFrequency = Number((popup_BonusCard_Time / 60).toFixed(1));
        /**
         * 拼多多
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(14) && GlobalCfg.USER_DATAS.pddNewly && this.isNeedShowPointToastByHours("Pdd", 72)) {
            this.updateToastLocalStorageByHours("Pdd", 72);
            this.showPddToast();
        }
        /**
         * 提现
         */
        else if (GlobalCfg.USER_DATAS.openModules.includes(5) && GlobalCfg.USER_DATAS.userDiamond > (defaultPopupWithdrawLimit * 100) 
                && this.isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency)) {
            this.updateToastLocalStorageByHours("WithDraw", toastWithDrawFrequency);
            this.showWithDrawToast();
        }
        /** 
         * 首充
         */
        else if (GlobalCfg.USER_DATAS.openModules.includes(10) && this.isNeedShowPointToastByHours("FirstRecharge", 1)) {
            this.updateToastLocalStorageByHours("FirstRecharge", 1);
            this.showFirstRechargeToast();
        }
        // /**
        //  * 金钻卡
        //  */
        // else if (GlobalCfg.USER_DATAS.openModules.includes(11) && GlobalCfg.USER_DATAS.voucherCard == 0 && this.isNeedShowPointToastByHours("BonusCard", BonusCardFrequency)) {
        //     this.updateToastLocalStorageByHours("BonusCard", BonusCardFrequency);
        //     this.showBonusCardToast();
        // }
        /**
         * 推广员
         */
        else if (GlobalCfg.USER_DATAS.openModules.includes(15) && this.isNeedShowPointToastByHours("Promoter", 1)) {
            this.updateToastLocalStorageByHours("Promoter", 1);
            this.showPromoterToast();
        };

        /**
         * 救济金
         * 
         */
        if (GlobalCfg.USER_DATAS.reliefGiftDiamond > 0) {
            this.scheduleOnce(() => {
                this.showReliefToast();
            }, 0.5);
        };
        
    },

    dealRechargeToast: function() {
        let popup_BonusCard_Time = CommonFun.getInstance().getAppConfigValueByKey('POPUP_BonusCard_FREQUENCY_TIME_MINUTE', 0);
        let BonusCardFrequency = Number((popup_BonusCard_Time / 60).toFixed(1));

        if (GlobalCfg.USER_DATAS.openModules.includes(14) && GlobalCfg.USER_DATAS.pddNewly && this.isNeedShowPointToastByHours("Pdd", 72)) {
            this.updateToastLocalStorageByHours("Pdd", 72);
            this.showPddToast();
        }
        /**
         * 二次充值
         */
        else if (GlobalCfg.USER_DATAS.openModules.includes(20) && this.checkShowSuperDiscount() == true) {
            // this.showSecondRechargeToast();
            CommonFun.getInstance().showBankruptcy();
        }
        // /**
        //  * 金钻卡
        //  */
        // else if (GlobalCfg.USER_DATAS.openModules.includes(11) && GlobalCfg.USER_DATAS.voucherCard == 0 && this.isNeedShowPointToastByHours("BonusCard", BonusCardFrequency)) {
        //     this.updateToastLocalStorageByHours("BonusCard", BonusCardFrequency);
        //     this.showBonusCardToast();
        // }
        /**
         * 有可领取的Bonus
         */
        else if(GlobalCfg.USER_DATAS.openModules.includes(12) && GlobalCfg.USER_DATAS.userDiamond < 1000 && GlobalCfg.USER_DATAS.undraw >= 100){
            CommonFun.getInstance().showBonusTransfer();
        }

        if(GlobalCfg.USER_DATAS.voucherDayGift.length > 0){
            let voucherDayGift = [...GlobalCfg.USER_DATAS.voucherDayGift];
            voucherDayGift.forEach(element => {
                element.amount = element.amount / 100;
            });
            CommonFun.getInstance().showRewardsTips(voucherDayGift);
            GlobalCfg.USER_DATAS.voucherDayGift = [];
        }
    },

    /**
     * 检测是否需要显示SuperDiscount
     * @returns {boolean}
     */
    checkShowSuperDiscount: function () {
        let superDiscount_Show_In_Lobby = CommonFun.getInstance().getAppConfigValueByKey('SuperDiscount_Show_In_Lobby', false);
        let superDiscount_Show_Rate = parseFloat(CommonFun.getInstance().getAppConfigValueByKey('SuperDiscount_Show_Rate', 0.4));
        if (superDiscount_Show_In_Lobby == true) {
            if (GlobalCfg.USER_DATAS.userDiamond < GlobalCfg.USER_DATAS.recharged * superDiscount_Show_Rate && this.isNeedShowPointToastByHours("SecondRecharge", Number((30 / 60).toFixed(1)))) {
                this.updateToastLocalStorageByHours("SecondRecharge", Number((30 / 60).toFixed(1)));
                return true;
            }
            return false;
        }
        return false;
    },

    /**
     * 根据本地缓存判断是否需要显示弹框
     * @param {*} toastType 弹框类型
     * @param {*} frequency 每日显示的次数
     */
    isNeedShowPointToastByDay: function(toastType, frequency) {
        /**
         * 今日零点毫秒级的时间戳
         */
        let todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();  
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (showTag != `${todayZeroTimeStamp}_${frequency}`) {
                    return true;
                }
                else {
                    return false;
                };
            } 
            catch (error) {
                return false;
            };
        }
        else {
            return true;
        };
    },

    updateToastLocalStorageByDay: function(toastType, frequency) {
        /**
         * 今日零点毫秒级的时间戳
         */
        let todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();  
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                let showTagArr = showTag.split("_");
                let showTimes = showTagArr[1];
                if (showTag != `${todayZeroTimeStamp}_${frequency}`) {
                    if (showTagArr[0] != `${todayZeroTimeStamp}`) {
                        showTimes = 0;
                    };
                    if (showTagArr[0] != `${todayZeroTimeStamp}`) {
                        showTimes = 0;
                    };
                    showTimes = parseInt(showTimes) + 1;
                    toastLocalData.showTag = `${todayZeroTimeStamp}_${showTimes}`;
                    cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`, JSON.stringify(toastLocalData));
                };
            } 
            catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
            };
        }
        else {
            let toastLocalData = {
                showTag: `${todayZeroTimeStamp}_1`
            };
            cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`, JSON.stringify(toastLocalData));
        };
    },

    /**
     * 根据本地缓存判断是否需要显示弹框
     * @param {*} toastType 弹框类型
     * @param {*} hours 间隔几个小时
     */
    isNeedShowPointToastByHours: function(toastType, hours) {
        /**
         * 当前毫秒级的时间戳
         */
        let curTimeStamp = new Date().getTime();
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (curTimeStamp > (parseInt(showTag) + hours * 60 * 60 * 1000)) {
                    return true;
                }
                else {
                    return false;
                };
            } 
            catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
                return false;
            };
        }
        else {
            return true;
        };
    },

    updateToastLocalStorageByHours: function(toastType, hours) {
        /**
         * 当前毫秒级的时间戳
         */
        let curTimeStamp = new Date().getTime();
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (curTimeStamp > (parseInt(showTag) + hours * 60 * 60 * 1000)) {
                    toastLocalData.showTag = `${curTimeStamp}`;
                    cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`, JSON.stringify(toastLocalData));
                }; 
                
            } 
            catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
            };
        }
        else {
            let toastLocalData = {
                showTag: curTimeStamp
            };
            cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`, JSON.stringify(toastLocalData));
        };
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        LoggerUtil.getInstance().log("msgId === " , msgId);
        if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS) {
            self.setSmallGameLoadProgress(notify);
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE) {
            self.setSmallGameLoadComplete(notify);
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            self.showUserInfo();
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_TGY_REWARD 
            || msgId == GlobalCfg.CLIENT_MSG_ID.GET_CHALLENGES_REWARD) {
            let price = notify.price;
            GlobalCfg.USER_DATAS.userDiamond = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, price);
            self.showUserInfo();
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD) {
            self.showUserInfo();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.HIDE_TGY_REDPOINT) {
           
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CHALLENGES_ACT) {
            self.dealChallengesAct(notify);
        }
        else if (msgId == 'lobbyservice.marquee') {
            if (notify) {
                if (notify.isRobot == true) {
                    GlobalCfg.MAR_QUEE_DATA_ROBOT.push(notify)
                }
                else {
                    GlobalCfg.MAR_QUEE_DATA.push(notify);
                };
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_FIRST_GIFT_REWARD) {
            self.showUserInfo();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_RELIEF_REWARD) {
            self.showUserInfo();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.UPDATE_USER_INFO) {
            GlobalCfg.USER_DATAS.userName = notify.nickname;
            GlobalCfg.USER_DATAS.userHeadimgurl = notify.userHeadimgurl;
            self.showUserInfo();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CLOSE_SSCGAME_REFRESH_LOBBY) {
            // 救济金
            if (GlobalCfg.USER_DATAS.reliefGiftDiamond > 0) {
                GlobalCfg.USER_DATAS.userDiamond -= GlobalCfg.USER_DATAS.reliefGiftDiamond; 
            };
            self.showUserInfo();
            self.showBanner();
            self.showOtherModules();  
            self.showSmallGameBtns();
            self.showToastViews();
            self.showTransBounsRedPoint();
            CommonFun.getInstance().hidProgress();
        }
        else if (msgId == 'lobbyservice.newmail') {
            // 新邮件通知，消息体无内容
            self.showNewEmailRedDot(true); 
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.READ_EMAIL){
            // 读取邮件，更新邮件按钮状态
            let bool = notify.state;
            self.showNewEmailRedDot(bool);
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
            self.showFirstRechargeTipPopup();
        }
        else if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
            self.showVipLevelIcon();
            if (GlobalCfg.USER_DATAS.recharged > 0 
                && GlobalCfg.USER_DATAS.userVip.level > 0 
                && CommonFun.getInstance().isOpenVipModule()) { 
                self.btn_vip.node.active = true;
            }
            else {
                self.btn_vip.node.active = false;
            };
            let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(GlobalCfg.USER_DATAS.userVip.level);
            if (isCanShowVIPFont) {
                self.lab_userName.node.color = new cc.Color(250, 225, 76); 
            }
            else {
                self.lab_userName.node.color = new cc.Color(255, 255, 255); 
            };
        }
        else if (GlobalCfg.CLIENT_MSG_ID.VIP_REWARD === msgId) {
            self.showUserInfo();
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.SIDEBAT_DISPLAYED) {
            let isShow = notify.isShow;
            self.dealToggleModules(isShow);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.BINDPHONE_SUCCESS) {
            self.lab_userBonus.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.bonus / 100)
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GET_BOUND_UNDRAW) {
            self.showTransBounsRedPoint();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CHANGE_LANGUAGE) {
            self.dealChangeLanguageEvent(notify);
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.ACTIVITY_GOBETTING_GET) {
            self.showActivityGoBetting();
            self.showUserInfo();
        }
    },

    showNewEmailRedDot(bool){
        let redDot = this.btn_mail.node.getChildByName('redDot');
        redDot.active = bool;
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_setting") {
            CommonFun.getInstance().showSetting();
            // CommonFun.getInstance().showPromoter();
        } 
        else if (btnName == "btn_add" || btnName == 'btn_quickRecharge' || btnName == "btn_addCash") {  
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ADD_BUTTON);
            this.dealBtnRechargeEvent();
        } 
        else if (btnName == "btn_withDarw") {
            this.dealBtnWithDrawEvent();
        } 
        else if (btnName == "btn_tx") {
            this.dealBtnTxEvent();
        }  
        else if (btnName == 'btn_getNow') {
            this.dealBtnActivityEvent(btnName);
        }
        else if (btnName == "btn_bonusTransfer") {
            this.dealBtnBonusTransferEvent();
        } 
        else if (btnName == 'btn_service') {
            this.dealBtnServiceEvent();
        } 
        else if (btnName == 'btn_mail') {
            this.dealBtnMailEvent();
        } 
        else if (btnName == 'btn_referEarn') {
            this.showPromoterToast();
        } 
        else if (btnName == 'btn_pdd') {
            this.dealPddBtnEvent();
        }
        else if (btnName == "btn_vip") {
            CommonFun.getInstance().showMyVip();
        }
        else if(btnName == this.btn_goBetiing.node.name){
            CommonFun.getInstance().showGoBetting();
        }
    },

    dealBtnRechargeEvent: function() {
        if (!GlobalCfg.USER_DATAS.openModules.includes(4)) {
            CommonFun.getInstance().showMsgBox("Not yet open", "YES_ON", () => { }, false);
            return
        };
        // 首充 且 首充活动模块开关开启
        // if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.openModules.includes(10)) {
        //     // CommonFun.getInstance().showActivity("Bonus");
        //     this.showFirstRechargeToast();
        // } 
        // else {
            CommonFun.getInstance().showNewShop(true);
        // };
    },

    dealBtnWithDrawEvent: function() {
        CommonFun.getInstance().showWithDrawPreData();
    },

    dealBtnTxEvent: function() {
        CommonFun.getInstance().showPersonal();   
    },

    dealBtnActivityEvent: function(btnName) {
        if (btnName == 'btn_getNow') {
            GlobalCfg.clickBtnGetNow = true;
        };
        CommonFun.getInstance().showActivity();
    },

    dealBtnBonusTransferEvent: function() {
        CommonFun.getInstance().showBonusTransfer();
    },

    dealBtnServiceEvent: function() {
        CommonFun.getInstance().showCustomerService();
    },

    dealBtnMailEvent: function() {
        CommonFun.getInstance().showEmail();
    },

    showPromoter: function() {
        CommonFun.getInstance().showPromoter();
    },

    dealPddBtnEvent: function() {
         Promise.all([APIManager.getInstance().get_pdd_api_data(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY_PDD_FIRST)])
            .then(([pdd_api_data, prefab]) => {
                let pddFirstNode = cc.instantiate(prefab);
                let firstCtrl = pddFirstNode.getComponent("firstCtrl");
                firstCtrl.setData(pdd_api_data);
                CommonFun.getInstance().addToPointParent(pddFirstNode, GlobalCfg.PREFAB_PARENT.ACTIVITY_PDD);
            });
    },

    dealToggleModules: function(isShow) {
        let isChecked = isShow;
        let w = cc.view.getVisibleSize().width;
        if (isChecked) {
            cc.tween(this.node_middles)
            .to(0.2, {position: cc.v2(0, -20)}, {easing: 'smooth'})
            .call(() => {
                this.node_gameScollview.setContentSize(w - 510 - 30, 480);
                this.node_gameScollview.getChildByName("view").setContentSize(w - 510 - 30, 480);
            })
            .start();
        }
        else {
            cc.tween(this.node_middles)
            .to(0.2, {position: cc.v2(-132, -20)}, {easing: 'smooth'})
            .call(() => {
                this.node_gameScollview.setContentSize(w - 510 - 30 + 132, 480);
                this.node_gameScollview.getChildByName("view").setContentSize(w - 510 - 30 + 132, 480);
            })
            .start();
        };
    },

    dealChallengesAct: function(notify) {
        let actName = notify.actName;
        if (actName == "recharge") {
            /**
             * 前往充值
             */
            CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.ChallengeTasks);
        }
        else if (actName == SceneManager.getInstance().sceneType.TEENPATTI) {
            this.checkUpdate("tpGame", () => {
                window.isNeedShowRoomList = "tpGame";
                this.showGameRoomList();
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.RUMMY) {
            this.checkUpdate("Rummy", () => {
                window.isNeedShowRoomList = "rummy";
                this.showGameRoomList();
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.LHD) {
            this.checkUpdate("lhdGame", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.LHD);
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.SEVENUPDOWN) {
            this.checkUpdate("7up7downGame", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SEVENUPDOWN);
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.HORSERACE) {
            this.checkUpdate("horseRaceGame", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.HORSERACE);
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.MUNDA) {
            this.checkUpdate("munda", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.MUNDA);
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.BACCARAT) {
            this.checkUpdate("baccarat3PattiGame", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BACCARAT);
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.ANDAER) {
            this.checkUpdate("andaerGame", () => {
                window.isNeedShowRoomList = "andar";
                this.showGameRoomList();
            });
        }
        else if (actName == SceneManager.getInstance().sceneType.BENZ) {
            this.checkUpdate("Benz", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BENZ);
            });
        };
    },

    loadHeadSp: function() {
        if (GlobalCfg.USER_DATAS.userHeadimgurl.length === 0) {
            return;
        };
        cc.loader.load({url: GlobalCfg.USER_DATAS.userHeadimgurl, type: 'png' },  (err, img) => {
            if (!err && cc.isValid(this) && cc.isValid(this.sprite_tx)) {
                let spriteFrame = new cc.SpriteFrame(img);
                this.sprite_tx.spriteFrame = spriteFrame;
                this.sprite_tx.node.setContentSize(100, 100);
            };
        });
    },

    btnClickGame: function(button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_zjh") {  
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_TP_BUTTON);
            if (CommonFun.getInstance().isNeedShowTPFingerTip() && CommonFun.getInstance().isEnteredTPGame() == false && GlobalCfg.USER_DATAS.recharged == 0) {
                this.tryEnterMinScoreTP();
            }
            else {
                this.checkUpdate("tpGame", () => {
                    window.isNeedShowRoomList = "tpGame";
                    GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product;
                    this.showGameRoomList();
                });
            };
        } 
        else if (btnName == "btn_zjh2") {  
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_TP_BUTTON);
            this.checkUpdate("tpGame", () => {
                window.isNeedShowRoomList = "tpGame";
                GlobalCfg.SMALL_GAME_DATAS.teenPattiData.endpoint = this.teenPatti2Endpoint;
                console.log("teenPatti2Endpoint:", this.teenPatti2Endpoint);
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product;
                this.showGameRoomList();
            });
        } 
        else if (btnName == "btn_andeer") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ANDAR_BUTTON);
            this.checkUpdate("andaerGame", () => {
                window.isNeedShowRoomList = "andar";
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.andeerData.product;
                this.showGameRoomList();
            });
        } 
        else if( btnName == "btn_rummy") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_RUMMY_BUTTON);
            this.checkUpdate("Rummy", () => {
                window.isNeedShowRoomList = "rummy";
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.rummyData.product;
                this.showGameRoomList();
            });
        } 
        else if (btnName == "btn_upDown") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_UPDOWN_GAME);
            this.checkUpdate("7up7downGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.upDownData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SEVENUPDOWN);
            });
        } 
        else if (btnName == "btn_lhd") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_LHD_GAME);
            this.checkUpdate("lhdGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.lhdData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.LHD);
            });
        } 
        else if(btnName == "btn_munda") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_MUNDA_GAME);
            this.checkUpdate("munda", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.mundaData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.MUNDA);
            });
        } 
        else if (btnName == "btn_horseRace") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_HORSE_GAME);
            this.checkUpdate("horseRaceGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.horseRaceData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.HORSERACE);
            });
        } 
        else if (btnName == "btn_fruitMachine") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_FRUIT_GAME);
            this.checkUpdate("fruitMachine", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.fruitMachineData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SGJ);
            });
        } 
        else if (btnName == "btn_mayaMachine") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_MAYA_GAME);
            this.checkUpdate("mayaMachine", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.mayaMachineData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.MAYA);
            });
        } 
        else if (btnName == "btn_indiaMachine") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_MAYA_GAME);
            this.checkUpdate("indiaMachine", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.indiaMachineData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.INDIA);
            });
        } 
        else if (btnName == "btn_vampireMachine") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_MAYA_GAME);
            this.checkUpdate("vampireMachine", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.vampireMachineData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.VAMPIRE);
            });
        } 
        else if (btnName == "btn_Benz") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_BENZ_GAME);
            this.checkUpdate("Benz", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.benZData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BENZ);
            });
        } 
        else if (btnName == "btn_baccarat3Patti") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_3PATTI_GAME);
            this.checkUpdate("baccarat3PattiGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.baccaratData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BACCARAT);
            });
        }
        else if (btnName == "btn_ssc") {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_SSC_GAME);
            this.checkUpdate("sscGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.sscData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SSC);
            });
        }
        else if (btnName == 'btn_rocket'){
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_CRASH_GAME);
            this.checkUpdate("rocket", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.rocketData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ROCKET);
            });
        } 
        else if (btnName == 'btn_zoo'){
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ZOO_GAME);
            this.checkUpdate("zooGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.zooData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ZOO);
            });
        } 
        else if (btnName == 'btn_cricket'){
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_CRICKET_GAME);
            this.checkUpdate("cricketGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.cricketData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.CRICKET);
            });
        } 
        else if (btnName == 'btn_zeus'){
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ZEUS_GAME);
            this.checkUpdate("zeusGame", () => {
                CommonFun.getInstance().showProgress();
                GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.zeusData.product;
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ZEUS);
            });
        } 
    },

    tryEnterMinScoreTP: function() {
        //@ts-ignore
        if (CommonFun.getInstance().isNeedUpdata("tpGame") == false) {
            //@ts-ignore
            if (GlobalCfg.USER_DATAS.openModules.includes(100)) {
                //@ts-ignore
                let teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti;
                teenPattiRoomInfo = teenPattiRoomInfo.sort((a, b) => {
                    return a.entrycondition - b.entrycondition;
                });
                teenPattiRoomInfo = teenPattiRoomInfo.filter((item) => {
                    return item.trial == false && item.isblind == false;
                });
                let itemData = null;
                for (let i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
                    //@ts-ignore
                    if (teenPattiRoomInfo[i].entrycondition <= GlobalCfg.USER_DATAS.userDiamond && GlobalCfg.USER_DATAS.userDiamond <= teenPattiRoomInfo[i].entryconditionmax) {
                        itemData = teenPattiRoomInfo[i];
                        break;
                    };
                };
                if (!itemData) {
                    //@ts-ignore
                    window.isNeedShowRoomList = "tpGame";
                    //@ts-ignore
                    CommonFun.getInstance().showSelectRoom();
                    return;
                };
                //@ts-ignore
                CommonFun.getInstance().showProgress();
                //@ts-ignore
                GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData.id;
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
            }
            else {
                //@ts-ignore
                CommonFun.getInstance().showTips(`TeenPatti is not open yet!`); 
            };
        }
        else {
            //@ts-ignore
            GameDownloader.getInstance().priorLoadGame("tpGame");
        };
    },

    showGameRoomList: function() { 
        CommonFun.getInstance().showSelectRoom();
    },

    checkUpdate: function(subpackgeName, callFun) {
        if (cc.sys.os != cc.sys.OS_ANDROID || !GlobalCfg.IS_SMALL_GAME_UPDATE || cc.sys.isBrowser) {
            callFun();
            return;
        };

        if (CommonFun.getInstance().isNeedUpdata(subpackgeName)) {
            CommonFun.getInstance().showTips("Download the game now!");
            GameDownloader.getInstance().priorLoadGame(subpackgeName);
        } 
        else {
            callFun();
        };
    },

    setSmallGameLoadProgress: function(notify) {
        if (!notify) {
            return;
        };
        let progress = notify.progress;
        let subpackgeName = notify.subpackgeName;
        let upDateMaskNode = null;
        switch (subpackgeName) {
            case "7up7downGame":
                upDateMaskNode = this.btn_miniseven.node.getChildByName("upDateMask");
                break;
            case "andaerGame":
                upDateMaskNode = this.btn_miniandar.node.getChildByName("upDateMask");
                break;
            case "tpGame":
                upDateMaskNode = this.btn_miniteenpatti.node.getChildByName("upDateMask");
                break;
            case "Rummy":
                upDateMaskNode = this.btn_minirummy.node.getChildByName("upDateMask");
                break;
            case "lhdGame":
                upDateMaskNode = this.btn_minilonghu.node.getChildByName("upDateMask");
                break;
            case "munda":
                upDateMaskNode = this.btn_minijhandimunda.node.getChildByName("upDateMask");
                break;
            case "horseRaceGame":
                upDateMaskNode = this.btn_minisaima.node.getChildByName("upDateMask");
                break;
            case "sscGame":
                upDateMaskNode = this.btn_miniluckyloto.node.getChildByName("upDateMask");
                break;
            case "fruitMachine":
                upDateMaskNode = this.btn_minishuiguo.node.getChildByName("upDateMask");
                break;
            case "mayaMachine":
                upDateMaskNode = this.btn_minimaya.node.getChildByName("upDateMask");
                break;
            case "indiaMachine":
                upDateMaskNode = this.btn_miniindia.node.getChildByName("upDateMask");
                break;
            case "vampireMachine":
                upDateMaskNode = this.btn_minivampire.node.getChildByName("upDateMask");
                break;
            case "baccarat3PattiGame":
                upDateMaskNode = this.btn_miniteenpattibaccarat.node.getChildByName("upDateMask");
                break;
            case "Benz":
                upDateMaskNode = this.btn_minibenzbmw.node.getChildByName("upDateMask");
                break;
            case "rocket":
                upDateMaskNode = this.btn_minirocket.node.getChildByName("upDateMask");
                break;
            case "zooGame":
                upDateMaskNode = this.btn_minizoo.node.getChildByName("upDateMask");
                break;
            case "cricketGame":
                upDateMaskNode = this.btn_minicricket.node.getChildByName("upDateMask");
                break;
            case "zeusGame":
                upDateMaskNode = this.btn_minizeus.node.getChildByName("upDateMask");
                break;
            default:
                break;
        };

        if (upDateMaskNode) {
            upDateMaskNode.active = true;
            let updateProgressBar = upDateMaskNode.getChildByName("progressBar").getComponent(cc.ProgressBar);
            updateProgressBar.node.active = true;
            updateProgressBar.progress = progress/100;
            let updateLab = upDateMaskNode.getChildByName("lab_xz").getComponent(cc.Label);
            updateLab.string = `${progress}%`;
        };
    }, 

    setSmallGameLoadComplete: function(notify) {
        if (!notify) {
            return;
        };
        let subpackgeName = notify.subpackgeName;
        switch (subpackgeName) {
            case "7up7downGame":
                this.btn_miniseven.node.getChildByName("upDateMask").active = false;
                break;
            case "andaerGame":
                this.btn_miniandar.node.getChildByName("upDateMask").active = false;
                break;
            case "tpGame":
                this.btn_miniteenpatti.node.getChildByName("upDateMask").active = false;
                break;
            case "Rummy":
                this.btn_minirummy.node.getChildByName("upDateMask").active = false;
                break;
            case "lhdGame":
                this.btn_minilonghu.node.getChildByName("upDateMask").active = false;
                break;
            case "munda":
                this.btn_minijhandimunda.node.getChildByName("upDateMask").active = false;
                break;
            case "horseRaceGame":
                this.btn_minisaima.node.getChildByName("upDateMask").active = false;
                break;
            case "sscGame":
                this.btn_miniluckyloto.node.getChildByName("upDateMask").active = false;
                break;
            case "fruitMachine":
                this.btn_minishuiguo.node.getChildByName("upDateMask").active = false;
                break;
            case "mayaMachine":
                this.btn_minimaya.node.getChildByName("upDateMask").active = false;
                break;
            case "indiaMachine":
                this.btn_miniindia.node.getChildByName("upDateMask").active = false;
                break;
            case "vampireMachine":
                this.btn_minivampire.node.getChildByName("upDateMask").active = false;
                break;
            case "baccarat3PattiGame":
                this.btn_miniteenpattibaccarat.node.getChildByName("upDateMask").active = false;
                break;
            case "Benz":
                this.btn_minibenzbmw.node.getChildByName("upDateMask").active = false;
                break;
            case "rocket":
                this.btn_minirocket.node.getChildByName("upDateMask").active = false;
                break;
            case "zooGame":
                this.btn_minizoo.node.getChildByName("upDateMask").active = false;
                break;
            case "cricketGame":
                this.btn_minicricket.node.getChildByName("upDateMask").active = false;
                break;
            case "zeusGame":
                this.btn_minizeus.node.getChildByName("upDateMask").active = false;
                break;
            default:
                break;
        };
    },

    onDestroy: function() {
        CommonFun.getInstance().removeCarouselStrip();
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    },

    // 提现弹窗
    showWithDrawToast: function() {
        CommonFun.getInstance().showPopUpWithDraw();
    },

    showFirstRechargeToast: function() {
        CommonFun.getInstance().showFirstRecharge();
    },

    showSecondRechargeToast: function() {
        CommonFun.getInstance().showSuperDiscount('Lobby');
    },
    
    showPromoterToast: function() {
        CommonFun.getInstance().showPromoter();
    },

    showBonusCardToast: function() {
        CommonFun.getInstance().showDailyBonusCard();
    },

    showReliefToast: function() {
        CommonFun.getInstance().showRelief();
    },

    showFirstGiftToast: function() {
        CommonFun.getInstance().showFirstGiftDiamond();
    },

    showPddToast: function() {},

    dealChangeLanguageEvent: function(notify) {
        let languagesType = notify.languagesType;
        this.setSmallGameBtnByLanguageType(languagesType);
        this.setAddCashBtnByLanguageType(languagesType);
    },

    setSmallGameBtnByLanguageType: function(languagesType) {
        let skinName = '';
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                skinName = 'yuyan1';
                break;
            case I18NLanguagesEnum.Hindi:
                skinName = 'yuyan2';
                break;
            case I18NLanguagesEnum.Urdu:
                skinName = 'yuyan3';
                break;
            case I18NLanguagesEnum.Bengali:
                skinName = 'yuyan4';
                break;
            default:
                skinName = 'yuyan1';
                break;
        };

        let skeleton = null
        if (this.btn_miniandar.node.active) {
            skeleton = this.btn_miniandar.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minibenzbmw.node.active) {
            skeleton = this.btn_minibenzbmw.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minijhandimunda.node.active) {
            skeleton = this.btn_minijhandimunda.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minilonghu.node.active) {
            skeleton = this.btn_minilonghu.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };

        if (this.btn_minirummy.node.active) {
            skeleton = this.btn_minirummy.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            let temp1 = "";
            if (skinName == 'yuyan2') {
                temp1 = 'yuyan4';
            }
            else  if (skinName == 'yuyan4') {
                temp1 = 'yuyan2';
            }
            else {
                temp1 = skinName;
            };
            skeleton.setSkin(temp1);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minisaima.node.active) {
            skeleton = this.btn_minisaima.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_miniseven.node.active) {
            skeleton = this.btn_miniseven.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minishuiguo.node.active) {
            skeleton = this.btn_minishuiguo.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minimaya.node.active) {
            skeleton = this.btn_minimaya.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            // skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_miniindia.node.active) {
            skeleton = this.btn_miniindia.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            // skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'idle', true);
        };
        if (this.btn_minivampire.node.active) {
            skeleton = this.btn_minivampire.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            // skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'idle', true);
        };
        if (this.btn_miniteenpatti.node.active) {
            skeleton = this.btn_miniteenpatti.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            let temp1 = "";
            if (skinName == 'yuyan2') {
                temp1 = 'yuyan4';
            }
            else  if (skinName == 'yuyan4') {
                temp1 = 'yuyan2';
            }
            else {
                temp1 = skinName;
            };
            skeleton.setSkin(temp1);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_miniteenpatti2.node.active) {
            skeleton = this.btn_miniteenpatti2.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            let temp1 = "";
            if (skinName == 'yuyan2') {
                temp1 = 'yuyan4';
            }
            else  if (skinName == 'yuyan4') {
                temp1 = 'yuyan2';
            }
            else {
                temp1 = skinName;
            };
            skeleton.setSkin(temp1);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_miniteenpattibaccarat.node.active) {
            skeleton = this.btn_miniteenpattibaccarat.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minirocket.node.active) {
            skeleton = this.btn_minirocket.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minicricket.node.active) {
            skeleton = this.btn_minicricket.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minizeus.node.active) {
            skeleton = this.btn_minizeus.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
        if (this.btn_minizoo.node.active) {
            skeleton = this.btn_minizoo.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };        
    },


    setAddCashBtnByLanguageType: function(languagesType) {
        let skinName = '';
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                skinName = 'yuyan1';
                break;
            case I18NLanguagesEnum.Hindi:
                skinName = 'yuyan2';
                break;
            case I18NLanguagesEnum.Urdu:
                skinName = 'yuyan3';
                break;
            case I18NLanguagesEnum.Bengali:
                skinName = 'yuyan4';
                break;
            default:
                skinName = 'yuyan1';
                break;
        };

        let skeleton = null;
        if (this.btn_addCash.node.active) {
            skeleton = this.btn_addCash.node.getChildByName('Background').getComponent(sp.Skeleton);
            skeleton.clearTrack(0);
            skeleton.setSkin(skinName);
            skeleton.setAnimation(0, 'animation', true);
        };
    },

    /**
     * 显示首次充值清除金币提示
     */
    showFirstRechargeTipPopup: function() {
        let defaultType = CommonFun.getInstance().getAppConfigValueByKey('POPUP_RechargeTip_Type', 1);
        switch (defaultType) {
            case 1:
                CommonFun.getInstance().showAdvancedMode(false);
                break;
            case 2:
                CommonFun.getInstance().showNewRechargeTip();
                break;
            default:
                break;
        }
    },
}); 