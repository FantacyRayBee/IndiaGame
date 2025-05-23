import { pgGameEvent } from "../script/PgEvent";
import { BaseView } from "./BaseView";
import CocosUtil from "./CocosUtil";
import RecordMgr from "./RecordMgr";
import { SharedRecordEvent } from "./shared_record";
import { SharedRecordCustomDate } from "./shared_record_custom_date";


const { ccclass, property } = cc._decorator;


@ccclass
export class UIDateSelect extends BaseView {

    protected onLoad(): void {
    }

    start() {
        this.node.on(SharedRecordEvent.REQUEST_CUSTOM_DATE_RECORD, this.onSelectData, this)
        let com = this.getComponent(SharedRecordCustomDate)
        if (com) {
            com.setDate(this.node)
        }
    }

    onSelectData(startTimestamp, endTimestamp) {
        cc.systemEvent.emit(pgGameEvent.close_his_selectdate_view);
        RecordMgr.getInstance().setFilter(startTimestamp, endTimestamp);
    }

    protected onDestroy(): void {
        cc.systemEvent.emit(pgGameEvent.close_his_dateSelect_view);
    }

    public show() {
        this.node.active = true;
    }

}


