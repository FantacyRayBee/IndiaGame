"use strict";
cc._RF.push(module, 'd4f47RPXlJBGrIL+yKXKLs2', 'PromoterLeftViewCtrl');
// ResourcesBundle/NewPlan/Promoter/PromoterLeftViewCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  ctor: function ctor() {
    this.curTypeStr = null;
  },
  onLoad: function onLoad() {
    var _this = this;
    this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");
    this.node_teamView = this.viewList["teamView"];
    this.node_teamView_lab_whatIsATeam = this.viewList["teamView/lab1"];
    this.node_teamView_lab_answer = this.viewList["teamView/lab2"];
    this.node_teamView_lab_id = this.viewList["teamView/titleNode/lab_id"];
    this.node_teamView_lab_name = this.viewList["teamView/titleNode/lab_name"];
    this.node_teamView_lab_invited = this.viewList["teamView/titleNode/lab_invited"];
    this.node_teamView_lab_totalBonus = this.viewList["teamView/titleNode/lab_totalBonus"];
    this.node_teamView_lab_id_0 = this.viewList["teamView/itemNode0/lab_id"];
    this.node_teamView_lab_name_0 = this.viewList["teamView/itemNode0/lab_name"];
    this.node_teamView_lab_invited_0 = this.viewList["teamView/itemNode0/lab_invited"];
    this.node_teamView_lab_totalBonus_0 = this.viewList["teamView/itemNode0/lab_totalBonus"];
    this.node_teamView_lab_id_1 = this.viewList["teamView/itemNode1/lab_id"];
    this.node_teamView_lab_name_1 = this.viewList["teamView/itemNode1/lab_name"];
    this.node_teamView_lab_invited_1 = this.viewList["teamView/itemNode1/lab_invited"];
    this.node_teamView_lab_totalBonus_1 = this.viewList["teamView/itemNode1/lab_totalBonus"];
    this.node_teamView_lab_id_2 = this.viewList["teamView/itemNode2/lab_id"];
    this.node_teamView_lab_name_2 = this.viewList["teamView/itemNode2/lab_name"];
    this.node_teamView_lab_invited_2 = this.viewList["teamView/itemNode2/lab_invited"];
    this.node_teamView_lab_totalBonus_2 = this.viewList["teamView/itemNode2/lab_totalBonus"];
    this.node_teamView_lab_id_3 = this.viewList["teamView/itemNode3/lab_id"];
    this.node_teamView_lab_name_3 = this.viewList["teamView/itemNode3/lab_name"];
    this.node_teamView_lab_invited_3 = this.viewList["teamView/itemNode3/lab_invited"];
    this.node_teamView_lab_totalBonus_3 = this.viewList["teamView/itemNode3/lab_totalBonus"];
    this.node_teamView_lab_id_4 = this.viewList["teamView/itemNode4/lab_id"];
    this.node_teamView_lab_name_4 = this.viewList["teamView/itemNode4/lab_name"];
    this.node_teamView_lab_invited_4 = this.viewList["teamView/itemNode4/lab_invited"];
    this.node_teamView_lab_totalBonus_4 = this.viewList["teamView/itemNode4/lab_totalBonus"];
    this.node_teamView_lab_id_5 = this.viewList["teamView/itemNode5/lab_id"];
    this.node_teamView_lab_name_5 = this.viewList["teamView/itemNode5/lab_name"];
    this.node_teamView_lab_invited_5 = this.viewList["teamView/itemNode5/lab_invited"];
    this.node_teamView_lab_totalBonus_5 = this.viewList["teamView/itemNode5/lab_totalBonus"];
    this.node_teamView_lab_id_6 = this.viewList["teamView/itemNode6/lab_id"];
    this.node_teamView_lab_name_6 = this.viewList["teamView/itemNode6/lab_name"];
    this.node_teamView_lab_invited_6 = this.viewList["teamView/itemNode6/lab_invited"];
    this.node_teamView_lab_totalBonus_6 = this.viewList["teamView/itemNode6/lab_totalBonus"];
    this.node_teamView_lab_id_7 = this.viewList["teamView/itemNode7/lab_id"];
    this.node_teamView_lab_name_7 = this.viewList["teamView/itemNode7/lab_name"];
    this.node_teamView_lab_invited_7 = this.viewList["teamView/itemNode7/lab_invited"];
    this.node_teamView_lab_totalBonus_7 = this.viewList["teamView/itemNode7/lab_totalBonus"];
    this.node_teamView_lab_id_8 = this.viewList["teamView/itemNode8/lab_id"];
    this.node_teamView_lab_name_8 = this.viewList["teamView/itemNode8/lab_name"];
    this.node_teamView_lab_invited_8 = this.viewList["teamView/itemNode8/lab_invited"];
    this.node_teamView_lab_totalBonus_8 = this.viewList["teamView/itemNode8/lab_totalBonus"];
    this.node_historyView = this.viewList["historyView"];
    this.node_historyView_lab_tips = this.viewList["historyView/lab1"];
    this.node_historyView_lab_totalOutputTips = this.viewList["historyView/lab_totalOutputTips"];
    this.node_historyView_lab_totalBonusTips = this.viewList["historyView/lab_totalBonusTips"];
    this.node_historyView_lab_totalOutput = this.viewList["historyView/lab_totalOutput"];
    this.node_historyView_lab_totalBonus = this.viewList["historyView/lab_totalBonus"];
    this.node_historyView_lab_time = this.viewList["historyView/titleNode/lab_time"];
    this.node_historyView_lab_outPut = this.viewList["historyView/titleNode/lab_outPut"];
    this.node_historyView_lab_invited = this.viewList["historyView/titleNode/lab_invited"];
    this.node_historyView_lab_time_0 = this.viewList["historyView/itemNode0/lab_time"];
    this.node_historyView_lab_outPut_0 = this.viewList["historyView/itemNode0/lab_outPut"];
    this.node_historyView_lab_invited_0 = this.viewList["historyView/itemNode0/lab_invited"];
    this.node_historyView_lab_time_1 = this.viewList["historyView/itemNode1/lab_time"];
    this.node_historyView_lab_outPut_1 = this.viewList["historyView/itemNode1/lab_outPut"];
    this.node_historyView_lab_invited_1 = this.viewList["historyView/itemNode1/lab_invited"];
    this.node_historyView_lab_time_2 = this.viewList["historyView/itemNode2/lab_time"];
    this.node_historyView_lab_outPut_2 = this.viewList["historyView/itemNode2/lab_outPut"];
    this.node_historyView_lab_invited_2 = this.viewList["historyView/itemNode2/lab_invited"];
    this.node_historyView_lab_time_3 = this.viewList["historyView/itemNode3/lab_time"];
    this.node_historyView_lab_outPut_3 = this.viewList["historyView/itemNode3/lab_outPut"];
    this.node_historyView_lab_invited_3 = this.viewList["historyView/itemNode3/lab_invited"];
    this.node_historyView_lab_time_4 = this.viewList["historyView/itemNode4/lab_time"];
    this.node_historyView_lab_outPut_4 = this.viewList["historyView/itemNode4/lab_outPut"];
    this.node_historyView_lab_invited_4 = this.viewList["historyView/itemNode4/lab_invited"];
    this.node_historyView_lab_time_5 = this.viewList["historyView/itemNode5/lab_time"];
    this.node_historyView_lab_outPut_5 = this.viewList["historyView/itemNode5/lab_outPut"];
    this.node_historyView_lab_invited_5 = this.viewList["historyView/itemNode5/lab_invited"];
    this.node_historyView_lab_time_6 = this.viewList["historyView/itemNode6/lab_time"];
    this.node_historyView_lab_outPut_6 = this.viewList["historyView/itemNode6/lab_outPut"];
    this.node_historyView_lab_invited_6 = this.viewList["historyView/itemNode6/lab_invited"];
    this.node_bonusView = this.viewList["bonusView"];
    this.node_bonusView_lab1 = this.viewList["bonusView/lab1"];
    this.node_bonusView_lab3 = this.viewList["bonusView/lab3"];
    this.node_bonusView_titleNode_lab_number = this.viewList["bonusView/titleNode/lab_number"];
    this.node_bonusView_titleNode_lab_bonus = this.viewList["bonusView/titleNode/lab_bonus"];
    this.node_bonusView_lab_number_0 = this.viewList["bonusView/itemNode0/lab_number"];
    this.node_bonusView_lab_bonus_0 = this.viewList["bonusView/itemNode0/lab_bonus"];
    this.node_bonusView_lab_number_1 = this.viewList["bonusView/itemNode1/lab_number"];
    this.node_bonusView_lab_bonus_1 = this.viewList["bonusView/itemNode1/lab_bonus"];
    this.node_bonusView_lab_number_2 = this.viewList["bonusView/itemNode2/lab_number"];
    this.node_bonusView_lab_bonus_2 = this.viewList["bonusView/itemNode2/lab_bonus"];
    this.node_bonusView_lab_number_3 = this.viewList["bonusView/itemNode3/lab_number"];
    this.node_bonusView_lab_bonus_3 = this.viewList["bonusView/itemNode3/lab_bonus"];
    this.node_bonusView_lab_number_4 = this.viewList["bonusView/itemNode4/lab_number"];
    this.node_bonusView_lab_bonus_4 = this.viewList["bonusView/itemNode4/lab_bonus"];
    this.node_bonusView_lab_number_5 = this.viewList["bonusView/itemNode5/lab_number"];
    this.node_bonusView_lab_bonus_5 = this.viewList["bonusView/itemNode5/lab_bonus"];
    this.node_bonusView_lab_number_6 = this.viewList["bonusView/itemNode6/lab_number"];
    this.node_bonusView_lab_bonus_6 = this.viewList["bonusView/itemNode6/lab_bonus"];
    this.node_bonusView_lab_number_7 = this.viewList["bonusView/itemNode7/lab_number"];
    this.node_bonusView_lab_bonus_7 = this.viewList["bonusView/itemNode7/lab_bonus"];
    this.node_bonusView_lab_number_8 = this.viewList["bonusView/itemNode8/lab_number"];
    this.node_bonusView_lab_bonus_8 = this.viewList["bonusView/itemNode8/lab_bonus"];
    this.node.on("click", function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      _this.node.destroy();
    }, this);
    this.setInviteLeftViewLanguage();
  },
  setInviteLeftViewLanguage: function setInviteLeftViewLanguage() {
    // 1是英文 2是印地语 3乌尔都 4孟加拉语  默认英语
    var whatIsATeamStr = "";
    var answerStr = "";
    var idStr = "";
    var nameStr = "";
    var invitedStr = "";
    var bonusStr = "";
    var historyTipsStr = "";
    var historyOutPutTipsStr = "";
    var historyBonusTipsStr = "";
    var historyTimeStr = "";
    var historyOutPutStr = "";
    var historyInvitedStr = "";
    var bonusTips1Str = "";
    var bonusTips3Str = "";
    var bonusNumberStr = "";
    var bonusBonusStr = "";
    whatIsATeamStr = "What is a team?";
    answerStr = "The friends you invite, as well as the friends they invite, Can loop indefinitely. All belong to your team.";
    idStr = "ID";
    nameStr = "NAME";
    invitedStr = "INVITED";
    bonusStr = "TOTAL BONUS";
    historyTipsStr = "Every reward you received will immediately enter your deposit.";
    historyOutPutTipsStr = "Total Output Value";
    historyBonusTipsStr = "Total Bonus";
    historyTimeStr = "TIME";
    historyOutPutStr = "OUTPUT INCOME";
    historyInvitedStr = "INVITED INCOME";
    bonusTips1Str = "The more people you invite, the more rewards you get for every 100 people in your team";
    bonusTips3Str = "winnings output value!";
    bonusNumberStr = "NUMBER OF INVITEES";
    bonusBonusStr = "BONUS";
    this.node_teamView_lab_whatIsATeam.getComponent(cc.Label).string = whatIsATeamStr;
    this.node_teamView_lab_answer.getComponent(cc.Label).string = answerStr;
    this.node_teamView_lab_id.getComponent(cc.Label).string = idStr;
    this.node_teamView_lab_name.getComponent(cc.Label).string = nameStr;
    this.node_teamView_lab_invited.getComponent(cc.Label).string = invitedStr;
    this.node_teamView_lab_totalBonus.getComponent(cc.Label).string = bonusStr;
    this.node_historyView_lab_tips.getComponent(cc.Label).string = historyTipsStr;
    this.node_historyView_lab_totalOutputTips.getComponent(cc.Label).string = historyOutPutTipsStr;
    this.node_historyView_lab_totalBonusTips.getComponent(cc.Label).string = historyBonusTipsStr;
    this.node_historyView_lab_time.getComponent(cc.Label).string = historyTimeStr;
    this.node_historyView_lab_outPut.getComponent(cc.Label).string = historyOutPutStr;
    this.node_historyView_lab_invited.getComponent(cc.Label).string = historyInvitedStr;
    this.node_bonusView_lab1.getComponent(cc.Label).string = bonusTips1Str;
    this.node_bonusView_lab3.getComponent(cc.Label).string = bonusTips3Str;
    this.node_bonusView_titleNode_lab_number.getComponent(cc.Label).string = bonusNumberStr;
    this.node_bonusView_titleNode_lab_bonus.getComponent(cc.Label).string = bonusBonusStr;
    if (this.curTypeStr == "teamView") {
      this.node_teamView.active = true;
      this.node_historyView.active = false;
      this.node_bonusView.active = false;
      this.sendTeamRecordReq();
    } else if (this.curTypeStr == "historyView") {
      this.node_teamView.active = false;
      this.node_historyView.active = true;
      this.node_bonusView.active = false;
      this.sendHistoryRecordReq();
    } else if (this.curTypeStr == "bonusView") {
      this.node_teamView.active = false;
      this.node_historyView.active = false;
      this.node_bonusView.active = true;
    }
    ;
  },
  showLeftViewByTypeStr: function showLeftViewByTypeStr(typeStr) {
    this.curTypeStr = typeStr;
  },
  sendTeamRecordReq: function sendTeamRecordReq() {
    var _this2 = this;
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/teamplayerincomerank";
    CommonFun.getInstance().httpGet(httpUrl, function (msg) {
      if (msg.result == 0) {
        if (msg.data && msg.data.rank && CommonFun.getInstance().isValidForScr(_this2)) {
          _this2.setTeamRecord(msg.data.rank);
        }
        ;
      } else {
        CommonFun.getInstance().showTips(msg.msg);
      }
      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  sendHistoryRecordReq: function sendHistoryRecordReq() {
    var _this3 = this;
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/income/record";
    CommonFun.getInstance().httpGet(httpUrl, function (msg) {
      if (msg.result == 0) {
        if (msg.data && CommonFun.getInstance().isValidForScr(_this3)) {
          _this3.setHistoryRecord(msg.data);
        }
        ;
      } else {
        CommonFun.getInstance().showTips(msg.msg);
      }
      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  setTeamRecord: function setTeamRecord(rank) {
    if (rank && rank.length >= 1) {
      for (var i = 0, len = rank.length; i < len; i++) {
        if (i >= 9) {
          return;
        }
        ;
        var element = rank[i];
        this["node_teamView_lab_id_" + i].getComponent(cc.Label).string = element["did"];
        this["node_teamView_lab_name_" + i].getComponent(cc.Label).string = element["name"];
        this["node_teamView_lab_invited_" + i].getComponent(cc.Label).string = element["invite_num"];
        this["node_teamView_lab_totalBonus_" + i].getComponent(cc.Label).string = element["total_income"] / 100;
      }
      ;
    }
    ;
  },
  setHistoryRecord: function setHistoryRecord(data) {
    if (!data) {
      return;
    }
    ;
    this.node_historyView_lab_totalOutput.getComponent(cc.Label).string = data["total_income"] / 100;
    this.node_historyView_lab_totalBonus.getComponent(cc.Label).string = data["total_bonus"] / 100;
    if (data["day_record"]) {
      for (var i = 0, len = data["day_record"].length; i < len; i++) {
        if (i >= 7) {
          return;
        }
        ;
        var element = data["day_record"][i];
        this["node_historyView_lab_time_" + i].getComponent(cc.Label).string = this.transformTimestamp(element["time"]);
        this["node_historyView_lab_outPut_" + i].getComponent(cc.Label).string = element["income"] / 100;
        this["node_historyView_lab_invited_" + i].getComponent(cc.Label).string = element["bonus"] / 100;
      }
      ;
    }
    ;
  },
  transformTimestamp: function transformTimestamp(timestamp) {
    var time = new Date(timestamp * 1000);
    var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
    var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
    var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
    return y + '-' + M + '-' + d;
  }
});

cc._RF.pop();