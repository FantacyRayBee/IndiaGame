

import { gameData } from '../datacenter/GameData';
import { itemData } from '../datacenter/ItemData';
import { levelData } from '../datacenter/LevelData';
import { rankInfoData } from '../datacenter/RankInfo';
import { settingData } from '../datacenter/SettingData';
import { ENUM_GAME_STATUS } from '../Enum';
import CommonTool from '../framework/utils/CommonTool';

const STORAGE_KEY = 'CC_MATCH_CONTAINER'

export const DEFAULT_TIP_TIME=5;

export default class DataManager {

    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<DataManager>()
    }

    get settingData() {
        return  settingData;
    }

    get levelData() {
        return  levelData;
    }

    get itemData() {
        return  itemData;
    }

    get gameData() {
        return  gameData;
    }
    get rankInfoData() {
        return  rankInfoData;
    }

    // 游戏状态
    status: ENUM_GAME_STATUS = ENUM_GAME_STATUS.UNRUNING
    // 加载进度
    loadingRate: number = 0;

    //是否开始计时
    isSchedule:boolean=false;

    //提示是否开始计时
    isTip:boolean=false;  
    tipTime:number=5;

    //死局失败时是否已提示使用刷新道具
    isTipRefresh:boolean=false;

    // 选中
    current: cc.Node = null
    // 入柜商品数据，三维数组  1维：几个货架、2维：几层 、3维：几个商品、
    goodsData: number[][] = []
    // 前排容器
    frontContainers: cc.Node[] = []
    // 后排容器
    backContainers: cc.Node[] = []
    // 红心和能量
    hearts: number = 5
    heartCollectByVideo: number = 1;

    //用户剩余星星数
    collectStarCount: number =0

    powerCollectByVideo: number = 50

    // 红心恢复
    heartRefreshTime: number = 1800 // 间隔刷新
    lastHeartRefreshTime: number = 0 // 每次刷新纪录点
    lastHeartUpdateTime: number = 0 // 后续离开游戏返回补充红心
    // 洗牌递归树
    shuffleLoopNum: number = 0
    // 洗牌中
    isShuffling: boolean = false
    // 生成起始点
    starStartPosArr: any[] = []


    reset() {
        this.status = ENUM_GAME_STATUS.UNRUNING
        this.current = null
        this.backContainers = []
        this.frontContainers = []
        this.goodsData = []
        this.shuffleLoopNum = 0
        this.isShuffling = false
        this.starStartPosArr = []
        this.isSchedule=false;
        this.isTip=false;
        this.tipTime=DEFAULT_TIP_TIME;
        this.isTipRefresh=false;
    }

    save() {
        cc.sys.localStorage.setItem(STORAGE_KEY, JSON.stringify({
            hearts: this.hearts,
            collectStarCount: this.collectStarCount,
            lastHeartRefreshTime: this.lastHeartRefreshTime,
            lastHeartUpdateTime: this.lastHeartUpdateTime,
        }))
    }

    restore() {
        rankInfoData.isRankList=true;
        rankInfoData.initRankInfo();
        DataManager.instance.itemData.loadItemData();

        //每天数据初始化
        if(CommonTool.isNextDay(DataManager.instance.gameData.lastOpenTime)){ 
            let week=CommonTool.theWeekOfYear(new Date());
            let month=new Date().getMonth();
            let year=new Date().getFullYear();
            let lastWeek=CommonTool.theWeekOfYear(new Date(DataManager.instance.gameData.lastOpenTime));
            if(week!=lastWeek){
                DataManager.instance.rankInfoData.weekScore=0;
            }
            let lastMonth=new Date(DataManager.instance.gameData.lastOpenTime).getMonth();
            if(month!=lastMonth){
                DataManager.instance.rankInfoData.monthScore=0;
            }
            let lastYear=new Date(DataManager.instance.gameData.lastOpenTime).getFullYear();
            if(year!=lastYear){
                DataManager.instance.rankInfoData.yearScore=0;
            }
            DataManager.instance.levelData.todayPlayCount=0;
            DataManager.instance.levelData.todayPlayFailCount=0;
            DataManager.instance.levelData.todayPlayLevels=0;
            DataManager.instance.levelData.saveCurrData();
            DataManager.instance.gameData.lastOpenTime=new Date().getTime();
            DataManager.instance.gameData.loginAllDays++;
            DataManager.instance.rankInfoData.todayScore=0;
            DataManager.instance.rankInfoData.saveBestRankData();
        }
        
        DataManager.instance.gameData.loginCounts++;
        DataManager.instance.gameData.loginTodayCounts++;

        DataManager.instance.gameData.saveData();
       // let rankListClass:RankListClass= rankInfoData.getRankData(Constants.RankType.TODAY);
      //  console.log("rankListClass",rankListClass);

        const _data = cc.sys.localStorage.getItem(STORAGE_KEY) as any
        try {
            const data = JSON.parse(_data)
            this.hearts = typeof data.hearts == 'number' ? data.hearts : 5
            this.collectStarCount = typeof data.collectStarCount == 'number' ? data.collectStarCount : 5
            this.lastHeartRefreshTime = typeof data.lastHeartRefreshTime == 'number' ? data.lastHeartRefreshTime : 0
            this.lastHeartUpdateTime = typeof data.lastHeartUpdateTime == 'number' ? data.lastHeartUpdateTime : 0
        } catch {
            this.hearts = 5
            this.collectStarCount = 0
            this.lastHeartRefreshTime = 0
            this.lastHeartUpdateTime = 0
        }
    }
}
