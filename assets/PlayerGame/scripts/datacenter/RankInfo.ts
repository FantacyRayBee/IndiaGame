import Constants from "../Constants";
import SystemData, { dc, field } from "../framework/SystemData";
import CommonTool from "../framework/utils/CommonTool";
import { DateUtil } from "../framework/utils/DateUtil";
import DataManager from "../manager/DataManager";
import Rank from "../rank/Rank";
import RankListClass from "../rank/RankLisClasst";


@dc("RankInfoData")
export default class RankInfoData  extends SystemData{

    init(){
        
    }

    //是否需要重新生成排名，通过一关重新生成排名
    @field()
    isRankList:boolean = false;

    //当天是否重新生成过排名
    @field()
    todayIsRank=false;

    //历史最高分第一名数据
    @field()
    firstRankInfo:string='';

    //历史最高分第二名数据
    @field()
    secondRankInfo:string='';

    //历史最高分第三名数据
    @field()
    thirdRankInfo:string='';

    //用户级别排名数据
    @field()
    bestRankLevelInfo:string='';


    //用户历史最高分的排名数据
    @field()
    bestRankInfo:string='';

    //用户今天打到的最高分排名数据
    @field()
    todayRankInfo:string='';     
    //周排名数据
    @field()
    weekRankInfo:string='';   
    //月排名数据
    @field()
   monthRankInfo:string='';  
    //年排名数据
    @field()
    yearRankInfo:string='';  

     //用户输入的姓名
     @field()
    rankName:string='';

    //用户选择的头像
    @field()
    rankAvatar:string='';


    //用户历史最高通关的排名
    bestLevelRank:number = 0;

    //用户历史打的分数排名
    bestScoreRank:number = 0;
    //用户今年打的分数排名
    yearScoreRank:number = 0;
    //用户本月打的分数排名
    monthScoreRank:number = 0;
    //用户本周打的分数排名
    weekScoreRank:number = 0;
    //用户今天打的分数排名
    todayScoreRank:number = 0;

    //用户当天消除分数
    todayScore:number = 100;

    //用户周消除分数
    weekScore:number = 200;

    //用户月消除分数
    monthScore:number = 1000;

    //用户年消除分数
    yearScore:number = 10000;

    //用户历史消除分数
    bestScore:number = 10000;

    constructor() {
        super();
        this.loadBestRankData();
    }

    loadBestRankData(){
        let str = localStorage.getItem("RankInfoData.bestDatas");
        if (str){
            let  bestDatas= JSON.parse(str);          
            if(bestDatas["bestLevelRank"]!=null){
                this.bestLevelRank =  Number(bestDatas["bestLevelRank"]);
            }
            if(bestDatas["yearScoreRank"]!=null){
                this.yearScoreRank =  Number(bestDatas["yearScoreRank"]);
            }
            if(bestDatas["monthScoreRank"]!=null){
                this.monthScoreRank =  Number(bestDatas["monthScoreRank"]);
            }
            if(bestDatas["weekScoreRank"]!=null){
                this.weekScoreRank =  Number(bestDatas["weekScoreRank"]);
            }
            if(bestDatas["todayScoreRank"]!=null){
                this.todayScoreRank =  Number(bestDatas["todayScoreRank"]);
            }
            if(bestDatas["todayScore"]!=null){
                this.todayScore =  Number(bestDatas["todayScore"]);
            }
            if(bestDatas["weekScore"]!=null){
                this.weekScore =  Number(bestDatas["weekScore"]);
            }
            if(bestDatas["monthScore"]!=null){
                this.monthScore =  Number(bestDatas["monthScore"]);
            }
            if(bestDatas["yearScore"]!=null){
                this.yearScore =  Number(bestDatas["yearScore"]);
            }
            if(bestDatas["bestScore"]!=null){
                this.bestScore =  Number(bestDatas["bestScore"]);
            }
        }

    }

    saveBestRankData(){
        let  bestDatas= {};  
        bestDatas["bestLevelRank"]=this.bestLevelRank;
        bestDatas["yearScoreRank"]=this.yearScoreRank;
        bestDatas["monthScoreRank"]=this.monthScoreRank;
        bestDatas["weekScoreRank"]=this.weekScoreRank;  
        bestDatas["todayScoreRank"]=this.todayScoreRank; 
        bestDatas["todayScore"]=this.todayScore;  
        bestDatas["weekScore"]=this.weekScore;  
        bestDatas["monthScore"]=this.monthScore;  
        bestDatas["yearScore"]=this.yearScore;  
        bestDatas["bestScore"]=this.bestScore;       
        let l4 = JSON.stringify(bestDatas);
        localStorage.setItem("RankInfoData.bestDatas",l4);
    }

    getRankData(rankType:string):RankListClass{
        let rankListClass:RankListClass=new RankListClass();
        let strInfo='';
        if(rankType==Constants.RankType.TODAY&&this.todayRankInfo!=''){
            strInfo=this.todayRankInfo;
        }
        else if(rankType==Constants.RankType.WEEK&&this.weekRankInfo!=''){
            strInfo=this.weekRankInfo;
        }else if(rankType==Constants.RankType.MONTH&&this.monthRankInfo!=''){
            strInfo=this.monthRankInfo;
        }else if(rankType==Constants.RankType.YEAR&&this.yearRankInfo!=''){
            strInfo=this.yearRankInfo;
        }else if(rankType==Constants.RankType.ALL&&this.bestRankInfo!=''){
            strInfo=this.bestRankInfo;
        }else if(rankType==Constants.RankType.LEVEL&&this.bestRankInfo!=''){
            strInfo=this.bestRankLevelInfo;
        }
        if(strInfo!=''){
            let rankInfo=JSON.parse(strInfo);
            rankListClass.isRank=rankInfo._isRank;
            rankListClass.rankType=rankInfo._rankType;
            if(rankInfo!=null&&rankInfo._firstRank){
                let firstRank:Rank=new Rank();
                firstRank.name=rankInfo._firstRank._name;
                firstRank.rankNumber=rankInfo._firstRank._rankNumber;
                firstRank.score=rankInfo._firstRank._score;
                firstRank.avatar=rankInfo._firstRank._avatar;
                rankListClass.firstRank=firstRank;
            }
            if(rankInfo!=null&&rankInfo._secondRank){
                let secondRank:Rank=new Rank();
                secondRank.name=rankInfo._secondRank._name;
                secondRank.rankNumber=rankInfo._secondRank._rankNumber;
                secondRank.score=rankInfo._secondRank._score;
                secondRank.avatar=rankInfo._secondRank._avatar;
                rankListClass.secondRank=secondRank;
            }
            if(rankInfo!=null&&rankInfo._thirdRank){
                let thirdRank:Rank=new Rank();
                thirdRank.name=rankInfo._thirdRank._name;
                thirdRank.rankNumber=rankInfo._thirdRank._rankNumber;
                thirdRank.score=rankInfo._thirdRank._score;
                thirdRank.avatar=rankInfo._thirdRank._avatar;
                rankListClass.thirdRank=thirdRank;
            }
            if(rankInfo!=null&&rankInfo._currentRank){
                let currentRank:Rank=new Rank();
                currentRank.name=rankInfo._currentRank._name;
                currentRank.rankNumber=rankInfo._currentRank._rankNumber;
                currentRank.score=rankInfo._currentRank._score;
                currentRank.rankUp=rankInfo._currentRank._rankUp;
                currentRank.avatar=rankInfo._currentRank._avatar;
                rankListClass.currentRank=currentRank;
            }

            if(rankInfo!=null&&rankInfo._rankList){
                let rankListArray:Rank[]=[];
                rankListArray.length=rankInfo._rankList.length;
                for (let index = 0; index < rankInfo._rankList.length; index++) {
                    const element = rankInfo._rankList[index];
                    let rank:Rank=new Rank();
                    rank.name=element._name;
                    rank.rankNumber=element._rankNumber;
                    rank.score=element._score;
                    rank.avatar=element._avatar;
                    rank.rankUp=element._rankUp;
                    rankListArray[index]=rank;
                }
                rankListClass.rankList=rankListArray;
            }

        }

        return rankListClass;
           
    }

    saveRankData(rankListClass:RankListClass){

        if(rankListClass==null){
            return;
        }

        let strInfo='';
        strInfo=JSON.stringify(rankListClass);
        if(rankListClass.rankType==Constants.RankType.TODAY){
            this.todayRankInfo=strInfo;
            if(rankListClass.isRank){
                if(this.todayScoreRank>=rankListClass.currentRank.rankNumber){
                    rankListClass.currentRank.rankUp=true;
                }else{
                    rankListClass.currentRank.rankUp=false;
                }
                strInfo=JSON.stringify(rankListClass);
                this.todayRankInfo=strInfo;
                this.todayScoreRank=rankListClass.currentRank.rankNumber;
            }else{
                this.todayScoreRank=0;
            }
            
        }
        if(rankListClass.rankType==Constants.RankType.WEEK){
            this.weekRankInfo=strInfo;
            if(rankListClass.isRank){
                if(this.weekScoreRank>=rankListClass.currentRank.rankNumber){
                    rankListClass.currentRank.rankUp=true;
                }else{
                    rankListClass.currentRank.rankUp=false;
                }
                strInfo=JSON.stringify(rankListClass);
                this.weekRankInfo=strInfo;
                this.weekScoreRank=rankListClass.currentRank.rankNumber;
            }else{
                this.weekScoreRank=0;
            }
            
        }
        if(rankListClass.rankType==Constants.RankType.MONTH){
            this.monthRankInfo=strInfo;
            if(rankListClass.isRank){
                if(this.monthScoreRank>=rankListClass.currentRank.rankNumber){
                    rankListClass.currentRank.rankUp=true;
                }else{
                    rankListClass.currentRank.rankUp=false;
                }
                strInfo=JSON.stringify(rankListClass);
                this.monthRankInfo=strInfo;
                this.monthScoreRank=rankListClass.currentRank.rankNumber;
            }else{
                this.monthScoreRank=0;
            }
            
        }
        if(rankListClass.rankType==Constants.RankType.YEAR){
            this.yearRankInfo=strInfo;
            if(rankListClass.isRank){
                if(this.yearScoreRank>=rankListClass.currentRank.rankNumber){
                    rankListClass.currentRank.rankUp=true;
                }else{
                    rankListClass.currentRank.rankUp=false;
                }
                strInfo=JSON.stringify(rankListClass);
                this.yearRankInfo=strInfo;
                this.yearScoreRank=rankListClass.currentRank.rankNumber;
            }else{
                this.yearScoreRank=0;
            }
            
        }
        if(rankListClass.rankType==Constants.RankType.ALL){
            this.bestRankInfo=strInfo;
            if(rankListClass.isRank){
                if(this.bestScoreRank>=rankListClass.currentRank.rankNumber){
                    rankListClass.currentRank.rankUp=true;
                }else{
                    rankListClass.currentRank.rankUp=false;
                }
                strInfo=JSON.stringify(rankListClass);
                this.bestRankInfo=strInfo;
                this.bestScoreRank=rankListClass.currentRank.rankNumber;
            }else{
                this.bestScoreRank=0;
            }
            this.firstRankInfo=JSON.stringify(rankListClass.firstRank);
            this.secondRankInfo=JSON.stringify(rankListClass.secondRank);
            this.thirdRankInfo=JSON.stringify(rankListClass.thirdRank);
         //   console.log('firstRankInfo',this.firstRankInfo);
        }
        if(rankListClass.rankType==Constants.RankType.LEVEL){
            this.bestRankLevelInfo=strInfo;
            if(rankListClass.isRank){
                if(this.bestLevelRank>=rankListClass.currentRank.rankNumber){
                    rankListClass.currentRank.rankUp=true;
                }else{
                    rankListClass.currentRank.rankUp=false;
                }
                strInfo=JSON.stringify(rankListClass);
                this.bestRankLevelInfo=strInfo;
                this.bestLevelRank=rankListClass.currentRank.rankNumber;
            }else{
                this.bestLevelRank=0;
            }
        }
    }

    //重新进行模拟排名
    initRankInfo(){
         //如果当天已经生成过排名，用户排名不降，用户排名只有在第二天第一次生成排名是降低
         let isReduce=true;
         if(rankInfoData.todayIsRank){
            isReduce=false;
         }
        if(this.isRankList){
           let  allRankListClass:RankListClass=RankInfoData.cacluateNormalRank(Constants.RankType.ALL,this.bestScore,isReduce);
           this.saveRankData(allRankListClass);  
           let  yearRankListClass:RankListClass=RankInfoData.cacluateNormalRank(Constants.RankType.YEAR,this.yearScore,isReduce);
           this.saveRankData(yearRankListClass); 
           let  monthRankListClass:RankListClass=RankInfoData.cacluateNormalRank(Constants.RankType.MONTH,this.monthScore,isReduce);
           this.saveRankData(monthRankListClass);    
           let  weekRankListClass:RankListClass=RankInfoData.cacluateNormalRank(Constants.RankType.WEEK,this.weekScore,isReduce);
           this.saveRankData(weekRankListClass);   
           let  todayRankListClass:RankListClass=RankInfoData.cacluateNormalRank(Constants.RankType.TODAY,this.todayScore,isReduce);
           this.saveRankData(todayRankListClass);             
           let  levelRankListClass:RankListClass=RankInfoData.cacluateNormalRank(Constants.RankType.LEVEL,DataManager.instance.levelData.level,isReduce);
           this.saveRankData(levelRankListClass); 
           this.isRankList=false;   
        }
        this.saveData()
    }

       //计算模拟排名
    //每日统计前300名，最佳统计20000. senceType:排名使用场景   rank 用户直接查看排名,game 游戏过程中重新计算排名，用户一定在榜上，用户排名一定比上一次有进步，取用户的后10名数据。
    //rankNumber 传入的名次，
    public static cacluateNormalRank(rankType:string,scoreNumber:number,isReduce:boolean,senceType?:string,rankNumber?:number):RankListClass{

        //   console.log("enter cacluateEndlessRank");
           if(senceType==null){
               senceType='rank';
           }
           if(rankNumber==null){
               rankNumber=0;
           }
   
           //最高分增长间隔
           let intervalArray = [25,28,32,56,102,135,221];
           let intervalCount= CommonTool.getRandomByArray(intervalArray);
           //排名上升间隔
           let intervalLevelArray = [1,2,2,2,3,3,4,5,6];
           
           let rankListArray:Rank[]=[];
           //当前分数的排名
           let currRankNum:number=0;
   
           let rankListClass:RankListClass=new RankListClass();
           //第一名分数
           let  bestScore=Constants.RankStartBest.TODAY;
           //总共统计多少名
           let   rankCount:number=Constants.RankTypeCount.TODAY;
           //上榜最低分数
           let  rankScoreLine=10;
           //最高分数，不能超过
           let maxScore=Constants.RankBest.TODAY;
           //间隔系数
           let intervalTime=1;
           //上一次的排名
           let  lastRank=rankInfoData.todayScoreRank;

           //名字数组
           let nameArray=Constants.rankNameArray1;
   
           let lastFirseRank:Rank=null;
           let lastSecondRank:Rank=null;
           let lastThirdRank:Rank=null;
   
           if(rankType==Constants.RankType.TODAY){
               if(scoreNumber>2000&&scoreNumber<=5000){
                   rankCount=rankCount/2.5+intervalCount;
               }
               if(scoreNumber>5000&&scoreNumber<=10000){
                   rankCount=rankCount/3+intervalCount;
               }
               if(scoreNumber>10000&&scoreNumber<=30000){
                   rankCount=rankCount/4+intervalCount;
               }
               if(scoreNumber>30000){
                   rankCount=rankCount/6+intervalCount;
               }
           }
           if(rankType==Constants.RankType.WEEK){
                bestScore=Constants.RankStartBest.WEEK;
                rankCount=Constants.RankTypeCount.WEEK;
                rankScoreLine=10;
                intervalTime=10;
                intervalCount=intervalCount*intervalTime;
                maxScore=Constants.RankBest.WEEK;
                nameArray=Constants.rankNameArray1;
                lastRank=rankInfoData.weekScoreRank;
                if(scoreNumber>5000&&scoreNumber<=10000){
                    rankCount=rankCount/2.5+intervalCount;
                }
                if(scoreNumber>10000&&scoreNumber<=20000){
                    rankCount=rankCount/3+intervalCount;
                }
                if(scoreNumber>20000&&scoreNumber<=50000){
                    rankCount=rankCount/4+intervalCount;
                }
                if(scoreNumber>50000){
                    rankCount=rankCount/6+intervalCount;
                }
               
            }
            if(rankType==Constants.RankType.MONTH){
                bestScore=Constants.RankStartBest.MONTH;
                rankCount=Constants.RankTypeCount.MONTH;
                rankScoreLine=10;
                intervalTime=20;
                intervalCount=intervalCount*intervalTime;
                maxScore=Constants.RankBest.MONTH;
                nameArray=Constants.rankNameArray1;
                lastRank=rankInfoData.monthScoreRank;
                if(scoreNumber>10000&&scoreNumber<=20000){
                    rankCount=rankCount/2.5+intervalCount;
                }
                if(scoreNumber>20000&&scoreNumber<=50000){
                    rankCount=rankCount/3+intervalCount;
                }
                if(scoreNumber>50000&&scoreNumber<=100000){
                    rankCount=rankCount/4+intervalCount;
                }
                if(scoreNumber>100000){
                    rankCount=rankCount/6+intervalCount;
                }
                
            }
            if(rankType==Constants.RankType.YEAR){
                bestScore=Constants.RankStartBest.YEAR;
                rankCount=Constants.RankTypeCount.YEAR;
                rankScoreLine=10;
                intervalTime=30;
                intervalCount=intervalCount*intervalTime;
                maxScore=Constants.RankBest.YEAR;
                nameArray=Constants.rankNameArray1;
                lastRank=rankInfoData.yearScoreRank;
                if(scoreNumber>200000&&scoreNumber<=500000){
                    rankCount=rankCount/2.5+intervalCount;
                }
                if(scoreNumber>500000&&scoreNumber<=1000000){
                    rankCount=rankCount/3+intervalCount;
                }
                if(scoreNumber>100000&&scoreNumber<=2000000){
                    rankCount=rankCount/4+intervalCount;
                }
                if(scoreNumber>2000000){
                    rankCount=rankCount/6+intervalCount;
                }
                
            }
   
           if(rankType==Constants.RankType.ALL){
               if(rankInfoData.firstRankInfo!=''){
                   lastFirseRank=new Rank();
                   let rankInfo=JSON.parse(rankInfoData.firstRankInfo);
                   lastFirseRank.name=rankInfo._name;
                   lastFirseRank.rankNumber=rankInfo._rankNumber;
                   lastFirseRank.score=rankInfo._score;
                   lastFirseRank.avatar=rankInfo._avatar;
               }
               if(rankInfoData.secondRankInfo!=''){
                   let rankInfo=JSON.parse(rankInfoData.secondRankInfo);
                   lastSecondRank=new Rank();
                   lastSecondRank.name=rankInfo._name;
                   lastSecondRank.rankNumber=rankInfo._rankNumber;
                   lastSecondRank.score=rankInfo._score;
                   lastSecondRank.avatar=rankInfo._avatar;
               }
       
               if(rankInfoData.thirdRankInfo!=''){   
                   let rankInfo=JSON.parse(rankInfoData.thirdRankInfo);    
                   lastThirdRank=new Rank();     
                   lastThirdRank.name=rankInfo._name;
                   lastThirdRank.rankNumber=rankInfo._rankNumber;
                   lastThirdRank.score=rankInfo._score;
                   lastThirdRank.avatar=rankInfo._avatar;
               }
       
               bestScore=Constants.RankStartBest.ALL;
               rankCount=Constants.RankTypeCount.ALL;
               rankScoreLine=10;
               intervalTime=50;
               intervalCount=intervalCount*intervalTime;
               maxScore=Constants.RankBest.ALL;
               nameArray=Constants.rankNameArray1;
               lastRank=rankInfoData.bestScoreRank;
   
                if(scoreNumber>200000&&scoreNumber<=500000){
                  rankCount=rankCount/2.5+intervalCount;
                }
                if(scoreNumber>500000&&scoreNumber<=1000000){
                    rankCount=rankCount/3+intervalCount;
                }
                if(scoreNumber>100000&&scoreNumber<=2000000){
                    rankCount=rankCount/4+intervalCount;
                }
                if(scoreNumber>2000000){
                    rankCount=rankCount/6+intervalCount;
                }
           }

           if(rankType==Constants.RankType.LEVEL){
                let intervalArray = [0,1,1,1,2,2,2,3,3,4,5];
                let intervalCount= CommonTool.getRandomByArray(intervalArray);
                bestScore=Constants.RankStartBest.LEVEL;
                rankCount=Constants.RankTypeCount.LEVEL;
                rankScoreLine=2;
                intervalTime=2;
                intervalCount=intervalCount*intervalTime;
                maxScore=Constants.RankBest.LEVEL;
                nameArray=Constants.rankNameArray1;
                lastRank=rankInfoData.bestLevelRank;
                if(scoreNumber>10&&scoreNumber<=50){
                    rankCount=rankCount/2.5+intervalCount;
                }
                if(scoreNumber>50&&scoreNumber<=100){
                    rankCount=rankCount/3+intervalCount;
                }
                if(scoreNumber>100&&scoreNumber<=200){
                    rankCount=rankCount/4+intervalCount;
                }
                if(scoreNumber>200){
                    rankCount=rankCount/6+intervalCount;
                }
               
            }
   
           
              
              let days= DateUtil.getDiffDay(DateUtil.formatDate(new Date()),Constants.StartRankDate);
          //    console.log('intervalCount',intervalCount);
          //    console.log('days',days);
         //     console.log('rankScoreLine',rankScoreLine);
              if(days>1){
                 if(days>30){
                   days=30;
                 }
                 bestScore=bestScore+days*intervalCount;
                 if(rankType==Constants.RankType.ALL){
                    rankScoreLine=rankScoreLine+Math.round(days*intervalCount)/intervalTime;
                 }
                
                 if(bestScore>maxScore){
                    bestScore=maxScore;
                 }          
              }
           //   console.log('rankScoreLine2',rankScoreLine);
           //   console.log('lastRank',lastRank);
           //   console.log('bestScore',bestScore);
              //每个名次相差分数
              let todayInterval=(bestScore-rankScoreLine)/rankCount;
   
              currRankNum=Math.floor(rankCount-(scoreNumber/(todayInterval)));
           //   console.log('currRankNump00',currRankNum);
   
           //如果是每天日常更新，需要降低名次
           /*if(lastRank>0){
               if(isReduce){
                   if(currRankNum<=lastRank){
                       currRankNum=lastRank+CommonTool.getRandomByArray(intervalLevelArray);
                   }
               }else{
                   if(currRankNum>=lastRank){
                       currRankNum=lastRank-CommonTool.getRandomByArray(intervalLevelArray);
                    //   console.log('currRankNump111',currRankNum);
                   }
               }
           }*/
   
           if(rankNumber>0){
               currRankNum=rankNumber;
           }
   
           if(currRankNum<1)currRankNum=1;
         //  console.log('currRankNump11',currRankNum);
         //  console.log('currRankNump  rankInfoData',lastFirseRank);
           //console.log('currRankNump  rankInfoData222',lastFirseRank.score);
           //如果当前分数在前三名，需要和当天前面计算的前三名比较
           if(currRankNum<=3&&rankInfoData.todayIsRank&&rankType==Constants.RankType.ALL){
               if(currRankNum==1&&rankInfoData.firstRankInfo!=''&&lastFirseRank!=null){
                   if(scoreNumber<lastFirseRank.score){
                       currRankNum=2;
                   }
               }
               if(currRankNum==2&&rankInfoData.secondRankInfo!=''&&lastSecondRank!=null){
                   if(scoreNumber<lastSecondRank.score){
                       currRankNum=3;
                   }
               }
               if(currRankNum==3&&rankInfoData.thirdRankInfo!=''&&lastThirdRank!=null){
                   if(scoreNumber<lastThirdRank.score){
                       currRankNum=4;
                   }
               }
           }
         //  console.log('currRankNump22',currRankNum);
              //需要显示的后面排名个数，默认5个
              let prevIndexs=5;
              if(currRankNum<5){
                 prevIndexs=15-currRankNum;
              }
             
              //需要显示的前面排名个数，
              let nextIndexs=15-prevIndexs;
              //前面不足5个，少显示一个
              if(currRankNum<=5){
                nextIndexs=nextIndexs-1;
              }
   
               //排名未上榜 不在前15名
              if(currRankNum>15){
                //currRankNum=rankCount+1;
                nextIndexs=15;
                prevIndexs=0;
              }
   
              
              if(senceType=='game'){
               nextIndexs=0; 
               prevIndexs=10;
              }
   
              //长度10或者9
              rankListArray.length=prevIndexs+nextIndexs;
   
            //  console.log('todayInterval',todayInterval);
           //   console.log('currRankNum',currRankNum);
            //  console.log('nextIndexs',nextIndexs);
           //   console.log('prevIndexs',prevIndexs);
   
              //上一个排名的分数
              let prevScore=scoreNumber;
              let lastName='';
              if(scoreNumber<rankScoreLine){
                 prevScore=rankScoreLine;
              }
              if(scoreNumber>bestScore||currRankNum>15){
                  prevScore=bestScore;
              }
   
               //如果当前分数小于最高分数的5分之一，间隔系数减少一半。大于5分之4，间隔分数增加一倍。
               if(scoreNumber<bestScore/20){
                   intervalTime=intervalTime/4;
               }else if(scoreNumber<bestScore/5){
                   intervalTime=intervalTime/2;
               }else if(scoreNumber>bestScore*4/5){
                   intervalTime=intervalTime*2;
               } 
   
               //这里循环取出前面nextIndexs个的排名
              for (let index = nextIndexs-1; index>=0; index--) {
                   intervalCount= CommonTool.getRandomByArray(intervalArray);
                   let rank:Rank=new Rank();
                   let nameStr=CommonTool.getRandomByArray(nameArray).split('-');
                   if(nameStr[0]==lastName){
                       nameStr=CommonTool.getRandomByArray(Constants.rankNameArray1).split('-');
                   }
                   lastName=nameStr[0];
                   rank.name=nameStr[0];
                   if(nameStr.length>1){
                       rank.avatar=nameStr[1];
                   }
                   rank.rankUp=CommonTool.getRandomByArray([true,false]);
                   if(currRankNum>15){
                        rank.rankNumber=15-nextIndexs+index+1;
                   }else{
                        rank.rankNumber=currRankNum-nextIndexs+index;
                   }
                  
                   let score=prevScore+(intervalCount*intervalTime)+CommonTool.getRandomByArray(intervalArray);
                   if(score<scoreNumber){
                       score=scoreNumber+intervalTime;
                   }
                   score=Math.round(score);
   
                   rank.score=score;
                   prevScore=score;
                   rankListClass.setTopThreeRanks(rank);
                   rankListArray[index]=rank;
                  
              }  
   
               //这里循环取出后面prevIndexs的排名
              for (let index = 0; index <prevIndexs; index++) {
                   intervalCount= CommonTool.getRandomByArray(intervalArray);
                   let rank:Rank=new Rank();
                   let nameStr=CommonTool.getRandomByArray(nameArray).split('-');
                   if(nameStr[0]==lastName){
                       nameStr=CommonTool.getRandomByArray(Constants.rankNameArray1).split('-');
                   }
                   lastName=nameStr[0];
                   rank.name=nameStr[0];
                   if(nameStr.length>1){
                       rank.avatar=nameStr[1];
                   }
                   rank.rankUp=CommonTool.getRandomByArray([true,false]);
                   rank.rankNumber=currRankNum+index+1;
                   let score=prevScore-intervalCount*intervalTime-CommonTool.getRandomByArray(intervalArray);
                   if(score<rankScoreLine){
                       score=rankScoreLine+(prevIndexs-index);
                   }
                   if(score>scoreNumber){
                       score=scoreNumber-intervalTime;
                   }
                   score=Math.round(score);
                   rank.score=score;
                   prevScore=score;
                   if((nextIndexs+index)>=rankListArray.length){
                       break;
                   }
                   rankListClass.setTopThreeRanks(rank);
                   rankListArray[nextIndexs+index]=rank;
              }    
               
          // console.log('rank.score000000000',rankListArray[9].score);
   
           //打包返回对象
           rankListClass.rankList=rankListArray;
           let currRank:Rank=new Rank();
           currRank.rankNumber=currRankNum;
           currRank.score=scoreNumber;
           if(rankInfoData.rankName!=''){
               currRank.name=rankInfoData.rankName;
           }else{
               currRank.name='Me';
           }
           if(rankInfoData.rankAvatar!=''){
               currRank.avatar=rankInfoData.rankAvatar;
           }else{
               let nameStr=CommonTool.getRandomByArray(nameArray).split('-');
               if(nameStr.length>1){
                   currRank.avatar=nameStr[1];
               }
           }
        //   console.log('rank.score111111111111',rankListArray[9].score);
     
           if(senceType=='game'||lastRank>currRankNum){
               currRank.rankUp=true;
           }else{
               currRank.rankUp=false;
           }
   
           rankListClass.currentRank=currRank;
           rankListClass.setTopThreeRanks(currRank);
           rankListClass.rankType=rankType;
           rankListClass.rankScoreLine=rankScoreLine;
           rankListClass.isRank=true;
           
      //    console.log('rankScoreLine',rankScoreLine);
      //  console.log('rank.score11111111111111',rankListArray[9].score);
           //未上榜
           if(scoreNumber<rankScoreLine){
               if( rankListClass.rankList[rankListClass.rankList.length-1]!=null){
                   rankListClass.rankList[rankListClass.rankList.length-1].score=rankScoreLine;
               }
               
               rankListClass.isRank=false;
           }
   
           //生成前三名
           if(rankListClass.firstRank==null){
               let firstRank:Rank=new Rank();
               if(rankInfoData.todayIsRank&&lastFirseRank!=null){
                   firstRank=lastFirseRank;
               }else{
   
                   let nameStr=CommonTool.getRandomByArray(nameArray).split('-');
                   if(nameStr[0]==lastName){
                       nameStr=CommonTool.getRandomByArray(Constants.rankNameArray1).split('-');
                   }
                   lastName=nameStr[0];
                   firstRank.name=nameStr[0];
                   if(nameStr.length>1){
                       firstRank.avatar=nameStr[1];
                   }
                   firstRank.rankUp=true;
                   firstRank.rankNumber=1;
                   firstRank.score=bestScore;
               }
              
               rankListClass.firstRank=firstRank;
           }
   
           //增加前几名分数间隔
            if(rankType==Constants.RankType.TODAY){
                intervalTime=intervalTime*2;
            }else if(rankType==Constants.RankType.WEEK){
                intervalTime=intervalTime*5;
            }else if(rankType==Constants.RankType.MONTH){
                intervalTime=intervalTime*10;
            }else if(rankType==Constants.RankType.YEAR){
                intervalTime=intervalTime*50;
            }else if(rankType==Constants.RankType.ALL){
                intervalTime=intervalTime*50;
            }else if(rankType==Constants.RankType.LEVEL){
                intervalTime=intervalTime*2;
            }
           
        //   console.log('firstRank',rankListClass.firstRank);
   
           if(rankListClass.secondRank==null){
               let secondRank:Rank=new Rank();
               if(rankInfoData.todayIsRank&&lastSecondRank!=null){
                   secondRank=lastSecondRank;
               }else{
                   let nameStr=CommonTool.getRandomByArray(nameArray).split('-');
                   if(nameStr[0]==lastName){
                       nameStr=CommonTool.getRandomByArray(Constants.rankNameArray1).split('-');
                   }
                   lastName=nameStr[0];
                   secondRank.name=nameStr[0];
                   if(nameStr.length>1){
                       secondRank.avatar=nameStr[1];
                   }
                   secondRank.rankNumber=2;
                   secondRank.score=rankListClass.firstRank.score-CommonTool.getRandomByArray(intervalArray)*(intervalTime+1)-CommonTool.getRandomByArray(intervalArray);
               }
               rankListClass.secondRank=secondRank;
           }
   
         //  console.log('secondRank',rankListClass.secondRank);
   
           if(rankListClass.thirdRank==null){
               let thirdRank:Rank=new Rank();
               if(rankInfoData.todayIsRank&&lastThirdRank!=null){
                   thirdRank=lastThirdRank;
               }else{
                   let nameStr=CommonTool.getRandomByArray(nameArray).split('-');
                   if(nameStr[0]==lastName){
                       nameStr=CommonTool.getRandomByArray(Constants.rankNameArray1).split('-');
                   }
                   lastName=nameStr[0];
                   thirdRank.name=nameStr[0];
                   if(nameStr.length>1){
                       thirdRank.avatar=nameStr[1];
                   }
                   thirdRank.rankNumber=3;
                   thirdRank.score=rankListClass.secondRank.score-CommonTool.getRandomByArray(intervalArray)*(intervalTime)-CommonTool.getRandomByArray(intervalArray);
               }
               //如果第四名的分数比第三名高，修改第三名的分数
               let forthRank=rankListArray[0];
               if(forthRank.rankNumber==4&&forthRank.score>thirdRank.score){
                   rankListClass.thirdRank.score=forthRank.score+CommonTool.getRandomByArray(intervalArray);
               }
   
               //如果第三名的分数比第二名高，修改第二名的分数
               if(rankListClass.secondRank.score<thirdRank.score){
                   rankListClass.secondRank.score=thirdRank.score+CommonTool.getRandomByArray(intervalArray)*2;
               }
               rankListClass.thirdRank=thirdRank;
           }
   
        //   console.log('thirdRank',rankListClass.thirdRank);
   
         //  console.log('rankListClass',rankListClass);
         
           rankInfoData.todayIsRank=true;
           return rankListClass;
   
       }
}

export var rankInfoData:RankInfoData = SystemData.register(RankInfoData)