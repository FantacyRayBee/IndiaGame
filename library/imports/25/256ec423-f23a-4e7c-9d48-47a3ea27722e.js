"use strict";
cc._RF.push(module, '256ecQj8jpOfJ1IR6PqJ3Iu', 'zooRecord');
// zooGame/Scripts/zooRecord.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    nodeList: {
      "default": null,
      type: cc.Node,
      tooltip: "历史记录父节点"
    },
    prefabItem: {
      "default": null,
      type: cc.Prefab,
      tooltip: "节点模板"
    }
  },
  ctor: function ctor() {
    this.recordDataList = []; // 历史记录数据

    this.recordNodeList = []; // 历史记录节点
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.posList = [cc.v2(-300, 0), cc.v2(-178, 0), cc.v2(-56, 0), cc.v2(66, 0), cc.v2(188, 0), cc.v2(310, 0)];
  },
  start: function start() {},

  /**
   * 初始化节点 / 多条记录刷新节点 
   */
  initItem: function initItem(data) {
    if (data.length > 6) {
      this.recordDataList = data.slice(data.length - 6, data.length);
    } else {
      this.recordDataList = data;
    }

    this.nodeList.removeAllChildren();
    this.recordNodeList.length = 0;
    var length = this.recordDataList.length;

    for (var i = 0; i < length; i++) {
      var spriteType = this.recordDataList[i];
      var itemNode = cc.instantiate(this.prefabItem);
      itemNode.getComponent('zooRecordItem').setData(spriteType);
      itemNode.setPosition(this.posList[i]);

      if (i == length - 1) {
        itemNode.getComponent('zooRecordItem').showBg(true);
      } else {
        itemNode.getComponent('zooRecordItem').showBg(false);
      }

      this.nodeList.addChild(itemNode);
      this.recordNodeList.push(itemNode);
    }
  },

  /**
   * 单条记录更新节点展示
   * @param {*} newRecord 最新记录
   */
  updateRecord: function updateRecord(newRecord) {
    if (this.recordNodeList.length >= 6) {
      var firstNode = this.recordNodeList.shift();

      if (firstNode && firstNode.isValid) {
        firstNode.destroy();
      }

      this.recordDataList.shift();
    }

    var lastNode = this.recordNodeList[this.recordNodeList.length - 1];

    if (lastNode) {
      lastNode.getComponent('zooRecordItem').showBg(false);
    }

    this.recordDataList.push(newRecord);
    var itemNode = cc.instantiate(this.prefabItem);
    itemNode.getComponent('zooRecordItem').setData(newRecord);
    itemNode.getComponent('zooRecordItem').showBg(true);
    this.nodeList.addChild(itemNode);
    this.recordNodeList.push(itemNode);

    for (var i = 0; i < this.recordNodeList.length; i++) {
      var _itemNode = this.recordNodeList[i];

      _itemNode.setPosition(this.posList[i]);
    }

    LoggerUtil.getInstance().log("\u66F4\u65B0\u8BB0\u5F55\uFF0C\u5F53\u524D\u8BB0\u5F55\u4E3A\uFF1A" + this.recordDataList);
  },

  /**
   * 返回最新的记录坐标
   * @returns {cc.v2}
   */
  getEndNodePos: function getEndNodePos() {
    if (this.recordNodeList.length == 0) {
      return this.posList[0];
    } else {
      return this.recordNodeList[this.recordNodeList.length - 1].getPosition();
    }
  } // update (dt) {},

});

cc._RF.pop();