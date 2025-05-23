import { config } from "../../../../../script/config/config";
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
import { currency } from "../../../../../script/pkg/currency";
import { pgGameEvent } from "../script/PgEvent";
import { BaseView } from "./BaseView";
import CocosUtil from "./CocosUtil";
import DateUtil from "./DateUtil";
import MoneyUtil from "./MoneyUtil";
import RecordMgr from "./RecordMgr";
import { UIHisDetail } from "./UIHisDetail";
import { RecordListRsp } from "./interface/recorddetail";




const { ccclass, property } = cc._decorator;


@ccclass
export class UIhistory extends BaseView {
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;
    @property(cc.Node)
    fistTip: cc.Node = null;

    static isFristReqRecord: boolean = false

    static req_history: "/record/list"  //历史记录
    static req_hisdetail: "/record/detail"  //历史记录

    static themeColor: cc.Color = cc.color(255, 178, 102, 255)        // 设置主题颜色


    onLoad() {
        tcLog.log("onLoad");
        CocosUtil.traverseNodes(this.node, this.m_ui);


        this.m_ui.loadtipBig = cc.find("aniRoot/loadtipBig", this.node)
        this.m_ui.content = cc.find("aniRoot/ScrollView/view/content", this.node)
        this.m_ui.lb_title_filter = cc.find("aniRoot/top/lb_title_filter", this.node)
        this.m_ui.lb_filter = cc.find("aniRoot/bottom/Node/lb_filter", this.node)
        this.m_ui.load_err = cc.find("aniRoot/load_err", this.node)

        this.m_ui.retry = cc.find("aniRoot/load_err/retry", this.node)
        this.m_ui.retry.addComponent(cc.Button)
        this.m_ui.err_close = cc.find("aniRoot/load_err/err_close", this.node)
        this.m_ui.err_close.addComponent(cc.Button)
        this.m_ui.lb_record_cnt = cc.find("aniRoot/bottom/Node/lb_record_cnt", this.node)
        this.m_ui.lb_total_bet = cc.find("aniRoot/bottom/Node/lb_total_bet", this.node)
        this.m_ui.lb_total_profit = cc.find("aniRoot/bottom/Node/lb_total_profit", this.node)
        this.m_ui.lb_tip_none = cc.find("aniRoot/lb_tip_none", this.node)

        this.m_ui.load_err.active = false


        cc.systemEvent.on(pgGameEvent.ref_record_filter, this.onSearchFilterChg, this);
        this.m_ui.ScrollView.on("scrolling", this.scrollViewEventHandler, this);

        this.m_ui.lab_bet.getComponent(cc.Label).string = tcI18n.i18nLabel("history_depage_bet", [currency.getSymbol()])
        this.m_ui.lab_profit.getComponent(cc.Label).string = tcI18n.i18nLabel("history_depage_profit", [currency.getSymbol()])


    }

    scrollViewEventHandler(scrollview, eventType) {
        if (!RecordMgr.getInstance().isFullData) {
            let solly = scrollview.getComponent(cc.ScrollView).content.y
            let _shi_len = RecordMgr.getInstance()._shi_len
            let _loaded = RecordMgr.getInstance()._loaded

            if (solly >= (_shi_len - 10) * 116 && !_loaded) {
                // tcLog.log(" _loaded:", solly);
                RecordMgr.getInstance()._loaded = true
                // this.scheduleOnce(this.getData, 3);
                this.getData()
            }
        }
    }


    async start() {
        tcLog.log("start");
        await this.waitAnim(false);
        this.fistTip.active = false;

        if (UIhistory.isFristReqRecord == false) {
            UIhistory.isFristReqRecord = true
            this.fistTip.active = true;
        }

        this.m_ui.retry?.on("click", async () => {
            this.m_ui.load_err.active = false;
            await this.waitAnim(false);
            this.getData();
        });

        this.m_ui.err_close?.on("click", async () => {
            cc.systemEvent.emit(pgGameEvent.close_history_view);
        });


        CocosUtil.addClickEvent(this.m_ui.btn_filter, function () {
            // UIManager.showView(EViewNames.UIselectdate, EUILayer.Dialog);
            cc.systemEvent.emit(pgGameEvent.open_his_selectdate_view);
        }, this);

    }


    onEnable() {
        tcLog.log("onEnable");
        this.initList();
        RecordMgr.getInstance().setFilter(1, 1);
    }

    protected onDestroy(): void {
        this.unschedule(this.getData);
    }

    waitAnim(isOpacity: boolean) {
        return new Promise<void>((resolve, reject) => {
            resolve();
            this.m_ui.loadtipBig.active = true;
            cc.Tween.stopAllByTarget(this.m_ui.loadtipBig.opacity);
            this.m_ui.loadtipBig.opacity = 255;
            if (isOpacity) {
                cc.tween(this.m_ui.loadtipBig).delay(0.3).to(0.2, { opacity: 0 }).call(() => {
                    resolve();
                }).start();
            } else {
                cc.tween(this.m_ui.loadtipBig).call(() => {
                    resolve();
                }).start();
            }
        })
    }

    private initList() {
        this.m_ui.content.removeAllChildren();
    }

    private async onSearchFilterChg() {
        this.initList()
        if (RecordMgr.getInstance().filterFrom == 1) {
            this.m_ui.lb_title_filter.getComponent(cc.Label).string = tcI18n.i18nLabel("history_filter_day")
            this.m_ui.lb_filter.getComponent(cc.Label).string = tcI18n.i18nLabel("history_filter_day")
        } else if (RecordMgr.getInstance().filterFrom == 7) {
            this.m_ui.lb_title_filter.getComponent(cc.Label).string = tcI18n.i18nLabel("history_filter_7day");
            this.m_ui.lb_filter.getComponent(cc.Label).string = tcI18n.i18nLabel("history_filter_7day");
        } else {
            let from = DateUtil.formatDay(RecordMgr.getInstance().filterFrom, "/");
            let to = DateUtil.formatDay(RecordMgr.getInstance().filterTo, "/");
            this.m_ui.lb_title_filter.getComponent(cc.Label).string = from + " - " + to;
            this.m_ui.lb_filter.getComponent(cc.Label).string = from + " - " + to;;
        }
        if (RecordMgr.getInstance()._offset == 0) {
            await this.waitAnim(false);
        }
        this.getData()
    }

    async getData() {
        let param: any = await this.refGetData()
        cc.tween(this.m_ui.loadtipBig).to(0.2, { opacity: 0 }).start();
        if (param) {
            this.onReqHistory(param);
        }
        return param
    }

    async refGetData(): Promise<any> {
        let param: any = await RecordMgr.getInstance().pullData();
        tcLog.log("refGetData", param);
        if (!param) {
            this.m_ui.load_err.active = true;
            return null
        }

        let cnt = param && param.data && param.data.count || 0;
        RecordMgr.getInstance()._dataCount = cnt;
        if (!param || !param.data || !param.data.list) {
            return param;
        }
        tcLog.log("_offset:", RecordMgr.getInstance()._offset);
        RecordMgr.getInstance()._shi_len += param.data.list.length
        RecordMgr.getInstance()._offset += 1;
        RecordMgr.getInstance().appendDatas(param);
        let len: number = RecordMgr.getInstance().getDataList().length
        tcLog.log("len", len);
        return param
    }

    private onReqHistory(param) {
        cc.systemEvent.emit(pgGameEvent.ui_req_loading_complete);
        this.fistTip.active = false;
        RecordMgr.getInstance()._loaded = false

        if (RecordMgr.getInstance().isFullData) {
            this.m_ui.loadtip_get_all.active = false;
            this.m_ui.lb_tip_get_all.active = true;

        } else {
            this.m_ui.loadtip_get_all.active = true;
            this.m_ui.lb_tip_get_all.active = false;
        }


        let data: RecordListRsp = param.data;
        // tcLog.log("onReqHistor...", data)
        this.m_ui.lb_record_cnt.getComponent(cc.Label).string = (data && data.count || 0) + " " + tcI18n.i18nLabel("history_bor_cnt");
        this.m_ui.lb_total_bet.getComponent(cc.Label).string = currency.formatWithSymbol(data && data.bet || 0)   // MoneyUtil.currencySymbol() + MoneyUtil.rmbStr(data && data.bet || 0);
        this.m_ui.lb_total_profit.getComponent(cc.Label).string = currency.formatWithSymbol(data && data.win || 0)  // MoneyUtil.currencySymbol() + MoneyUtil.rmbStr(data && data.win || 0);
        let cnt = data && data.count || 0;
        this.m_ui.lb_tip_none.active = (RecordMgr.getInstance()._offset == 1 && cnt <= 0);
        if (RecordMgr.getInstance()._offset == 1 && cnt <= 0) {
            this.m_ui.lb_tip_get_all.active = false
        }


        for (let i = 0; i < data.list.length; i++) {
            let item = cc.instantiate(this.itemPre);
            this.m_ui.content.addChild(item);
            if (!item.getComponent(HistoryItem)) item.addComponent(HistoryItem);
            let gameitem = item.getComponent(HistoryItem);
            if (gameitem) {
                gameitem.setGameID(data.list[i], i);
            }
        }
    }
}


class HistoryItem extends cc.Component {


    setGameID(data: any, idx: number): void {
        let conts: cc.Node = cc.find("conts", this.node)
        let layout = conts.getChildByName("layout");
        let otherInfo = layout.getChildByName("other");

        otherInfo.getChildByName("free_ra").color = UIhistory.themeColor
        otherInfo.getChildByName("lucky_neko_flag").color = UIhistory.themeColor
        otherInfo.getChildByName("continuous").getChildByName("icon").color = UIhistory.themeColor

        conts.getChildByName("lb_time").getComponent(cc.Label).string = DateUtil.formatTime1(data.createTime / 1000, 2);
        layout.getChildByName("lb_order").getComponent(cc.Label).string = data.order;
        conts.getChildByName("lb_bet").getComponent(cc.Label).string = currency.formatNoSymbol(data.bet);
        let profit = data.win;
        let lb_profit = conts.getChildByName("lb_profit").getComponent(cc.Label);
        lb_profit.string = currency.formatNoSymbol(data.win);
        lb_profit.node.color = profit > 0 && cc.color(255, 255, 255, 255) || cc.color(190, 190, 190, 255);
        this.node.color = idx % 2 == 0 && cc.color(52, 52, 63, 255) || cc.color(48, 48, 60, 255);


        otherInfo.getChildByName("free_ra").active = data.groupId.length > 0
        otherInfo.getChildByName("lucky_neko_flag").active = (data.win / data.bet) >= 5


        otherInfo.active = data.groupId.length > 0 || (data.win / data.bet) >= 5



        // {"createTime":1715911138098,"order":"2024051701585898106326",
        // "bet":21000,"win":84000,"normalRoundTimes":1,"leftTimes":-1,"groupId":""},


        this.node?.on("click", async () => {
            try {
                let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/history/UIHisDetail");
                let viewNode = cc.instantiate(node);
                viewNode.setParent(config.uiNode.dialog);
                let view = viewNode.getComponent(UIHisDetail);
                if (view) {
                    view.before(data);
                }
            } catch (err) {
                tcLog.error(`PgGameControlPanellogic show onClickBtnHistory error,${err}`);
            }
        });



    }

}

