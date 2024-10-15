

cc.Class({
    extends: cc.Component,

    /**
     * 翻牌动画
     * @param {牌权} paiValueArr 
     */
    cradAct:function (paiValueArr=null,fun,isFlip=null) {
        let self = GlobalCfg.ACT_SCENE_CTRL;
        let arr = [2,1,0,5,4,3];
        let timeArr = [0.1,0.2,0.3,0.1,0.2,0.3];
        let arr01 = self.node_CradBlue.children;
        let arr02 = self.node_CradRed.children;
        let newArr = arr01.concat(arr02);
        for (let i = 0; i < arr.length; i++) {
            let crad = newArr[arr[i]];
            crad.scale = 0.58;
            if(isFlip) {
                this.setCradValue(""+paiValueArr[i],crad);
                if(fun) fun()
            } else {
                cc.tween(crad) 
                .delay(timeArr[i]) 
                .to(0.2, { scaleX:0})
                .call(() => {  
                    this.setCradValue(""+paiValueArr[i],crad);
                    if(i == 5 && fun) {
                        fun()
                    }
                })
                .to(0.2,{ scaleX:0.58})
                .start(); 
            }
        }
    },

    /**
     * 设置牌值
     * @param {根据牌权来设置牌的精灵} paiValue 
     * @param {牌的节点} node 
     */
    setCradValue:function(paiValue=null , node=null){
        let self = GlobalCfg.ACT_SCENE_CTRL;
        if(paiValue) {
            node.getComponent(cc.Sprite).spriteFrame = self.pokseAtlas.getSpriteFrame(paiValue);
        } else {
            let arr01 = self.node_CradBlue.children;
            let arr02 = self.node_CradRed.children;
            let newArr = arr01.concat(arr02);
            for (let i = 0; i < newArr.length; i++) {
                let crad = newArr[i];
                crad.scale = 0.58;
                crad.getComponent(cc.Sprite).spriteFrame = self.pokseBei;
            }
        }

    },

    /**
     * 展示牌类型的动画
     * @param {牌的类型} side 
     * @param {红或蓝胜利} winBlueRed 
     */
    playCradAct:function(side,winBlueRed) { 
        let self = GlobalCfg.ACT_SCENE_CTRL;
        let cradDefaultSkinArr = [ "set","pureseq","sequence","color", "pair","highcard"];
        let node =  winBlueRed==6 ? self.node_blue : self.node_red;
        node.active = true;
        let ske = node.getChildByName("paixing_zi").getComponent(sp.Skeleton);;
        let skinName = cradDefaultSkinArr[side];
        ske.setSkin(skinName);
        ske.setAnimation(1, "chuxian", false);
    },

    /**
     * 初始化牌的动画
     */
    inOfCradAim:function() {
        let self = GlobalCfg.ACT_SCENE_CTRL;
        if(self.node) {
            if(self.node_blue && self.node_blue.active) self.node_blue.active = false;
            if(self.node_red && self.node_red.active) self.node_red.active = false;
        }
    },



});
