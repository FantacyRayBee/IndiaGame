

import { ENUM_AUDIO_CLIP, ENUM_CONTAINER_POSTION, ENUM_CONTAINER_TYPE, ENUM_GOODS_TYPE, ENUM_LEVEL_TYPE, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import AudiosManager from "../manager/AudiosManager";
import DataManager from "../manager/DataManager";
import PoolManager from "../manager/PoolManager";
import SdkManager from "../manager/SdkManager";
import ToastManager from "../manager/ToastManager";
import Goods from "./Goods";
import Levels from "./Levels";
import Tip from "../ui/Tip";
import { toXY } from "../Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Container extends cc.Component {
    
    //是关卡中第几个货架
    index: number = -1
    // 节点
    front: cc.Node = null;
    back: cc.Node = null;
    // 加锁
    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Label)
    lockNumberLabel: cc.Label = null;

    isLock: boolean = false;
    lockNum:number=0;

    col:number=0;
    row:number=0;
    levels:Levels=null;

    idNumber:number=1;

    //货架实时商品总数
    goodsCount:number=0;

    //移动速度 可以控制速度来调节难度，最大不超过5，最小1
    speed: number = 1.6;
    type:ENUM_CONTAINER_TYPE=ENUM_CONTAINER_TYPE.NORMAL;


    leftBg:cc.Node=null;
    normalBg:cc.Node=null;
    rightBg:cc.Node=null;
    shader1:cc.Node=null;


    initData(){
        this.lockNum=0;
        this.idNumber=0;
        this.isLock=false;
        this.type=ENUM_CONTAINER_TYPE.NORMAL;
        this.leftBg.active=false;
        this.rightBg.active=false;
        this.normalBg.active=true;
        this.shader1.active=true;
    }

    init(index: number,idNumber:number,levels:Levels) {
        this.leftBg=cc.find("left",this.node);
        this.normalBg=cc.find("normal",this.node);
        this.rightBg=cc.find("right",this.node);
        this.shader1=cc.find("shader1",this.node);
        this.initData();
        this.idNumber=idNumber;
        this.levels=levels;
        this.index = index;
        this.back = this.node.getChildByName('back');

        this.back.children.forEach(backContainer => {
            DataManager.instance.backContainers.push(backContainer);
            const goods = backContainer.getChildByName('Goods');             
            if (goods) {
                goods.removeAllChildren;
            }
        })
        this.front = this.node.getChildByName('front')
        this.front.children.forEach(frontContainer => {
            DataManager.instance.frontContainers.push(frontContainer)
            const goods = frontContainer.getChildByName('Goods')
                if (goods) {
                    goods.removeAllChildren;
                }
        });

        if(Container.isLockContainer(this.idNumber)){
               this.lockNum  =this.idNumber-10;
        }

         //设置货架的移动属性
         if(this.levels.type==ENUM_LEVEL_TYPE.MOVE&&this.levels.moveCount>=1){
            if(this.levels.moveCount==1){
                 if(this.row==5){
                     this.type=ENUM_CONTAINER_TYPE.MOVE;
                 }
            }else if(this.levels.moveCount==2){
                 if(this.row>=4){
                    this.type=ENUM_CONTAINER_TYPE.MOVE;
                 }
            }else if(this.levels.moveCount==3){
                 if(this.row>=3){
                    this.type=ENUM_CONTAINER_TYPE.MOVE;
                 }
             }else if(this.levels.moveCount==4){
                 if(this.row>=2){
                    this.type=ENUM_CONTAINER_TYPE.MOVE;
                 }
             }
            
        }
        if(this.type==ENUM_CONTAINER_TYPE.MOVE){
            this.node.parent.x=this.node.parent.x+(5-this.row)*20;
        }
        

        this.lockNode.active=false;
         if(this.lockNum>0){
             this.isLock=true;
             this.type=ENUM_CONTAINER_TYPE.LOCK;
             this.levels.locks.push(this);
             this.lockNode.active=true;
             this.lockNode.getChildByName('adNode').on('click', this.onLockClick, this);
             this.lockNumberLabel.string=this.lockNum+"";
         }
         this.setShow();
    }

    //设置货架显示背景图片
    setShow(){

        if(this.levels.level==1){
            if(this.col==0){
                this.leftBg.active=false;
                this.normalBg.active=true;
                this.rightBg.active=false;
                this.shader1.active=true;
                this.shader1.width=50;
                this.shader1.x=-25;
             }else if(this.col==2){
                 this.leftBg.active=false;
                 this.normalBg.active=false;
                 this.rightBg.active=true;
                 this.shader1.width=245;
                 this.shader1.x=-120;
             }else if(this.col==1){
                 this.leftBg.active=true;
                 this.normalBg.active=false;
                 this.rightBg.active=false;
                 this.shader1.width=245;
             }
            return;
        }
       
        if(this.col==0){

           this.leftBg.active=true;
           this.normalBg.active=false;
           this.rightBg.active=false;
           this.shader1.width=245;
        }else if(this.col==2){
            this.leftBg.active=false;
            this.normalBg.active=false;
            this.rightBg.active=true;
            this.shader1.width=245;
            this.shader1.x=-120;
        }else if(this.col==1){
            this.leftBg.active=false;
            this.normalBg.active=true;
            this.rightBg.active=false;
            this.normalBg.width=265;
            this.node.parent.width=265;
        }
    }

    //left center right
    setShader(showType:string,isShader){
        if(showType=="left"){
           this.leftBg.active=true;
           this.normalBg.active=false;
           this.rightBg.active=false;
           if(isShader){
               this.shader1.active=true;
               this.shader1.width=245;
           }
        }else if(showType=="right"){
            this.leftBg.active=false;
            this.normalBg.active=false;
            this.rightBg.active=true;
            if(isShader){
                this.shader1.active=true;
                this.shader1.width=245;
                this.shader1.x=-120;
            }
         }else if(showType=="center"){
            this.leftBg.active=false;
            this.normalBg.active=true;
            this.rightBg.active=false;
            if(isShader){
                this.shader1.active=true;
            }
         }
        
    }

    // 入前排
    initFront() {
        if (DataManager.instance.goodsData.length <= 0) return
        const arr = DataManager.instance.goodsData[this.index]
        const data: any = arr.pop()
        if (!data || data.length <= 0) return
        for (let i = 0; i < data.length; i++) {
            //console.log(data[i]);
            //代表这个位置留空
            if(data[i]==0){
                continue;
            }
            const goodsNode = PoolManager.instance.getNode('Goods')
            const goods = goodsNode.getComponent(Goods)
            goods.init({ id: data[i],index:i, isBack: false })
            goodsNode.parent = this.front.children[i];
            goods.container=this;
            this.goodsCount++;
        }
    }

    // 入后排
    initBack() {
        if (DataManager.instance.goodsData.length <= 0) return
        const arr = DataManager.instance.goodsData[this.index]
        const data: any = arr.pop();
        if (!data || data.length <= 0) return
        for (let i = 0; i < data.length; i++) {
            const goodsNode = PoolManager.instance.getNode('Goods')
            const goods = goodsNode.getComponent(Goods)
            goods.init({ id: data[i], index:i,isBack: true })
            goodsNode.parent = this.back.children[i];
            goods.container=this;
            this.goodsCount++;
        }
    }

    //获取货架的总层数
    getLayerCount(){
        let layer=0;
        let array=DataManager.instance.goodsData[this.index];
        if(array&&array.length>0){
            layer=2+array.length;
            return layer;
        }

        for (let i = 0; i < this.back.children.length; i++) {
            const backContainer = this.back.children[i]
            const goods = backContainer.getChildByName('Goods')
            if (goods) {
                layer=2;
                return  layer;
            }
        }


        for (let i = 0; i < this.front.children.length; i++) {
            const frontContainer = this.front.children[i]
            const goods = frontContainer.getChildByName('Goods')
            if (goods) {
                layer=1;
                return  layer;
            }
        }


        return layer;

    }

        //判断该货架的第2或者3层是否有空位，有返回对应的层数，否则返回0。如果这一层有两个goodsId，也不能增加
        //goodsId不传时不校验3个商品相同问题
        getEmptyLayer(goodsId?:number):number{
            if(goodsId==null)goodsId=-1;
            let array=DataManager.instance.goodsData[this.index];
            if(array&&array.length>0){
                let  data: any = array[array.length-1];
                if(data&&data.length<3){
                    if(data.length==1){
                        return 3;
                    }
                    for (let i = 0; i < data.length; i++) {
                       if( data[i]!=goodsId){
                           return 3;
                       }
                    }
                }
            }
    
            let goodsArray=[];
            for (let i = 0; i < this.back.children.length; i++) {
                const backContainer = this.back.children[i]
                const goods = backContainer.getChildByName('Goods')
                if (goods) {
                    const goodsComponent = goods.getComponent(Goods);
                    goodsArray.push(goodsComponent.id);
                }
            }
            if(goodsArray==null||goodsArray.length==1){
                return 2;
            }
            //不能三个商品的id都相同
            if(goodsArray.length==2){
                if(goodsArray[0]!=goodsId||goodsId!=goodsArray[1]){
                    return 2;
                }
            }
  
            return 0;
    
        }

    // back层转front层, 同时生成新的back层
    backToFront() {
        const isGoods = this.front.children.findIndex(container => container.getChildByName('Goods'))
        if (isGoods < 0) {
            let isBackToFront: boolean = false
            for (let i = 0; i < this.back.children.length; i++) {
                const backContainer = this.back.children[i]
                const goods = backContainer.getChildByName('Goods')
                if (goods) {
                    isBackToFront = true
                    const goodsComponent = goods.getComponent(Goods)
                    goods.parent = this.front.children[i]
                    goodsComponent.setFront();
                }
            }
            if (isBackToFront) {
                // 生成新back层
                this.initBack()
            }
        }
    }

    // 消除front层
    clearFront() {
        let goodsIndex: number = -1
        let isClear: boolean = true
        for (let i = 0; i < this.front.children.length; i++) {
            const goods = this.front.children[i].getChildByName('Goods')
            if (goods) {
                const index = goods.getComponent(Goods).id
                if (goodsIndex >= 0) {
                    if (goodsIndex != index) {
                        isClear = false
                        break
                    }
                } else {
                    goodsIndex = index
                }
            } else {
                isClear = false
                break
            }
        }
        if (isClear) {
            AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLEAR)
            for (let i = 0; i < this.front.children.length; i++) {
                const goods = this.front.children[i].getChildByName('Goods')
                const goodsComponent = goods.getComponent(Goods)
                goodsComponent.setClear()
            }
            DataManager.instance.levelData.clearAllNums++;
            DataManager.instance.levelData.currentClearNums++;

            const starPos = toXY(this.node, StaticInstance.gameManager.stage)
            DataManager.instance.starStartPosArr.push(starPos);
            
            this.backToFront()
            // 解锁
            if(this.levels.locks&&this.levels.locks.length>0){
                this.levels.locks[0].updateLockNum();
            }
            // 取消时停技能
            if (StaticInstance.uiManager.isActive(ENUM_UI_TYPE.ICE)) {
                StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE, false)
                StaticInstance.uiManager.setMainTimer(true)
                StaticInstance.uiManager.setMainTimerSound(true)
            }
            // 连击进度
            if(DataManager.instance.levelData.level!=1){
                StaticInstance.uiManager.setMainProgress()
            }
            
            // 取消第一关tip
            if (DataManager.instance.levelData.level == 1 && StaticInstance.gameManager.tipNode) {
                if(DataManager.instance.levelData.newGuideStep==1){
                    DataManager.instance.levelData.newGuideStep++;
                    let tip=StaticInstance.gameManager.tipNode.addComponent(Tip);
                    tip.startTip(DataManager.instance.levelData.newGuideStep);
                }else{
                    StaticInstance.gameManager.tipNode.removeFromParent();
                 }
                
            }
        }
        StaticInstance.gameManager.onGameCheck()
    }


    //在指定层增加商品g
    addGoodsById(layer:number,goodsId:number):boolean{
        if(layer==1){
            for (let i = 0; i < this.front.children.length; i++) {
                const backContainer = this.front.children[i]
                const goods = backContainer.getChildByName('Goods')
                if (!goods) {
                    const goodsNode = PoolManager.instance.getNode('Goods')
                    const goods = goodsNode.getComponent(Goods)
                    goods.init({ id:goodsId, index:i,isBack: true })
                    goodsNode.parent = this.front.children[i];
                    goods.container=this;
                    this.goodsCount++;
                    return true;
                }
            }
            console.log("front 没有空位",goodsId,this.index);
            return false;
        }else if(layer==2){
            for (let i = 0; i < this.back.children.length; i++) {
                const backContainer = this.back.children[i]
                const goods = backContainer.getChildByName('Goods')
                if (!goods) {
                    const goodsNode = PoolManager.instance.getNode('Goods')
                    const goods = goodsNode.getComponent(Goods)
                    goods.init({ id:goodsId, index:i,isBack: true })
                    goodsNode.parent = this.back.children[i];
                    goods.container=this;
                    this.goodsCount++;
                    return true;
                }
            }
            console.log("back 没有空位",goodsId,this.index);
            return false;
        }else{
            const arr = DataManager.instance.goodsData[this.index];
            //层数不一致
            if((layer-2)>arr.length){
                console.error("没有"+layer+"层",goodsId,this.index,arr.length);
                return false;
            }
            layer=layer-2;
            const data: any = arr[arr.length-layer];
            if (!data || data.length <= 0||data.length>=3) return false;
            data.push(goodsId);
            DataManager.instance.goodsData[this.index][arr.length-layer]=data;
            return true;
        }
    }
    //修改指定位置的商品
    updateGoodsById(layer:number,oldGoodsId:number,newGoodsId){
        if(layer==1){
            for (let i = 0; i < this.front.children.length; i++) {
                const goods = this.front.children[i].getChildByName('Goods');
                const goodsComponent = goods.getComponent(Goods);
                if(goodsComponent.id==oldGoodsId){
                    goodsComponent.setId(newGoodsId);
                    return true;
                }              
            }
            return false;
        }else if(layer==2){
            for (let i = 0; i < this.back.children.length; i++) {
                const goods = this.back.children[i].getChildByName('Goods');
                const goodsComponent = goods.getComponent(Goods);
                if(goodsComponent.id==oldGoodsId){
                    goodsComponent.setId(newGoodsId);
                    return true;
                }              
            }
            return false;
        }else{
            const arr = DataManager.instance.goodsData[this.index];
            //层数不一致
            if((layer-2)!=arr.length){
                return false;
            }
            layer=layer-2;
            const data: any = arr[arr.length-layer];
            if (!data || data.length <= 0) return false;
            for (let i = 0; i < data.length; i++) {
                if(oldGoodsId==data[i]){
                    DataManager.instance.goodsData[this.index][arr.length-layer][i]=newGoodsId;
                    return true;
                }
            }
            return false;
        }

    }

    onLockClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.showVideoAd(async (msg: string) => {
            if (!SdkManager.instance.getPlatform()) {
                ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255) })
            }
            this.setLockOpen()
        }, (msg: string) => {
            ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255) })
        })
    }

    updateLockNum(){
        this.lockNum--;
        this.lockNumberLabel.string=this.lockNum+"";
        if (this.lockNum <= 0) {
           this.setLockOpen();
        }
    }

    setLockOpen() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.UNLOCK)
        this.isLock = false;
        this.lockNum=0;
        const index = this.levels.locks.findIndex(lock => lock == this)
        this.levels.locks.splice(index, 1);
        this.lockNode.active=false;
    }

    public static  isLockContainer(type:number):boolean{
        if(type>10&&type<=15){
            return true
        }
        return false

    }

    protected update(dt: number): void {
        //左右移动货架
        if(this.type==ENUM_CONTAINER_TYPE.MOVE){         
            this.node.parent.x=this.node.parent.x+this.speed;
            if(this.node.parent.x>600){
                this.node.parent.x=-600;               
            }
        }
    }
}
