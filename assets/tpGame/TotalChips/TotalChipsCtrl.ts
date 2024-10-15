const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/TotalChipsCtrl')
export class TotalChipsCtrl extends cc.Component {

    @property(cc.Label)
    lab_totalChips: cc.Label = null;


    /**
     * 设置总下注池金额
     * @param amount 总下注池金额。
     */
    setTotalChipsAmount(amount: number) {
        //@ts-ignore
        this.lab_totalChips.string = `${CommonFun.getInstance().numberToShow(amount / 100)}`;
    };
};
