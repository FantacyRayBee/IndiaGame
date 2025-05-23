import { cmd } from "../../../../../script/config/cmd";
import { gameHelper } from "../../../../../script/config/config";
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
import { currency } from "../../../../../script/pkg/currency";
import { BaseView } from "./BaseView";
import CocosUtil from "./CocosUtil";
import { CompDissItem } from "./CompDissItem";
import { HisLineAward } from "./HisLineAward";
import StringUtil from "./StringUtil";
import { UIhistory } from "./UIhistory";
import { HisLineAwardInfo, RoundDetailInfo, Tsymbol } from "./interface/recorddetail";

const { ccclass, property } = cc._decorator;




@ccclass
export class CompHisPage extends BaseView {
    @property(cc.Node)
    ndElementParent: cc.Node;
    @property(cc.Node)
    ndIsAward: cc.Node;
    @property(cc.Prefab)
    prfAwardLine: cc.Prefab
    @property(cc.SpriteFrame)
    sprites: cc.SpriteFrame[] = [];
    @property(cc.Node)
    ndAwardLineParent: cc.Node;
    select: number[][] = [
        [0, 1, 2],
        [0, 4, 3],
        [0, 4, 5],
        [3, 4, 2],
        [3, 4, 5],
        [3, 7, 5],
        [3, 7, 8],
        [6, 7, 5],
        [6, 7, 8],
        [6, 10, 8]
    ]

    protected onLoad(): void {
        CocosUtil.traverseNodes(this.node, this.m_ui);

        this.m_ui.lb_jyno.color = UIhistory.themeColor
        this.m_ui.lb_tz.color = UIhistory.themeColor
        this.m_ui.lb_yl.color = UIhistory.themeColor
        this.m_ui.lb_ye.color = UIhistory.themeColor

        this.m_ui.lb_tz.getComponent(cc.Label).string = tcI18n.i18nLabel("history_depage_bet", [currency.getSymbol()])
        this.m_ui.lb_yl.getComponent(cc.Label).string = tcI18n.i18nLabel("history_depage_profit", [currency.getSymbol()])
        this.m_ui.lb_ye.getComponent(cc.Label).string = tcI18n.i18nLabel("history_depage_balance", [currency.getSymbol()])
    }

    private _data: any
    setData(data: any, isFree: boolean, hasNext: boolean) {
        this._data = data
        let labs: { [key: string]: cc.Label } = {};
        CocosUtil.traverseNodes(this.node, this.m_ui)
        CocosUtil.traverseLabels(this.node, labs)

        labs.lb_order_no.string = StringUtil.lineStr(data.round_no) || ""; // 交易单号


        if (data.leftTimes != undefined && data.leftTimes > -1 && data.leftTimes < 7) {
            labs.lb_bet_num.string = currency.formatNoSymbol(0)
        } else {
            labs.lb_bet_num.string = currency.formatNoSymbol(data.bet)  //(data.bet && MoneyUtil.rmbStr(data.bet)) || "0.00"; //投注
        }


        labs.lb_profit_num.string = currency.formatNoSymbol(data.player_win_lose)
        labs.lb_balance_num.string = currency.formatNoSymbol(data.balance)
        labs.lb_betvalue.string = tcI18n.i18nLabel("tool_bet_options_bet_size") + " " + currency.formatWithSymbol(data.bet_size)
        labs.lb_betrate.string = tcI18n.i18nLabel("tool_bet_options_bet_level") + " " + (data.bet_multiple || "0"); //投注倍数
        this.ndIsAward.active = true   //无中奖组合

        this.m_ui.BgFortune.active = false
        this.m_ui.BgNor.active = true

        if (data.leftTimes != undefined && data.leftTimes > -1) {
            this.m_ui.BgFortune.active = true
            this.m_ui.BgNor.active = false
        }

        if (data.hits && data.hits.length > 0) {
            for (let index = 0; index < 12; index++) {
                this.itemSetHide(index)
            }
        } else {
            for (let index = 0; index < 12; index++) {
                this.itemSetShow(index)
            }
        }


        data.screen.forEach((item, idx) => {
            this.itemSetData(item, idx)
        })


        if ((!data.hits || data.hits.length == 0) && (data.prize - data.bet) > 0) {
            for (let index = 0; index < 12; index++) {
                this.itemSetHide(index)
            }
            let node = cc.instantiate(this.prfAwardLine);
            this.ndAwardLineParent.addChild(node);
            let element: HisLineAwardInfo = {}
            element.win = data.prize
            node.getComponent(HisLineAward).setData(element, 0)

            data.screen.forEach((data: Tsymbol, idx) => {
                if (data.id == 9) {
                    this.itemSetShow(idx)
                }
            })
            this.ndIsAward.active = false
        }



        if (!data.hits || data.hits.length == 0) return

        this.ndIsAward.active = false

        for (let index = 0; index < data.hits.length; index++) {
            const element = data.hits[index];
            let node = cc.instantiate(this.prfAwardLine);
            this.ndAwardLineParent.addChild(node);
            node.getComponent(CompDissItem).init(this.m_ui.kong)

            let tmpdata = {
                dataArr: data,
                item: node,
                itemData: element
            }
            node.getComponent(CompDissItem).setData(tmpdata)
            node.getComponent(HisLineAward).setData(element, index)
            let tmp: number[] = []
            // 0,1,2,  3,4,5,  6,7,8,  9,10,11
            for (let ii = 0; ii < 3; ii++) {
                let num: number = this.select[(element.lineId - 1)][ii]
                tmp.push(num)
                let ele: cc.Node = this.ndElementParent.getChildByName("UIHisItem_" + num)
                let icon: cc.Node = ele.getChildByName("icon")
                let awardbg: cc.Node = ele.getChildByName("awardbg")
                let lab: cc.Node = ele.getChildByName("lab")
                icon.color = cc.color(255, 255, 255, 255);
                lab.color = cc.color(255, 255, 255, 255);
                awardbg.active = true
            }
            tcLog.log("tmp:", tmp)
        }
    }
    async itemSetHide(idx) {
        let ele: cc.Node = this.ndElementParent.getChildByName("UIHisItem_" + idx)
        let icon: cc.Node = ele.getChildByName("icon")
        let awardbg: cc.Node = ele.getChildByName("awardbg")
        let lab: cc.Node = ele.getChildByName("lab")
        icon.color = cc.color(170, 170, 170, 255);
        lab.color = cc.color(170, 170, 170, 255);
        awardbg.active = false
    }
    async itemSetShow(idx) {
        let ele: cc.Node = this.ndElementParent.getChildByName("UIHisItem_" + idx)
        let icon: cc.Node = ele.getChildByName("icon")
        let awardbg: cc.Node = ele.getChildByName("awardbg")
        let lab: cc.Node = ele.getChildByName("lab")
        icon.color = cc.color(255, 255, 255, 255);
        lab.color = cc.color(255, 255, 255, 255);
        awardbg.active = false

        if (this._data.screen[idx].id == 9) {
            icon.getComponent(cc.Sprite).spriteFrame = this.sprites[9];
        }
    }

    itemSpire = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 51: 5, 81: 6, 82: 7, 9: 8, };
    async itemSetData(item, idx) {
        let ele: cc.Node = this.ndElementParent.getChildByName("UIHisItem_" + idx)
        let icon: cc.Node = ele.getChildByName("icon")
        let lab: cc.Node = ele.getChildByName("lab")
        let itemId = this.itemSpire[item.id]
        icon.getComponent(cc.Sprite).spriteFrame = this.sprites[itemId];

        if (item.id == 9) {
            lab.active = true
            let value: number = item.multi

            let fontName = "font1";
            let times = value / 10
            if (times >= 10 && times < 50) {
                fontName = "font3";
            } else if (times >= 50) {
                fontName = "font4";
            }
            let fontAsset = await tcRes.load(gameHelper.getBundleName(cmd.SERVER_TYPE_FORTUNE_RABBIT), cc.Font, `artwork/font/${fontName}`);
            lab.getComponent(cc.Label).font = fontAsset;
            lab.getComponent(cc.Label).string = currency.formatNoSymbol(currency.accMul(item.multi,
                this._data.bet_size * this._data.bet_multiple))


        } else {
            lab.active = false
            lab.getComponent(cc.Label).string = ""
        }
        if (idx == 9 || idx == 11) {
            ele.active = false
        }

    }
}