import { Game_Const } from "../../../../../ApiTemplate/script/config/GameConst";
import GameNet from "../../../../../ApiTemplate/script/net/GameNet";
import { Result } from "../../../../../ApiTemplate/script/net/Result";
import { SelectGameMrg } from "../../../../../ApiTemplate/script/tools/SelectGameMrg";
import { tcLog } from "../../../../../script/framework/log/log";
import { acr } from "../../../../update-v2/script/api/acr";
import { gameData } from "../../../../update-v2/script/api/api-config";
import { pgGameEvent } from "../script/PgEvent";
import DateUtil from "./DateUtil";
import { UIhistory } from "./UIhistory";
import { RecordDetailInfo } from "./interface/recorddetail";


export default class RecordMgr {
    private static _instance: RecordMgr = null;
    public static getInstance(): RecordMgr {
        if (!RecordMgr._instance) { RecordMgr._instance = new RecordMgr; }
        return RecordMgr._instance;
    }


    public static delInstance(): void {
        if (RecordMgr._instance) {
            RecordMgr._instance = null;
        }
    }

    protected on_dtor(): void {

    }

    private _filterFrom: number = 1;
    private _filterTo: number = 1;

    get filterFrom() {
        return this._filterFrom;
    }

    get filterTo() {
        return this._filterTo;
    }

    public _loaded
    public _shi_len

    public _offset = 0;
    public _dataCount = 1;
    public _dataArr = [];

    getDataList() {
        return this._dataArr;
    }

    appendDatas(param) {
        let data = param.data;
        let arr = data && data.list || [];
        this._dataArr.push(...arr);
    }

    setFilter(from: number, to: number) {
        this._filterFrom = from;
        this._filterTo = to;
        this._loaded = false
        this._shi_len = 0;
        this._offset = 0;
        this._dataCount = 1;
        this._dataArr = [];
        this.isFullData = false
        cc.systemEvent.emit(pgGameEvent.ref_record_filter);
    }

    isFullData: boolean
    checkReqFull() {
        return this.isFullData
    }

    pullData(): Promise<any> {
        return new Promise(async resolve => {
            if (this.checkReqFull()) {
                let Idata: any = {
                    "error_code": 0,
                    "data": {
                        "list": []
                    }
                }
                return resolve(Idata);
            }
            let info = {
                startDate: 0,
                endDate: 0,
                limit: 20,
                page: this._offset,
                gameid: Game_Const.Gmee_Type
            }
            // {"createTime":1715911138098,"order":"2024051701585898106326",
            // "bet":21000,"win":84000,"normalRoundTimes":1,"leftTimes":-1,"groupId":""},

            let now = new Date(DateUtil.getSysTime());
            let now_year = now.getFullYear();
            let now_month = now.getMonth() + 1;
            let now_day = now.getDate();
            let startTime = DateUtil.getTimestamp(now_year, now_month, now_day, 0, 0, 0);

            if (this.filterFrom == 1) {
                info.startDate = now.getTime()
                info.endDate = now.getTime()      //24*60*60*1000
            }
            else if (this.filterFrom == 7) {
                info.startDate = now.getTime() - 604800000      //7*24*60*60*1000
                info.endDate = now.getTime()
            }
            else {
                info.startDate = this.filterFrom;
                info.endDate = this.filterTo;
            }


            let historyData: any = await SelectGameMrg.getInstance().history(info)
            if (!historyData || historyData.result != Result.Success) {
                console.error("none:", historyData);
                return resolve(null)
            }
            tcLog.log("historyData:", historyData);

            if (!historyData.historylist || historyData.historylist.length < 20 || historyData.historylist.length == 0) {
                this.isFullData = true
            }
            if (!historyData.historylist) {
                let Idata: any = {
                    "error_code": 0,
                    "data": {
                        "list": [],
                        "count": 0,
                        "bet": 0,
                        "win": 0,
                    }
                }
                return resolve(Idata)
            }


            let sortResult = historyData.historylist.reduce((acc, item) => {
                if (item.groupId.length > 0) {
                    if (!acc[item.groupId]) {
                        // acc[item.groupId] = [];
                        acc[item.groupId] = 0
                    }
                    // acc[item.groupId].push(item);
                    acc[item.groupId] += item.win
                }
                return acc;
            }, {});


            function filterObjectArray(arr) {
                return arr.filter(obj => obj.leftTimes < 0);
            }
            const filteredArray = filterObjectArray(historyData.historylist);
            // tcLog.log(filteredArray); // 输出过滤后的数组
            historyData.historylist = filteredArray


            let betcount = 0
            let wincount = 0
            for (let index = 0; index < historyData.historylist.length; index++) {
                const element = historyData.historylist[index];
                element.bet = element.bet * 10
                if (element.groupId.length == 0) {
                    element.win = element.win * 10
                    betcount += element.bet
                    wincount += element.win
                } else {
                    element.win = sortResult[element.groupId] * 10
                    wincount += element.win
                }
            }


            let Idata: any = {
                "error_code": 0,
                "data": {
                    "list": [],
                    "count": historyData.historylist.length,
                    "bet": betcount,
                    "win": wincount,
                }
            }
            Idata.data.list = historyData.historylist
            return resolve(Idata)




        })
    }


    private _allDetails: { [key: string]: RecordDetailInfo[] } = {};

    pullDetail(createTime, orderId: string, groupId: string) {
        return new Promise(async res => {
            if (this._allDetails[orderId]) {
                return res(this._allDetails[orderId])
            }

            let info = {
                createTime: createTime,
                order: orderId,
                groupId: groupId,
                gameid: Game_Const.Gmee_Type
            }
            let iDetailData: any = await SelectGameMrg.getInstance().historyDetail(info)
            if (!iDetailData || iDetailData.result != Result.Success) {
                console.error("none:", iDetailData);
                return res(null)
            }
            // let data: any = iDetailData.historyDetail[0]

            let param: any = {
                "error_code": 0,
                "data": {
                    "list": []
                }
            }
            // {
            //     "result": 0, "historylist": [{
            //         "createTime": 1715911619579, "order": "20240517020659579106326",
            //         "bet": 21000, "win": 252000, "normalRoundTimes": 1, "leftTimes": -1, "groupId": ""
            //     }, { "createTime": 1715911617695, "order": "20240517020657695106326", "bet": 21000, "win": -21000, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911479327, "order": "20240517020439327106326", "bet": 0, "win": 493500, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "20240516083033123106326" }, { "createTime": 1715911474307, "order": "20240517020434307106326", "bet": 0, "win": 0, "normalRoundTimes": 1, "leftTimes": 1, "groupId": "20240516083033123106326" }, { "createTime": 1715911472267, "order": "20240517020432267106326", "bet": 0, "win": 0, "normalRoundTimes": 1, "leftTimes": 2, "groupId": "20240516083033123106326" }, { "createTime": 1715911467235, "order": "20240517020427235106326", "bet": 0, "win": 0, "normalRoundTimes": 1, "leftTimes": 3, "groupId": "20240516083033123106326" }, { "createTime": 1715911462211, "order": "20240517020422211106326", "bet": 0, "win": 0, "normalRoundTimes": 1, "leftTimes": 4, "groupId": "20240516083033123106326" }, { "createTime": 1715911460175, "order": "20240517020420175106326", "bet": 0, "win": 0, "normalRoundTimes": 1, "leftTimes": 5, "groupId": "20240516083033123106326" }, { "createTime": 1715911458140, "order": "20240517020418140106326", "bet": 0, "win": 0, "normalRoundTimes": 1, "leftTimes": 6, "groupId": "20240516083033123106326" }, { "createTime": 1715911447459, "order": "20240517020407459106326", "bet": 21000, "win": 42000, "normalRoundTimes": 1, "leftTimes": 7, "groupId": "" }, { "createTime": 1715911446039, "order": "2024051702040639106326", "bet": 21000, "win": -21000, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911444619, "order": "20240517020404619106326", "bet": 21000, "win": -21000, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911441199, "order": "20240517020401199106326", "bet": 21000, "win": -16800, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911437779, "order": "20240517020357779106326", "bet": 21000, "win": -10500, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911436359, "order": "20240517020356359106326", "bet": 21000, "win": -21000, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911432939, "order": "20240517020352939106326", "bet": 21000, "win": -14700, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911429467, "order": "20240517020349467106326", "bet": 21000, "win": -10500, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911426119, "order": "20240517020346119106326", "bet": 21000, "win": -16800, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911424699, "order": "20240517020344698106326", "bet": 21000, "win": -21000, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }, { "createTime": 1715911421286, "order": "20240517020341286106326", "bet": 21000, "win": 0, "normalRoundTimes": 1, "leftTimes": -1, "groupId": "" }]
            // }

            for (let index = 0; index < iDetailData.historyDetail.length; index++) {
                let data = iDetailData.historyDetail[index];
                let round_list = []
                let temp: any = new Object()
                temp.round_no = data.order
                temp.bet = data.bet * 10
                if (data.leftTimes != undefined && data.leftTimes > -1 && data.leftTimes < 7) {
                    temp.prize = (data.win) * 10
                } else {
                    temp.prize = (data.bet + data.win) * 10
                }

                if (data.leftTimes != undefined && data.leftTimes == 7) {
                    temp.player_win_lose = (data.win - data.bet) * 10
                } else {
                    temp.player_win_lose = data.win * 10
                }


                temp.balance = data.moneyAfter * 10
                temp.bet_size = gameData.betSizes[data.betIndex]
                temp.bet_multiple = gameData.betLevels[data.mutipleIndex]
                temp.screen = data.screen
                temp.hits = data.hits
                temp.normalRoundTimes = data.normalRoundTimes
                temp.leftTimes = data.leftTimes
                temp.groupId = data.groupId
                round_list.push(temp)

                let list_obj: any = {
                    create_timestamp: iDetailData.historyDetail[0].createTime,
                    round_list: round_list
                }
                param.data.list.push(list_obj)
            }

            tcLog.log("historyDetail:", param);
            if (param?.data?.list) {
                return res(param?.data?.list)
            }
        })
    }
}

