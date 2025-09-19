const {ccclass, property} = cc._decorator;

@ccclass
export default class SignItemCtrl extends cc.Component {

    @property(cc.Label)
    private lab_reward: cc.Label = null;

    @property(cc.Label)
    private lab_day: cc.Label = null;

    @property(cc.Node)
    private node_signed: cc.Node = null;

    @property(cc.Node)
    private node_unsigned: cc.Node = null;

    setSignItemData(gift, today, done, day) {
        this.lab_reward.string = `₹${gift/100}`;
        this.lab_day.string = `Day${day}`;

        if (today > day) {
            this.node_signed.active = true;
            this.node_unsigned.active = false;
        }
        else if (today == day && done == true) {
            this.node_signed.active = true;
            this.node_unsigned.active = false;
        }
        else if (today == day && done == false) {
            this.node_signed.active = false;
            this.node_unsigned.active = true;
        }
        else {
            this.node_signed.active = false;
            this.node_unsigned.active = false;
        };
    }

    setSignItemSigned() {
        this.node_signed.active = true;
        this.node_unsigned.active = false;
    }
}
