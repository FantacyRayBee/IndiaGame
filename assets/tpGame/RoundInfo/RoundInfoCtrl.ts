const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/RoundInfoCtrl')
export default class RoundInfoCtrl extends cc.Component {

    @property(cc.Label)
    private lab_content: cc.Label = null;

    /**
     * 设置轮次信息轮次次数
     * @param round 轮次
     */
    setRoundInfoRound(round: number) {
        this.lab_content.string = `Round ${round}/50`;
    }
}
