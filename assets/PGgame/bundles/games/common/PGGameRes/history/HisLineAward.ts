import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { currency } from "../../../../../script/pkg/currency";
import { HisLineAwardInfo } from "./interface/recorddetail";

const { ccclass, property } = cc._decorator;


@ccclass
export class HisLineAward extends cc.Component {
    @property(cc.Label)
    lb_idx: cc.Label;
    @property(cc.Sprite)
    icon_fuhao: cc.Sprite;
    @property(cc.Label)
    lb_x10: cc.Label;
    @property(cc.Node)
    dot: cc.Node;
    @property(cc.SpriteFrame)
    lineImages: cc.SpriteFrame[] = [];

    setData(data: HisLineAwardInfo, idx: number) {
        if (data.lineId != undefined) {
            this.lb_idx.string = (idx + 1) < 10 ? `0${idx + 1}` : `${idx + 1}`
            this.icon_fuhao.spriteFrame = this.lineImages[data.lineId - 1];
            this.lb_x10.string = currency.formatWithSymbol(data.win * 10);
        } else {
            this.lb_idx.string = tcI18n.i18nLabel("history_line_award")
            this.lb_x10.string = currency.formatWithSymbol(data.win);
        }

        this.icon_fuhao.node.active = data.lineId != undefined
        this.dot.active = data.lineId != undefined
    }
}


