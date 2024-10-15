cc.Class({
    extends: cc.Component,

    properties: {
        lab_btnTips: cc.Label,
    },

    onLoad: function() {
        this.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    },

    btnClickCall: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.zhuKeFuCtrl && this.zhuKeFuCtrl.clickEnumItemCall(this.enumType);
    },

    setZhuKeFuCtrl: function(zhuKeFuCtrl) {
        this.zhuKeFuCtrl = zhuKeFuCtrl;
    },

    setBtnTipsEumeType: function(enumType) {
        this.enumType = enumType;
    },

    setBtnTipsLanguageType: function(languageType) {
        this.languageType = languageType;
    },

    showBtnTipsStr: function() {
        this.lab_btnTips.string = this.zhuKeFuCtrl[this.languageType]["enum_" + this.enumType];
    },
});
