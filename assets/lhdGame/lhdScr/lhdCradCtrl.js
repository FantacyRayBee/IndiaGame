cc.Class({
    extends: cc.Component,

    properties: {
        pokseAtlas: cc.SpriteAtlas,
        Sprite_crad_Right  : cc.Sprite, 
        Sprite_crad_left : cc.Sprite,
        Sprite_crad_bei : cc.SpriteFrame
        
    },
    ctor: function () {
        this.cardtype = 0;
        this.cardgrade = 0;
        this.lord = false;
        this.initCardInfo = null;
    },

    onLoad: function () {
    },
 
    // 0 ~ 51; 52, 53;获取牌的精灵资源
    setCardInfo: function (paiValue) {
        let paiType = this.getPaiType(paiValue);
        // let paiNum = this.getPaiNum(paiValue);
        let getNum = function (paiValue) {
            let paiNum = ((paiValue + 12) % 13);
            if (paiValue == 52) {
                paiNum = "d";
            } else if (paiValue == 53) {
                paiNum = "x";
            }
            return paiNum;
        }
        let paiNum = getNum(paiValue);
        if (paiNum == 0) {
            paiNum = 13;
        }
        let cardSpriteFrameName = paiType + paiNum;
        return cardSpriteFrameName;
    },

    getPaiNum: function (paiValue) {
        let paiNum = (paiValue % 13);
        if (paiValue == 52) {
            paiNum = "d";
        } else if (paiValue == 53) {
            paiNum = "x";
        }
        return paiNum;
    },

    getPaiType: function (paiValue) {
        let paiType = "";
        if (paiValue <= 12) {
            paiType = "fangkuai";
        } else if (paiValue > 12 && paiValue <= 25) {
            paiType = "meihua";
        } else if (paiValue > 25 && paiValue <= 38) {
            paiType = "hongxin";
        } else if (paiValue > 38 && paiValue <= 51) {
            paiType = "heitao";
        } else if (paiValue == 52) {
            paiType = "w_";
        } else if (paiValue == 53) {
            paiType = "w_";
        }
        return paiType;
    },

    // 游戏结束牌翻转动画
    showCradEngAct : function (cradArr) {
        let long  = this.setCardInfo(cradArr[0])
        let hu  = this.setCardInfo(cradArr[1])
        cc.tween(this.Sprite_crad_left.node)
        .to(0.1, { scale: 1.2})
        .to(0.1, { scale: 1})
        .to(0.15, { scaleX: 0})
        .call(() => { 
            this.Sprite_crad_left.spriteFrame = this.pokseAtlas.getSpriteFrame(long);
            cc.tween(this.Sprite_crad_Right.node)
            .to(0.1, { scale: 1.2})
            .to(0.1, { scale: 1})
            .to(0.15, { scaleX: 0})
            .call(() => { 
                this.Sprite_crad_Right.spriteFrame = this.pokseAtlas.getSpriteFrame(hu);
             })
             .to(0.2, { scaleX: 1})
             .delay(0.1)
             .call(() => { 
                if(GlobalCfg.ACT_SCENE_CTRL.winorlose ==1 || GlobalCfg.ACT_SCENE_CTRL.winorlose ==2) {
                    GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = true;
                } 
             })
            .start()
         })
         .to(0.2, { scaleX: 1})
         .call(() => { 
            GlobalCfg.ACT_SCENE_CTRL.endGameAim();
         })
         .delay(0.1)
         .call(() => { 
            if(GlobalCfg.ACT_SCENE_CTRL.winorlose ==0 || GlobalCfg.ACT_SCENE_CTRL.winorlose ==2) {
                GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = true;
            } 
         })
        .start()
    },

    // 游戏开始是牌出场动画
    showCradStartAct:function(callback) {
        cc.tween(this.Sprite_crad_left.node)
        .to(0.6, { position: cc.v2(0, 0)}, {easing: "quadOut"}) 
        .call(() => { 
            GlobalCfg.ACT_SCENE_CTRL.ske_huo_long.active = true;
         })
        .start()
        
        cc.tween(this.Sprite_crad_Right.node)
        .to(0.6, { position: cc.v2(0, 0)}, {easing: "quadOut"}) 
        .call(() => { 
            GlobalCfg.ACT_SCENE_CTRL.ske_huo_hu.active = true;
            if(callback){
                callback()
            }
         })
        .start()
    },

    // 初始化牌的位置
    initCardPos:function(){
        this.Sprite_crad_left.node.scale = 1;
        this.Sprite_crad_Right.node.scale = 1;
        this.Sprite_crad_left.node.setPosition(200,0);
        this.Sprite_crad_Right.node.setPosition(-200,0);
        this.Sprite_crad_left.spriteFrame = this.Sprite_crad_bei;
        this.Sprite_crad_Right.spriteFrame = this.Sprite_crad_bei;
    },




    // 进入游戏初始化牌的状态
    gameStartInItCrad:function(start,cards) {
        let leftCrad = this.node.getChildByName("node_maskCrad_left").getChildByName("back_left")
        let RightCrad = this.node.getChildByName("node_maskCrad_Right").getChildByName("back_right")
        if(start == 4) {    //结算
            // leftCrad.setPosition(200,0);
            // RightCrad.setPosition(-200,0);
            leftCrad.setPosition(0,0);
            RightCrad.setPosition(0,0);
            // if(cards){
            //     this.setCardInfo(cards[0]);
            //     this.setCardInfo(cards[1]);
            // }
        } else {
            leftCrad.setPosition(0,0);
            RightCrad.setPosition(0,0);
            GlobalCfg.ACT_SCENE_CTRL.ske_huo_hu.active = true;
            GlobalCfg.ACT_SCENE_CTRL.ske_huo_long.active = true;
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = false;
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = false;
            this.Sprite_crad_left.spriteFrame = this.Sprite_crad_bei;
            this.Sprite_crad_Right.spriteFrame = this.Sprite_crad_bei;
        }
    },

    initCard:function(cards,winorlose){
        let leftCrad = this.node.getChildByName("node_maskCrad_left").getChildByName("back_left")
        let RightCrad = this.node.getChildByName("node_maskCrad_Right").getChildByName("back_right")
        leftCrad.setPosition(0,0);
        RightCrad.setPosition(0,0);
        // this.Sprite_crad_left.node.scale = 1;
        // this.Sprite_crad_Right.node.scale = 1;
        let long  = this.setCardInfo(cards[0])
        let hu  = this.setCardInfo(cards[1])
        this.Sprite_crad_left.spriteFrame = this.pokseAtlas.getSpriteFrame(long);
        this.Sprite_crad_Right.spriteFrame = this.pokseAtlas.getSpriteFrame(hu);
        if(winorlose == 1){
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = false;
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = true;
        } else if (winorlose == 2) {
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = true;
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = false;
        }else if (winorlose == 3) {
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = true;
            GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = true;
        }
        GlobalCfg.ACT_SCENE_CTRL.ske_huo_hu.active = false;
        GlobalCfg.ACT_SCENE_CTRL.ske_huo_long.active = false;
    }

}); 
