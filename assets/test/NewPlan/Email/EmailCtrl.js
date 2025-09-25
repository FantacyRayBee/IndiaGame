cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        content: cc.Node,
        empt_node: cc.Node,
        skeleton_loading: sp.Skeleton,

        right_node: cc.Node,
        right_lab_title: cc.Label,
        right_lab_content: cc.Label,
        right_lab_date: cc.Label,
        right_lab_rewardnum: cc.Label,
        btn_get: cc.Button,
        right_coin: cc.Node,
        yes_node1: cc.Node,
        yes_node2: cc.Node,
    },

    ctor: function() {
        this.readmailArr = [];
        this.unReadCount = 0;
        this.mailDataArr = [];
        this.prefabMailArr = {}; // 邮件预制体
        this.curMailIndex = 0; // 当前邮件索引
    },

    onLoad: function() {
        this.empt_node.active = false;
        this.skeleton_loading.node.active = true;
        this.btn_close.node.on('click', this.btnClick, this);
        this.btn_get.node.on('click', this.btnGetClick, this);

        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.OPEN_EMAIL) {
            this.dealOpenEMailEvent(notify);
        } 
        else if (msgId == "EmailClick") {
            this.dealEmailClickEvent(notify);
        }
    },

    start: function() {
        Promise.all([this.getMailInfo(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.EMAILITEM)])
        .then((arr) => {
            let mails = arr[0];
            let itemPrefab = arr[1];
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.skeleton_loading.node.active = false;
                this.mailDataArr = mails;
                this.dealData();
                if (mails.length == 0) {
                    this.empt_node.active = true;
                    this.right_node.active = false;
                }
                else {
                    this.right_node.active = true;
                    this.addMailItems(this.mailDataArr, itemPrefab);
                };           
            };       
        })
        .catch((err) => {});
    },

    dealData: function() {
        for (let i = 0; i < this.mailDataArr.length; i++) {
            this.mailDataArr[i].read_state = this.mailDataArr[i].award_state;
        }
    },


    getMailInfo: function() {
        return new Promise((resolve, reject) => {
            let url = GlobalCfg.HTTP_SERVER + "/v1/mailbox/mail";
            CommonFun.getInstance().httpGet(url, (msg) => {
                CommonFun.getInstance().hidProgress();
                if (msg.data && msg.result == 0) {
                    let mails = msg.data.mails;
                    resolve(mails);
                } 
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                    reject();
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });
    },

    onDestroy: function() {
        CommonFun.getInstance().hidProgress();
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.EMAILITEM);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.EMAIL);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    btnClick: function(button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        if (btnName == 'btn_close') {
            let url = GlobalCfg.HTTP_SERVER + "/v1/mailbox/readmail";
            this.readmailArr = this.duplicateRemoval(this.readmailArr);
            if (this.readmailArr.length > 0) {
                CommonFun.getInstance().httpPost(url, {mail_ids: this.readmailArr}, (msg) => {
                    if (msg.result == 0) {
                        GlobalCfg.USER_DATAS.new_email = false;
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.READ_EMAIL, msgData: { state: GlobalCfg.USER_DATAS.new_email } });
                    }
                    else {
                        CommonFun.getInstance().showTips(msg.msg);
                    };
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            } 
            else {
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.READ_EMAIL, msgData: { state: GlobalCfg.USER_DATAS.new_email } });
            };
            this.node.destroy();
        }
    },

    btnGetClick: function() {
        let data = this.mailDataArr[this.curMailIndex];
        CommonFun.getInstance().showProgress();
        let url = GlobalCfg.HTTP_SERVER + "/v1/mailbox/takeattaches";
        let paramData = { mail_id: data.id };
        CommonFun.getInstance().httpPost(url, paramData, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0 && msg.data && msg.data.awards) {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    data.award_state = true;
                    this.btn_get.interactable = false;
                    this.prefabMailArr[this.curMailIndex].setData(data, this.curMailIndex)
                    this.dealEmailClickEvent({data: data});
                };
                let addDepositNum = 0;
                let addWinningsNum = 0;
                let addBonusNum = 0;
                for (let i = 0; i < msg.data.awards.length; i++) {
                    let award = msg.data.awards[i];
                    if (award.kind == 3 || award.kind == 10) {
                        addDepositNum += award.num;
                    }
                    else if (award.kind == 11) {
                        addWinningsNum += award.num;
                    }
                    else if (award.kind == 12) {
                        addBonusNum += award.num;
                    };
                };
                let arr = [];
                if (addDepositNum > 0) {
                    GlobalCfg.USER_DATAS.deposit += addDepositNum;
                    GlobalCfg.USER_DATAS.userDiamond += addDepositNum;
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD, msgData: {}});
                    arr.push({ id: 10, amount: addDepositNum / 100 });
                };
                if (addWinningsNum > 0) {
                    GlobalCfg.USER_DATAS.winnings += addWinningsNum;
                    GlobalCfg.USER_DATAS.userDiamond += addWinningsNum;
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD, msgData: {}});
                    arr.push({ id: 11, amount: addWinningsNum / 100 });
                };
                if (addBonusNum > 0) {
                    GlobalCfg.USER_DATAS.bonus += addBonusNum;
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD, msgData: {}});
                    arr.push({ id: 12, amount: addBonusNum / 100 });
                };

                if (arr.length > 0) {
                    CommonFun.getInstance().showRewardsTips(arr);
                };
            } 
            else {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    addMailItems: function(mails, itemPrefab) {
        let len = mails.length;
        if (len == 0) {
            return;
        };

        let index = 0;
        let addItem = () => {
            let itemData = mails[index];

            this.getUnreadMailCount(itemData);

            let item_Node = cc.instantiate(itemPrefab);
            
            let itemCtrl = item_Node.getComponent('titleItemCtrl');
            itemCtrl.setData(itemData, index);
            this.content.addChild(item_Node);
            this.prefabMailArr[index] = itemCtrl;
            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                this.setTitleEmailState(0); //默认打开第一个邮件
                this.prefabMailArr[0].btnClick();
                return;
            }; 
        };
        this.schedule(addItem, 5/cc.game.getFrameRate(), len - 1, 0);
    },

    setTitleEmailState: function (index) {
        for (let i = 0; i < this.mailDataArr.length; i++) {
            if (i == index) {
                this.prefabMailArr[i].setClickState(true)
            }
            else {
                this.prefabMailArr[i].setClickState(false)
            }
        }
    },


    //获取当前所有未读邮件的数目
    getUnreadMailCount: function (item) {
        if (item.attaches && item.award_state == false) {
            this.unReadCount += 1
        } 
        else {
            if (item.state == false) {
                this.unReadCount += 1
            };
        }
    },

    /**
     * 去重
     * @param {Array} nums 
     * @returns Array
     */
    duplicateRemoval: function (nums) {
        let mySet = new Set();
        let len = nums.length;
        for (let i = 0; i < len; i++) {
            mySet.add(nums[i]);
        };
        let arr = Array.from(mySet);
        return arr
    },


    dealOpenEMailEvent: function(mail_id) {
        for (let i = 0; i < this.mailDataArr.length; i++) {
            let itemData = this.mailDataArr[i];
            if (mail_id == itemData.id) {
                itemData.state = true;
                itemData.read_state = true;
            };
        };
        this.readmailArr.push(mail_id);
    },

    dealEmailClickEvent: function(notify) {
        let data = notify.data;
        this.emailData = data;
        this.curMailIndex = notify.index;
        this.setTitleEmailState(notify.index);
        this.right_coin.active = false;
        this.btn_get.interactable = false;
        LoggerUtil.getInstance().log("dealEmailClickEvent data:", data);
        // type: 1 为系统邮件 2 为反馈邮件
        if (data.type == 1 || data.type == 2) {
            if (data.title != "") {
                this.right_lab_title.string = data.title;
            }
            else {
                this.right_lab_title.string = data.type == 1 ? "System Mail" : "Feedback Mail";
            };
            if (data.attaches && data.attaches.length > 0) {
                this.btn_get.interactable = !data.award_state;
                this.right_coin.active = true;
                this.right_lab_rewardnum.string = data.attaches[0].num / 100;
                this.yes_node1.active = data.award_state;
                this.yes_node2.active = data.award_state;
            }
            this.right_lab_content.string = data.content;
        } 
        else {
            this.btn_get.interactable = true;
            this.right_lab_content.string = "Sorry, please refresh";
        };

        this.right_lab_date.string = this.getDateToDay(data.create_at);
        this.dealOpenEMailEvent(data.id);
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
