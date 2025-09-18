
cc.Class({
    extends: cc.Component,

    /**
     * 对象排序
     * @param {*} property 
     * @returns 
     */
    compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    },


    jbfenzhu:function(infos) {
        let self = GlobalCfg.ACT_SCENE_CTRL;
        let arr = [];
        let arr_01 = [];
        if(self.node_coinAll) {
            this.coinArr = self.coinArr// self.node_coinAll.children || [];
            for (let i = this.coinArr.length-1; i >=0  ; i--) {
                let chouMa = this.coinArr[i];
                if(chouMa.name !='') arr.push(chouMa);
                if( i>0 && i%10==0 && arr.length >10) {
                    arr_01.push(arr);
                    arr = []
                }
            }
            return arr_01
        }
        return arr_01
    },


    /**
     * 创造筹码的对象池
     * @param {对象池的对象} node 
     */
    initCoinPool: function (node) {
        this.coinPool = new cc.NodePool();
        for (var i = 0; i < 500; i++) {
            let pab_coin = cc.instantiate(node);
            this.coinPool.put(pab_coin);
        }
    },


    /**
     * 从对象池请求对象筹码
     * @param {初始化对象坐标} pos 
     * @returns 
     */
    createEnemy: function (pos) {
        let self = GlobalCfg.ACT_SCENE_CTRL;
        let chouMa = null;
        if (this.coinPool.size() > 0) { 
            chouMa = this.coinPool.get();
        } else { 
            chouMa = cc.instantiate(self.pab_coin);
        }
        chouMa.active = true;
        chouMa.setPosition(pos);
        self.coinArr.push(chouMa);
        self.node_coinAll.addChild(chouMa)
        // chouMa.parent = self.node_coinAll;
        return chouMa
    },

    /**
     * 设置玩家倒计时
     * @param {时间} time 
     *  * @param {玩家是否可以下注} status 
     */
    outTime:function(time,status){
        let self = GlobalCfg.ACT_SCENE_CTRL;
        if(self.node_djs && status ==0) {
            self.node_djs.active = true
            let lab_time = self.node_djs.getChildByName("lab_time").getComponent(cc.Label);
            lab_time.string = time;
        } else {
            self.node_djs.active = false;
        }
    },

    /**
     * 计数普通玩家跟VIP玩家输赢
     * @param {所有玩家结算结果} calcResult 
     */
    calcResult:function(calcResult){
        let infos = [];
        let UserInfo = {}
        UserInfo.score = 0;
        UserInfo.pos = 7;
        for (let i = 0; i < calcResult.length; i++) {
            let date = calcResult[i];
            if( date && date.pos ) {
                let UserInfo = {}
                UserInfo.score = date.score;
                UserInfo.pos = date.pos;
                infos[date.pos] = UserInfo;
            } else{
                UserInfo.score +=  date.score;
                infos[7] = UserInfo;
            }
        }
        return infos
    },

    /**
     * 
     * @param {图像url} headUrl 
     * @param {图片尺寸大小} realWidth 
     * @param {需要跟换的图片节点} heaSprite 
     */
    loadHeadSp: function (headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    /**
     * 将对象返回对象池
     * @param {回收的对象} enemy 
     */
    onEnemyKilled: function (enemy) {
        // if(enemy) {
            enemy.destroy()
            // enemy.setPosition(0,0);
            // enemy.scale = 1;
            // enemy.active = false;
            // enemy.name = "遗留的上一局的金币";
            // this.coinPool.put(enemy);
        // } else(
        //     LoggerUtil.getInstance().log("回收对象有问题")
        // )
    },

    /**
     * 根据是否大厅来控制该预制体的图片
     * @param {显示不同的图片} winType 
     * @param {是否是大厅的历史记录} isLobby 
     */
    installWinIcon:function(winType,isLobby){
        let winIcon = null;
        // 把该预制体的图片名字存在一起
        let arr = ["icon_blue","icon_red","icon_02","icon_01"];
        let self = GlobalCfg.ACT_SCENE_CTRL;
        let pabName = isLobby ? arr[winType-6] : arr[winType-4];
        winIcon = cc.instantiate(self.winIcon);
        let node = winIcon.getChildByName(pabName);
        if(node) {
            node.active = true;
            return winIcon
        }
        return winIcon
    },

    /**
     * 进入游戏第一次需要加载桌上金币
     */
    addCion:function(pools){
        GlobalCfg.ACT_SCENE_CTRL.removeneCoinAll();
        for (let i = 0; i < pools.length; i++) {
            let side = pools[i].side;
            let all = pools[i].all;
            if(all && i !=5 ) {
                for (let i = 0; i < 30; i++) {
                    let pos = this.setCoinEndPos(side)
                    let chouma = this.createEnemy(pos);
                    chouma.name = ""+ side;
                }
            }
        }
    },

    /**
     * 游戏结束时加载赢的区域金币
     * @param {*} notify 
     */
    endGameAddCion:function(notify) {
        let winBlueRed = notify.winBlueRed;
        let winSide = notify.winSide
        let pools = notify.pools;
        GlobalCfg.ACT_SCENE_CTRL.removeneCoinAll();
        for (let i = 0; i < pools.length; i++) {
            let side = pools[i].side;

            if( side!=5 && (winBlueRed == side || winSide ==side)) {
                for (let i = 0; i < 50; i++) {
                    let pos = this.setCoinEndPos(side);
                    let chouma = this.createEnemy(pos);
                    chouma.name = side + '';
                }
            }
        }

    },

    tuCion:function() {
        let self = GlobalCfg.ACT_SCENE_CTRL
        let index = 0;
        let time = 2.2;
        for (let i = 0; i < self.infos.length; i++) {
            let date = self.infos[i];
            let score = date.score;
            let after = date.after;
            let pos = date.pos;
            if(date && score > 0) {
                self.scheduleOnce(()=>{ 
                    let chouMaArr = this.jbfenzhu(self.infos);
                    let ctrl = self.getPlayerInfoByUserId(pos);
                    if(ctrl){
                        ctrl.showPlayWinCion(after,score);
                        ctrl.playWinCoin(chouMaArr[index]);
                    }else {
                        if(pos == 7) { // 自己
                            self.noVIPPlayerCtrl.playWinCoin(chouMaArr[index]);
                            self.noVIPPlayerCtrl.showPlayWinCion(after,score);
                        }
                    }
                    index++;
                },time += 0.25);
            }
        }

        let newTime = (self.infos.length *0.25 + 2).toFixed(2)
        self.scheduleOnce(()=>{ self.playWinCoin(7) },newTime);
    },

    
    /**
     * 游戏结束后赢的区域需要闪烁
     * @param {赢的区域节点} node 
     */
    kuangBlink:function(node) {
        cc.tween(node)
        .blink(2,5)
        .call(()=>{
            node.active = false;
        })
        .start()
    },

    /**
     * 设置金币结束时的坐标
     * @param {下注区域的坐标} type 
     * @returns 
     */
     setCoinEndPos:function(type) {
        let node_y = null;
        let node_x = null;
       
        if(type == 7) {   // 红
            node_y = Math.ceil(Math.random()*90)-20;
            node_x = Math.ceil(Math.random()*350)+50;

        } else if (type == 6) {   // 蓝  -50  -400
            node_y = Math.ceil(Math.random()*90)-20;
            node_x = Math.ceil(Math.random()*-350)-50;
        
        } else if (type == 0) {    
            node_y = Math.ceil(Math.random()*-50)-130;
            node_x = Math.ceil(Math.random()*130)+310;

        } else if (type == 1) { 
            node_y = Math.ceil(Math.random()*-50)-130;
            node_x = Math.ceil(Math.random()*130)+120;

        } else if (type == 2) { 
            node_y = Math.ceil(Math.random()*-50)-130;
            node_x = Math.ceil(Math.random()*110)-50;

        } else if (type == 3) { 
            node_y = Math.ceil(Math.random()*-50)-130;
            node_x = Math.ceil(Math.random()*-130)-120;

        } else if (type == 4) { 
            node_y = Math.ceil(Math.random()*-50)-130;
            node_x = Math.ceil(Math.random()*-130)-310;
        }
        
        return cc.v2(node_x,node_y)
    },
   
});