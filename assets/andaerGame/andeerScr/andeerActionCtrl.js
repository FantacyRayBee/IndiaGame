

cc.Class({
    extends: cc.Component,

    properties: {
        pab_crad : cc.Prefab,
    },

    ctor: function () {
        this.cardPosArr = [cc.v2(-192,61), cc.v2(192,61)]   // 左右牌的位置
        this.cardPabArr = [];                               // 存放牌的数组
    },

    onLoad: function() {

    },

    faMidPosCard: function(cardValue, isTween = true) {
        let nodePos = cc.v2(0, 61);
        let cardNew = cc.instantiate(this.pab_crad);
        this.cardPabArr.push(cardNew);
        let andeerCardCtrl = cardNew.getComponent('andeerCardCtrl');
        cardNew.scale = 0;
        cardNew.setPosition(0, 215);
        this.node.addChild(cardNew);
        GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("faPai");
        if (!isTween) {
            andeerCardCtrl.setCardInfo(cardValue);
            cardNew.setPosition(nodePos);
            cardNew.scale = 0.85;
        }
        else {
            cc.tween(cardNew)
            .to(0.3, {scale: 0.85, position: nodePos, angle: -360}, {easing: "quadOut"})
            .call(() => {
                andeerCardCtrl.setCardInfo(cardValue)
            })
            .start()
        };
    },

    faLeftRightPosCard: function(cardValueArr, isTween = true, winType = null) {
        if (!Array.isArray(cardValueArr)) {
            LoggerUtil.getInstance().error("设置左右牌时, 牌值错误!");
            return;
        };

        if (isTween) {
            console.time("faLeftRightPosCard");
            let index = 0;
            let repeat = cardValueArr.length;
            this.schedule(() => {
                let cardnew = cc.instantiate(this.pab_crad);
                this.cardPabArr.push(cardnew);
                let andeerCardCtrl = cardnew.getComponent('andeerCardCtrl');
                cardnew.scale = 0;
                cardnew.setPosition(0, 215);
                let nodePos = this.cardPosArr[index % 2];
                this.node.addChild(cardnew)
                GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("faPai");
                cc.tween(cardnew)
                    .to(0.3, {scale: 0.85, position: nodePos, angle: -360}, {easing: "quadOut"})
                    .call(() => {
                        andeerCardCtrl.setCardInfo(cardValueArr[index])
                        index++;
                        if(index == repeat){
                            if(winType == "A" || winType == "B"){
                                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                                    msgCode: "AndarDealingCardsEnd",
                                    msgData: {winType: winType}
                                });
                            }
                            console.timeEnd("faLeftRightPosCard");
                        }
                    })
                    .start()
            }, 0.5, repeat - 1, 0);
        }
        else {
            for (let i = 0, len = cardValueArr.length; i < len; i++) {
                let cardValue = cardValueArr[i];
                let cardNew = cc.instantiate(this.pab_crad);
                this.cardPabArr.push(cardNew);
                let andeerCardCtrl = cardNew.getComponent('andeerCardCtrl');
                andeerCardCtrl.setCardInfo(cardValue)
                cardNew.scale = 0.85;
                cardNew.setPosition(this.cardPosArr[i%2]);
                this.node.addChild(cardNew)
            };
        }
    },

    deleteAllCard: function() {
        this.unscheduleAllCallbacks();
        for (let i = 0, len = this.cardPabArr.length; i < len; i++) {
            let cardNode = this.cardPabArr[i];
            cardNode && cardNode.destroy();
        };

        this.cardPabArr = [];
    },
});
