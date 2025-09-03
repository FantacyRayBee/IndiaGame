

import { ENUM_GOODS_TYPE, ENUM_LEVEL_DIFFICULTY, ENUM_LEVEL_TYPE, ENUM_UI_TYPE } from "../Enum";
import DataManager from "../manager/DataManager";
import PoolManager from "../manager/PoolManager";
import Container from "./Container";
import { LEVEL_CONFIG } from "../config/LevelsConfig";
import Constants from "../Constants";
import CommonTool from "../framework/utils/CommonTool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Levels extends cc.Component {

    
    //货架数组
    @property([cc.Node])
    containerNodes:cc.Node[] =[];

    level: number = 1;
    goodsCount:number=10;

    moveCount:number=0;

    //关卡类型
    type:ENUM_LEVEL_TYPE=ENUM_LEVEL_TYPE.NORMAL;

    //关卡难度
    difficulty:ENUM_LEVEL_DIFFICULTY=ENUM_LEVEL_DIFFICULTY.EASY;
    
    //货架关卡配置数组
    containArray:number[]=null;

    //当前关卡启用的货架对象
    public containers: Container[] = [];

    //上锁货架
    locks: Container[] = [];


    initData(){

        //初始化关卡、货架
        for (let index = 0; index < this.containerNodes.length; index++) {
            this.containerNodes[index].active=false;
            this.containerNodes[index].removeAllChildren();           
        }
        if(this.containers&&this.containers.length>0){
            for (let index = 0; index < this.containers.length; index++) {
                const element = this.containers[index];
                if(element&&element.node){
                    element.node.removeFromParent();
                }
            }
            this.containers.length=0;
            
        }

        if(this.locks&&this.locks.length>0){
            for (let index = 0; index < this.locks.length; index++) {
                const element = this.locks[index];
                if(element&&element.node){
                    element.node.removeFromParent();
                }
            }
            this.locks.length=0;
        }
        DataManager.instance.levelData.initData();
        
    }

    initLevel(level:number):number[]{
        if(!CommonTool.isFullScreen()){
            this.node.scale=0.95;
        }
        this.initData();
        this.level = Math.min(level, LEVEL_CONFIG.length);
        let levelData=LEVEL_CONFIG[level - 1];

        this.type=levelData.type;
        this.difficulty=levelData.difficult;
        this.goodsCount=levelData.goodsCount;
        this.containArray=levelData.contain;
        this.moveCount=levelData.move;
        DataManager.instance.levelData.timer=levelData.time;
        let count=0;

        //生成新货架
        for (let index = 0; index < this.containArray.length; index++) {
            const indexNum = this.containArray[index];
            if(indexNum>0){
                this.containerNodes[index].active=true;
                let  containerNode = PoolManager.instance.getNode("Container", this.containerNodes[index]);
                containerNode.parent=this.containerNodes[index];
               let  container=containerNode.getComponent(Container);
               let colrow=this.getContainerColAndRow(index);
               container.col= colrow.col;
               container.row= colrow.row;
               if(levelData.speed&&levelData.speed>0){
                  container.speed=levelData.speed;
               }
                
               container.init(count,indexNum,this);
               console.log(index,container.col,container.row);
               this.containers.push(container);
               count++;

               //设置货架使用的阴影
             /* if(index>0&&index<(this.containArray.length-1)){
                  if(this.containArray[index-1]==0){
                    container.setShow(ENUM_CONTAINER_POSTION.LEFT);
                  }else if(this.containArray[index+1]==0){
                    container.setShow(ENUM_CONTAINER_POSTION.RIGHT);
                  }else{
                    container.setShow(ENUM_CONTAINER_POSTION.CENTER);
                  }
               }else if(index==0){
                  container.setShow(ENUM_CONTAINER_POSTION.LEFT);
               }else if(index==(this.containArray.length-1)){
                  container.setShow(ENUM_CONTAINER_POSTION.RIGHT);
               }*/
            }
            
        }

        //根据货架所在位置显示不同的货架图片和阴影
       /* for (let index = 0; index < this.containers.length; index++) {
            const container = this.containers[index];
            if(container.col==0){
                if(this.isContainerByPos(container.col+1,container.row)){
                    container.setShow("left",false);
                }else{
                    container.setShow("true",false);
                }
                continue;
            }
            if(element.col==col&&element.row==row){
                return true;
            }
            
        }*/
        
        //生成商品
        //1.获取要插入的商品数组
        let goodsIndexArr = [];
        let goodsTypes=levelData.goods;

        for (let i = 0; i < goodsTypes.length; i++) {
            if(this.level==1){
                goodsIndexArr.push(goodsTypes[i]);
                continue;
            }     
            console.log("goodsTypes",goodsTypes[i]);    
            let typeArray=goodsTypes[i].split("_");
            console.log("typeArray",typeArray);
            if(typeArray.length<3){
                console.error("level goods error",typeArray);
                return ;
            }
            //商品大类
            let type=Number(typeArray[0]);
            //种类数量，随机
            let count=Number(typeArray[1]);
            //颜色数量，随机
            let colorNum=Number(typeArray[2]);
            let lastgoodsId=0;
            
            for (let j = 0; j < count; j++) {
                let goodsIdArray=Constants.BEVERAGE_GOODS;
                let maxColorNum=2;
                if(type==ENUM_GOODS_TYPE.DAILY){
                    goodsIdArray=Constants.DAILY_GOODS;
                }else if(type==ENUM_GOODS_TYPE.FOOD){
                    goodsIdArray=Constants.FOOD_GOODS;
                }else  if(type==ENUM_GOODS_TYPE.JUICE){
                    goodsIdArray=Constants.JUICE_GOODS;
                } else if(type==ENUM_GOODS_TYPE.LETTER){
                    goodsIdArray=Constants.LETTER_GOODS;
                }  else if(type==ENUM_GOODS_TYPE.PLANT){
                    goodsIdArray=Constants.PLANT_GOODS;
                }  else if(type==ENUM_GOODS_TYPE.TOY){
                    goodsIdArray=Constants.TOY_GOODS;
                }  else if(type==ENUM_GOODS_TYPE.SNACKFOODS){
                    goodsIdArray=Constants.SNACKFOODS_GOODS;
                }  
                console.log("goodsIdArray",goodsIdArray); 
                console.log("maxColorNum",maxColorNum);     
                //具体的商品id，不包括颜色
                let goodsId = CommonTool.getRandomByArray(goodsIdArray);   
                maxColorNum=goodsId.toString().substring(3);
                goodsId=goodsId.toString().substring(0,3);
                while(goodsId==lastgoodsId&&goodsIdArray.length>1){
                    goodsId = CommonTool.getRandomByArray(goodsIdArray);
                    maxColorNum=goodsId.toString().substring(3);
                    goodsId=goodsId.toString().substring(0,3);
                } 
                 
               console.log("goodsId",goodsId);              
                lastgoodsId=goodsId;
                let lastColorId=-1;
                for (let k = 0; k < colorNum; k++) {
                    let  colorId = CommonTool.getRandomByInt(1,maxColorNum+1);
                    while((colorId==lastColorId||colorId>maxColorNum)&&maxColorNum>1){
                        colorId =CommonTool.getRandomByInt(1,maxColorNum+1);
                        console.log("while colorId",colorId);
                    } 
                    console.log("lastColorId",lastColorId);
                    lastColorId=colorId;
                    console.log("colorId",colorId);   
                    if(colorId<10){
                        goodsIndexArr.push(goodsId+"0"+colorId.toString());
                    }else{
                        goodsIndexArr.push(goodsId+""+colorId.toString());
                    }
                    
                    console.log("goodsIndexArr",goodsIndexArr);
                }
            }          
            
        }
        if(this.level==1){  //新手关卡写死生成逻辑
            const tripledArray = [];
            tripledArray.push(goodsIndexArr[0]);
            tripledArray.push(0);
            tripledArray.push(0);
            tripledArray.push(goodsIndexArr[1]);
            tripledArray.push(goodsIndexArr[0]);
            tripledArray.push(goodsIndexArr[1]);
            tripledArray.push(0);
            tripledArray.push(goodsIndexArr[0]);
            tripledArray.push(goodsIndexArr[1]);
            goodsIndexArr=tripledArray;
        }else{
            goodsIndexArr=CommonTool.shuffleAndCopyTriple(goodsIndexArr);
        }
        

        return goodsIndexArr;
    }

    /**
     * 判断一个行列坐标是否有货架
     * @param col 货架所在列
     * @param row 货架所在行
     */
    public isContainerByPos(col: number, row: number): boolean {
                if(this.containers!=null){
                    for (let index = 0; index < this.containers.length; index++) {
                        const element = this.containers[index];
                        if(element.col==col&&element.row==row){
                            return true;
                        }
                        
                    }
                
                }
                return false;
        }    


    getContainerColAndRow(index:number){
        let col=Math.floor(index%Constants.LEVEL_CONTAINER_COL);
        let row=Math.floor(index/Constants.LEVEL_CONTAINER_COL);

        if(this.type==ENUM_LEVEL_TYPE.NORMAL){
            return {col,row};
        }
       
        if(this.type==ENUM_LEVEL_TYPE.MOVE){
            if(this.moveCount==1){
                if(index>=15){
                    col= Math.floor((index-15)%Constants.LEVEL_CONTAINER_COL_MOVE);
                    row=Math.floor((index-15)/Constants.LEVEL_CONTAINER_COL_MOVE)+5;
                }
           }else if(this.moveCount==2){
                if(index>=12){
                    col= Math.floor((index-12)%Constants.LEVEL_CONTAINER_COL_MOVE);
                    row=Math.floor((index-12)/Constants.LEVEL_CONTAINER_COL_MOVE)+4;
                }
           }else if(this.moveCount==3){
                if(index>=9){
                    col= Math.floor((index-9)%Constants.LEVEL_CONTAINER_COL_MOVE);
                    row=Math.floor((index-9)/Constants.LEVEL_CONTAINER_COL_MOVE)+3;
                }
            }else if(this.moveCount==4){
                if(index>=6){
                    col= Math.floor((index-6)%Constants.LEVEL_CONTAINER_COL_MOVE);
                    row=Math.floor((index-6)/Constants.LEVEL_CONTAINER_COL_MOVE)+2;
                }
            }
        }

        return {col,row};
    }

    getContainerRow(index:number){
        if(this.type==ENUM_LEVEL_TYPE.NORMAL){
            return Math.floor((index+1)/Constants.LEVEL_CONTAINER_COL);
        }
    }

    getContainerByIndex(index:number){
        console.log("getContainerByIndex",index,this.containers.length);
        if(this.containers&&this.containers.length>0){
            if(this.containers.length<=index){
                return null;
            }
            return this.containers[index];          
        }
        return null;
    }

    release(){

    }

   
}
