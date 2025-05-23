import { AdapterV2 } from "../../../../../script/pkg/adapter-v2";
import { SelectDateType, SharedRecordEvent } from "./shared_record";
import { DateEx } from "./shared_record/DateEx";
import { SharedRecordCustomSelectList } from "./shared_record/shared_record_custom_select_list";

const { ccclass, property } = cc._decorator;

// 自定义日期

interface CustomDate {
    year: number,
    month: number,
    day: number
}

const LAST_THREE_MONTHS = 3;
const SEARCH_WEEK = 6;

@ccclass
export class SharedRecordCustomDate extends cc.Component {
    private static instance: SharedRecordCustomDate

    public static getInstance(): SharedRecordCustomDate {
        if (!this.instance) {
            this.instance = new SharedRecordCustomDate();
        }
        return this.instance;
    }


    @property({ type: cc.Button })
    btnStartYear: cc.Button; // 开始年

    @property({ type: cc.Button })
    btnStartMonth: cc.Button; // 开始月

    @property({ type: cc.Button })
    btnStartDay: cc.Button; // 开始日

    @property({ type: cc.Button })
    btnEndYear: cc.Button; // 结束年

    @property({ type: cc.Button })
    btnEndMonth: cc.Button; // 结束月

    @property({ type: cc.Button })
    btnEndDay: cc.Button; // 结束日

    @property({ type: cc.Label })
    lbStartYear: cc.Label; // 开始年

    @property({ type: cc.Label })
    lbStartMonth: cc.Label; // 开始月

    @property({ type: cc.Label })
    lbStartDay: cc.Label; // 开始日

    @property({ type: cc.Label })
    lbEndYear: cc.Label; // 结束年

    @property({ type: cc.Label })
    lbEndMonth: cc.Label; // 结束月

    @property({ type: cc.Label })
    lbEndDay: cc.Label; // 结束日

    @property({ type: cc.Node })
    ndSelectList: cc.Node;

    @property({ type: cc.Prefab })
    recordCustomSelectList: cc.Prefab;// 选择列表

    private selectList: SharedRecordCustomSelectList = null;
    private nowDate: CustomDate = null; // 当前时间
    private record: cc.Node = null;

    protected onLoad(): void {
        let date = new Date();
        this.nowDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
    }

    start() {
        this.lbStartYear.string = `${this.nowDate.year}`;
        this.lbStartMonth.string = `${this.nowDate.month}`;
        this.lbStartDay.string = `${this.nowDate.day}`;

        this.lbEndYear.string = `${this.nowDate.year}`;
        this.lbEndMonth.string = `${this.nowDate.month}`;
        this.lbEndDay.string = `${this.nowDate.day}`;
    }

    setDate(record: cc.Node) {
        this.record = record;
    }

    public onBtnSuccess() {
        let startDate = this.getStartDate();
        let endDate = this.getEndDate();
        let startTimestamp = DateEx.getZeroTimestamp(startDate.year, startDate.month - 1, startDate.day);
        let endTimestamp = DateEx.getZeroTimestamp(endDate.year, endDate.month - 1, endDate.day);
        endTimestamp = endTimestamp + (3600 * 24 - 1) * 1000;
        this.node.destroy();
        this.record.emit(SharedRecordEvent.REQUEST_CUSTOM_DATE_RECORD, startTimestamp, endTimestamp, SelectDateType.CUSTOM)
    }

    public onBtnBack() {
        this.node.destroy();
    }

    public onBtnStartYear() {
        let startDate = this.getMonthsAgo();
        let szDate = [];
        for (let i = startDate.year; i <= this.nowDate.year; i++) {
            szDate.push(i);
        }

        let { year } = this.getStartDate()
        this.getSelectList(this.btnStartYear.node, szDate, year, (selectData: number) => {
            if (year == selectData) {
                return
            }

            this.lbStartYear.string = `${selectData}`

            if (this.nowDate.year > selectData) { // 选中去年，把月份更新成最近的
                this.lbStartYear.string = `${selectData}`
                this.lbStartMonth.string = `${new Date().getMonth() + 1 - LAST_THREE_MONTHS + 12}`
                this.lbStartDay.string = `${new Date(selectData, Number(this.lbStartMonth.string), 0).getDate()}`
            } else {
                let date = new Date();
                this.lbStartYear.string = `${date.getFullYear()}`
                this.lbStartMonth.string = `${date.getMonth() + 1}`
                this.lbStartDay.string = `${date.getDate()}`
            }

            this.updateEndTime(this.getStartDate());
        });
    }

    public onBtnStartMonth() {
        let startDate = this.getMonthsAgo();
        let { year, month } = this.getStartDate()
        let szDate = []
        for (let i = 0; i <= LAST_THREE_MONTHS; i++) {
            let next = startDate.month + i;
            if (startDate.year < year) {
                if (next <= 12) {
                    continue
                }
                szDate.push(next - 12)
            } else {
                if (next > 12) {
                    break;
                }
                szDate.push(next);
            }
        }
        this.getSelectList(this.btnStartMonth.node, szDate, month, (selectData: number) => {
            if (month == selectData) {
                return
            }

            this.lbStartMonth.string = `${selectData}`

            if (year < this.nowDate.year || this.nowDate.month > selectData) {// 往直前的日期调整
                this.lbStartDay.string = `${DateEx.getMonthDay(year, selectData)}`;
            } else {
                // 调到本月，显示当天
                this.lbStartDay.string = `${this.nowDate.day}`;
            }

            this.updateEndTime(this.getStartDate());
        });
    }

    public onBtnStartDay() {
        let { year, month, day } = this.getStartDate()

        let monthDay: number
        let startDay = 1;
        if (year == this.nowDate.year && month == this.nowDate.month) {
            monthDay = this.nowDate.day;
        } else {
            monthDay = DateEx.getMonthDay(year, month);
            let minCustomDate = this.getMonthsAgo();
            if (minCustomDate.year == year && minCustomDate.month == month) {
                startDay = Math.max(startDay, minCustomDate.day);
            }
        }

        let szDate = []
        for (let i = startDay; i <= monthDay; i++) {
            szDate.push(i);
        }

        this.getSelectList(this.btnStartDay.node, szDate, day, (selectData: number) => {
            if (day == selectData) {
                return
            }

            this.lbStartDay.string = `${selectData}`
            this.updateEndTime(this.getStartDate());
        });
    }

    public onBtnEndYear() {
        let endDate = this.getMonthsAgo();
        let szDate = []
        for (let i = endDate.year; i <= this.nowDate.year; i++) {
            szDate.push(i);
        }

        let { year } = this.getEndDate();
        this.getSelectList(this.btnEndYear.node, szDate, year, (selectData: number) => {
            if (year == selectData) {
                return
            }

            this.lbEndYear.string = `${selectData}`

            if (this.nowDate.year > selectData) { // 选中去年，把月份更新成最近的
                this.lbEndYear.string = `${selectData}`
                this.lbEndMonth.string = `${new Date().getMonth() + 1 - LAST_THREE_MONTHS + 12}`
                this.lbEndDay.string = `${new Date(selectData, Number(this.lbEndMonth.string), 0).getDate()}`
            } else {
                let date = new Date();
                this.lbEndYear.string = `${date.getFullYear()}`
                this.lbEndMonth.string = `${date.getMonth() + 1}`
                this.lbEndDay.string = `${date.getDate()}`
            }

            this.updateStartTime(this.getEndDate());
        });
    }

    public onBtnEndMonth() {
        console.warn("btnendmonth")
        let endDate = this.getMonthsAgo();
        let { year, month } = this.getEndDate();
        let szDate = []
        for (let i = 0; i <= LAST_THREE_MONTHS; i++) {
            let next = endDate.month + i;
            if (endDate.year < year) {
                if (next <= 12) {
                    continue
                }
                szDate.push(next - 12)
            } else {
                if (next > 12) {
                    break;
                }
                szDate.push(next);
            }
        }
        this.getSelectList(this.btnEndMonth.node, szDate, month, (selectData: number) => {
            console.warn("month", month, selectData);
            if (month == selectData) {
                return
            }
            console.warn("this.nowDate.month", this.nowDate.month);

            this.lbEndMonth.string = `${selectData}`

            if (year < this.nowDate.year || this.nowDate.month > selectData) {// 往直前的日期调整
                this.lbEndDay.string = `${DateEx.getMonthDay(year, selectData)}`;
            } else {
                // 调到本月，显示当天
                this.lbEndDay.string = `${this.nowDate.day}`;
            }

            this.updateStartTime(this.getEndDate());
        });
    }

    public onBtnEndDay() {
        let { year, month, day } = this.getEndDate()

        let monthDay: number
        let startDay = 1;
        if (year == this.nowDate.year && month == this.nowDate.month) {
            monthDay = this.nowDate.day;
        } else {
            monthDay = DateEx.getMonthDay(year, month);
            let minCustomDate = this.getMonthsAgo();
            if (minCustomDate.year == year && minCustomDate.month == month) {
                startDay = Math.max(startDay, minCustomDate.day);
            }
        }

        let szDate = []
        for (let i = startDay; i <= monthDay; i++) {
            szDate.push(i);
        }
        this.getSelectList(this.btnEndDay.node, szDate, day, (selectData: number) => {
            if (day == selectData) {
                return
            }

            this.lbEndDay.string = `${selectData}`
            this.updateStartTime(this.getEndDate());
        });
    }

    public getStartDate() {
        let year = Number(this.lbStartYear.getComponent(cc.Label).string)
        let month = Number(this.lbStartMonth.getComponent(cc.Label).string)
        let day = Number(this.lbStartDay.getComponent(cc.Label).string)
        return { year, month, day };
    }

    public getEndDate() {
        let year = Number(this.lbEndYear.getComponent(cc.Label).string)
        let month = Number(this.lbEndMonth.getComponent(cc.Label).string)
        let day = Number(this.lbEndDay.getComponent(cc.Label).string)
        return { year, month, day };
    }

    // 更新开始时间
    public updateStartTime(endTime: CustomDate) {
        let endDateTimestamp = new Date(endTime.year, endTime.month - 1, endTime.day).getTime();
        let beginTimestamp = endDateTimestamp - (24 * 3600 * SEARCH_WEEK * 1000); // 一周前时间

        let minCustomDate = this.getMonthsAgo()
        let minDate = new Date(minCustomDate.year, minCustomDate.month - 1, minCustomDate.day) // 允许搜索最早时间
        if (beginTimestamp < minDate.getTime()) {
            beginTimestamp = minDate.getTime()
        }

        let { year, month, day } = this.getStartDate();
        let startTimestamp = new Date(year, month - 1, day).getTime();
        if (startTimestamp >= beginTimestamp && startTimestamp <= endDateTimestamp) { // 允许搜索范围内
            return
        }

        let beginDate = new Date(beginTimestamp);

        if (beginDate.getFullYear() != year) {
            this.lbStartYear.string = `${beginDate.getFullYear()}`
        }

        if (beginDate.getMonth() + 1 != month) {
            this.lbStartMonth.string = `${beginDate.getMonth() + 1}`
        }

        if (beginDate.getDate() != day) {
            this.lbStartDay.string = `${beginDate.getDate()}`
        }
    }

    // 更新结束时间
    public updateEndTime(startTime: CustomDate) {
        let startDateTimestamp = new Date(startTime.year, startTime.month - 1, startTime.day).getTime();
        let endTimestamp = startDateTimestamp + (24 * 3600 * (SEARCH_WEEK) * 1000); // 一周后时间

        let maxDate = new Date(this.nowDate.year, this.nowDate.month - 1, this.nowDate.day) // 允许搜索不能超过当天
        if (endTimestamp > maxDate.getTime()) {
            endTimestamp = maxDate.getTime()
        }

        let { year, month, day } = this.getEndDate();
        let currendTimestamp = new Date(year, month - 1, day).getTime();
        if (currendTimestamp >= startDateTimestamp && currendTimestamp <= endTimestamp) { // 允许搜索范围内
            return
        }

        let endDate = new Date(endTimestamp);

        if (endDate.getFullYear() != year) {
            this.lbEndYear.string = `${endDate.getFullYear()}`
        }

        console.warn("更新结束时间", endDate.getMonth() + 1, month, startTime);

        if (endDate.getMonth() + 1 != month) {
            this.lbEndMonth.string = `${endDate.getMonth() + 1}`
        }

        if (endDate.getDate() != day) {
            this.lbEndDay.string = `${endDate.getDate()}`
        }
    }

    // 获取前n个月
    public getMonthsAgo() {
        let beginDate = Object.assign({}, this.nowDate);

        let { year, month } = DateEx.getMonthsAgo(this.nowDate.year, this.nowDate.month - 1, LAST_THREE_MONTHS)
        beginDate.year = year;
        beginDate.month = month + 1;

        let day = DateEx.getMonthDay(year, month); // 获取本月几天
        beginDate.day = Math.min(beginDate.day, day);
        return beginDate;
    }

    public getSelectList(target: cc.Node, szData: number[], currentDate: number, callback: (selectDate: number) => void) {
        if (!cc.isValid(this.selectList)) {
            let nd = cc.instantiate(this.recordCustomSelectList);
            nd.active = true
            this.ndSelectList.active = true
            nd.parent = this.ndSelectList;
            this.selectList = nd.getComponent(SharedRecordCustomSelectList);
        }

        if (this.selectList.getTarget() == target) {
            this.selectList.destroySelf();
            return
        }
        this.selectList.mystart();

        let uiTransform = target
        let worldPos
        if (AdapterV2.getInstance().winSizeHeight > 1440) {
            worldPos = uiTransform.convertToWorldSpaceAR(new cc.Vec3((this.ndSelectList.width - uiTransform.width) * 0.5,
                ((this.ndSelectList.height - uiTransform.height) * 0.5) - 217));

        } else {
            worldPos = uiTransform.convertToWorldSpaceAR(new cc.Vec3((this.ndSelectList.width - uiTransform.width) * 0.5,
                (this.ndSelectList.height - uiTransform.height) * 0.5));
        }



        this.selectList.setPosition(worldPos);
        this.selectList.setTarget(target);
        this.selectList.setData(szData, currentDate);
        this.selectList.setCallback(callback);
    }

    // 点击空白关闭
    public onBtnCheckSelectList() {
        if (cc.isValid(this.selectList)) {
            this.selectList.destroySelf();
            this.selectList = null;
        }
    }
}


