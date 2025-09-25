cc.Class({
    extends: cc.Component,

    properties: {
        node1: cc.Node,
        node2: cc.Node,

        lab_level1: cc.Label,
        lab_dayTake1: cc.Label,
        lab_weekTake1: cc.Label,
        lab_monthTake1: cc.Label,
        lab_dayWithdrawCountLimit1: cc.Label,
        lab_gachaCount1: cc.Label,

        lab_level2: cc.Label,
        lab_dayTake2: cc.Label,
        lab_weekTake2: cc.Label,
        lab_monthTake2: cc.Label,
        lab_dayWithdrawCountLimit2: cc.Label,
        lab_gachaCount2: cc.Label,
    },

    setVipRulesRuleItemData: function (data) {
        let node1Data = data.node1Data;
        let node2Data = data.node2Data;
        if (node1Data) {    
            this.lab_level1.string = node1Data.level;
            if (node1Data.level <= GlobalCfg.USER_DATAS.userVip.level) {
                this.lab_dayTake1.string = `$${node1Data.dayTake/100}`;
                this.lab_weekTake1.string = `$${node1Data.weekTake/100}`;
                this.lab_monthTake1.string = `$${node1Data.monthTake/100}`;
                this.lab_dayWithdrawCountLimit1.string = node1Data.dayWithdrawCountLimit;
                this.lab_gachaCount1.string = node1Data.gachaCount;
            }
            else {
                this.lab_dayTake1.string = "-";
                this.lab_weekTake1.string = "-";
                this.lab_monthTake1.string = "-";
                this.lab_dayWithdrawCountLimit1.string = "-";
                this.lab_gachaCount1.string = "-";
            };
        }
        else {
            this.lab_level1.string = "-";
            this.lab_dayTake1.string = "-";
            this.lab_weekTake1.string = "-";
            this.lab_monthTake1.string = "-";
            this.lab_dayWithdrawCountLimit1.string = "-";
            this.lab_gachaCount1.string = "-";
        };

        if (node2Data) {    
            this.lab_level2.string = node2Data.level;
            if (node2Data.level <= GlobalCfg.USER_DATAS.userVip.level) {
                this.lab_dayTake2.string = `$${node2Data.dayTake/100}`;
                this.lab_weekTake2.string = `$${node2Data.weekTake/100}`;
                this.lab_monthTake2.string = `$${node2Data.monthTake/100}`;
                this.lab_dayWithdrawCountLimit2.string = node2Data.dayWithdrawCountLimit;
                this.lab_gachaCount2.string = node2Data.gachaCount;
            }
            else {
                this.lab_dayTake2.string = "-";
                this.lab_weekTake2.string = "-";
                this.lab_monthTake2.string = "-";
                this.lab_dayWithdrawCountLimit2.string = "-";
                this.lab_gachaCount2.string = "-";
            };
        }
        else {
            this.lab_level2.string = "-";
            this.lab_dayTake2.string = "-";
            this.lab_weekTake2.string = "-";
            this.lab_monthTake2.string = "-";
            this.lab_dayWithdrawCountLimit2.string = "-";
            this.lab_gachaCount2.string = "-";
        };
    }
});
