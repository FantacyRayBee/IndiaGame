import { ENUM_AUDIO_CLIP, ENUM_GAME_STATUS } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import { getDistance, toXY } from "../Utils";
import AudiosManager from "../manager/AudiosManager";
import DataManager, { DEFAULT_TIP_TIME } from "../manager/DataManager";
import EffectManager from "../manager/EffectManager";
import ResourceManager from "../manager/ResourceManager";
import Container from "./Container";
import Constants from "../Constants";
import GameManager from "../manager/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Goods extends cc.Component {

    isBack: boolean = false
    // 节点
    body: cc.Node = null
    //后排货架
    bodyShade: cc.Node = null;

    //物品阴影
    shadow: cc.Node = null;
    // 是否入柜移动
    isMoving: boolean = false
    // 入新柜移动速度
    speed: number = 1000;

    //返回移动速度
    returnSpeed: number = 2000;

    //前排宽高
    frontHeight: number = 1;
    frontWidth: number = 1;
    @property
    id:number=0;

    color:number=0;

    //在货架里的位置
    index:number=0;

    //所在的container
    container: Container = null;

    init(params: { id?: number, index: number,isBack?: boolean } = { id: 1,index:0, isBack: false }) {
        
        Object.assign(this, params)
        if(this.id>1000){
           this.color= Number(this.id.toString().substring(3));
        }
        this.body = this.node.getChildByName('body')
        this.bodyShade = this.body.getChildByName('bgshade')
        this.shadow = this.node.getChildByName('shadow')
        this.setBody(this.id)
        if (!this.node.hasEventListener('touchstart')) this.node.on('touchstart', this.onTouchStart, this)
        if (!this.node.hasEventListener('touchmove')) this.node.on('touchmove', this.onTouchMove, this)
        if (!this.node.hasEventListener('touchend')) this.node.on('touchend', this.onTouchEnd, this)
        if (!this.node.hasEventListener('touchcancel')) this.node.on('touchcancel', this.onTouchEnd, this);

    }

    setBody(id: number) {
        if (!(this.body && this.bodyShade)) return
        const spriteFrame: cc.SpriteFrame = ResourceManager.instance.getSprite(`${id}`)
        if (!spriteFrame) return
        const { width, height } = spriteFrame.getRect()
        let scale = 0.9
        if(height>Constants.GOODS_HEIGHT){
            scale=Constants.GOODS_HEIGHT/height;
        }else{
            scale=Constants.GOODS_WIDTH/width;
        };
        if(width * scale>Constants.GOODS_WIDTH){
            scale=Constants.GOODS_WIDTH/width;
        }
        this.frontHeight=height * scale;
        this.frontWidth=width * scale;
        if( this.isBack){
            scale=scale*0.98;
        }
        this.body.getComponent(cc.Sprite).spriteFrame = spriteFrame
        this.body.width = width * scale
        this.body.height = height * scale
        this.bodyShade.getComponent(cc.Sprite).spriteFrame = spriteFrame
        this.shadow.getComponent(cc.Sprite).spriteFrame = spriteFrame
        this.bodyShade.active =  this.isBack
        this.shadow.active=true;
        this.shadow.width = width * scale
        this.shadow.height = height * scale
        this.shadow.scale=0.9;  
        this.initShawPostion();
    }



    initShawPostion(){
        this.shadow.x=Constants.GOODS_SHADOW_X; 
        this.shadow.y=Constants.GOODS_SHADOW_Y; 
        if(!this.isBack){
            this.shadow.x=Constants.GOODS_SHADOW_X_FRONT;
            //最右边的物品阴影短一些
            if(this.index==2){
                this.shadow.x=Constants.GOODS_SHADOW_X+5;
            }
        }
    }

    //重新修改该商品的id，并替换对应的图片
    setId(id:number){
        this.id=id;
        if(this.id>1000){
            this.color= Number(this.id.toString().substring(3));
         }
         this.setBody(this.id);
    }

    setFront() {
        this.isBack = false
        
        cc.tween(this.body)
          .to(0.01,{width:this.frontWidth,height:this.frontHeight})
          .call(() => {
            this.shadow.width = this.frontWidth;
            this.shadow.height = this.frontHeight;  
            this.node.setPosition(cc.v2(0, 0));
        }).start();

        cc.tween(this.bodyShade)
        .to(0.01,{opacity:10,scale:1})
        .call(() => {
            this.bodyShade.active = false

      }).start();
    }

    toFrontEffect(cb: Function){
        this.node.zIndex = 999;
        if (!this.bodyShade) {
            this.bodyShade = this.node.getChildByName("body").getChildByName("bgshade");
        }
        cc.tween(this.bodyShade)
            .to(0.2,{opacity:10, scale: 1})
            .call(() => {
                this.bodyShade.active = false
               
        }).start();

        let action = cc.sequence(
            cc.delayTime(0.1),
            cc.moveTo(0.2, cc.v2(this.node.position.x, this.node.position.y - 50)).easing(cc.easeIn(1)),
            cc.callFunc(()=>{
                cb && cb();
            }),
        );
        cc.tween(this.node).then(action).start();
    }

    toMagicFrontEffect(cb: Function){
        let action = cc.sequence(
            cc.delayTime(0.1),
            cc.spawn(
                cc.moveTo(0.2, cc.v2(this.node.position.x, this.node.position.y - 8)).easing(cc.easeIn(1)),
                cc.scaleTo(0.2, 1.1),
            ),
            cc.scaleTo(0.1, 1),
            cc.callFunc(()=>{
                cb && cb();
            }),
        );
        cc.tween(this.node).then(action).start();
    }
    
    backMagicFrontEffect(cb: Function){
        let action = cc.sequence(
            cc.spawn(
                cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeIn(1)),
                cc.scaleTo(0.2, 1),
            ),
            cc.callFunc(()=>{
                cb && cb();
            }),
        );
        cc.tween(this.node).then(action).start();
    }

    backFrontEffect(cb: Function){
        let action = cc.sequence(
            cc.spawn(
                cc.fadeIn(0.2),
                cc.scaleTo(0.2, 1.2),
            ),
            cc.scaleTo(0.2, 1),
            cc.callFunc(()=>{
                cb && cb();
            }),
        );
        cc.tween(this.node).then(action).start();
    }

    setMoving(bool: boolean) {
        if (bool) {
            DataManager.instance.current = this.node
            this.node.group = 'ui'
        } else {
            DataManager.instance.current = null
            this.node.group = 'default'
            this.isMoving = false
        }
    }

    setClear(bEffect: boolean = true) {
        console.log("消除掉：", this.id);
        this.container.goodsCount--;
        if (bEffect) {
            EffectManager.instance.play('Collect', this.node.parent)
        }
        this.node.removeFromParent();
    }

    onTouchStart(e: cc.Event.EventTouch) {
        if (this.isBack || DataManager.instance.current || this.isMoving || DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING || DataManager.instance.isShuffling) return
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.GET_IN)
        const location = e.getLocation()
        const pos = this.node.parent.convertToNodeSpaceAR(location)
        this.node.setPosition(pos)
        this.setMoving(true);
        this.shadow.active=true;
        let postion=this.caculatePostion();
        this.shadow.x=postion.x;
        this.shadow.y=postion.y;
        DataManager.instance.isSchedule=true;
        DataManager.instance.isTip=false;
    }

    onTouchMove(e: cc.Event.EventTouch) {
        if (this.isBack || DataManager.instance.current != e.currentTarget || this.isMoving || DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING || DataManager.instance.isShuffling) return
        const location = e.getLocation()
        const pos = this.node.parent.convertToNodeSpaceAR(location)
        this.node.setPosition(pos)
        let postion=this.caculatePostion();
        this.shadow.x=postion.x;
        this.shadow.y=postion.y;
    }

    onTouchEnd(e: cc.Event.EventTouch) {

        if (this.isBack || DataManager.instance.current != e.currentTarget || this.isMoving || DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING || DataManager.instance.isShuffling) return
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.GET_OUT)
        const location = e.getLocation()
        // 获取货架上前排的每一个空格，加锁的不能移动
        const frontContainers = DataManager.instance.frontContainers.filter(container => !container.getChildByName('Goods') && !container.parent.parent.getComponent(Container).isLock)
        
        // 目标货柜
        let targetGoodsContainer = null
        let maxArea = 0;
        for (let j = 0; j < frontContainers.length; j++) {
            const goodsContainer = frontContainers[j];
            const goodsContainerRect = goodsContainer.getBoundingBox()
            const point = goodsContainer.parent.convertToNodeSpaceAR(location)
            // 矩形相交面积
            const bodyRect = cc.rect(point.x - this.body.width / 2, point.y - this.body.height / 2, this.body.width, this.body.height)
            if (goodsContainerRect.intersects(bodyRect)) {
                const tempRect = new cc.Rect()
                goodsContainerRect.intersection(tempRect, bodyRect)
                const area = tempRect.width * tempRect.height
                if (area > maxArea) {
                    maxArea = area
                    targetGoodsContainer = goodsContainer;
                }
            }
        }

        
        // 入柜
        if (targetGoodsContainer) {
            //新手引导关第一步没有放对不让入柜
            if(DataManager.instance.levelData.level==1&&DataManager.instance.levelData.newGuideStep==1){
                const newContainer = targetGoodsContainer.parent.parent;
                const newContainerComponent: Container = newContainer.getComponent(Container);
                console.log(newContainerComponent.col,newContainerComponent.row);
                if(newContainerComponent.col==2&&newContainerComponent.row==0){
                    targetGoodsContainer=null;
                }else{
                    this.node.parent = targetGoodsContainer
                    const pos = this.node.parent.convertToNodeSpaceAR(location)
                    this.node.setPosition(pos);
                }
            }else{
                this.node.parent = targetGoodsContainer
                const pos = this.node.parent.convertToNodeSpaceAR(location)
                this.node.setPosition(pos);
            }
        } 
        // 入柜动画
        this.isMoving = true
        const dis = getDistance(this.node.getPosition(), cc.v2(0, 0));
        let delayTime=dis / this.speed;
        if (targetGoodsContainer==null) {
            delayTime=dis/this.returnSpeed;
        }
        const act = cc.moveTo(delayTime, cc.v2(0, 0))
        cc.tween(this.node).then(act).call(() => {
            if (targetGoodsContainer) {
                const oldContainerComponent = this.container;
                // back层转front层, 同时生产新的back层
                oldContainerComponent.backToFront();
                const newContainer = targetGoodsContainer.parent.parent;
                const newContainerComponent: Container = newContainer.getComponent(Container);

                this.node.parent=targetGoodsContainer;
                this.container=newContainerComponent;

                if(targetGoodsContainer.x>0){
                    this.index=2;
                } else  if(targetGoodsContainer.x<0){
                    this.index=0;
                }else{
                    this.index=1;
                }
                this.initShawPostion();
                oldContainerComponent.goodsCount--;
                newContainerComponent.goodsCount++;
                // 消除
                newContainerComponent.clearFront();
            }else{
                this.initShawPostion();
            }
            this.setMoving(false);
        }).start();
        
        DataManager.instance.isTip=true;
        DataManager.instance.tipTime=DEFAULT_TIP_TIME;
    }

    //根据物品的位置实时计算阴影位置 范围  y -10 —— -30，x: 40 —— 70
    caculatePostion():cc.Vec2{
        let firstX=Constants.GOODS_SHADOW_X_FRONT+10;
        let firstY=Constants.GOODS_SHADOW_Y;
        let currentX=0;
        let currentY=0;
        let winSizePixels=cc.winSize;
        let worldPostion=this.shadow.convertToWorldSpaceAR(new cc.Vec2(this.shadow.position.x,this.shadow.position.y));

        currentX=firstX+(30-worldPostion.x/winSizePixels.width*(30));
        currentY=firstY+worldPostion.y/winSizePixels.height*(-20);
        

        if(currentX<40){
            currentX=40;
        }
        if(currentX>70){
            currentX=70;
        }

        if(currentY>-10){
            currentY=-10;
        }
        if(currentY<-30){
            currentY=-30;
        }

        return new cc.Vec2(currentX,currentY);

    }

}
