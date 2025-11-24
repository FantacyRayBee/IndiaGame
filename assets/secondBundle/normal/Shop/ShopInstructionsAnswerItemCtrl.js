cc.Class({
    extends: cc.Component,

    properties: {
        lab_title: cc.Label,
    },
    
    onLoad: function() {
        this.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.5), this);
    },

    btnClickCall: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.zhuKeFuCtrl && this.zhuKeFuCtrl.clickAnswerItemCall(this.enumType, this.itemIndex);
    },

    setZhuKeFuCtrl: function(zhuKeFuCtrl) {
        this.zhuKeFuCtrl = zhuKeFuCtrl;
    },

    setAnswerItemEnumType: function(enumType) {
        this.enumType = enumType;
    },

    setAnswerItemIndex: function(index) {
        this.itemIndex = index;
    },

    setAnswerLanguageType: function(languageType) {
        this.languageType = languageType;
    },

    showAnswerTitle: function() {
        this.lab_title.string = this.zhuKeFuCtrl[this.languageType]["answer_" + this.enumType][this.itemIndex];
    },
});
