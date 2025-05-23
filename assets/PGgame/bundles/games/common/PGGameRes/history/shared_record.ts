
const { ccclass, property } = cc._decorator;

export enum SharedRecordEvent {
    CLOSE_RECORD = "CLOSE_RECORD", // 退出记录查看
    OPEN_RECORD_DATE_TYPE = "OPEN_RECORD_DATE_TYPE", // 打开选择日期
    OPEN_RECORD_CUSTOM_DATE = "OPEN_RECORD_CUSTOM_DATE", // 打开自定义日期
    REQUEST_CUSTOM_DATE_RECORD = "REQUEST_CUSTOM_DATE_RECORD", // 查询自定义记录
    OPEN_RECORD_ROUND_DETAIL_LIST = "OPEN_RECORD_ROUND_DETAIL_LIST", // 打开记录详情
    REQUEST_REMAINING_DATA = "REQUEST_REMAINING_DATA" // 请求剩余数据
}

export enum SelectDateType {
    TODAY, // 今天
    LAST_WEEK, // 最近七天
    CUSTOM // 自定义
}

// 记录入口点，管理

@ccclass
export class SharedRecord extends cc.Component {

    protected onLoad(): void {
    }

    start() {
        // this.test()
    }

}


