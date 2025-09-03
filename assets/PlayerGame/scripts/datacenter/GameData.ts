import SystemData, { dc, field } from "../framework/SystemData";



@dc("GameData")
export default class GameDataClass extends SystemData{

    init(){
        
    }

    //是否播放过新手引导;
    @field()
    isWatchNewGuide:boolean  = true;

    //上次登录时间，每24小时更新
    @field()
    lastOpenTime:number =new Date().getTime();

    @field()
    //用户登录过多少天
    loginAllDays:number = 1;

    @field()
    //用户登录过多少次
    loginCounts:number = 0;

    @field()
    //用户当天登录过多少次
    loginTodayCounts:number = 0;

    
    constructor(){
        super();
    }

}

export var gameData:GameDataClass = SystemData.register(GameDataClass)