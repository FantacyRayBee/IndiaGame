cc.Class({
    extends: cc.Component,

    properties: {
       btn_close: cc.Button,
       toggle_vipRules: cc.Toggle,  
       toggle_benefits: cc.Toggle,
       toggle_levelUpGift: cc.Toggle, 
       node_content: cc.Node,
    },

    ctor: function() {
        this.curChildViewType = "vipRules";
    },

    onLoad: function() {
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.toggle_vipRules.node.on("toggle", this.toggleCallBack, this);
        this.toggle_benefits.node.on("toggle", this.toggleCallBack, this);
        this.toggle_levelUpGift.node.on("toggle", this.toggleCallBack, this);
    },

    start: function() {
        switch (this.curChildViewType) {
            case "vipRules":
                this.dealToggleVipRulesEvent();
                this.toggle_vipRules.check();
                break;
            case "benefits":
                this.dealToggleBenefitsEvent();
                this.toggle_benefits.check();
                break;
            case "levelUpGift":
                this.dealToggleLevelUpGiftEvent();
                this.toggle_levelUpGift.check();
                break;
            default:
                break;
        };
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnCloseEvent();
                return;
            default:
                break;
        }
    },

    toggleCallBack: function(toggle) {
        let toggleName = toggle.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        switch (toggleName) {
            case "toggle_vipRules":
                this.dealToggleVipRulesEvent();
                break;
            case "toggle_benefits":
                this.dealToggleBenefitsEvent();
                break;
            case "toggle_levelUpGift":
                this.dealToggleLevelUpGiftEvent();
                break;
            default:
                break;
        }
    },

    dealBtnCloseEvent: function() {
        this.node.destroy();
    },

    dealToggleVipRulesEvent: function() {
        this.unscheduleAllCallbacks();
        this.node_content.destroyAllChildren();

        let prefabPromise = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULESRULE);
        prefabPromise.then((prefab) => {
            let node = cc.instantiate(prefab);
            this.node_content.addChild(node);
        });
    },

    dealToggleBenefitsEvent: function() {
        this.unscheduleAllCallbacks();
        this.node_content.destroyAllChildren();

        let prefabPromise = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULESBENEFITS);
        prefabPromise.then((prefab) => {
            let node = cc.instantiate(prefab);
            this.node_content.addChild(node);
        });
    },

    dealToggleLevelUpGiftEvent: function() {
        this.unscheduleAllCallbacks();
        this.node_content.destroyAllChildren();

        let prefabPromise = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULESUPGIFT);
        prefabPromise.then((prefab) => {
            let node = cc.instantiate(prefab);
            this.node_content.addChild(node);
        });
    },

    setVipRulesChildViewType: function(childViewType) {
        this.curChildViewType = childViewType;
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULES);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULESRULE);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULESBENEFITS);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULESUPGIFT);
    },
});
