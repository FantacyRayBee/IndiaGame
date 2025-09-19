cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_send: cc.Button,
        editbox: cc.EditBox,
        lab_strCount: cc.Label,
    },

    ctor: function() {
        this.count = 0;
        this.lab_content = null;
    },

    onLoad: function() {
        this.btn_close.node.on('click', this.btnClick, this);
        this.btn_send.node.on('click', this.btnClick, this); 
        this.editbox.node.on('editing-did-began', this.editEventBeginListen, this);
        this.editbox.node.on('editing-did-ended', this.editEventEndListen, this);
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FASTFEEDBACK);
    },


    btnClick: function(button) {
        let btnName = button.node.name;
        if (btnName == 'btn_close') {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == 'btn_send') {
            if (this.count > 0) {
                let url = GlobalCfg.HTTP_SERVER + "/v1/help/feedback";
                CommonFun.getInstance().httpPost(url, { content: this.lab_content.string }, (msg) => {
                    if (msg.result == 0) {
                        if (msg.data.count > 0){      //反馈限制次数大于 0 
                            CommonFun.getInstance().showMsgBox('Send successfully!\n please pay attention to Message', "YES", () => {
                                if (CommonFun.getInstance().isValidForScr(this)) {
                                    this.node.destroy();
                                };
                            }, false);
                        }
                    }
                    else if (msg.result == 5010){
                        CommonFun.getInstance().showMsgBox("Today's feedback has reached the upper limit", "YES", () => {
                            if (CommonFun.getInstance().isValidForScr(this)) {
                                this.node.destroy();
                            };
                        }, false);
                    } 
                    else {
                        CommonFun.getInstance().showTips(msg.msg);
                    };
                }, null, GlobalCfg.USER_DATAS.BearerToken)
                
            } 
            else {
                CommonFun.getInstance().showTips("Please fill in the feedback content first!");
            }
        }
    },

    editEventBeginListen: function(editbox) {},

    editEventEndListen: function (editbox) {
        let textLabel = editbox.node.getChildByName('TEXT_LABEL');
        this.lab_content = textLabel.getComponent(cc.Label);
        let lab_string = this.lab_content.string;
        this.count = this.getByteLen(lab_string);
        this.lab_strCount.string = `${this.count}/400`;
    },

    /**
     * 设置反馈次数
     * @param {Number} FeedBackCount 
     * @param {Number} MaxFeedBackCount 
     */
    setData: function (FeedBackCount, MaxFeedBackCount) {
        this.feedBackCount = FeedBackCount;
        this.maxFeedBackCount = MaxFeedBackCount;
    },

    /**
     * 
     * @param {String} val 
     * @returns 
     */
    getByteLen: function (val) {
        let len = 0;
        for (let i = 0; i < val.length; i++) {
            let a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            } else {
                len += 1;
            }
        }
        return len;
    },
});
