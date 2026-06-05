cc.Class({
    extends: cc.Component,

    properties: {
        node_state1: cc.Node,
        node_state2: cc.Node,
        btn_play: cc.Button,
        btn_collect: cc.Button,
        lab_sub: cc.Label,
        lab_winCompleted: cc.Label,
        lab_win: cc.Label,
        lab_task: cc.Label,
        lab_playTips: cc.Label,
    },

    ctor: function() {
        this.taskGameNameObj = {
            0: 'in teenpatti',
            1: 'with a Pair',
            2: 'with a High Card',
            3: 'with a Color',
            4: 'with a Sequence',
            5: 'in rummy',
            6: 'in Drogan VS Tiger',
            7: 'in 7Up 7Down',
            8: 'in Horse Racing',
            9: 'in Jhandi Munda',
            10: 'in Baccarat 3Patti',
            11: 'in Andar Bahar',
            12: 'Recharge any amount',
            13: 'in Racing Car Roulette'
        };
    },

    onLoad: function() {
        this.btn_play.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.btn_collect.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        if (btnName == "btn_play") {
            let actName = '';
            if (this.ChallengesItemTask >= 0 && this.ChallengesItemTask <= 4) {
                actName = SceneManager.getInstance().sceneType.TEENPATTI;
            }
            else if (this.ChallengesItemTask == 5) {
                actName = SceneManager.getInstance().sceneType.RUMMY;
            }
            else if (this.ChallengesItemTask == 6) {
                actName = SceneManager.getInstance().sceneType.LHD;
            }
            else if (this.ChallengesItemTask == 7) {
                actName = SceneManager.getInstance().sceneType.SEVENUPDOWN;
            }
            else if (this.ChallengesItemTask == 8) {
                actName = SceneManager.getInstance().sceneType.HORSERACE;
            }
            else if (this.ChallengesItemTask == 9) {
                actName = SceneManager.getInstance().sceneType.MUNDA;
            }
            else if (this.ChallengesItemTask == 10) {
                actName = SceneManager.getInstance().sceneType.BACCARAT;
            }
            else if (this.ChallengesItemTask == 11) {
                actName = SceneManager.getInstance().sceneType.ANDAER;
            }
            else if (this.ChallengesItemTask == 12) {
                actName = "recharge";
            }
            else if (this.ChallengesItemTask == 13) {
                actName = SceneManager.getInstance().sceneType.BENZ;
            };

            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.CHALLENGES_ACT,
                msgData: {actName: actName}
            });

            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CLOSE_VIEW, 
                msgData: {}
            });
        }
        else if (btnName == "btn_collect") {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CHALLENGES_COLLECT,
                msgData: {
                    taskIndex: this.taskIndex,
                }
            }); 
        };
    },

    setChallengesItemInfo: function(taskData, taskIndex) {
        this.taskIndex = taskIndex;

        this.ChallengesItemTask = taskData.Task; // 任务代号
        let need = taskData.Need;                // 需要完成的次数
        let award = taskData.Award;              // 奖励
        let state = taskData.State;              // 0未开启, 1开启, 2待领取, 3已领取
        let progress = taskData.Progress;        // 进度(完成次数)

        this.ChallengesItemState = state;

        if (state == 0) {
            this.lab_task.string = `TASK ${taskIndex + 1}`;
            this.node_state1.active = false;
            this.node_state2.active = true;
        }
        else {
            this.node_state1.active = true;
            this.node_state2.active = false;
        };

        if (state == 1) {
            this.btn_play.node.active = true;
            this.btn_collect.node.active = false;
        }
        else if (state == 2) {
            this.btn_play.node.active = false;
            this.btn_collect.node.active = true;
        }
        else if (state == 3) {
            this.btn_play.node.active = false;
            this.btn_collect.node.active = false;
        };

        this.lab_win.string = CommonFun.getInstance().formatCurrencyAmount(award / 100);
        this.lab_winCompleted.string = `${progress}/${need} Games won`;
        this.lab_sub.string = `Win ${need} games ${this.taskGameNameObj[this.ChallengesItemTask]}`;

        if (this.ChallengesItemTask == 12) {
            this.lab_playTips.string = 'Add Cash';
            this.lab_win.string = CommonFun.getInstance().formatCurrencyAmount(award / 100);
            this.lab_winCompleted.string = '';
            this.lab_sub.string = `${this.taskGameNameObj[this.ChallengesItemTask]}`;
        };
    },

    getChallengesItemTaskIndex: function() {
        return this.taskIndex;
    },

    setChallengesItemCollectComplete: function() {
        this.btn_play.node.active = false;
        this.btn_collect.node.active = false;
    },

    setChallengesItemOpenStatus: function() {
        this.node_state1.active = true;
        this.node_state2.active = false;
        this.btn_play.node.active = true;
        this.btn_collect.node.active = false;
    },

    getChallengesItemState: function() {
        return this.ChallengesItemState;
    }
});
