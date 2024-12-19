"use strict";
cc._RF.push(module, '21ad0jP1KNOKZthVx6VJ/8P', 'bigWinner_indexCtrl');
// sscGame/sscScr/bigWinner_indexCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {
    labs: [cc.Label],
    sprite_bg: cc.Sprite
  },
  setwinnerIndex: function setwinnerIndex(date) {
    var imgUrl = date.bigWinner.imgUrl;
    this.labs[0].string = CommonFun.getInstance().getStrByLength(date.bigWinner.nickname, 15);
    this.labs[1].string = this.getLocalTime(date.time);
    this.labs[2].string = FloatCalculation.accDiv(date.bet, 100);
    this.labs[3].string = FloatCalculation.accDiv(date.win, 100);
    this.loadHeadSp(imgUrl, 64, this.sprite_bg);
  },
  getLocalTime: function getLocalTime(nS) {
    // let time = new Date(nS*1000);
    // time = time.toLocaleString(); 
    // return time.replace('/','-');

    var time = new Date(nS * 1000);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    if (month < 10) {
      month = '0' + month;
    }
    if (date < 10) {
      date = '0' + date;
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second;
  },
  onLoad: function onLoad() {},
  start: function start() {} // update (dt) {},
});

cc._RF.pop();