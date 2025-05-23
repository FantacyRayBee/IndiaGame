
const { ccclass, property } = cc._decorator;

// 日期
@ccclass
export class SharedRecordDateItem extends cc.Component {
    @property({ type: cc.Label })
    lbDate: cc.Label

    @property({ type: cc.Button })
    self: cc.Button

    private callback: Function

    onLoad() {
    }

    setCallback(cb: Function) {
        this.callback = cb;
    }

    setString(date: string) {
        this.lbDate.string = date;
    }

    onClick() {
        this.callback();
    }
}


