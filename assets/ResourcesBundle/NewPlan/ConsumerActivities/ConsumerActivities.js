/**
 * 
2.领取下注返利
POST v1/betrebate/claim
type ClaimBetRebateReq struct {
  Bet int json:"bet" // 选中的下注额
}
 */
cc.Class({
    extends: cc.Component,

    properties: {
        itemParent: cc.Node,
        labelTimeCountdown: cc.Label,
        btnClose: cc.Button,
        prefabItem: cc.Prefab,
        spriteFrameNothing: cc.SpriteFrame,
        spriteFrames: [cc.SpriteFrame],
    },


    onLoad() {
        this.btnClose.node.on('click', () => {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }, this);
    },

    start() {
        /**
         * 字段"betrebate"
          结构:
          type BetRebateInfo struct {
            Bet  int64           json:"bet"  // 玩家总下注
            Item []BetRebateItem json:"item" // 返利
          }
	
          type BetRebateItem struct {
            Bet      int  json:"bet"      // 下注额
            Rebate   int  json:"rebate"   // 返利额
            Received bool json:"received" // 已领取
          }
         */
        this.labelTimeCountdown.string = CommonFun.getInstance().getTodayCountdown();
        this.scheduleGetTodayTimeCountdown = () => {
            this.labelTimeCountdown.string = CommonFun.getInstance().getTodayCountdown();
        }
        this.schedule(this.scheduleGetTodayTimeCountdown, 1);
        this.dealItemData(GlobalCfg.USER_DATAS.betrebate.item);
    },

    onDestroy() {
        this.unschedule(this.scheduleGetTodayTimeCountdown);
    },

    // update (dt) {},

    /**
     * 
     * @param {Array<BetRebateItem>} data 
     */
    dealItemData(data) {
        this.itemParent.removeAllChildren();
        data = data.sort(function (a, b) {
            return a.bet - b.bet;
        });
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let betRebateItem = data[i];
            if (i == 0) {
                this.initItemNode(betRebateItem, i, false);
            } else {
                if (GlobalCfg.USER_DATAS.betrebate.bet / data[i - 1].bet >= 1){
                    this.initItemNode(betRebateItem, i, false, length);
                }else{
                    this.initItemNode(betRebateItem, i, true, length);
                }
            }
        }
    },

    /**
     * 
     * @param {BetRebateItem} data 
     * @param {number} index
     * @param {boolean} unShowNum 不展示详细数字
     */
    initItemNode(data, index, unShowNum = false , itemLength) {
        let selfCurBet = GlobalCfg.USER_DATAS.betrebate.bet / 100;
        let itemNode = cc.instantiate(this.prefabItem);
        let pic = itemNode.getChildByName("pic").getComponent(cc.Sprite);
        let labelGet = itemNode.getChildByName("amount").getComponent(cc.Label);
        let progressBar = itemNode.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
        let progressBarLabel = progressBar.node.getChildByName("Label").getComponent(cc.Label);
        let nodeReceived = itemNode.getChildByName("mask");
        let nodeSelect = itemNode.getChildByName("select");
        nodeReceived.active = false;
        nodeSelect.active = false;
        let bet = data.bet ? data.bet / 100 : 0;
        let rebate = data.rebate / 100;
        let received = data.received;
        if (bet == 0) {
            LoggerUtil.getInstance().error("Current BetRebateItem bet is null or 0, please check BetRebateItem")
            return;
        }
        if (rebate == 0) {
            pic.spriteFrame = this.spriteFrameNothing;
        } else {
            pic.spriteFrame = this.spriteFrames[index];
        }
        let percent = Number((selfCurBet / bet).toFixed(2));
        if (percent >= 1) {
            progressBar.progress = 1;
            labelGet.string = "$" + CommonFun.getInstance().numberToShow(rebate);
            progressBarLabel.string = CommonFun.getInstance().numberToShow(bet) + " / " + CommonFun.getInstance().numberToShow(bet);
            if (received == true) {
                nodeReceived.active = true;
                nodeSelect.active = false;
            } else {
                nodeReceived.active = false;
                nodeSelect.active = true;
                itemNode.on(cc.Node.EventType.TOUCH_END, () => {
                    GlobalCfg.G_COMPONENTS.Audio.playButton();
                    this.getRebateSendMsg(data.bet, itemNode);
                }, this);
            }
        } else {
            if(unShowNum){
                progressBar.progress = 0;
                progressBarLabel.string = "??? / ???";
                labelGet.string = '???'
            }else{
                progressBar.progress = percent;
                labelGet.string = "$" + CommonFun.getInstance().numberToShow(rebate);
                progressBarLabel.string = CommonFun.getInstance().numberToShow(selfCurBet) + " / " + CommonFun.getInstance().numberToShow(bet);
            }
        }
        if(index == itemLength -1){
            // 特殊对待最后一项，展示出来
            labelGet.string = "$" + rebate;
        }
        itemNode.parent = this.itemParent;
    },

    getRebateSendMsg(bet, itemNode) {
        // type ClaimBetRebateAck struct {
        //   Rebate Item json:"rebate" // 返利
        // }
        // // Item 物品
        // type Item struct {
        //   Id     uint32 json:"id"     // 10 dep, 11 winnings, 12 bonus
        //   Amount int64  json:"amount" // 金币数额单位为分
        // }
        CommonFun.getInstance().showProgress("");
        let url = GlobalCfg.HTTP_SERVER + "/v1/betrebate/claim";
        CommonFun.getInstance().httpPost(url, { bet: bet }, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                let data = msg.data;
                let rebate = data.rebate;
                let id = rebate.id;
                switch (id) {
                    case 10:
                        GlobalCfg.USER_DATAS.deposit += rebate.amount;
                        break;
                    case 11:
                        GlobalCfg.USER_DATAS.winnings += rebate.amount;
                        break;
                    case 12:
                        GlobalCfg.USER_DATAS.bonus += rebate.amount;
                        break;
                    default:
                        break;
                }
                GlobalCfg.USER_DATAS.userDiamond = GlobalCfg.USER_DATAS.deposit + GlobalCfg.USER_DATAS.winnings;
                CommonFun.getInstance().showRewardsTips([{ id: 10, amount: rebate.amount / 100 }]);
                this.updateClientBetrebateData(rebate.amount);
                ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
                    msgCode: GlobalCfg.CLIENT_MSG_ID.ACTIVITY_GOBETTING_GET,
                    msgData: {}
                });
                if (itemNode) {
                    itemNode.getChildByName("mask").active = true;
                    itemNode.getChildByName("select").active = false;
                    itemNode.off(cc.Node.EventType.TOUCH_END);
                }
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    /**
     * 
     * @param {number} rebate 
     */
    updateClientBetrebateData(rebate) {
        let length = GlobalCfg.USER_DATAS.betrebate.item.length;
        for (let i = 0; i < length; i++) {
            if (GlobalCfg.USER_DATAS.betrebate.item[i].rebate == rebate) {
                GlobalCfg.USER_DATAS.betrebate.item[i].received = true;
            }
        }
    },
});


