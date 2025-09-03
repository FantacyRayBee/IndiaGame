cc.Class({
    extends: cc.Component,

    properties: {
        lab_title: cc.Label,
        lab_time: cc.Label,
        redDot: cc.Node,
        btn: cc.Button,

        reward: cc.Node,
        bg: cc.Sprite,
        normalSp: cc.SpriteFrame,
        markSp: cc.SpriteFrame,
        unabledSp: cc.SpriteFrame,
    },

    ctor() {
        this.dataContent = null;    //邮件的内容
        this.index = -1;    //邮件的索引
    },

    onLoad() {
        this.btn.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    btnClick: function (button) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.click();
    },

    click: function () {
        if (this.dataContent.award_state == true) {
            this.redDot.active = false;
        }
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "EmailClick", msgData: { data: this.dataContent, index: this.index} });
    },

    /**
     * 设置邮件在邮箱中的显示部分
     * @param {Object} data 
     */
    setData: function (data, index) {
        this.dataContent = data;
        this.index = index;
        if (data.title!="") {
            this.lab_title.string = data.title;
        }
        else {
            this.lab_title.string = "Feedback Mail";
        };
        
        this.lab_time.string = this.getDateToDay(data.create_at)
        this.redDot.active = this.setRedDotState(data);
        this.reward.active = !data.award_state;
    },

    setClickState: function (state) {
        this.bg.spriteFrame = state ? this.markSp : this.normalSp;
        this.lab_title.node.color = !state ? new cc.Color(81, 11, 121) : new cc.Color(121, 66, 11);
        this.lab_time.node.color = !state ? new cc.Color(51, 19, 85) : new cc.Color(151, 90, 25);
    },

    /**
     * 设置红点状态，false 为未读
     * @param {Object} data 
     * @returns {Boolean} 
     */
    setRedDotState:function(data){
        //附件存在，奖励未领取
        if (data.attaches && Reflect.has(data,'attaches') == true && data.attaches.length > 0) {
            if (data.award_state == false || data.read_state == false) {
                return true
            }
            else {
                return false
            };
        }
        else{
            let state = data.state
            state == true ? state = false : state = true;
            LoggerUtil.getInstance().log("无附件，未领取",state);
            return state
        };
    },

    /**
     * 
     * @param {Object} data 
     * @returns String 2021-11-01
     */
    getDateToDay: function (data) {
        let date = new Date(data)
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        return y + '-' + this.add0(m) + '-' + this.add0(d) + " " + this.add0(h) + ':' + this.add0(mm);
    },

    add0: function (m) {
        return m < 10 ? '0' + m : m
    },
});
