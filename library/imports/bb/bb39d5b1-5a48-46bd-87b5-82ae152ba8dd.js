"use strict";
cc._RF.push(module, 'bb39dWxWkhGvYe1gq4VK6jd', 'EmailCtrl');
// ResourcesBundle/NewPlan/Email/EmailCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    content: cc.Node,
    empt_node: cc.Node,
    skeleton_loading: sp.Skeleton
  },
  ctor: function ctor() {
    this.readmailArr = [];
    this.unReadCount = 0;
    this.mailDataArr = [];
  },
  onLoad: function onLoad() {
    this.empt_node.active = false;
    this.skeleton_loading.node.active = true;
    this.btn_close.node.on('click', this.btnClick, this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.OPEN_EMAIL) {
      this.dealOpenEMailEvent(notify);
    }
  },
  start: function start() {
    var _this = this;
    Promise.all([this.getMailInfo(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.EMAILITEM)]).then(function (arr) {
      var mails = arr[0];
      var itemPrefab = arr[1];
      if (CommonFun.getInstance().isValidForScr(_this)) {
        _this.skeleton_loading.node.active = false;
        _this.mailDataArr = mails;
        if (mails.length == 0) {
          _this.empt_node.active = true;
        } else {
          _this.addMailItems(mails, itemPrefab);
        }
        ;
      }
      ;
    })["catch"](function (err) {});
  },
  getMailInfo: function getMailInfo() {
    return new Promise(function (resolve, reject) {
      var url = GlobalCfg.HTTP_SERVER + "/v1/mailbox/mail";
      CommonFun.getInstance().httpGet(url, function (msg) {
        CommonFun.getInstance().hidProgress();
        if (msg.data && msg.result == 0) {
          var mails = msg.data.mails;
          resolve(mails);
        } else {
          CommonFun.getInstance().showTips(msg.msg);
          reject();
        }
        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().hidProgress();
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.EMAILITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.EMAIL);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playBack();
    if (btnName == 'btn_close') {
      var url = GlobalCfg.HTTP_SERVER + "/v1/mailbox/readmail";
      this.readmailArr = this.duplicateRemoval(this.readmailArr);
      if (this.readmailArr.length > 0) {
        CommonFun.getInstance().httpPost(url, {
          mail_ids: this.readmailArr
        }, function (msg) {
          if (msg.result == 0) {
            GlobalCfg.USER_DATAS.new_email = false;
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
              msgCode: GlobalCfg.CLIENT_MSG_ID.READ_EMAIL,
              msgData: {
                state: GlobalCfg.USER_DATAS.new_email
              }
            });
          } else {
            CommonFun.getInstance().showTips(msg.msg);
          }
          ;
        }, null, GlobalCfg.USER_DATAS.BearerToken);
      } else {
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.READ_EMAIL,
          msgData: {
            state: GlobalCfg.USER_DATAS.new_email
          }
        });
      }
      ;
      this.node.destroy();
    }
  },
  addMailItems: function addMailItems(mails, itemPrefab) {
    var _this2 = this;
    var len = mails.length;
    if (len == 0) {
      return;
    }
    ;
    var index = 0;
    var addItem = function addItem() {
      var itemData = mails[index];
      _this2.getUnreadMailCount(itemData);
      var item_Node = cc.instantiate(itemPrefab);
      var itemCtrl = item_Node.getComponent('EmailitemCtrl');
      itemCtrl.setData(itemData);
      _this2.content.addChild(item_Node);
      index += 1;
      if (index == len) {
        _this2.unschedule(addItem);
        return;
      }
      ;
    };
    this.schedule(addItem, 5 / cc.game.getFrameRate(), len - 1, 0);
  },
  //获取当前所有未读邮件的数目
  getUnreadMailCount: function getUnreadMailCount(item) {
    if (item.attaches && item.award_state == false) {
      this.unReadCount += 1;
    } else {
      if (item.state == false) {
        this.unReadCount += 1;
      }
      ;
    }
  },
  /**
   * 去重
   * @param {Array} nums 
   * @returns Array
   */
  duplicateRemoval: function duplicateRemoval(nums) {
    var mySet = new Set();
    var len = nums.length;
    for (var i = 0; i < len; i++) {
      mySet.add(nums[i]);
    }
    ;
    var arr = Array.from(mySet);
    return arr;
  },
  dealOpenEMailEvent: function dealOpenEMailEvent(notify) {
    var mail_id = notify.mail_id;
    for (var i = 0; i < this.mailDataArr.length; i++) {
      var itemData = this.mailDataArr[i];
      if (mail_id == itemData.id) {
        itemData.state = true;
        itemData.award_state = true;
      }
      ;
    }
    ;
    this.readmailArr.push(mail_id);
  }
});

cc._RF.pop();