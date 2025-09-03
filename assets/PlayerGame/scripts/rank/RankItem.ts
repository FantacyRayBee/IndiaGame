import Constants from "../Constants";
import SpriteFrameCache from "../framework/SpriteFrameCache";
import { i18nManage } from "../i18n/i18nManage";

const {ccclass, property} = cc._decorator;


@ccclass
export default class RankItem extends cc.Component {

    private meNode: cc.Node = null; 

    private playerNode: cc.Node = null; 

    private topNode: cc.Node = null; 

    private scoreLabel: cc.Label = null; 
    //排名
    private numberLabel: cc.Label = null; 

    //箭头
    private arrow:cc.Node = null;

    private nameLabel:cc.Label = null;

    private scoreNode: cc.Node = null; 

    private isMe:boolean=false;

    //level score
    private rankType:string="";


    onLoad (){
        this.meNode = cc.find('meNode', this.node);
        this.playerNode = cc.find('playerNode', this.node);
        this.topNode = cc.find('topNode', this.node);
        this.numberLabel = cc.find('rankNum', this.node).getComponent(cc.Label);
        this.arrow = cc.find('arrow', this.node);
        this.nameLabel = cc.find('name', this.node).getComponent(cc.Label);
        this.scoreNode = cc.find('scoreNode', this.node);
        this.scoreLabel = cc.find('num', this.scoreNode).getComponent(cc.Label);
        this.node.stopAllActions();
        this.arrow.active=false;
        this.topNode.active=false;

    }

    initItem(name:string,rank:number,score:number,isMe:boolean,rankType:string){    
        this.nameLabel.string=name;
        this.numberLabel.string=rank.toString();
        this.scoreLabel.string=score.toString();
        this.isMe=isMe;
       
        if(this.isMe){
            this.meNode.active=true;
            this.playerNode.active=false;
        }else{
            this.meNode.active=false;
            this.playerNode.active=true;
        }
        if(rank<=3){
            this.topNode.active=true;
            this.numberLabel.node.active=false;
            if(rank==1){
                this.topNode.getChildByName('one').active=true;
                this.topNode.getChildByName('two').active=false;
                this.topNode.getChildByName('three').active=false;
            }if(rank==2){
                this.topNode.getChildByName('one').active=false;
                this.topNode.getChildByName('two').active=true;
                this.topNode.getChildByName('three').active=false;
            }if(rank==3){
                this.topNode.getChildByName('one').active=false;
                this.topNode.getChildByName('two').active=false;
                this.topNode.getChildByName('three').active=true;
            }

        }
        let toggle=this.node.getComponent(cc.Toggle);
        this.setRankType(rankType);
    }

    public setArrow(flag:boolean){
        this.arrow.active=true;
        if(flag){
            this.arrow.getChildByName('up').active=true;
            this.arrow.getChildByName('down').active=false;
        }else{
            this.arrow.getChildByName('up').active=false;
            this.arrow.getChildByName('down').active=true;
        }

    }

    public noRank(rankNum:string){
        this.meNode.getChildByName("bg").width=680;
        this.meNode.getChildByName("bg").height=100;
        this.numberLabel.string=rankNum;
        this.numberLabel.node.scale=1.1;
        
    }

    public setRankType(rankType:string){
        this.rankType=rankType;
        if(this.rankType=="level"){
            this.scoreNode.getChildByName("title").getComponent(cc.Label).string=i18nManage._getLabel('title_level',[]);
        }else{
            this.scoreNode.getChildByName("title").getComponent(cc.Label).string=i18nManage._getLabel('title_score',[]);
        }

    }
    
}