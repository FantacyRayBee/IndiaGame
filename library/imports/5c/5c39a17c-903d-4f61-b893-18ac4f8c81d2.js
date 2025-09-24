"use strict";
cc._RF.push(module, '5c39aF8kD1PYbiTGKxPjIHS', 'BenefitsItemCtrl');
// ResourcesBundle/NewPlan/MyVip/BenefitsItemCtrl.js

"use strict";

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_tips1: cc.Label,
    lab_tips2: cc.Label,
    sprite_icon: cc.Sprite,
    btn_icon: cc.Button,
    node_quan: cc.Node,
    atlas_benifits: cc.SpriteAtlas
  },
  ctor: function ctor() {
    this.tipsStr = {
      1: "Daily Withdrawal Count",
      2: "Withdrawal Limit",
      3: "Monthly Allowance",
      4: "Weekly Allowance",
      5: "Daily Allowance",
      6: "VIP Seats",
      7: "VIP Customer Service",
      8: "VIP Name Color",
      9: "Commission Charged",
      10: "Level Up Gift",
      11: "Lucky Draw"
    };
    this.monthObj = {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec"
    };
    this.rewardTimer = null;
    this.benifitsType = 0;
    this.benifitsData = null;
  },
  onLoad: function onLoad() {},
  onDestroy: function onDestroy() {
    clearInterval(this.rewardTimer);
    this.rewardTimer = null;
  },
  setBenifitsTimeForDay: function setBenifitsTimeForDay(diffTime) {
    var _this = this;

    var downTimer = function downTimer() {
      diffTime -= 1;

      if (diffTime < 0) {
        if (CommonFun.getInstance().isValidForScr(_this)) {
          clearInterval(_this.rewardTimer);
          _this.rewardTimer = null;

          if (_this.benifitsType == 5) {
            _this.lab_tips2.string = "\u20B9" + _this.benifitsData.dayTake / 100;
            _this.btn_icon.interactable = true;
            _this.node_quan.active = true;
          } else if (_this.benifitsType == 4) {
            _this.lab_tips2.string = "\u20B9" + _this.benifitsData.weekTake / 100;
            _this.btn_icon.interactable = true;
            _this.node_quan.active = true;
          } else if (_this.benifitsType == 3) {
            _this.lab_tips2.string = "\u20B9" + _this.benifitsData.monthTake / 100;
            _this.btn_icon.interactable = true;
            _this.node_quan.active = true;
          } else {
            _this.lab_tips2.string = '';
            _this.btn_icon.interactable = false;
            _this.node_quan.active = false;
          }

          ;
        }

        ;
        return;
      }

      ;

      if (CommonFun.getInstance().isValidForScr(_this)) {
        _this.lab_tips2.string = formatDuring(diffTime);
      }

      ;
    };

    var formatDuring = function formatDuring(mss) {
      var hours = Math.floor(mss % (60 * 60 * 24) / (60 * 60));
      var minutes = Math.floor(mss % (60 * 60) / 60);
      var seconds = Math.floor(mss % 60);
      return (hours < 10 ? '0' + hours : hours) + ": " + (minutes < 10 ? '0' + minutes : minutes) + ": " + (seconds < 10 ? '0' + seconds : seconds);
    };

    this.lab_tips2.string = formatDuring(diffTime);
    this.rewardTimer = setInterval(downTimer, 1000);
  },
  setBenifitsTimeForWeekOrMonth: function setBenifitsTimeForWeekOrMonth(endTime) {
    var dateObj = new Date(endTime * 1000); // 获取年、月、日

    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1; // JavaScript中月份从0开始计数，所以加上1

    var day = dateObj.getDate();
    this.lab_tips2.string = (day < 10 ? '0' + day : day) + " " + this.monthObj[month] + "," + year;
  },
  setBenifitsItemData: function setBenifitsItemData(type, data) {
    if (type <= 0 || type > 11) {
      this.node.active = false;
      return;
    }

    ;
    this.benifitsType = type;
    this.benifitsData = data;
    var languagesType = I18NUtil.getInstance().getLanguageType();
    var nameStr = "";

    if (type == 1) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Daily Withdrawal Count']);
    } else if (type == 2) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Withdrawal Limit']);
    } else if (type == 3) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Monthly Allowance']);
    } else if (type == 4) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Weekly Allowance']);
    } else if (type == 5) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Daily Allowance']);
    } else if (type == 6) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP Seats']);
    } else if (type == 7) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP Customer Service']);
    } else if (type == 8) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP Name Color']);
    } else if (type == 10) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Level Up Gift']);
    } else if (type == 11) {
      nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Lucky Draw']);
    }

    ;
    this.lab_tips1.string = nameStr;
    this.sprite_icon.spriteFrame = this.atlas_benifits.getSpriteFrame("" + type);

    if (GlobalCfg.USER_DATAS.userVip.level == data.level) {
      var timestamp = GlobalCfg.USER_DATAS.userVip.system_time;

      if (type == 5) {
        if (timestamp < GlobalCfg.USER_DATAS.userVip.next_day_take_time) {
          this.setBenifitsTimeForDay(GlobalCfg.USER_DATAS.userVip.next_day_take_time - timestamp);
          this.btn_icon.interactable = false;
          this.node_quan.active = false;
        } else {
          this.lab_tips2.string = "\u20B9" + data.dayTake / 100;
          this.btn_icon.interactable = true;
          this.node_quan.active = true;
          this.btn_icon.node.on("click", CommonFun.getInstance().debounce(function () {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
              msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_TAKE_WELFARE,
              msgData: {
                type: "day"
              }
            });
          }, 3), this);
        }

        ;
        this.lab_tips2.node.active = true;
      } else if (type == 4) {
        if (timestamp < GlobalCfg.USER_DATAS.userVip.next_week_take_time) {
          this.setBenifitsTimeForWeekOrMonth(GlobalCfg.USER_DATAS.userVip.next_week_take_time);
          this.btn_icon.interactable = false;
          this.node_quan.active = false;
        } else {
          this.lab_tips2.string = "\u20B9" + data.weekTake / 100;
          this.btn_icon.interactable = true;
          this.node_quan.active = true;
          this.btn_icon.node.on("click", CommonFun.getInstance().debounce(function () {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
              msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_TAKE_WELFARE,
              msgData: {
                type: "week"
              }
            });
          }, 3), this);
        }

        ;
        this.lab_tips2.node.active = true;
      } else if (type == 3) {
        if (timestamp < GlobalCfg.USER_DATAS.userVip.next_month_take_time) {
          this.setBenifitsTimeForWeekOrMonth(GlobalCfg.USER_DATAS.userVip.next_month_take_time);
          this.btn_icon.interactable = false;
          this.node_quan.active = false;
        } else {
          this.lab_tips2.string = "\u20B9" + data.monthTake / 100;
          this.btn_icon.interactable = true;
          this.node_quan.active = true;
          this.btn_icon.node.on("click", CommonFun.getInstance().debounce(function () {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
              msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_TAKE_WELFARE,
              msgData: {
                type: "month"
              }
            });
          }, 3), this);
        }

        ;
        this.lab_tips2.node.active = true;
      } else if (type == 2) {
        this.lab_tips2.string = "\u20B9" + data.withdrawTotalLimit / 100;
        this.lab_tips2.node.active = true;
        this.btn_icon.interactable = false;
        this.node_quan.active = false;

        if (GlobalCfg.USER_DATAS.userVip.withdraw_total >= data.withdrawTotalLimit) {
          this.btn_icon.interactable = true;
          this.btn_icon.node.on("click", CommonFun.getInstance().debounce(function () {
            CommonFun.getInstance().showTips('The current withdrawal limit has been used up, please raise the VIP level!');
          }, 1), this);
        }

        ;
      } else if (type == 1) {
        this.lab_tips2.string = data.dayWithdrawCountLimit - GlobalCfg.USER_DATAS.userVip.day_withdraw_count + " times";
        this.lab_tips2.node.active = true;
        this.btn_icon.interactable = false;
        this.node_quan.active = false;

        if (data.dayWithdrawCountLimit - GlobalCfg.USER_DATAS.userVip.day_withdraw_count <= 0) {
          this.btn_icon.interactable = true;
          this.btn_icon.node.on("click", CommonFun.getInstance().debounce(function () {
            CommonFun.getInstance().showTips('The current withdrawal times have been used up, please raise the VIP level!');
          }, 1), this);
        }

        ;
      } else if (type == 7) {
        this.btn_icon.interactable = true;
        this.node_quan.active = false;
        this.lab_tips2.node.active = false;
        this.btn_icon.node.on("click", CommonFun.getInstance().debounce(function () {
          var channel_info = _extends({}, GlobalCfg.USER_DATAS.customerService);

          var whatsAppInfos = channel_info.whatsApp.split(',');
          var mobileNum = whatsAppInfos[0].match(/\d+/g);
          APPManager.skipToOtherApp("com.whatsapp", "https://api.whatsapp.com/send?phone=" + mobileNum);
        }, 5), this);
      } else if (type == 11) {
        this.btn_icon.interactable = true;
        this.node_quan.active = false;
        this.lab_tips2.node.active = false;
        this.btn_icon.node.on("click", CommonFun.getInstance().debounce(function () {
          CommonFun.getInstance().showVipLuckyDraw();
        }, 1), this);
      } else {
        this.lab_tips2.node.active = false;
        this.btn_icon.interactable = false;
        this.node_quan.active = false;
      }

      ;
    } else {
      this.lab_tips2.node.active = false;
      this.btn_icon.interactable = false;
      this.btn_icon.enableAutoGrayEffect = true;
      this.node_quan.active = false;
    }

    ;
  }
});

cc._RF.pop();