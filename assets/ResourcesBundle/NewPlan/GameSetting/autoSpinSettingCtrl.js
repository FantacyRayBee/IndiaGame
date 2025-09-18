let EnumBtnType = cc.Enum({
    Spin: 0,
    Ratio: 1,
    Less: 2,
    More: 3,
});

cc.Class({
    extends: cc.Component,

    properties: {
        toggle_ratio: cc.Toggle,
        toggle_less: cc.Toggle,
        toggle_more: cc.Toggle,

        btn_add_spin: cc.Button,
        btn_sub_spin: cc.Button,
        btn_add_ratio: cc.Button,
        btn_sub_ratio: cc.Button,
        btn_add_less: cc.Button,
        btn_sub_less: cc.Button,
        btn_add_more: cc.Button,
        btn_sub_more: cc.Button,

        btn_timeArr: [cc.Button],

        lab_spin: cc.Label,
        lab_ratio: cc.Label,
        lab_less: cc.Label,
        lab_more: cc.Label,

        btn_cancel: cc.Button,
        btn_start: cc.Button,
    },

    ctor: function () {
        this.counter = 0;
        this.interval = null;
        this.toggleTypeArr = [true, false, false, false];
        this.timeArr = [10, 20, 30, 40, 50];
        this.inTime = 150;
    },

    onLoad: function() {
        this.toggle_ratio.node.on('click', this.toggleClick, this);
        this.toggle_less.node.on('click', this.toggleClick, this);
        this.toggle_more.node.on('click', this.toggleClick, this);

        this.btn_cancel.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_start.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_add_spin.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_sub_spin.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_sub_ratio.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_add_ratio.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_add_less.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_sub_less.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_add_more.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_sub_more.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);

        for (let i = 0; i < 5; i++) {
            this.btn_timeArr[i].node.on('click', CommonFun.getInstance().debounce(this.timeBtnClick, 0), this);
        }
        this.buttonAddEventListener();
    },

    initData: function(arr1, arr2){
        this.typeNumArr = arr1;
        this.toggleTypeArr = arr2;
        this.setToggle();
        this.updateCounter();
    },

    buttonAddEventListener: function () {
        this.btn_add_spin.node.on(cc.Node.EventType.TOUCH_START, this.startDecreasing_spin,  this);
        this.btn_add_spin.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_add_spin.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);
        this.btn_sub_spin.node.on(cc.Node.EventType.TOUCH_START,  this.startIncreasing_spin,  this);
        this.btn_sub_spin.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_sub_spin.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);

        this.btn_add_ratio.node.on(cc.Node.EventType.TOUCH_START, this.startDecreasing_ratio,  this);
        this.btn_add_ratio.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_add_ratio.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);
        this.btn_sub_ratio.node.on(cc.Node.EventType.TOUCH_START,  this.startIncreasing_ratio,  this);
        this.btn_sub_ratio.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_sub_ratio.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);

        this.btn_add_less.node.on(cc.Node.EventType.TOUCH_START, this.startDecreasing_less,  this);
        this.btn_add_less.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_add_less.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);
        this.btn_sub_less.node.on(cc.Node.EventType.TOUCH_START,  this.startIncreasing_less,  this);
        this.btn_sub_less.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_sub_less.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);

        this.btn_add_more.node.on(cc.Node.EventType.TOUCH_START, this.startDecreasing_more,  this);
        this.btn_add_more.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_add_more.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);
        this.btn_sub_more.node.on(cc.Node.EventType.TOUCH_START,  this.startIncreasing_more,  this);
        this.btn_sub_more.node.on(cc.Node.EventType.TOUCH_END,  this.stopChanging,  this);
        this.btn_sub_more.node.on(cc.Node.EventType.TOUCH_CANCEL,  this.stopChanging,  this);
    },

    setToggle: function () {
        this.toggle_ratio.ischecked = this.toggleTypeArr[1];
        this.toggle_less.ischecked = this.toggleTypeArr[2];
        this.toggle_more.ischecked = this.toggleTypeArr[3];
    },

    toggleClick: function (toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let name = toggle.node.name;
        switch (name) {
            case "toggle_ratio":
                this.toggleTypeArr[1] = toggle.ischecked;
                break;
            case "toggle_less":
                this.toggleTypeArr[2] = toggle.ischecked;
                break;
            case "toggle_more":
                this.toggleTypeArr[3] = toggle.ischecked;
                break;
            default:
                break;
        };
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_cancel.node.name:
                this.hide(false);
                break;
            case this.btn_start.node.name:
                this.hide(true);
                break;
            case this.btn_add_spin.node.name:
                this.Normaldecreasing(EnumBtnType.Spin, 1)
                break;
            case this.btn_sub_spin.node.name:
                this.Normaldecreasing(EnumBtnType.Spin, -1)
                break;       
            case this.btn_sub_ratio.node.name:
                this.Normaldecreasing(EnumBtnType.Ratio, -1)
                break;
            case this.btn_add_ratio.node.name:
                this.Normaldecreasing(EnumBtnType.Ratio, 1)
                break;
            case this.btn_add_less.node.name:
                this.Normaldecreasing(EnumBtnType.Less, 10);
                break;
            case this.btn_sub_less.node.name:
                this.Normaldecreasing(EnumBtnType.Less, -10);
                break;
            case this.btn_add_more.node.name:
                this.Normaldecreasing(EnumBtnType.More, 10);
                break;
            case this.btn_sub_more.node.name:
                this.Normaldecreasing(EnumBtnType.More, -10);
                break;
            case this.btn_close.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                return;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    timeBtnClick: function(btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let index = parseInt(btnName)
        this.typeNumArr[0] = this.timeArr[index];
        this.updateCounter();
    },

    updateCounter: function() {
        this.lab_spin.string = this.typeNumArr[0];
        this.lab_ratio.string = this.typeNumArr[1] + "X";
        this.lab_less.string = this.typeNumArr[2];
        this.lab_more.string = this.typeNumArr[3];
    },

    Normaldecreasing: function(type, num) {
        this.typeNumArr[type] = this.typeNumArr[type] + num;

        if (type == EnumBtnType.Spin) {
            if (this.typeNumArr[0] <= 5) {
                this.typeNumArr[0] = 5;
            }
            if (this.typeNumArr[0] >= 50) {
                this.typeNumArr[0] = 50;
            }
        }
        else if (type == EnumBtnType.Ratio) {
            if (this.typeNumArr[1] <= 1) {
                this.typeNumArr[1] = 1;
            }
        }
        else if (type == EnumBtnType.Less) {
            if (this.typeNumArr[2] <= 0) {
                this.typeNumArr[2] = 0;
            }
        }
        else if (type == EnumBtnType.More) {
            if (this.typeNumArr[3] <= 0) {
                this.typeNumArr[3] = 0;
            }
        }
        this.updateCounter();
    },

    startDecreasing_spin: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[0] = this.typeNumArr[0] + 1;
            if (this.typeNumArr[0] >= 50) {
                this.typeNumArr[0] = 50;
            }
            this.updateCounter();
        }, this.inTime); 
    },

    startIncreasing_spin: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[0] = this.typeNumArr[0] - 1;
            if (this.typeNumArr[0] <= 5) {
                this.typeNumArr[0] = 5;
            }
            this.updateCounter();
        }, this.inTime); 
    },

    startDecreasing_ratio: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[1] = this.typeNumArr[1] + 1;
            this.updateCounter();
        }, this.inTime); 
    },

    startIncreasing_ratio: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[1] = this.typeNumArr[1] - 1;
            if (this.typeNumArr[1] <= 1) {
                this.typeNumArr[1] = 1;
            }
            this.updateCounter();
        }, this.inTime); 
    },

    startDecreasing_less: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[2] = this.typeNumArr[2] + 10;
            this.updateCounter();
        }, this.inTime); 
    },

    startIncreasing_less: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[2] = this.typeNumArr[2] - 10;
            if (this.typeNumArr[2] <= 0) {
                this.typeNumArr[2] = 0;
            }
            this.updateCounter();
        }, this.inTime); 
    },

    startDecreasing_more: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[3] = this.typeNumArr[3] + 10;
            this.updateCounter();
        }, this.inTime); 
    },

    startIncreasing_more: function() {
        this.interval = setInterval(() => {
            this.typeNumArr[3] = this.typeNumArr[3] - 10;
            if (this.typeNumArr[3] <= 0) {
                this.typeNumArr[3] = 0;
            }
            this.updateCounter();
        }, this.inTime); 
    },


    stopChanging: function() {
        clearInterval(this.interval);
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMESETTING);
    },

    hide: function(event) {
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.SAVE_AUTOSPIN,
            msgData: {
                autoSpinTypeNumArr: this.typeNumArr,
                toggleTypeArr: this.toggleTypeArr,
                isDeal: event,
            }
        });
        this.node.destroy();
    },
});