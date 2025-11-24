cc.Class({
    extends: cc.Component,

    properties: {
        lab_title: cc.Label,
        lab_date: cc.Label,
        lab_time: cc.Label,
        redDot: cc.Node,
        btn: cc.Button,
    },

    ctor() {
        this.dataContent = null;    //邮件的内容
    },

    onLoad() {
        this.btn.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    btnClick: function (button) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.redDot.active = false;
        CommonFun.getInstance().showFeedbackMail(this.dataContent);
    },

    /**
     * 设置邮件在邮箱中的显示部分
     * @param {Object} data 
     */
    setData: function (data) {
        this.dataContent = data;
        if (data.title!="") {
            this.lab_title.string = data.title;
        }
        else {
            this.lab_title.string = "Feedback Mail";
        };
        
        this.lab_date.string = this.getDateToDay(data.create_at);
        this.lab_time.string = this.getDateToMinute(data.create_at);
        this.redDot.active = this.setRedDotState(data);
    },

    /**
     * 设置红点状态，false 为未读
     * @param {Object} data 
     * @returns {Boolean} 
     */
    setRedDotState:function(data){
        //附件存在，奖励未领取
        if (Reflect.has(data,'attaches') == true && data.attaches.length > 0) {
            if (data.award_state == false) {
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
        return y + '-' + this.add0(m) + '-' + this.add0(d)
    },

    /**
     * 返回时间
     * @param {Object} data 
     * @returns String 10:02
     */
    getDateToMinute: function (data) {
        let date = new Date(data)
        var h = date.getHours();
        var mm = date.getMinutes();
        return this.add0(h) + ':' + this.add0(mm)
    },

    add0: function (m) {
        return m < 10 ? '0' + m : m
    },
});
