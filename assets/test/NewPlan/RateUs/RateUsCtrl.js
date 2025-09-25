cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_ok: cc.Button,
        btn_1: cc.Button,
        btn_2: cc.Button,
        btn_3: cc.Button,
        btn_4: cc.Button,
        btn_5: cc.Button,
    },

    onLoad: function () {
        this.num = Number(cc.sys.localStorage.getItem("RateUsStorage"));

        this.btn_close.node.on('click', this.btnClick, this);
        this.btn_ok.node.on('click', this.btnClick, this);

        for (let i = 0; i < 5; i++) {
            this[`btn_${i + 1}`].node.on('click', this.btnClick, this);
        };

        this.btn_ok.node.active = this.num === 0;

        this.rateUs(this.num);
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        } else {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (btnName === "btn_ok") {
                cc.sys.localStorage.setItem("RateUsStorage", this.num);
                this.node.destroy();
            } else if (btnName === "btn_1") {
                this.rateUs(1);
            } else if (btnName === "btn_2") {
                this.rateUs(2);
            } else if (btnName === "btn_3") {
                this.rateUs(3);
            } else if (btnName === "btn_4") {
                this.rateUs(4);
            } else if (btnName === "btn_5") {
                this.rateUs(5);
            }
        }

    },

    rateUs: function (num) {
        this.num = num;
        this.btn_1.node.getChildByName('spr_star').active = false;
        this.btn_2.node.getChildByName('spr_star').active = false;
        this.btn_3.node.getChildByName('spr_star').active = false;
        this.btn_4.node.getChildByName('spr_star').active = false;
        this.btn_5.node.getChildByName('spr_star').active = false;
        if (this.num <= 0) {
            return;
        };
        for (let i = 0; i < num; i++) {
            this[`btn_${i + 1}`].node.getChildByName('spr_star').active = true;
        };
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.RATEUS);
    },
});