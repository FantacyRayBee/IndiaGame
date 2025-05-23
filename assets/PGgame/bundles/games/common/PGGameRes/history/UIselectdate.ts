import { pgGameEvent } from "../script/PgEvent";
import { BaseView } from "./BaseView";
import CocosUtil from "./CocosUtil";
import RecordMgr from "./RecordMgr";
import { UIhistory } from "./UIhistory";


const { ccclass, property } = cc._decorator;


@ccclass
export class UIselectdate extends BaseView {
    onLoad() {
        CocosUtil.traverseNodes(this.node, this.m_ui);
        CocosUtil.setModal(this.node, true);
        this.m_ui.lb_title.color = UIhistory.themeColor
        this.m_ui.close.color = UIhistory.themeColor
    }

    start() {

        CocosUtil.addClickEvent(this.m_ui.btn_close, function () {
            cc.systemEvent.emit(pgGameEvent.close_his_selectdate_view);
        }, this);

        CocosUtil.addClickEvent(this.m_ui.btn_today, function () {
            RecordMgr.getInstance().setFilter(1, 1);
            cc.systemEvent.emit(pgGameEvent.close_his_selectdate_view);
        }, this);

        CocosUtil.addClickEvent(this.m_ui.btn_7day, function () {
            RecordMgr.getInstance().setFilter(7, 7);
            cc.systemEvent.emit(pgGameEvent.close_his_selectdate_view);
        }, this);

        CocosUtil.addClickEvent(this.m_ui.btn_selfdef, function () {

            cc.systemEvent.emit(pgGameEvent.open_his_dateSelect_view);
        }, this);





    }

    public show() {
        this.node.active = true;
        let cur = RecordMgr.getInstance().filterFrom;
        this.m_ui.lb_7day_title.color = cur == 7 ? UIhistory.themeColor : cc.color(175, 175, 175, 255);
        this.m_ui.lb_today_title.color = cur == 1 ? UIhistory.themeColor : cc.color(175, 175, 175, 255);
        this.m_ui.lb_selfdef_title.color = (cur != 1 && cur != 7) ? UIhistory.themeColor : cc.color(175, 175, 175, 255);
    }

}

