import { pgGameEvent } from "../script/PgEvent";
import CocosUtil from "./CocosUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class CompDissItem extends cc.Component {
    private _info: any

    parent: cc.Node;
    init(parent: cc.Node) {
        this.parent = parent
    }

    start() {
        CocosUtil.addClickEvent(this.node, function () {
            // EventCenter.getInstance().fire(GameEvent.ui_show_hisdetail_tip, this.parent, this._info);
            cc.systemEvent.emit(pgGameEvent.ui_show_hisdetail_tip, this.parent, this._info);
        }, this, null, 1.01);
    }

    setData(data: any) {
        this._info = data;
    }
}


