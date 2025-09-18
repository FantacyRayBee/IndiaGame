const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/BetInfoCtrl')
export default class BetInfoCtrl extends cc.Component {

    @property(cc.Label)
    private lab_totalBet: cc.Label = null;


    initBetInfo() {
        this.lab_totalBet.string = "";
    }
    
    /**
     * 设置玩家累计下注的总金额
     * @param totalBet 累计下注的总金额
     */
    setBetInfoTotalBet(totalBet: number) {
        //@ts-ignore
        this.lab_totalBet.string = `${CommonFun.getInstance().numberToShow(totalBet / 100)}`;
    }

    getBetInfoTotalBet() {
        return this.lab_totalBet.string;
    }
}
