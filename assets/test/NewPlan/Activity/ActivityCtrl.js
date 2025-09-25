cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        node_content: cc.Node,
        toggle_daily: cc.Toggle,
        toggle_challenges: cc.Toggle,
        toggle_bonus: cc.Toggle,
        toggle_turntable: cc.Toggle,
    },

    ctor: function() {
        this.node_daily = null;
        this.node_challenges = null;
        this.node_bonus = null;
        this.node_turntable = null;
        this.customMsgEventHandle = null;
        this.pointView = "Daily";
    },

    onLoad: function() {
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.toggle_daily.node.on('toggle', this.toggleClick, this);
        this.toggle_challenges.node.on('toggle', this.toggleClick, this);
        this.toggle_bonus.node.on('toggle', this.toggleClick, this);
        this.toggle_turntable.node.on('toggle', this.toggleClick, this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ACTIVITYSIGN);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ACTIVITYTURNTABLE);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ACTIVITYGETBONUS);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ACTIVITYCHALLENGES);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ACTIVITY);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CLOSE_VIEW) {
            self.node.destroy();
        }
    },

    setPointView: function(pointView) {
        this.pointView = pointView;
    },

    start () {
        let curToggleName = null;
        let data = GlobalCfg.USER_DATAS.openModules;
        let couldShowModel = new Map();
        // 签到活动
        if (data.includes(8)) {
            couldShowModel.set("Daily", true);
            this.toggle_daily.node.active = true;
        }
        else {
            this.toggle_daily.node.active = false;
        };
        // 转盘活动
        if (data.includes(9)) {
            couldShowModel.set("Turntable", true);
            this.toggle_turntable.node.active = true;
        }
        else {
            this.toggle_turntable.node.active = false;
        };
        // 首充活动
        if (GlobalCfg.USER_DATAS.recharged == 0 && data.includes(10)) {
            couldShowModel.set("Bonus", true);
            this.toggle_bonus.node.active = true;
        }
        else {
            this.toggle_bonus.node.active = false;
        };
        // 挑战任务
        if (GlobalCfg.USER_DATAS.challengeRunning && data.includes(17)) {
            couldShowModel.set("Challenges", true);
            this.toggle_challenges.node.active = true;
        }
        else {
            this.toggle_challenges.node.active = false;
        };

        let func = (type)=>{
            switch (type) {
                case "Daily":
                    this.toggle_daily.isChecked = true;
                    curToggleName = this.toggle_daily.node.name;
                    break;
                case "Challenges":
                    this.toggle_challenges.isChecked = true;
                    curToggleName = this.toggle_challenges.node.name;
                    break;
                case "Bonus":
                    this.toggle_bonus.isChecked = true;
                    curToggleName = this.toggle_bonus.node.name;
                    break;
                case "TurnTable":
                    this.toggle_turntable.isChecked = true;
                    curToggleName = this.toggle_turntable.node.name;
                    break;
                default:
                    break;
            }
        }

        let funcShowCurrentCouldShowModel = ()=>{
            couldShowModel.forEach((value, key)=>{
                if(value){
                    func(key);
                    return;
                }
            });
        }

        /**
         * 
         * @param {string} pointView 值：Daily  Challenges  Bonus  TurnTable
         */
        let func_CheckPointView = (pointView)=>{
            if(couldShowModel.has(pointView)){
                func(pointView);
            }else{
                funcShowCurrentCouldShowModel();
            }
        }

        func_CheckPointView(this.pointView);

        if (curToggleName) {
            this.setViewByToggleName(curToggleName);
        };
    },    

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.node.destroy();
                break;
            default:
                break;
        }
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    setViewByToggleName(toggleName) {
        if (this.node_challenges) {
            this.node_challenges.active = toggleName == "toggle_challenges";
        };
        if (this.node_turntable) {
            this.node_turntable.active = toggleName == "toggle_turntable";
        };
        if (this.node_bonus) {
            this.node_bonus.active = toggleName == "toggle_bonus";
        };
        if (this.node_daily) {
            this.node_daily.active = toggleName == "toggle_daily";
        };

        let prefabPath = null;
        if (toggleName == "toggle_daily" && !this.node_daily) {
            prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYSIGN;
        }
        else if (toggleName == "toggle_turntable" && !this.node_turntable) {
            prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYTURNTABLE;
        }
        else if (toggleName == "toggle_bonus" && !this.node_bonus) {
            prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYGETBONUS;
        }
        else if (toggleName == "toggle_challenges" && !this.node_challenges) {
            prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYCHALLENGES;
        };

        if (prefabPath) {
            let promise = CommonFun.getInstance().loadPrefabByPromise(prefabPath);
            promise.then((prefab) => {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    let node = cc.instantiate(prefab);
                    switch (toggleName) {
                        case "toggle_daily":
                            this.node_daily = node;
                            break;
                        case "toggle_challenges":
                            this.node_challenges = node;
                            break;
                        case "toggle_bonus":
                            this.node_bonus = node;
                            break;
                        case "toggle_turntable":
                            this.node_turntable = node;
                            break;
                        default:
                            break;
                    }

                    this.node_content.addChild(node);
    
                    if (this.node_challenges) {
                        this.node_challenges.active = toggleName == "toggle_challenges";
                    };
                    if (this.node_turntable) {
                        this.node_turntable.active = toggleName == "toggle_turntable";
                    };
                    if (this.node_bonus) {
                        this.node_bonus.active = toggleName == "toggle_bonus";
                    };
                    if (this.node_daily) {
                        this.node_daily.active = toggleName == "toggle_daily";
                    };
                };
            })
            .catch ((error) => {
                LoggerUtil.getInstance().log(error);
            });
        };
    },
});
