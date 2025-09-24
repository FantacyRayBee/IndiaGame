"use strict";
cc._RF.push(module, 'c44b6hxe8BCBLWOsu8gJt1d', 'pab_jackpot_indexCtrl');
// sscGame/sscScr/pab_jackpot_indexCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lsbs: [cc.Label],
    node_crad: [cc.Node]
  },
  onLoad: function onLoad() {},
  showDate: function showDate(date) {
    this.lsbs[0].string = this.getLocalTime(date.time);
    this.lsbs[1].string = date.winner;
    this.lsbs[2].string = FloatCalculation.accDiv(date.win, 100);
    var cards = date.cards;

    for (var i = 0; i < cards.length; i++) {
      var sscCradCtrl = this.node_crad[i].getComponent("sscCradCtrl");
      sscCradCtrl.setCardInfo(cards[i]);
    }
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
  start: function start() {} // update (dt) {},

});

cc._RF.pop();