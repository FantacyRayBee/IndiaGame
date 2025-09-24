"use strict";
cc._RF.push(module, 'a62b7U494xID7l8hmGoZxJx', 'FastFeedBackCtrl');
// ResourcesBundle/NewPlan/FastFeedBack/FastFeedBackCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_send: cc.Button,
    editbox: cc.EditBox,
    lab_strCount: cc.Label
  },
  ctor: function ctor() {
    this.count = 0;
    this.lab_content = null;
  },
  onLoad: function onLoad() {
    this.btn_close.node.on('click', this.btnClick, this);
    this.btn_send.node.on('click', this.btnClick, this);
    this.editbox.node.on('editing-did-began', this.editEventBeginListen, this);
    this.editbox.node.on('editing-did-ended', this.editEventEndListen, this);
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FASTFEEDBACK);
  },
  btnClick: function btnClick(button) {
    var _this = this;

    var btnName = button.node.name;

    if (btnName == 'btn_close') {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
      return;
    }

    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName == 'btn_send') {
      if (this.count > 0) {
        var url = GlobalCfg.HTTP_SERVER + "/v1/help/feedback";
        CommonFun.getInstance().httpPost(url, {
          content: this.lab_content.string
        }, function (msg) {
          if (msg.result == 0) {
            if (msg.data.count > 0) {
              //反馈限制次数大于 0 
              CommonFun.getInstance().showMsgBox('Send successfully!\n please pay attention to Message', "YES", function () {
                if (CommonFun.getInstance().isValidForScr(_this)) {
                  _this.node.destroy();
                }

                ;
              }, false);
            }
          } else if (msg.result == 5010) {
            CommonFun.getInstance().showMsgBox("Today's feedback has reached the upper limit", "YES", function () {
              if (CommonFun.getInstance().isValidForScr(_this)) {
                _this.node.destroy();
              }

              ;
            }, false);
          } else {
            CommonFun.getInstance().showTips(msg.msg);
          }

          ;
        }, null, GlobalCfg.USER_DATAS.BearerToken);
      } else {
        CommonFun.getInstance().showTips("Please fill in the feedback content first!");
      }
    }
  },
  editEventBeginListen: function editEventBeginListen(editbox) {},
  editEventEndListen: function editEventEndListen(editbox) {
    var textLabel = editbox.node.getChildByName('TEXT_LABEL');
    this.lab_content = textLabel.getComponent(cc.Label);
    var lab_string = this.lab_content.string;
    this.count = this.getByteLen(lab_string);
    this.lab_strCount.string = this.count + "/400";
  },

  /**
   * 设置反馈次数
   * @param {Number} FeedBackCount 
   * @param {Number} MaxFeedBackCount 
   */
  setData: function setData(FeedBackCount, MaxFeedBackCount) {
    this.feedBackCount = FeedBackCount;
    this.maxFeedBackCount = MaxFeedBackCount;
  },

  /**
   * 
   * @param {String} val 
   * @returns 
   */
  getByteLen: function getByteLen(val) {
    var len = 0;

    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);

      if (a.match(/[^\x00-\xff]/ig) != null) {
        len += 2;
      } else {
        len += 1;
      }
    }

    return len;
  }
});

cc._RF.pop();