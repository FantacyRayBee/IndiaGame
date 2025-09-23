
cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Button,
        btn_collect: cc.Button,
        btn_withdraw: cc.Button,
        node_info: cc.Node,
        node_bottom: cc.Node,
        node_showpai: cc.Node,
        node_paiArrs: [cc.Node],
        skel_hand_showpai: cc.Node,

        lab_endTime: cc.Label,
        lab_remind: cc.Label,
        lab_totalNum: cc.Label,
        lab_round: cc.Label,
        lab_curRound: cc.Label,
        lab_taskDesc: cc.Label,
        lab_taskTime: cc.Label,
        lab_progress: cc.Label,
        lab_lucky: cc.Label,

        node_task_reward1: cc.Node,
        node_task_reward2: cc.Node,
        node_hand: cc.Node,

        progressbar: cc.ProgressBar,

        skel_light: sp.Skeleton,
        skel_hand: sp.Skeleton,
        skel_lucky: sp.Skeleton,
        content: cc.Node,
        item: cc.Node,
    },

    onLoad () {
        // this.taskCfg = {
        //     [1]: {taskName: 'Play 3 games of TeenPatti', reward: 4500, status: 1, pais: [], jump: 'TeenPatti'},
        //     [2]: {taskName: 'Play 7 games of TeenPatti', reward: 4800, status: 1, pais: [], jump: 'TeenPatti'},
        //     [3]: {taskName: 'Play 10 games of TeenPatti', reward: 4900, status: 1, pais: [], jump: 'TeenPatti'},
        //     [4]: {taskName: 'Play 10 games of Fruit Party', reward: 4990, status: 2, pais: [100,200,90,50], jump: 'Fruit'},
        //     [5]: {taskName: 'Play 10 games of Dragon VS Tiger', reward: 4999, status: 2, pais: [10,9,10,8], jump: 'Dragon'},
        //     [6]: {taskName: 'Complete a recharge of $500', reward: 4999.9, status: 2, pais: [0.1,0.9,0.5,1], jump: 'shop'},
        //     [7]: {taskName: 'Check the account is correct and complete a withdrawal', reward: 4999.99, status: 2, pais: [0.1,0.09,0.1,0.09], jump: 'withdraw'},
        //     [8]: {taskName: 'Total recharge $50000', reward: 5000, status: 1, pais: [], jump: 'shop'},
        // }

        this.progressArr = [0,0.90,0.91,0.92,0.94,0.95,0.96,0.99];
        this.paiInitPosXArr = [-250, -84, 85, 250]
        this.switchInterval = 180, // 切换间隔时间(秒)
        this.fadeDuration = 1,    // 淡入淡出动画时长(秒)
        this.currentIndex = 0;    // 当前显示的索引
        this.isClickPai = false; //是否点击了牌
        this.setRandomData();
        this.initNode(); //初始化节点
    },

    start() {
        this.jumpId = "TeenPatti";
        this.startAutoSwitch();
        this.startCountdown(GlobalCfg.USER_DATAS.inducement.end_time)
        this.refreshData();
    },

    initNode: function () {
        this.btnClose.node.on('click', this.debounce(this.btnClick, 1), this);
        this.btn_collect.node.on('click', this.debounce(this.btnClick, 3), this);
        this.btn_withdraw.node.on('click', this.debounce(this.btnClick, 3), this);

        for (let i = 0; i < 4; i++) {
            this.node_paiArrs[i].getChildByName(""+i).on('click', this.debounce(this.paiClick, 1), this);
        }
    },


    refreshData: function (isShowNextRoundAnim = false) {
        let data = GlobalCfg.USER_DATAS.inducement;
        let curRound = data.task_info.rounds;
        let info = GlobalCfg.INDUCEMENT_INFO
        let allNumber = GlobalCfg.INDUCEMENT_INFO[8].reward;

        if (curRound <= 8) {
            this.btn_withdraw.interactable = false;
            this.progressbar.progress = this.progressArr[curRound - 1];
            this.lab_round.string = `${curRound}/8`
            this.lab_curRound.string = curRound
            this.lab_taskDesc.string = `${info[curRound].taskName}`
            if (data.task_info.all_completions_num > 100) { //大于100 说明是充值任务，金额需要除以100
                this.lab_taskTime.string =`${(data.task_info.completions_num/100)}/${(data.task_info.all_completions_num/100)}`
            }
            else{
                this.lab_taskTime.string =`${data.task_info.completions_num}/${data.task_info.all_completions_num}`
            }
            this.node_task_reward1.active = info[curRound].status == 1
            this.node_task_reward2.active = info[curRound].status == 2
            this.isCollect = data.task_info.completions_num >= data.task_info.all_completions_num

            let IsShowInducementHand = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_IsShowInducementHand`);
            let needShow = false;
            if (!IsShowInducementHand) { //缓存里没有 说明是第一次，需要有手指引导
                needShow = true;
                cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_IsShowInducementHand`, 1);
            }
            this.node_hand.active = this.isCollect || needShow;
            this.jumpId = info[curRound].jump;
            if (curRound == 1) {
                this.lab_remind.string = `Only need $${allNumber} to withdraw $${allNumber}`;
                let canGetReward = info[curRound].reward
                this.lab_totalNum.string = "$0";
                this.lab_progress.string = `0/${allNumber}`
                let decimals = this.countDecimals(canGetReward);
                this.node_task_reward1.getComponent(cc.Label).string = "$" + canGetReward.toFixed(decimals > 2 ? 2 : decimals);
            }
            else{
                if (isShowNextRoundAnim) { //需要播放金币滚动动画
                    if (curRound <= 2) {
                        this.runChangeTotalNum(this.lab_totalNum, 0, info[1].reward, 0.5)
                    }
                    else {
                        this.runChangeTotalNum(this.lab_totalNum, info[curRound - 2].reward, info[curRound - 1].reward, 0.5)
                    }
                }
                else {
                    this.lab_totalNum.string = "$" + info[curRound - 1].reward;
                }
                let remind = (allNumber - info[curRound - 1].reward);
                
                this.lab_remind.string = `Only need $${parseFloat(remind.toFixed(2))} to withdraw $${allNumber}`;
                this.lab_progress.string = `${info[curRound - 1].reward}/${allNumber}`

                let canGetReward = info[curRound].reward - info[curRound - 1].reward
                this.node_task_reward1.getComponent(cc.Label).string = "$" + parseFloat(canGetReward.toFixed(2));
            }
        }
        else{ //已经达到最大轮次 能够领取最终大奖
            this.btn_collect.interactable = false;
            this.btn_withdraw.interactable = true;
            this.lab_round.string = `8/8`;
            this.lab_curRound.string = 8;
            this.lab_taskDesc.string = `${info[8].taskName}`;
            this.lab_taskTime.string =`50000/50000`;
            this.lab_remind.string = ``;
            // this.lab_remind.string = `Only need $0 to withdraw $5000`;
            this.lab_progress.string = `${allNumber}/${allNumber}`;
            this.node_task_reward1.active = false;
            this.node_task_reward2.active = false;
            this.lab_totalNum.string = `$${allNumber}`;
            this.progressbar.progress = 1;
            this.node_hand.active = false;
        }
    },

    showNextRoundAnim: function() {
        this.node_info.active = true;
        this.node_bottom.active = true;
        this.skel_lucky.node.active = false;
        this.skel_light.node.active = false;

        this.skel_light.node.active = true;
        this.skel_light.setAnimation(0, "skill", false);

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: 'inducement_click', msgData: {}});
    },

    debounce: function(action, delayTime) {  
        if (!delayTime) {
            return action;
        }
        let fn = function() { 
            let btnNode = arguments[0].node;
            if (!btnNode.timeOut) {
                action.apply(this, arguments);
                btnNode.timeOut = setTimeout(function() { 
                    if (btnNode) {
                        clearTimeout(btnNode.timeOut);
                        btnNode.timeOut = null;
                    }; 
                }, delayTime * 1000);  
            }
        };
        return fn;
    }, 
    
    // 启动倒计时
    startCountdown(expireTimestamp) {
        // 先立即更新一次显示
        this.updateCountdownDisplay(expireTimestamp);

        // 每秒更新一次
        this.countdownInterval = setInterval(() => {
            this.updateCountdownDisplay(expireTimestamp);
        }, 1000);
    },

    // 更新倒计时显示
    updateCountdownDisplay(expireTimestamp) {
        const remainingMs = Math.max(0, expireTimestamp - Date.now());
        this.lab_endTime.string = "End After: " +  CommonFun.getInstance().formatToHMS(remainingMs);
        // 倒计时结束时的处理
        if (remainingMs <= 0) {
            this.node.destroy();
        }
    },

    btnClick(button) {
        let btnName = button.node.name;
        if(btnName == "btnClose"){
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_withdraw") {
            this.dealWithdraw();
        }
        else if (btnName == "btn_collect") {
            this.dealCollect();
        }
    },

    paiClick(button) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = button.node.name;
        let self = this;
        let data = GlobalCfg.USER_DATAS.inducement;
        let curRound = data.task_info.rounds;
        let info = GlobalCfg.INDUCEMENT_INFO
        this.isClickPai = true;
        let paiIndex = 0;
        let tmpPais = [];
        for (let i = 0; i < 4; i++) {
            if (i != info[curRound].paiIndex) {
                tmpPais.push(i);
            }
        }
        for (let i = 0; i < 4; i++) {
            this.node_paiArrs[i].getChildByName(""+i).getComponent(cc.Button).interactable = false;
            let label = this.node_paiArrs[i].getChildByName(""+i).getChildByName("detail").getChildByName("price").getComponent(cc.Label)
            if (i == parseInt(btnName)) { //即将翻开的这张牌 使用inducement_info里的index
                label.string = "$" + info[curRound].pais[info[curRound].paiIndex];
            }
            else{ //其他三张牌 使用paiIndex以外的值
                label.string = "$" + info[curRound].pais[tmpPais[paiIndex]];
                paiIndex++;
            }
        }
        //领奖
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/RechargeInducement/ReceiveReward";
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            if (msg.result == 0) {
                GlobalCfg.USER_DATAS.inducement.task_info = msg.data.task_info;
                self.actPai(button, true, 1.1, ()=>{
                    self.showLucky()
                })
                self.scheduleOnce(() => {
                    for (let i = 0; i < 4; i++) {
                        if (i != parseInt(btnName)) { //1.5秒后 将其他三张牌也翻面朝上
                            let button1 = self.node_paiArrs[i].getChildByName(""+i).getComponent(cc.Button)
                            self.actPai(button1, true, 1)
                        }
                    }
                }, 1.5);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    actPai(button, isFanZheng, _scale,  callback){
        let scale = _scale //isFanZheng ? 1.1 : 1;
        cc.tween(button.node)
        .tag(1)
        .delay(0.2)
        .to(0.25, { scaleX:0})
        .call(() => {
            button.node.getChildByName("back").active = !isFanZheng;
            button.node.getChildByName("detail").active = isFanZheng; 
        })
        .to(0.25,{ scaleX:scale, scaleY:scale})
        .start()

        if (callback) {
            this.scheduleOnce(() => {
                callback();
            }, 5.5);
        }
    },

    //生成随机数据 测试用
    setRandomData:function(){
        let num = 5
        let userList = [];
        for (let i = 0; i < num; i++) {
            let tmpList = [];
            for (let index = 0; index < 4; index++) {
                let userId = Math.floor(Math.random() * 900000) + 100000; // 1 到 300
                tmpList.push(userId);
            }
            userList.push(tmpList);
        }
        this.userList = userList
        LoggerUtil.getInstance().log("setRandomData: ", this.userList);
    },

    // 开始自动轮播
    startAutoSwitch() {
        // 先停止可能的已有计时器
        this.stopAutoSwitch();
        this.updateContent();
        // 设置定时器
        this.switchTimer = setInterval(() => {
            this.switchToNextItem();
        }, this.switchInterval * 1000);
    },

    // 停止自动轮播
    stopAutoSwitch() {
        if (this.switchTimer) {
            clearInterval(this.switchTimer);
            this.switchTimer = null;
        }
    },

    setItem:function(node, infos){
        let descs = {};
        let allNumber = GlobalCfg.INDUCEMENT_INFO[8].reward;
        for (let i = 1; i < 5; i++) {
            descs[i] = node.getChildByName("" + i).getChildByName("desc").getComponent(cc.RichText);
            descs[i].string = "User" + infos[i - 1] +` Withdraw <color=#F9D95A>$${allNumber}</color>`;
        };
    },
    
    // 切换到下一个项目
    switchToNextItem() {
        if (!this.userList || this.userList.length === 0) return;
        // 计算下一个索引
        this.currentIndex = (this.currentIndex + 1) % this.userList.length;
        // 执行渐隐动画
        cc.tween(this.content)
            .to(this.fadeDuration / 2, { opacity: 0 })
            .call(() => {
                // 更新内容
                this.updateContent();
                // 执行渐显动画
                cc.tween(this.content)
                    .to(this.fadeDuration / 2, { opacity: 255 })
                    .start();
            })
            .start();
    },

    // 更新内容显示
    updateContent() {
        // 获取当前要显示的数据
        const currentData = this.userList[this.currentIndex];
        this.setItem(this.item, currentData);
    },

    dealCollect() {
        let data = GlobalCfg.USER_DATAS.inducement;
        let curRound = data.task_info.rounds;
        if (this.isCollect) {
            let self = this;
            if (GlobalCfg.INDUCEMENT_INFO[curRound].status == 2) { //2为跳转至翻牌动画
                this.showPaiAnim();
            }
            else {
                //领奖
                let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/RechargeInducement/ReceiveReward";
                CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
                    if (msg.result == 0) {
                        GlobalCfg.USER_DATAS.inducement.task_info = msg.data.task_info;
                        self.scheduleOnce(() => {
                            self.showNextRoundAnim();
                            self.refreshData(true);
                        }, 0.5);
                    }
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            }
        }
        else{
            if (curRound == 6) {
                GlobalCfg.SELECT_RECHARGE_ACOUNT = data.task_info.all_completions_num;
            }
            //跳转
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: 'inducement_click', msgData: {jump:this.jumpId}});
            this.node.destroy();
        }
    },

    dealWithdraw() {
        //领奖
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/RechargeInducement/ReceiveRewardCoin";
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            if (msg.result == 0) {
                CommonFun.getInstance().showRewardsTips([{ id: 10, amount: msg.data.coin / 100 }]);
                this.node.destroy();
                let httpUrl2 = GlobalCfg.HTTP_SERVER + "/v1/RechargeInducement/GetInfo";
                CommonFun.getInstance().httpPost(httpUrl2, {}, (msg) => {
                    if (msg.result == 0) {
                        GlobalCfg.USER_DATAS.inducement = msg.data;
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: 'inducement_click', msgData: {}});
                    }
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    //展示牌动画
    showPaiAnim() {
        this.node_bottom.active = false;
        this.node_showpai.active = true;
        let self = this;
        let data = GlobalCfg.USER_DATAS.inducement;
        let curRound = data.task_info.rounds;
        this.initPais();
        for (let i = 0; i < 4; i++) {
            this.node_paiArrs[i].getChildByName(""+i).getComponent(cc.Button).interactable = false;
        }
        // 停顿1秒后散开
        this.scheduleOnce(() => {
            for (let i = 0; i < 4; i++) {
                self.actPai(self.node_paiArrs[i].getChildByName(""+i).getComponent(cc.Button), false, 1)
            }
            self.scheduleOnce(() => {
                //合并动画：4张牌向中心移动
                for (let i = 0; i < 4; i++) {
                    cc.tween(self.node_paiArrs[i])
                    .to(0.3, { 
                        position: cc.v2(0, 0),
                        scale: 0.8  // 可选：缩小牌表示堆叠
                    })
                    .start();
                }
                // 停顿1秒后散开
                self.scheduleOnce(() => {
                    for (let i = 0; i < 4; i++) {
                        cc.tween(self.node_paiArrs[i])
                        .to(0.3, {
                            position: cc.v2(self.paiInitPosXArr[i], 0),
                            scale: 1  // 恢复原始大小
                        }).call(() => {
                            for (let i = 0; i < 4; i++) {
                                this.node_paiArrs[i].getChildByName(""+i).getComponent(cc.Button).interactable = true;
                            }
                            if (curRound == 4) { //如果第一次碰到翻牌问题，2秒没有操作需要引导他去点击
                                self.scheduleOnce(()=>{
                                    if (this.isClickPai == false)
                                        this.skel_hand_showpai.active = true;
                                },2)
                            }
                        })
                        .start();
                    }
                }, 1);
            }, 1);
        }, 1.5);
    },

    initPais() {
        let data = GlobalCfg.USER_DATAS.inducement;
        let curRound = data.task_info.rounds;
        let info = GlobalCfg.INDUCEMENT_INFO
        this.isClickPai = false;
        for (let i = 0; i < 4; i++) {
            this.node_paiArrs[i].position = cc.v2(this.paiInitPosXArr[i], 0);
            this.node_paiArrs[i].getChildByName(""+i).scale = 1; // 恢复原始大小
            this.node_paiArrs[i].getChildByName(""+i).getChildByName("back").active = false;
            this.node_paiArrs[i].getChildByName(""+i).getChildByName("detail").active = true;
            this.node_paiArrs[i].getChildByName(""+i).getChildByName("detail").getChildByName("price").getComponent(cc.Label).string = "$" + info[curRound].pais[i];
        }
    },

    showLucky() {
        let data = GlobalCfg.USER_DATAS.inducement;
        let curRound = data.task_info.rounds - 1;//因为到这一步的时候 已经获取到最新的数据 需要要减一

        this.node_info.active = false;
        this.node_bottom.active = false;
        this.node_showpai.active = false;
        this.skel_lucky.node.active = true;
        this.skel_lucky.setAnimation(0, "skill", false);
        this.lab_lucky.string = GlobalCfg.INDUCEMENT_INFO[curRound].tips 

        this.scheduleOnce(() => {
            this.showNextRoundAnim();
            this.refreshData(true);
        }, 4);
    },

    // 判断数值有多少位小数
    countDecimals:function(value){
        if (Number.isInteger(value)) return 0;  // 如果是整数返回0
        // 转换成字符串后计算小数位数
        const str = value.toString();
        if (str.indexOf('.') !== -1) {
            return str.split('.')[1].length;
        }
        return 0;
    }, 

    /**
     * 分数变化动画
     * @param {Number} startValue 开始分数
     * @param {Number} endValue 结束分数
     * @param {*} time 动画时间
     */
    runChangeTotalNum: function(label, startValue, endValue, time) {
        if (startValue == 0 && endValue == 0) {
            return;
        }
        let obj = {};
        obj.currentValue = startValue;

        // 获取起始值和结束值中最大的小数位数
        const startDecimals = this.countDecimals(startValue);
        const endDecimals = this.countDecimals(endValue);
        const maxDecimals = Math.max(startDecimals, endDecimals);
        cc.tween(obj)
        .to(time, { currentValue: endValue }, {
            onUpdate: (target, ratio) => {
                const value = startValue + (endValue - startValue) * ratio;
                // 根据最大小数位数格式化显示
                if (maxDecimals === 0) {
                    label.string = Math.floor(value).toString();
                } else {
                    label.string = value.toFixed(maxDecimals > 2 ? 2 : maxDecimals); // 最多保留2位小数
                }
            }
        }).start();
    },

    onDestroy() {
        this.stopAutoSwitch();
        clearInterval(this.countdownInterval);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.INDUCEMENT);
    },

});