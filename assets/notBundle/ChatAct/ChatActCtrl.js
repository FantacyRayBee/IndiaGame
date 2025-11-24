

cc.Class({
    extends: cc.Component,

    properties: {
        bqAtlas: cc.SpriteAtlas,
        lab_chat: cc.Label,
    },

   
    // 发送表情  消息类型 0短语 1表情
    face: function(notify, pos) {
        let data = notify;
        let msgtype = notify.msgType;
        let msgid = data.name;

        this.emotion = this.node.getChildByName("emotion");
        this.chat_bg = this.node.getChildByName("chat_bg");

        if (msgtype == 0) {
            this.setUserPos(pos);
            this.chat_bg.active = true;
            this.lab_chat.string = msgid;

            cc.tween(this.lab_chat.node)
            .to(3, { position: cc.v2(-260, 0) })
            .call(() => {
               this.node.destroy();
            })
            .start()
        }
        else if (msgtype == 1) {
            this.emotion.setPosition(pos);
            this.emotion.active = true;
            this.emotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);

            cc.tween(this.emotion)
            .repeat(4,cc.tween().by(0.5, { position: cc.v2(0,-5) }).by(0.5, { position: cc.v2(0,5) }))
            .call(() => {
                this.node.destroy();
            })
            .start()
        }
    },

    setUserPos: function(pos) {
        let X = 0;
        let Y =  pos.y+50;
        if (pos.x > 0) {
            X = pos.x - 230;
            this.chat_bg.scaleX = -1;
            this.lab_chat.node.scaleX = -1;
        } 
        else {
            X = pos.x + 230;
            this.chat_bg.scaleX = 1;
            this.lab_chat.node.scaleX =1;
        };
        this.chat_bg.setPosition(X, Y);
    }


});
