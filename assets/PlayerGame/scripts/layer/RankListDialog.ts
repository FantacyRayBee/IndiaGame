
import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import BaseDialog from "./BaseDialog";
import SdkManager from "../manager/SdkManager";
import ToastManager from "../manager/ToastManager";
import { rankInfoData } from "../datacenter/RankInfo";
import Constants from "../Constants";
import RankListClass from "../rank/RankLisClasst";
import PoolManager from "../manager/PoolManager";
import RankItem from "../rank/RankItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankListDialog extends BaseDialog {

    btnClose: cc.Node = null;


    rankScroll:cc.ScrollView = null;

    scrollContentNode:cc.Node = null;

    loadNode:cc.Node = null;

    rankNode:cc.Node = null; 

    levelBtn:cc.Node = null; 

    scoreBtn:cc.Node = null; 

    weekBtn:cc.Node = null; 

    monthBtn:cc.Node = null; 

    allBtn:cc.Node = null; 

    noMeNode:cc.Node = null; 

    private percent:number=0;

    private rankType:string=null;
    
    onLoad() {
        this.rankNode = cc.find('rankNode', this.node);
        this.rankScroll = cc.find('ScrollView', this.rankNode).getComponent(cc.ScrollView);
        this.scrollContentNode = cc.find('view/content', this.rankScroll.node);
        this.levelBtn = cc.find('btnNode/levelBtn', this.rankNode);
        this.scoreBtn = cc.find('btnNode/scoreBtn', this.rankNode);
        this.weekBtn = cc.find('btnNode/levelChildBtn/weekBtn', this.rankNode);
        this.monthBtn = cc.find('btnNode/levelChildBtn/monthBtn', this.rankNode);
        this.allBtn = cc.find('btnNode/levelChildBtn/bestBtn', this.rankNode);
        this.noMeNode = cc.find('noMeNode', this.rankNode);
        this.btnClose = cc.find('titleNode/btn_close', this.rankNode)
        this.btnClose.on('click', this.onCloseClick, this);
        this.levelBtn.on('click', this.onClickLevel, this);
        this.scoreBtn.on('click', this.onClickWeek, this);
        this.weekBtn.on('click', this.onClickWeek, this);
        this.monthBtn.on('click', this.onClickMonth, this);
        this.allBtn.on('click', this.onClickBest, this);
    }

    onDestroy() {
        this.btnClose.off('click', this.onCloseClick, this)
        this.levelBtn.off('click', this.onClickLevel, this)
        this.scoreBtn.off('click', this.onClickWeek, this)
        this.weekBtn.off('click', this.onClickWeek, this)
        this.monthBtn.off('click', this.onClickMonth, this)
        this.allBtn.off('click', this.onClickBest, this)
    }

    onEnable() {
        this.zoomIn(this.rankNode);
        SdkManager.instance.toggleBannerAd(true)
    }

    onDisable() {
        SdkManager.instance.toggleBannerAd(false)
    }

    onClickLevel(){
        this.selectRank(Constants.RankType.LEVEL);
    }

    onClickWeek(){
        this.selectRank(Constants.RankType.WEEK);
    }

    onClickMonth(){
        this.selectRank(Constants.RankType.MONTH);
    }

    onClickBest(){
        this.selectRank(Constants.RankType.ALL);
    }

    selectRank(rankType:string){
        this.rankType=rankType;
        this.startRank();
        let levelIndex= this.levelBtn.getSiblingIndex();
        let scoreIndex=this.scoreBtn.getSiblingIndex();
        if(rankType==Constants.RankType.LEVEL){
            if(scoreIndex>levelIndex){
                 this.levelBtn.setSiblingIndex(scoreIndex);
                 this.scoreBtn.setSiblingIndex(levelIndex);
            }
            this.levelBtn.active=true;
            this.levelBtn.getChildByName("Background").getChildByName("bgClicked").active=true;
            this.levelBtn.getChildByName("Background").getChildByName("bgNoClicked").active=false;
            this.scoreBtn.active=true;
            this.scoreBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
            this.scoreBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
            this.weekBtn.active=false;
            this.monthBtn.active=false;
            this.allBtn.active=false;
        }else{
            if(levelIndex>scoreIndex){
                this.levelBtn.setSiblingIndex(scoreIndex);
                this.scoreBtn.setSiblingIndex(levelIndex);
            }
            this.levelBtn.active=true;
            this.levelBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
            this.levelBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
            this.scoreBtn.active=true;
            this.scoreBtn.getChildByName("Background").getChildByName("bgClicked").active=true;
            this.scoreBtn.getChildByName("Background").getChildByName("bgNoClicked").active=false;
            this.weekBtn.active=true;
            this.monthBtn.active=true;
            this.allBtn.active=true;
            if(rankType==Constants.RankType.WEEK){
                this.weekBtn.getChildByName("Background").getChildByName("bgClicked").active=true;
                this.weekBtn.getChildByName("Background").getChildByName("bgNoClicked").active=false;
                this.monthBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
                this.monthBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
                this.allBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
                this.allBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
            }else  if(rankType==Constants.RankType.MONTH){
                this.weekBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
                this.weekBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
                this.monthBtn.getChildByName("Background").getChildByName("bgClicked").active=true;
                this.monthBtn.getChildByName("Background").getChildByName("bgNoClicked").active=false;
                this.allBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
                this.allBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
            }else{
                this.weekBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
                this.weekBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
                this.monthBtn.getChildByName("Background").getChildByName("bgClicked").active=false;
                this.monthBtn.getChildByName("Background").getChildByName("bgNoClicked").active=true;
                this.allBtn.getChildByName("Background").getChildByName("bgClicked").active=true;
                this.allBtn.getChildByName("Background").getChildByName("bgNoClicked").active=false;
            }
        }

    }

   
    
    onShown(rankType:string) {
        this.noMeNode.active=false;
        this.rankType=rankType;
        this.selectRank(rankType);
    }

    startRank(){
       
        
        this.initLeaderBoard();
        
        this.loadLeaderboard();
         /*this.scheduleOnce(_=>{
           //检查网络和广告填充。
          let isNet=CallAndroidCommon.isNetWorkEnable();
          this.loadNode.active=false;
          if(!isNet){
            this.showErrorDesc('label_net');
            return;
          }else{
            this.loadLeaderboard();
          }
         
        },1.2);*/
    }

    loadLeaderboard(){
        rankInfoData.initRankInfo();

       
        let rankInfoList:RankListClass= rankInfoData.getRankData( this.rankType);
        
        if(rankInfoList==null||rankInfoList.rankList==null||rankInfoList.rankList.length==0){
            rankInfoData.isRankList=true;
            rankInfoData.initRankInfo();
            rankInfoList= rankInfoData.getRankData( this.rankType);
        }

        //this.currentScore=rankInfoList.currentRank.score;


        let count=rankInfoList.rankList.length;
        //是否已显示当前用户
        let showMe=false;

        let rankItemType="level";
        if(this.rankType!=Constants.RankType.LEVEL){
            rankItemType="score";
        }

        for (var i = 0 ;i <count; i ++){
            let rank = rankInfoList.rankList[i];
            if(rank.rankNumber>rankInfoList.currentRank.rankNumber&&!showMe){
                let f =PoolManager.instance.getNode('RankItem',this.scrollContentNode);
                f.name='childRankMe'; 
                let item = f.getComponent(RankItem);
                let name="player";
                
                item.initItem(name,rankInfoList.currentRank.rankNumber,rankInfoList.currentRank.score,true,rankItemType);
                item.setArrow(rankInfoList.currentRank.rankUp);
                
                showMe=true;
                this.percent=i/count;
            }
            let f = PoolManager.instance.getNode('RankItem',this.scrollContentNode);
            f.name='childRank'+i; 
            let item = f.getComponent(RankItem);
            item.initItem(rank.name,rank.rankNumber,rank.score,false,rankItemType);
            item.setArrow(rank.rankUp);
        }

        //如果没有显示当前用户的排名，代表不在排名表上
        if(!showMe){
            this.noMeNode.active=true;
            let f =PoolManager.instance.getNode('RankItem',this.noMeNode);
            f.name='childRankMe'; 
            let item = f.getComponent(RankItem);
            let name="player";              
            item.initItem(name,rankInfoList.currentRank.rankNumber,rankInfoList.currentRank.score,true,rankItemType);
            item.setArrow(rankInfoList.currentRank.rankUp);
            if(this.rankType==Constants.RankType.LEVEL||this.rankType==Constants.RankType.ALL){
                if(rankInfoList.currentRank.rankNumber>500){
                    item.noRank("500+");
                }else{
                    item.noRank(rankInfoList.currentRank.rankNumber.toString());
                }
            }else if(this.rankType==Constants.RankType.MONTH){
                if(rankInfoList.currentRank.rankNumber>300){
                    item.noRank("300+");
                }else{
                    item.noRank(rankInfoList.currentRank.rankNumber.toString());
                }
            }else if(this.rankType==Constants.RankType.WEEK){
                if(rankInfoList.currentRank.rankNumber>200){
                    item.noRank("200+");
                }else{
                    item.noRank(rankInfoList.currentRank.rankNumber.toString());
                }
            }
        }else{
            this.noMeNode.active=false;
        }

        //最后插入一个空的item
        let f2 = PoolManager.instance.getNode('RankItem',this.scrollContentNode);
        f2.name='childRankL'; 
        let item2 = f2.getComponent(RankItem);
        item2.node.opacity=1;
        item2.node.scale=0.5;
        
        this.scheduleOnce(this.scrollToCurrentRank);
    }

    scrollToCurrentRank(){
        if(this.percent>0){
            this.rankScroll.scrollToPercentVertical(1-this.percent);
        }else{
            this.rankScroll.scrollToPercentVertical(0.06);
        }
        
    }




    initLeaderBoard(){
        if(this.scrollContentNode.children&&this.scrollContentNode.children.length>0){
            for (var i = this.scrollContentNode.children.length-1 ;i >=0; i--){
                if(this.scrollContentNode.children[i].name.indexOf('childRank')>=0){
                    this.scrollContentNode.children[i].removeFromParent();
                }

            }
        }
    }
 

    onCloseClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.RANK, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU)
    }
}


