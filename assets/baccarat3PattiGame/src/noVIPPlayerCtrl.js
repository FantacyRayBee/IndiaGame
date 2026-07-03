

cc.Class({
    extends: cc.Component,

    /**
     * 设置自己信息
     * @param {自己的信息} requester 
     */
    setMyDate:function(requester) {
        let self = GlobalCfg.ACT_SCENE_CTRL;
        if(requester) {
            self.myVipPos = requester.vipPos;
            GlobalCfg.USER_DATAS.userDiamond = requester.diamond;
            self.myPlayerId = requester.playerId;
            self.lab_myCoin.string = CommonFun.getInstance().numberToShow(requester.diamond/100);
            self.utils.loadHeadSp(requester.imgUrl,90,self.headSp);

            // if (requester.vipLevel >= 1 && requester.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
                self.sprite_vipLevelIcon.node.active = true;
                self.sprite_vipLevelIcon.spriteFrame = self.atlas_new_icon.getSpriteFrame(`vip_${requester.vip1Level}`);
            // }
            // else {
            //     self.sprite_vipLevelIcon.node.active = false;
            // };
        } else {
            LoggerUtil.getInstance().error("服务器数据错误：requester")
        }
    },

    /**
     * 设置自己的钱
     * @param {自己的钱} coin 
     */
    setMyCoin:function(coin) {
        let self = GlobalCfg.ACT_SCENE_CTRL;
        GlobalCfg.USER_DATAS.userDiamond = coin;
        self.lab_myCoin.string = CommonFun.getInstance().numberToShow(coin/100);

        let myVipPos = self.getPlayerInfoByUserId(self.myVipPos);
        if(myVipPos) {
            myVipPos.setVipCion(coin)
        } 

    },

    /**
     * 自己投注抖动
     */
    myHeadSpriteShake:function() {
        let node = GlobalCfg.ACT_SCENE_CTRL.myUser;
        cc.tween(node)
        .to(0.1, { position: cc.v2(-344,-287)})
        .to(0.1, { position: cc.v2(-344,-302)})
        .start()
    },


    /**
     * 除自己外的普通玩家下注
     * @param {普通玩家下注奖池} newArr 
     */
    noVIPPlayerAct:function(newArr) {
        let arr = this.unique(newArr);
        let btn_playerNum = GlobalCfg.ACT_SCENE_CTRL.btn_playerNum;
        for (let i = 0; i < arr.length; i++) {
            let betType = arr[i];
            for (let i = 0; i < 4; i++) {
                let pos = GlobalCfg.ACT_SCENE_CTRL.utils.setCoinEndPos(betType);
                let chouMa = GlobalCfg.ACT_SCENE_CTRL.utils.createEnemy(cc.v2(-538,-321)); 
                chouMa.name = `${betType}`
    
                cc.tween(chouMa) 
                .delay((Math.random()*0.2).toFixed(2)) 
                .to(0.3, { position: pos},{ easing: "quadIn" })
                .start(); 
            }
        }
        
        if(btn_playerNum && arr.length > 0) {
            cc.tween(btn_playerNum)
            .to(0.1, { position: cc.v2(-538,-306)})
            .to(0.1, { position: cc.v2(-538,-325)})
            .start()
        }

        GlobalCfg.ACT_SCENE_CTRL.puTongBetArr =[];
    },

    /**
     * 下注投注飞金币动作
     * @param {根据下注的类型来固定结束的坐标} betType 
     * @param {根据钱的多少来投注金币的个数} amount 
     */
    myCoinAct:function(betType,amount) {
        let index = [10,50,100,1000,2000].map(i=>i).indexOf(amount/100);
        let coins = [1,3,5,10,12][index] || 3;

        for (let i = 0; i < coins; i++) {
            let pos = GlobalCfg.ACT_SCENE_CTRL.utils.setCoinEndPos(betType);
            let chouMa = GlobalCfg.ACT_SCENE_CTRL.utils.createEnemy(cc.v2(-344,-302)); 
            chouMa.name = `${betType}`

            cc.tween(chouMa) 
            .delay((Math.random()*0.2).toFixed(2)) 
            .to(0.3, { position: pos},{ easing: "quadIn" })
            .start(); 
        }
    },

    playWinCoin:function(arr) {
        if(!arr) return;
        for (let i = arr.length-1; i >=0; i--) {
            let chouMa = arr[i];
            if(chouMa) {
                cc.tween(chouMa) 
                .delay((Math.random()/3).toFixed(2)) 
                .to(0.3, { position: cc.v2(-344,-302)},{ easing: "quadIn" })
                .call(()=>{
                    GlobalCfg.ACT_SCENE_CTRL.utils.onEnemyKilled(chouMa);
                })
                .start(); 
            } else {
                LoggerUtil.getInstance().error("错误======>>>>,chouMa",chouMa)
            }
        }
    },

     // 显示玩家赢钱的漂分
     showPlayWinCion:function(coin,score){
         let self = GlobalCfg.ACT_SCENE_CTRL;
        if(self.my_bg_js ){
            this.setMyCoin(coin);
            let scoreStr = this.getFloatNum(Number(score/100).toFixed(2));
            self.my_lab_score.string = "+" + scoreStr;
            self.my_bg_js.setPosition(0,40);  
            self.my_bg_js.active = true;
            cc.tween(self.my_bg_js)
            .to(1, { position: cc.v2(0, 90)})
            .delay(1)
            .call(() => { 
                self.my_bg_js.active = false;
                })
            .start()
        }
    },

    getFloatNum: function (num) {
        let numString = num.toString();
        if (numString.charAt(numString.length - 1) == '0') {
            numString = numString.substring(0, numString.length - 1);
            return this.getFloatNum(numString);
        } else {
            if(numString.charAt(numString.length - 1) == '.'){
                numString = numString.substring(0, numString.length - 1);
            }
            return numString;
        }
    },

    /**
     * 数组去重
     */
     unique:function(a) {
        var res = [];
        for (var i = 0, len = a.length; i < len; i++) {
        for (var j = i + 1; j < len; j++) {
            // 这一步十分巧妙
            // 如果发现相同元素
            // 则 i 自增进入下一个循环比较
            if (a[i] === a[j])
            j = ++i; //j = i = i + 1;
        }
        res.push(a[i]);
        }
        return res;
    },


});
