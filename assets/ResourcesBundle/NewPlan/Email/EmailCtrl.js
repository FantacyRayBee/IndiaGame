cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        content: cc.Node,
        empt_node: cc.Node,
        skeleton_loading: sp.Skeleton
    },

    ctor: function() {
        this.readmailArr = [];
        this.unReadCount = 0;
        this.mailDataArr = [];
    },

    onLoad: function() {
        this.empt_node.active = false;
        this.skeleton_loading.node.active = true;
        this.btn_close.node.on('click', this.btnClick, this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.OPEN_EMAIL) {
            this.dealOpenEMailEvent(notify);
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
                if (mails.length == 0) {
                    this.empt_node.active = true;
                }
                else {
                    this.addMailItems(mails, itemPrefab);
                };           
            };       
        })
        .catch((err) => {});
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
            
            let itemCtrl = item_Node.getComponent('EmailitemCtrl');
            itemCtrl.setData(itemData);
            this.content.addChild(item_Node);

            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                return;
            }; 
        };
        this.schedule(addItem, 5/cc.game.getFrameRate(), len - 1, 0);
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


    dealOpenEMailEvent: function(notify) {
        let mail_id = notify.mail_id;
        for (let i = 0; i < this.mailDataArr.length; i++) {
            let itemData = this.mailDataArr[i];
            if (mail_id == itemData.id) {
                itemData.state = true;
                itemData.award_state = true;
            };
        };
        this.readmailArr.push(mail_id);
    },
});
