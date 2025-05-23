
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../../script/framework/log/log";
import { currency } from "../../../../../script/pkg/currency";
import { pgGameEvent } from "../script/PgEvent";
import { BaseView } from "./BaseView";
import CocosUtil from "./CocosUtil";
import { CompHisPage } from "./CompHisPage";
import DateUtil from "./DateUtil";
import MoneyUtil from "./MoneyUtil";
import RecordMgr from "./RecordMgr";
import { UIDetailTip } from "./UIDetailTip";
import { UIhistory } from "./UIhistory";
import { RecordDetailInfo, RoundDetailInfo } from "./interface/recorddetail";


const { ccclass, property } = cc._decorator;


@ccclass
export class UIHisDetail extends BaseView {
    @property(cc.Prefab)
    prfPage: cc.Prefab;
    @property(cc.Prefab)
    detailTipPeb: cc.Prefab;
    @property(cc.Boolean)
    isAnim: boolean = false;

    private _ddIndex: number = 0;
    private _param;

    private _curIdx: number = 0;
    private _detailData: RoundDetailInfo[] = null;
    private _data: RecordDetailInfo[] = null;
    private _expanded: boolean = false;

    private curcloneTip: cc.Node;

    private _beforeData: any = null;

    pages: cc.Node[] = [];

    _initedFL: boolean = false;


    protected onLoad(): void {
        CocosUtil.traverseNodes(this.node, this.m_ui);
        this.m_ui.btn_pre.active = false;
        this.m_ui.btn_next.active = false;
        this.m_ui.expand_arrow.active = false;
        this.m_ui.pan_frees.setPosition(cc.v3(0, 1800, 0))
        this.setExpanded(false);
        this.m_ui.aniRoot.opacity = 1;

        cc.tween(this.node).delay(0.5).call(() => {
            // UIManager.getView(EViewNames.UIhistory).active = false;
            cc.systemEvent.emit(pgGameEvent.close_history_view);
        }).start();


        this.m_ui.load_err.active = false

        this.m_ui.lb_title.color = UIhistory.themeColor
        this.m_ui.expand_arrow.color = UIhistory.themeColor
        this.m_ui.btn_close1.color = UIhistory.themeColor
        this.m_ui.arrow_pre.color = UIhistory.themeColor
        this.m_ui.arrow_next.color = UIhistory.themeColor

    }

    start() {
        this.m_ui.detailBG.active = false;
        this.m_ui.detailBG.on(cc.Node.EventType.TOUCH_END, () => {
            // CocosUtil.addClickEvent(this.m_ui.detailBG, function () {
            // this.m_ui.detailBG.active = false;
            cc.systemEvent.emit(pgGameEvent.ui_close_hisdetail_tip);
            if (this.curcloneTip && this.curcloneTip.isValid) {
                this.curcloneTip.destroy()
                this.curcloneTip = null;
            }
        })
        CocosUtil.addClickEvent(this.m_ui.btn_close, function () {
            cc.Tween.stopAllByTarget(this.node);
            // UIManager.getView(EViewNames.UIhistory).active = true;
            // UIManager.closeView(EViewNames.UIHisDetail);
            cc.systemEvent.emit(pgGameEvent.open_history_view);
            cc.systemEvent.emit(pgGameEvent.close_history_detail);
        }, this);

        CocosUtil.addClickEvent(this.m_ui.btn_pre, () => {
            let idx = this._ddIndex
            idx--;
            if (idx < 0) {
                idx = 0
            }
            this.turnPage(idx)
        }, this);

        CocosUtil.addClickEvent(this.m_ui.btn_next, () => {
            let idx = this._ddIndex
            idx++;
            let len = this.getTotalNum();
            if (idx > len - 1) {
                idx = len - 1;
            }
            this.turnPage(idx)
        }, this);

        CocosUtil.addClickEvent(this.m_ui.btn_expand, () => {
            if (this._data.length <= 1) {
                return;
            }
            this.setExpanded(!this._expanded);
        }, this);

        CocosUtil.addClickEvent(this.m_ui.btnClosePanFree, () => {
            this.setExpanded(false);
        }, this);

        CocosUtil.addClickEvent(this.m_ui.retry, async () => {
            this.m_ui.load_err.active = false;
            this.isAnim = false;
            await this.waitAnim(false);
            this.before(this._beforeData);
        }, this);

        CocosUtil.addClickEvent(this.m_ui.err_close, () => {
            cc.Tween.stopAllByTarget(this.node);
            // UIManager.getView(EViewNames.UIhistory).active = true;
            // UIManager.closeView(EViewNames.UIHisDetail);
            cc.systemEvent.emit(pgGameEvent.open_history_view);
            cc.systemEvent.emit(pgGameEvent.close_history_detail);
        }, this);

        cc.systemEvent.on(pgGameEvent.ui_show_hisdetail_tip, this.onShowDetailTip, this);
        cc.systemEvent.on(pgGameEvent.ui_close_hisdetail_tip, this.onHideDetailTip, this);

        this.scheduleOnce(() => {
            this.m_ui.aniRoot.opacity = 255;
        });


        cc.systemEvent.on(pgGameEvent.close_history_detail, this.onCloseDetailView, this);

    }

    private onCloseDetailView() {
        // this.node.active = false
        this.node.removeFromParent()
    }


    async before(data) {
        tcLog.log("selectOrder:", data);
        this._data = data;
        this._beforeData = data;
        this.waitAnim(false);
        let datas: any = await RecordMgr.getInstance().pullDetail(data.createTime, data.order, data.groupId)
        if (!datas[0]) {
            this.m_ui.load_err.active = true;
            return;
        }
        this.onDetailData(datas);
    }

    private setExpanded(bExp: boolean) {
        this._expanded = bExp;
        this.m_ui.expand_arrow.scaleY = bExp && -1 || 1
        if (bExp) {
            this.m_ui.pan_frees.active = bExp;
            cc.tween(this.m_ui.pan_frees)
                .to(0.4, { position: cc.v3(0, -59, 0) })
                .call(() => {
                    this.m_ui.pan_frees.getComponent(cc.Widget).enabled = true;
                })
                .start()
            this.initFreeList()
            this.highSelect();
        } else {
            cc.tween(this.m_ui.pan_frees)
                .to(0.4, { position: cc.v3(0, 1800, 0) })
                .call(() => {
                    this.m_ui.pan_frees.active = bExp;
                })
                .start()
        }
    }

    private highSelect() {
        for (let i = 0; i < this.m_ui.cont_frees.children.length; i++) {
            let ddd = this.m_ui.cont_frees.children[i];
            if (i == this._curIdx) {
                ddd.getChildByName("lb_free_rmn").color = UIhistory.themeColor
                ddd.getChildByName("lb_free_gld").color = UIhistory.themeColor
            } else {
                ddd.getChildByName("lb_free_rmn").color = cc.color(255, 255, 255, 255);
                ddd.getChildByName("lb_free_gld").color = cc.color(255, 255, 255, 255);
            }
        }
    }

    private onShowDetailTip(uiNode: cc.Node, info: any) {
        if (this.curcloneTip && this.curcloneTip.isValid || !info) {
            return;
        }
        this.m_ui.detailBG.active = true;
        let cloneTip: cc.Node = cc.instantiate(this.detailTipPeb)
        cloneTip.active = true;
        this.curcloneTip = cloneTip;
        cloneTip.getComponent(UIDetailTip).initData(info)
        uiNode.removeAllChildren()
        uiNode.addChild(cloneTip)
    }
    private onHideDetailTip() {
        this.m_ui.detailBG.active = false;
    }

    private onDetailData(detailInfo?: RecordDetailInfo[]) {
        this._curIdx = 0;
        this._data = detailInfo
        this._detailData = this._data[this._curIdx].round_list;
        if (!this._detailData) {
            return;
        }
        // tcLog.log("-----detail", this._data[this._curIdx].create_time);
        let curData = this._detailData[this._ddIndex];
        if (!curData) {
            return
        }
        this.m_ui.expand_arrow.active = this._data.length > 1;

        let create_time = DateUtil.formatTime2(this._data[this._curIdx].create_timestamp / 1000);
        // let tstr = create_time.substring(0, create_time.length - 3) + " (GMT+8:00)";
        let tstr = create_time + " (GMT+8:00)";

        this.m_ui.lb_title_filter.getComponent(cc.Label).string = tstr.replace(/-/g, "/");
        this.initPages();
        this.selectPage(this._curIdx);
    }

    private initPages() {
        let content = this.m_ui.pages;
        this.pages.forEach(v => v.destroy())
        this.pages.length = 0;
        let len = this.getTotalNum();
        tcLog.log("initPages", len);
        for (let i = 0; i < len; i++) {
            let one = cc.instantiate(this.prfPage);
            content.addChild(one);
            one.setPosition(810 * i, 0, 0);
            one.active = i == 0;
            this.pages[i] = one;
            this.refreshPageData(i);
        }
        this.waitAnim(true);
    }

    private getTotalNum() {
        let len = 0;
        this._data.forEach((detail) => {
            len += detail.round_list.length;
        });
        return len;
    }

    private findCurIdx(pageIdx: number) {
        let len = 0;
        for (let i = 0; i < this._data.length; i++) {
            let ele = this._data[i];
            let nextLen = len + ele.round_list.length;
            if (pageIdx < nextLen) {
                return i;
            }
            len = nextLen;
        }
        return this._data.length - 1;
    }

    //点开列表的标题
    private initFreeList() {
        if (this._initedFL) { return; }
        this._initedFL = true;
        let total = this._data.length - 1;
        for (let i = 0; i < this._data.length; i++) {
            let cont_frees = this.m_ui.cont_frees.children[i];
            // let gold = 0;
            if (cont_frees) {
                cont_frees.getChildByName("lb_free_rmn").getComponent(cc.Label).string = tcI18n.i18nLabel("history_detail_spr") + ": " + (i + 1) + "/" + (total + 1);
                // gold = MoneyUtil.rmbYuan(this._data[i].round_list[0].player_win_lose);
            } else {
                cont_frees = cc.instantiate(this.m_ui.cont_frees.children[0]);
                cont_frees.parent = this.m_ui.cont_frees;
                cont_frees.getChildByName("lb_free_rmn").getComponent(cc.Label).string = tcI18n.i18nLabel("history_detail_spr") + ": " + (i + 1) + "/" + (total + 1);
                // gold = MoneyUtil.rmbYuan(this._data[i].round_list[0].prize);
            }
            // tcLog.log("data", this._data[i].round_list[0]);
            tcLog.log("initFreeList:", i, "  ", this._data[i].round_list[0].player_win_lose);

            let fuhao = this._data[i].round_list[0].player_win_lose < 0 ? "-" : ""
            if (0 == i) {
                cont_frees.getChildByName("lb_free_gld").getComponent(cc.Label).string = fuhao + currency.formatWithSymbol(Math.abs(this._data[i].round_list[0].player_win_lose));
            }
            else {
                cont_frees.getChildByName("lb_free_gld").getComponent(cc.Label).string = currency.formatWithSymbol(this._data[i].round_list[0].player_win_lose);
            }

            CocosUtil.addClickEvent(cont_frees, () => {
                this.selectPage(i);
                this.setExpanded(false);
                this.highSelect();
            }, this, i, 0.96);
        }
    }

    //详细页的标题
    setTitleName() {
        // console.warn("setTitleName", this._curIdx);
        let curDetailData = this._data[this._curIdx];
        if (curDetailData) {
            let len = this._data.length - 1;
            let curIdx = this._curIdx
            if (len == 0) {
                this.m_ui.lb_title.getComponent(cc.Label).string = tcI18n.i18nLabel("history_detail_nor")
            } else {
                this.m_ui.lb_title.getComponent(cc.Label).string = tcI18n.i18nLabel("history_detail_spr") + ": " + (curIdx + 1) + "/" + (len + 1);
            }
        } else {
            this.m_ui.lb_title.getComponent(cc.Label).string = ""
        }
    }

    private refreshPageData(pageIdx: number) {
        let msg = this.getDetailData(pageIdx);
        tcLog.info("refreshPageData ", "  pageIdx:", pageIdx, "  _curIdx:", this._curIdx, msg.data);
        this.pages[pageIdx].getComponent(CompHisPage).setData(msg.data, msg.isFree, msg.hasNext);
    }

    private getDetailData(pageIdx: number) {
        let len = 0;
        for (let i = 0; i < this._data.length; i++) {
            let ele = this._data[i];
            let nextLen = len + ele.round_list.length;
            if (pageIdx < nextLen) {
                return { data: ele.round_list[pageIdx - len], isFree: ele.free_total_times != ele.free_remain_times, hasNext: ele.round_list.length != 0 };
            }
            len = nextLen;
        }
    }

    private turnPage(nextIdx: number) {
        let curIdx = this._ddIndex;
        this.pages.forEach(v => {
            cc.Tween.stopAllByTarget(v);
            v.active = false
        })
        cc.warn("turnPage", " len:", this.pages.length, "curIdx:", curIdx, "nextIdx:", nextIdx)
        let curPage = this.pages[curIdx];
        let nextPage = this.pages[nextIdx];
        curPage.active = true
        nextPage.active = true
        let width = curPage.width;
        if (nextIdx > curIdx) {
            curPage.setPosition(0, curPage.position.y, curPage.position.z);
            nextPage.setPosition(width, nextPage.position.y, nextPage.position.z);
            cc.tween(curPage).by(0.4, { position: cc.v3(-width, 0, 0) }, { easing: cc.easing.cubicOut }).start();
            cc.tween(nextPage).by(0.4, { position: cc.v3(-width, 0, 0) }, { easing: cc.easing.cubicOut }).start();
        } else {
            curPage.setPosition(0, curPage.position.y, curPage.position.z);
            nextPage.setPosition(-width, nextPage.position.y, nextPage.position.z);
            cc.tween(curPage).by(0.4, { position: cc.v3(width, 0, 0) }, { easing: cc.easing.cubicOut }).start();
            cc.tween(nextPage).by(0.4, { position: cc.v3(width, 0, 0) }, { easing: cc.easing.cubicOut }).start();
        }
        this._ddIndex = nextIdx;
        this.m_ui.btn_pre.active = this._ddIndex != 0;
        this.m_ui.btn_next.active = this._ddIndex != this.getTotalNum() - 1;
        this._curIdx = this.findCurIdx(this._ddIndex);
        this.setTitleName()
    }

    findIndexZore(curIdx: number) {
        let len = 0;
        for (let i = 0; i < this._data.length; i++) {
            let ele = this._data[i];
            if (i == curIdx) {
                break;
            }
            len += ele.round_list.length;
        }
        return len;
    }

    private selectPage(curIdx: number) {
        this._ddIndex = this.findIndexZore(curIdx);
        console.warn("selectPage", this._ddIndex, curIdx);
        let page = this.pages[this._ddIndex];
        if (!page) {
            return;
        }
        this.pages.forEach(v => {
            cc.Tween.stopAllByTarget(v);
            v.active = false
        })
        page.active = true;
        this._curIdx = curIdx;
        this.m_ui.btn_pre.active = this._ddIndex != 0;
        this.m_ui.btn_next.active = this._ddIndex != this.getTotalNum() - 1;
        console.warn("总页数", this.getTotalNum() - 1, this._ddIndex)
        page.position = page.position.set(new cc.Vec3(0, page.position.y, page.position.z));
        this.setTitleName()
    }

    waitAnim(isTransparent: boolean) {
        return new Promise<void>((resolve, reject) => {
            this.m_ui.loadtip.active = true;
            let op = this.m_ui.loadtip;
            cc.Tween.stopAllByTarget(op);
            op.opacity = 255;
            if (!isTransparent) {
                op.opacity = 0;
                cc.tween(op).to(0.2, { opacity: 255 }).delay(0.5).call(() => {
                    resolve();
                }).start();
            } else {
                cc.tween(op).to(0.2, { opacity: 0 }).call(() => {
                    resolve();
                }).start();
            }
        })
    }
}

