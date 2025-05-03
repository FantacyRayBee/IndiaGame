"use strict";
cc._RF.push(module, '335f4Rx+WpAob3eC9IajnV+', 'CustomerServiceCtrl');
// ResourcesBundle/NewPlan/CustomerService/CustomerServiceCtrl.js

"use strict";

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
cc.Class({
  "extends": cc.Component,
  properties: {
    lab_nums: [cc.Label] //0 WhatsApp 1 Email  2 facebook 
  },
  onLoad: function onLoad() {
    var root = this.node.getChildByName('root');
    this.btn_close = root.getChildByName('btn_close').getComponent(cc.Button);
    this.btn_go_whatsApp = root.getChildByName('node_whatsApp').getChildByName('btn_go_whatsApp').getComponent(cc.Button);
    this.btn_copy_email = root.getChildByName('node_email').getChildByName('btn_copy_email').getComponent(cc.Button);
    this.btn_copy_fb = root.getChildByName('node_facebook').getChildByName('btn_copy_fb').getComponent(cc.Button);
    this.btn_go_feedback = root.getChildByName('node_feedback').getChildByName('btn_go_feedback').getComponent(cc.Button);
    this.btn_service = root.getChildByName('node_service').getChildByName('btn_service').getComponent(cc.Button);
    var arr = [this.btn_close, this.btn_service, this.btn_go_whatsApp, this.btn_copy_fb, this.btn_copy_email, this.btn_go_feedback];
    for (var i = 0, len = arr.length; i < len; i++) {
      var element = arr[i];
      element.node.on('click', this.btnClick, this);
    }
  },
  start: function start() {
    this.setContactData();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CUSTOMERSERVICE);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    if (btnName == 'btn_close') {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
      return;
    }
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == 'btn_go_whatsApp') {
      // Skip TO Telegram
      var str = this.channel_info.telegram;
      var arr = str.split('/');
      var pageid = arr[arr.length - 1];
      APPManager.skipToOtherApp('org.telegram.messenger', pageid);
    } else if (btnName == 'btn_copy_fb') {
      // Skip to Twitter
      var _str = this.channel_info.facebook;
      var _arr = _str.split('/');
      var screenName = _arr[_arr.length - 1];
      APPManager.skipToOtherApp('com.twitter.android', screenName);
    } else if (btnName == 'btn_copy_email') {
      // Skip to WhatsApp
      var whatsAppInfos = this.channel_info.whatsApp.split(',');
      var mobileNum = whatsAppInfos[0].match(/\d+/g);
      var channelLink = whatsAppInfos[1];
      APPManager.skipToOtherApp("com.whatsapp", channelLink);
    } else if (btnName == 'btn_service') {
      // Skip to service
      var _str2 = GlobalCfg.USER_DATAS.web_customer_service;
      _str2 += "?userId=" + GlobalCfg.USER_DATAS.userId;
      _str2 += "&nickname=" + GlobalCfg.USER_DATAS.userName;
      _str2 += "&mobile=" + GlobalCfg.USER_DATAS.phone;
      _str2 += "&email=" + GlobalCfg.USER_DATAS.mail;
      LoggerUtil.getInstance().log('btn_service str:', _str2);
      cc.sys.openURL(_str2);
    } else if (btnName == 'btn_go_feedback') {
      CommonFun.getInstance().showFastFeedBack();
    }
  },
  /**
   * 设置多种联系方式
   */
  setContactData: function setContactData() {
    this.channel_info = _extends({}, GlobalCfg.USER_DATAS.customerService);
    LoggerUtil.getInstance().log('ContactData', this.channel_info);
    var whatsAppInfos = this.channel_info.whatsApp.split(',');
    var whatsAppChannel = whatsAppInfos[1];
    for (var i = 0, len = this.lab_nums.length; i < len; i++) {
      switch (i) {
        case 0:
          this.lab_nums[i].string = this.channel_info.telegram;
          break;
        case 1:
          this.lab_nums[i].string = whatsAppChannel;
          break;
        case 2:
          this.lab_nums[i].string = this.channel_info.facebook;
          break;
        default:
          this.lab_nums[i].string = "null";
          break;
      }
    }
  },
  /**
   * 分割WhatsApp联系方式
   * @param {String} str 
   * @returns Array
   */
  splitWhatsAppNum: function splitWhatsAppNum(str) {
    var arr = str.split('');
    var len = arr.length;
    for (var i = 0; i < len; i++) {
      var element = arr[i];
      if (i > 1 && (element == '(' || element == '（')) {
        return arr.slice(0, i);
      }
    }
    return arr;
  },
  /**
   * 将联系方式 String 转为键值对
   * @param {String} info 
   * @returns Object
   */
  splitChannel_info: function splitChannel_info(info) {
    var arr1 = info.split(',');
    var arr = [];
    for (var i = 0; i < arr1.length; i++) {
      var item = arr1[i];
      var arr2 = item.split(':');
      arr.push(arr2);
    }
    var obj = {};
    arr.forEach(function (item) {
      var key = item[0];
      obj[key] = item[1];
    });
    return obj;
  },
  /**
   * web端复制内容
   * @param {String} str 复制内容
   * @param {String} subsc 复制成功提示
   * @returns 
   */
  webCopyString: function webCopyString(str, subsc) {
    var input = str;
    var el = document.createElement('textarea');
    el.value = input;
    el.setAttribute('readonly', '');
    el.style.contain = 'strict';
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.fontSize = '12pt'; // Prevent zooming on iOS

    var selection = getSelection();
    var originalRange = false;
    if (selection.rangeCount > 0) {
      originalRange = selection.getRangeAt(0);
    }
    document.body.appendChild(el);
    el.select();
    el.selectionStart = 0;
    el.selectionEnd = input.length;
    var success = false;
    try {
      success = document.execCommand('copy');
      CommonFun.getInstance().showTips(subsc);
    } catch (err) {}
    document.body.removeChild(el);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    return success;
  }
});

cc._RF.pop();