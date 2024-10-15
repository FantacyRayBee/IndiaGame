cc.Class({
    extends: cc.Component,

    properties: {
        lab_content: cc.Label,
    },

    ctor: function() {
        this.itemData = {};
    },

    onLoad: function() {
        this.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this); 
    },

    btnClick: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_WORD_CLICK_ITEM, msgData: {itemData: this.itemData}});
    },
    
    setWordItemContent: function(word) {
        this.itemData.name = word;
        this.lab_content.string = word;
    },
});
