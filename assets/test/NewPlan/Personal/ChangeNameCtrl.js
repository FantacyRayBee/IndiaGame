
cc.Class({
    extends: cc.Component,

    properties: {  

    }, 

    ctor() {
        this.nameLb = null;
    },

    onLoad: function() {
        this.node_editbox = cc.find('ty_bg_sml_2',this.node);
        this.addClickTouch(['btn_close','btn_okay'],cc.find('ty_bg_sml_2',this.node),this);
        this.editbox = cc.find('ty_bg_sml_2/sz_input_name/EditBox_Name',this.node).getComponent(cc.EditBox);
        this.oldName = GlobalCfg.USER_DATAS.userName;
        this.editbox.node.on('editing-did-began', this.editboxStartClick, this);
        this.editbox.node.on('editing-did-ended', this.editboxEndClick, this);
    },

    btnClick:function(button){
        var btnName = button.node.name;
        if (btnName == "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
        } else {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
        }
        if (btnName === "btn_close") {
            this.node.destroy();
        }else if(btnName === "btn_okay"){
            this.curName = this.editbox.string;
            if (this.curName.length == 0) {
                CommonFun.getInstance().showTips("Nickname can not be Empty!");

            } else {
                let time = this.getChangeNameTime("newTime");
                if(time){
                    let isExistence = this.chack_name(this.curName);
                    let isChina = this.funcChina(this.curName)
                    if(isExistence || isChina){
                        CommonFun.getInstance().showTips(otherLanguage.nameTips[language]);
                    } else {                     
                        this.userinfoUpdateReq();
                    }
               
                }else{
                    CommonFun.getInstance().showTips(playerCenterLanguage.lab_tip_01[language]);
                }
            }
        }
    },

    userinfoUpdateReq: function () {
        let self = this;
        let parm = {userid: GlobalCfg.USER_DATAS.userId, token: GlobalCfg.USER_DATAS.token};
        if (self.oldName === self.curName) {
            self.node.destroy();
            return;
        };
        parm.nickname = self.curName;
        if (Object.keys(parm).length > 2) {
            CommonFun.getInstance().httpPost(GlobalCfg.HTTP_USER_LOGIN + '/v1/userinfoupdate', parm, (jsonObj) => {
                if (jsonObj.result == 0) {
                    ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO, msgData: {} });
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, 
                        {msgCode: GlobalCfg.CLIENT_MSG_ID.UPDATE_USER_INFO, msgData: {userHeadimgurl: GlobalCfg.USER_DATAS.userHeadimgurl, nickname: parm.nickname}}
                    );
                    if (CommonFun.getInstance().isValidForScr(self)) {
                        self.getChangeNameTime("oneTime")
                        self.node.destroy();
                    };
                    CommonFun.getInstance().showTips("Nickname modified successfully!");
                } 
                else {
                    CommonFun.getInstance().showTips(jsonObj.msg);
                }
            });
        } 
    },

    // 开始点击文本框
    editboxStartClick:function(editbox){
        // cc.tween(this.node_editbox)
        // .to(0.1, {position: cc.v2(0, 280) })
        // .start();
    },

    // 结束点击文本框
    editboxEndClick:function(editbox){
        // cc.tween(this.node_editbox)
        // .to(0.1, {position: cc.v2(0, 0) })
        // .start();
    },

    //获取改名字的第一时间
    getChangeNameTime:function(str){
        var d =new Date();
        let time = d.getTime();
        if(str == "oneTime"){
            cc.sys.localStorage.setItem("oneTime", JSON.stringify(time));
        } else if (str == "newTime") {
            let oneTime = Number(JSON.parse(cc.sys.localStorage.getItem('oneTime')));
            let NewoneTime = oneTime == null ? 0 : oneTime;
            let nweTime =  time - NewoneTime
            if( NewoneTime ==0 || nweTime > 86400000 ){
                return true
            } else {
                return false
            }
        }
    },

    //检测是否有特殊符号
    chack_name:function(str){
        let isChina = this.funcChina(str)
        if(isChina){
            return false;
        }
        let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
        if (pattern.test(str)){
            return true;
        }
        return false;
    },

    //检测是否有中文字
    funcChina:function(str){
        var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        if(!patrn.exec(str)){
        return false;
        }
        else{
        return true;
        }
    },

    //定义添加按钮点击事件
    addClickTouch: function (btnNames, parent, context) {
        var dataType = Object.prototype.toString.call(btnNames);
        var btn = null;
        if (dataType == "[object Null]") {
            btn = context.node;
            btn.on('click', context.btnClick, context);
            return btn;
        } else if (dataType === "[object Array]") {
            for (let index = 0; index < btnNames.length; index++) {
                const element = btnNames[index];
                if (parent.node) {
                    parent.node.getChildByName(element).on('click', parent.btnClick, parent);
                } else {
                    parent.getChildByName(element).on('click', context.btnClick, context);
                }
            }
        }else if (dataType === "[object String]") {
            if (parent.node) {
                btn = parent.node.getChildByName(btnNames);
                btn.on('click', parent.btnClick, parent);
            } else {
                btn = parent.getChildByName(btnNames);
                btn.on('click', context.btnClick, context);
            }
            return btn;
        }
    },

});