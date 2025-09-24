"use strict";
cc._RF.push(module, 'f01b6A9u7RE5qu9Dy4ta1TD', 'APIManager');
// Main/Script/Common/UtilTools/APIManager.js

"use strict";

var APIManager = cc.Class({
  statics: {
    _instance: null
  },
  get_pdd_api_data: function get_pdd_api_data() {
    /**
     * 
     * CreateTime int64 json:"create_time"
        Quota       int json:"quota"        // 额度
        UsedCount   int json:"used_count"   // 已抽次数
        RemainCount int json:"remain_count" // 剩余次数
        Unclaimed   int json:"unclaimed"    // 待领取
        GoldCoin    int json:"gold_coin"    // 金币
        DoubleCard  int json:"double_card"  // 双倍卡个数
         Address TakeProfitAddress json:"address" // 提现地址
     */
    var url = GlobalCfg.HTTP_SERVER + "/v1/pdd/info";
    return new Promise(function (resolve, reject) {
      resolve({}); // CommonFun.getInstance().httpGet(url, (strInfo) => {
      //     if (strInfo.result == 0) {
      //         let data = strInfo.data;
      //         resolve(data);
      //     } else {
      //         reject("网络错误");
      //     }
      // })
    });
  }
});

APIManager.getInstance = function () {
  if (!APIManager._instance) {
    APIManager._instance = new APIManager();
  }

  ;
  return APIManager._instance;
};

module.exports = APIManager;
window.APIManager = APIManager;

cc._RF.pop();