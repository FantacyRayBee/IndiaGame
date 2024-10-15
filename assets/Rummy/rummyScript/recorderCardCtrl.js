

cc.Class({
    extends: cc.Component,

    properties: {
        lab_playName: [cc.Label],
        toggs: [cc.Toggle],
        node_myCrad: cc.Node,
        lab_cradValue: cc.Node,
        node_myContent: cc.Node,
        node_rightPlayContent: cc.Node,
        node_rightPlayCrad: cc.Node,
        pab_card: cc.Prefab,
        node_cradValue: cc.Node,
        ScrollView_myCrad : cc.ScrollView,
        ScrollView_rightPlayCrad : cc.ScrollView

    },

    ctor: function () {
        this.cardArr = [];
        this.oneCrad = null;
    },



    onLoad() {
        // this.node_cradValue = this.node.getChildByName("node_cradValue");

        for (let i = 0; i < this.toggs.length; i++) {
            this.toggs[i].node.on('click', this.toggleClick, this);
        }
        this.ScrollView_myCrad.scrollToLeft(0);
        this.ScrollView_rightPlayCrad.scrollToLeft(0);
    },

    toggleClick: function (toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let loggName = toggle.node.name;
        let rightChildren = this.node_rightPlayContent.children;
        let myChildren = this.node_myContent.children;
        if(rightChildren.length>=11 ){
            this.ScrollView_rightPlayCrad.scrollToRight(0);
        }else{
            this.ScrollView_rightPlayCrad.scrollToLeft(0);
        }
        if(myChildren.length >=11 ){
            this.ScrollView_myCrad.scrollToRight(0);
        }else {
            this.ScrollView_myCrad.scrollToLeft(0);
        }
        if (loggName == 'toggle_myPlay ') {
            this.node_myContent.active = true;
            this.node_rightPlayContent.active = false;
            this.ScrollView_rightPlayCrad.node.active = false;
            this.ScrollView_myCrad.node.active = true;

        } else if (loggName == 'toggle_rightPlay') {
            this.node_myContent.active = false;
            this.node_rightPlayContent.active = true;
            this.ScrollView_rightPlayCrad.node.active = true;
            this.ScrollView_myCrad.node.active = false;
        }
    },

    setCradListInOf: function (date, bool) {
        if (bool) { this.setpalyName(true); this.cardArr = []; }
        let outs = date.outs ? date.outs : date;
        for (let i = 0; i < outs.length; i++) {
            let card = outs[i].card;
            let isShowCradSprite = outs.length - 1 == i ? true : false;
            let sourceSeat = outs[i].sourceSeat;
            let isPicked = outs[i].isPicked;
            let pab_card = cc.instantiate(this.pab_card);
            let sprite = GlobalCfg.ACT_SCENE_CTRL.getPaiSpriteFrameByValue(card)
            let cradMask = pab_card.getChildByName("cradMask")
           
            pab_card.card = card;
            pab_card.width = 48; pab_card.height = 61;
            cradMask.width = 48; cradMask.height = 61;
            pab_card.getComponent(cc.Sprite).spriteFrame = sprite;
            this.setCradMap(card, isShowCradSprite)


            let paiNumber = GlobalCfg.ACT_SCENE_CTRL.getPaiNum(card);
            if (paiNumber ==  GlobalCfg.ACT_SCENE_CTRL.laiNumber) {
                let lai = pab_card.getChildByName("lai")
                let img = lai.getChildByName("img")
                lai.acale = 0.35
                lai.width = 48; lai.height = 61;
                lai.active = true;
                img.active = false
            }


            if (sourceSeat == -1) {
                pab_card.setPosition(-335, 53);
                this.oneCrad = pab_card;
                this.node.addChild(pab_card);
                if (isPicked) {
                    pab_card.getChildByName("cradMask").active = true
                }
            } else if (sourceSeat == GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl.seatId) { // 自己的牌库出的牌
                pab_card.y = -30;
                this.node_myContent.addChild(pab_card);
                if (isPicked) {
                    pab_card.getChildByName("cradMask").active = true
                }
            } else {                                                     // 对家的牌库出的牌
                pab_card.y = -30;
                this.node_rightPlayContent.addChild(pab_card)
                if (isPicked) {
                    pab_card.getChildByName("cradMask").active = true
                }
            }

            this.scheduleOnce(function() {
                let rightChildren = this.node_rightPlayContent.children;
                let myChildren = this.node_myContent.children;
                if(rightChildren.length >=11 ){
                    this.ScrollView_rightPlayCrad.scrollToRight(0);
                } else{
                    this.ScrollView_myCrad.scrollToLeft(0);
                }
    
                if(myChildren.length >=11 ){
                    this.ScrollView_myCrad.scrollToRight(0);
                } else {
                    this.ScrollView_myCrad.scrollToLeft(0);
                }
            }, 0);
        }
    },

    // 判断是否有同一张牌
    isEquallyCrad: function (card) {
        let cradPosOne = -313.5;  // 第一个相同牌的初始位子
        let cradPosTwo = -288.5;  // 第二个相同牌初始的位子
        if (this.cardArr.length == 0) {
            this.cardArr.push(card)
        } else {
            for (let i = 0; i < this.cardArr.length; i++) {
                let cradNun = this.cardArr[i];
                if (cradNun == card) {
                    return cradPosOne
                }
            }
            this.cardArr.push(card)
            return cradPosTwo
        }
    },

    // 设置记牌器的玩家名字
    setpalyName: function (bool) {
        this.node_cradValue.destroyAllChildren()
        this.node_myContent.destroyAllChildren()
        this.node_rightPlayContent.destroyAllChildren()
        this.lab_playName[0].string = "Me";
        this.lab_playName[1].string = "Me";
        this.lab_playName[2].string = GlobalCfg.ACT_SCENE_CTRL.otherUserCtrl.nickname;
        this.lab_playName[3].string = GlobalCfg.ACT_SCENE_CTRL.otherUserCtrl.nickname;
        if(bool){
            this.toggs[0].isChecked = true;
            this.node_myContent.active = true;
            this.node_rightPlayContent.active = false;
            this.ScrollView_rightPlayCrad.node.active = false;
            this.ScrollView_myCrad.node.active = true;

        }
    },



    // 设置牌的地图
    setCradMap: function (card, isShowCradSprite) {
        let colorY; let colorX
        let strCrad = ''
        let cradPos = this.isEquallyCrad(card);
        let cradSpacing = 50;     // 两个牌之间的间距
        let cradValue = GlobalCfg.ACT_SCENE_CTRL.getPaiNum(card);   // 牌的值
        let cradColor = GlobalCfg.ACT_SCENE_CTRL.getPaiType(card);  // 牌的花色



        if (cradColor == "fangkuai") {
            colorY = -88.5;  // 方块横坐标
        } else if (cradColor == "meihua") {
            colorY = -62.5;    // 梅花横坐标
        } else if (cradColor == "hongxin") {
            colorY = -37.5;   // 红桃横坐标
        } else if (cradColor == "heitao") {
            colorY = -13.5;     // 黑桃横坐标
        }

        if (cradValue == 0) {
            strCrad = 'A'
        } else if (cradValue == 10) {
            strCrad = 'J'
        } else if (cradValue == 11) {
            strCrad = 'Q'
        } else if (cradValue == 12) {
            strCrad = 'K'
        } else {
            strCrad = cradValue + 1;
        }
        colorX = cradPos + (cradSpacing * (cradValue))


        let lab_cradValue = cc.instantiate(this.lab_cradValue);
        let sprite_crad = lab_cradValue.getChildByName("sprite_crad");
        let lab_cradNun = lab_cradValue.getChildByName("lab_cradNun");
        let str = lab_cradNun.getComponent(cc.Label);
        str.string = strCrad;

        if (isShowCradSprite) {
            sprite_crad.active = true;
            str.node.color = new cc.Color(255, 255, 255);
        } else {
            sprite_crad.active = false;
            str.node.color = new cc.Color(54, 114, 205);
        }

        lab_cradValue.setPosition(colorX, colorY);
        this.node_cradValue.addChild(lab_cradValue)
    },

    //自己出牌需要重置牌库的颜色和添加
    resetLabelCoior: function (notify) {
        let card = notify.card;
        let seat = notify.seat;
        let children = this.node_cradValue.children;
        for (var i = 0; i < children.length; ++i) {
            let node = children[i]
            let str = node.getChildByName("lab_cradNun").getComponent(cc.Label);
            let sprite_crad = node.getChildByName("sprite_crad");
            sprite_crad.active = false;
            str.node.color = new cc.Color(54, 114, 205);
        }
    },

    // 玩家出牌
    playOutCrad: function (notify) {
        let seat = notify.seat;
        let card = notify.card;
        let outs = {
            card: card,
            sourceSeat: seat,
            isPicked: false
        }
        this.resetLabelCoior(notify)
        this.setCradListInOf([outs], false)
        if(this.oneCrad && this.oneCrad.card == card){
            let cradMask = this.oneCrad.getChildByName("cradMask") 
            cradMask.active = false;
        }
    },

    // 玩家起牌    play 1 对家
    playTouchCrad: function (notify,play) {
        let side = notify.side     // 起牌方位 0左1右
        let card = notify.card

        if(side == 1) {    // 玩家起手对家打的牌 要从牌库中的文字去除
            if(this.oneCrad && this.oneCrad.card == card){
                let cradMask = this.oneCrad.getChildByName("cradMask") 
                cradMask.active = true;
            }

            let children = this.node_cradValue.children;
            if (children.length > 0) {
                if(children.length == 1){
                    let node_crad = children[children.length - 1]
                    node_crad.destroy()
                    return
                }
                let node_crad = children[children.length - 1]
                node_crad.destroy()
                let node_crad2 = children[children.length - 2]
                let sprite_crad = node_crad2.getChildByName("sprite_crad");
                sprite_crad.active = true;
                let str = node_crad2.getChildByName("lab_cradNun").getComponent(cc.Label);
                str.node.color = new cc.Color(255, 255, 255);
            }

            // 玩家起手对家打的牌 要从牌库中的牌变黑
            let rightChildren = this.node_rightPlayContent.children;
            let myChildren = this.node_myContent.children;

            if(rightChildren.length > 0 ){
                for (let i = rightChildren.length -1; i >=0; i--) {
                   let node = rightChildren[i]
                   if(node.card == card){
                    let cradMask = node.getChildByName("cradMask") 
                    cradMask.active = true;
                    break
                   } 
                }
            }

            if(myChildren.length > 0 ){
                for (let i = myChildren.length -1; i >=0; i--) {
                   let node = myChildren[i]
                   if(node.card == card){
                    let cradMask = node.getChildByName("cradMask") 
                    cradMask.active = true;
                    break
                   } 
                }
            }
        } 
    },



    start() {

    },

    // update (dt) {},
});
