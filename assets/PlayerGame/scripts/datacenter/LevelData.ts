import SystemData, { dc, field } from "../framework/SystemData";



@dc("LevelData")
export default class LevelDataClass extends SystemData{

    init(){
        
    }


    @field()
    //当前关卡
    level:number = 1;

    @field()
    //最大关卡
    levelMax:number = 0;

    @field()
    //当前关卡计时器
    timer:number=0;

     //当前关卡开始次数（包括进入、失败、重新开始）   
     startCount:number=0;

     //当前连续通过的关卡数  
     succCount:number=0;
 
     //当前连续失败的次数 
     failCount:number=0;
 
     //当前关卡复活次数
     revivewCount:number=0;
 
     //当前关卡重玩次数   
     restartCount:number=0;
 
     //看广告前连续玩的次数
     playCount:number=0;

    //今天玩了多少关
    todayPlayLevels:number=0;

    //今天玩了多少次
    todayPlayCount:number=0;   
 
    //今天失败多少次
    todayPlayFailCount:number=0;  

    //当前关卡是否复活过
    isRevivew:boolean=false; 
    
    //总删除物品统计：消除一组记一次
    clearAllNums: number = 0;
    
    //用户当前关卡消除品统计    消除一组记一次
    currentClearNums:number = 0;

    //用户当前关卡消除分数    //计算方式 消除1个三分，有combo + comb数。
    currentStarScore:number = 0;

    //新手引导关卡走到第几步，总共2步
    newGuideStep=1;

    // 连击数
    combo: number = 0;

    // 连击倒计时
    comboTimer: number = 20;

    //格式  1:lose: 0 sec: 23.1
    levels = {}
    
    constructor(){
        super();
        this.loadCurrData();
        this.loadProgress();
    }

    initData(){
        this.currentClearNums=0;
        this.currentStarScore=0;
        this.isRevivew=false;
        this.timer=0;
        this.combo=0;
        this.comboTimer=20;
    }


    loadCurrData(){
        let str = localStorage.getItem("LevelData.currData");
        if (str){
            let coinDatas = JSON.parse(str);

            if(coinDatas["succCount"]!=null){
                this.succCount =  Number(coinDatas["succCount"]);
            }
            if(coinDatas["failCount"]!=null){
                this.failCount =  Number(coinDatas["failCount"]);
            }

            if(coinDatas["revivewCount"]!=null){
                this.revivewCount =   Number(coinDatas["revivewCount"]);
            }
            if(coinDatas["restartCount"]!=null){
                this.restartCount =   Number(coinDatas["restartCount"]);
            }
            if(coinDatas["playCount"]!=null){
                this.playCount =   Number(coinDatas["playCount"]);
            }
            if(coinDatas["todayPlayCount"]!=null){
                this.todayPlayCount =   Number(coinDatas["todayPlayCount"]);
            }
            if(coinDatas["todayPlayLevels"]!=null){
                this.todayPlayLevels =   Number(coinDatas["todayPlayLevels"]);
            }
            if(coinDatas["todayPlayFailCount"]!=null){
                this.todayPlayFailCount =   Number(coinDatas["todayPlayFailCount"]);
            }
        }

    }

    saveCurrData(){
        let coinDatas={};
        coinDatas["succCount"]=this.succCount;
        coinDatas["failCount"]=this.failCount;
        
        coinDatas["revivewCount"]=this.revivewCount;     
        coinDatas["restartCount"]=this.restartCount; 
        coinDatas["playCount"]=this.playCount; 
        coinDatas["todayPlayCount"]=this.todayPlayCount; 
        coinDatas["todayPlayLevels"]=this.todayPlayLevels; 
        coinDatas["todayPlayFailCount"]=this.todayPlayFailCount; 
        
        let l4 = JSON.stringify(coinDatas);
        localStorage.setItem("LevelData.currData",l4);
    }


    loadProgress(){
        let s = localStorage.getItem("leveldata.levels");
        if (s){
            this.levels = JSON.parse(s);
        }
    }

    prepareLevel(lv) {
        if(!this.levels[lv])
            this.levels[lv] = {sec:0,lose:0}
    }

    setLevelInfo(lv,key,value){
        this.levels[lv.toString()][key] = value;
    }


    getLevelInfo(lv,key){
        let lvInfo = this.levels[lv.toString()]
        if(lvInfo)
        {
            return lvInfo[key] ||0;
        }else{
            return 0;
        }
    }

    saveProgress(){
        let s = JSON.stringify(this.levels);
        localStorage.setItem("leveldata.levels",s);
    }



}

export var levelData:LevelDataClass = SystemData.register(LevelDataClass)