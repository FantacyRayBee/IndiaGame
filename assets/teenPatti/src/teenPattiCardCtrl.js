/*
 * @Author: 李康
 * @Date: 2021-11-30 21:59:03
 * @LastEditTime: 2021-12-21 11:24:17
 * @LastEditors: Please set LastEditors
 * @FilePath: \rummy_zjh\assets\teenPatti\src\teenPattiCardCtrl.js
 */


cc.Class({
    extends: cc.Component,

    properties: {},

    setTeenPattiCardRoomCtrl: function(roomCtrl) {
        this.roomCtrl = roomCtrl;
    },


    setTeenPattiCardSprite: function(cardValue) {
        let cardSprite = this.node.getComponent(cc.Sprite);
        let cardSpriteFrame = this.roomCtrl.spritAtlas_card.getSpriteFrame(cardValue);
        cardSprite.spriteFrame = cardSpriteFrame;
    },

    setTeenPattiCardScale: function(scale) {
        this.cardScale = scale;
        this.node.scale = scale;
    },

    setTeenPattiCardPosition: function(pos) {
        if (!pos) {
            return;
        };
        this.node.setPosition(pos);
    },

    playTeenPattiCardRollingOverAnima: function(cardValue) {
        let self = this;
        cc.tween(self.node)
        .to(0.08, {scaleX: 0})
        .call(() => {  
            self.setTeenPattiCardSprite(cardValue);
        })
        .to(0.08, {scaleX: self.cardScale})
        .start()
    },

    setTeenPattiCardGrayEffect: function() {
        let button = this.node.getComponent(cc.Button);
        button.interactable = false;
        button.enableAutoGrayEffect = true;
    },

    clearTeenPattiCardGrayEffect: function() {
        let button = this.node.getComponent(cc.Button);
        button.interactable = true;
        button.enableAutoGrayEffect = false;
    },
});
