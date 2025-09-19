cc.Class({
    extends: cc.Component,

    properties: {
        sprite_face: cc.Sprite
    },

    ctor: function() {
        this.itemData = {};
        this.face_spriteFrame = null;
    },

    onDestroy: function() {
        if (this.face_spriteFrame) {
            this.face_spriteFrame.decRef();
            this.face_spriteFrame = null;
        };
    },

    onLoad: function() {
        this.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this); 
    },

    btnClick: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_FACE_CLICK_ITEM, msgData: {itemData: this.itemData}});
    },

    setFaceItemFaceName(faceName) {
        faceName = faceName >= 10 ? "emotion_0" + faceName : "emotion_00" + faceName;
        this.itemData.name = faceName;
        ResourcesBundle.load(`NewPlan/GameWordInteraction/face/${faceName}`, cc.SpriteFrame, (err, spriteFrame) => {
            if (!err) {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    spriteFrame.addRef();
                    this.face_spriteFrame = spriteFrame;
                    this.sprite_face.spriteFrame = spriteFrame;
                }
                else {
                    spriteFrame.addRef();
                    spriteFrame.decRef();
                    spriteFrame = null;
                };
            }
            else {
                LoggerUtil.getInstance().error(err);
            };
        });
    },
});
