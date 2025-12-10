cc.Class({
    extends: cc.Component,

    properties: {
        lab_content: cc.Label,
        lab_btnTips: cc.Label,

        btn_close: cc.Button,
        btn_okay: cc.Button,
    },

    ctor: function() {
        this.okayCallback = null;
    },

    onLoad: function() {
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_okay.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_close.node.name:
                this.dealBtnCloseEvent();
                break;
            case this.btn_okay.node.name:
                this.dealBtnOkayEvent();
                break;
            default:
                break;
        }
    },


    dealBtnCloseEvent: function() {
        this.node.destroy();
    },


    dealBtnOkayEvent: function() {
        this.okayCallback && this.okayCallback();
        this.node.destroy();
    },

    setWithDrawTipsData: function(btnTipsType, content, callFun, fontSize, lineHeight) {
        this.lab_content.string = content;
        this.okayCallback = callFun;
        this.setBtnTipsType(btnTipsType);
        this.lab_content.lineHeight = lineHeight;
        this.lab_content.fontSize = fontSize;
    },

    setBtnTipsType: function(btnTipsType) {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        if (btnTipsType == "Okay") {
            switch (languagesType) {
                case I18NLanguagesEnum.English:
                    this.lab_btnTips.string = "Okay";
                    break;
                case I18NLanguagesEnum.Hindi:
                    this.lab_btnTips.string = "ठीक है";
                    break;
                case I18NLanguagesEnum.Urdu:
                    this.lab_btnTips.string = "ٹھیک ہے";
                    break;
                case I18NLanguagesEnum.Bengali:
                    this.lab_btnTips.string = "ঠিক আছে";
                    break;
                default:
                    this.lab_btnTips.string = "Okay";
                    break;
            };
        }
        else {
            switch (languagesType) {
                case I18NLanguagesEnum.English:
                    this.lab_btnTips.string = "Go upgrade";
                    break;
                case I18NLanguagesEnum.Hindi:
                    this.lab_btnTips.string = "अपग्रेड करें";
                    break;
                case I18NLanguagesEnum.Urdu:
                    this.lab_btnTips.string = "اپ گریڈ پر جائیں۔";
                    break;
                case I18NLanguagesEnum.Bengali:
                    this.lab_btnTips.string = "আপগ্রেড করতে যান";
                    break;
                default:
                    this.lab_btnTips.string = "Go upgrade";
                    break;
            };
        };
    },
});

