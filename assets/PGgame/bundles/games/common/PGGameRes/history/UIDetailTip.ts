
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../../script/framework/log/log";
import { currency } from "../../../../../script/pkg/currency";
import { pgGameEvent } from "../script/PgEvent";
import { BaseView } from "./BaseView";
import CocosUtil from "./CocosUtil";
import MoneyUtil from "./MoneyUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class UIDetailTip extends BaseView {

    itemScore = { 51: 200, 82: 100, 81: 50, 4: 10, 3: 5, 2: 3, 1: 2 };
    info: any;

    onLoad(): void {
        CocosUtil.traverseNodes(this.node, this.m_ui);
    }

    start() {
        CocosUtil.addClickEvent(this.node, function () {
            this.node.removeFromParent()
        }, this);
    }

    initData(info: any) {
        if (!info) {
            return;
        }
        tcLog.log("UIDetailTip", info)
        CocosUtil.traverseNodes(this.node, this.m_ui);
        this.info = info
        let datas = info.dataArr;


        // "tool_bet_options_bet_size": "Aposta",
        // "tool_bet_options_bet_level": "Nível de aposta",

        this.m_ui.lb_tiptxt.getComponent(cc.Label).string = tcI18n.i18nLabel("tool_bet_options_bet_size") +
            " x " + tcI18n.i18nLabel("tool_bet_options_bet_level") +
            " x " + tcI18n.i18nLabel("history_line_bet_Symbol")
        this.m_ui.lab_gongshi.getComponent(cc.Label).string =
            currency.formatNoSymbol(datas.bet_size) + " x " + datas.bet_multiple + " x "
            + this.itemScore[info.itemData.symbol];


        this.node.getChildByName("bg_corner4").active = false
        this.scheduleOnce(() => {
            this.node.getChildByName("bg_corner4").active = true
            let pos = CocosUtil.convertSpaceAR(info.item, this.node);
            pos.set(new cc.Vec3(pos.x, pos.y - 116, pos.z));
            this.node.getChildByName("bg_corner4").setPosition(pos);
        }, 0.06);
    }

}


