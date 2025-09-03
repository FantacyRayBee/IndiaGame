import CommonTool from "./utils/CommonTool";

const {ccclass, property} = cc._decorator;
export default class EffectFlyManager {
    private static instance: EffectFlyManager = null;
    static get Instance (): EffectFlyManager {
        if (!EffectFlyManager.instance){
            EffectFlyManager.instance = new EffectFlyManager();
        }
        return EffectFlyManager.instance;
    }

        //物品掉落效果
    public itemFlyEffect(dropItem:cc.Node, dropPoint:cc.Vec3, flyTarget:cc.Node){
            dropItem.position = cc.v3(dropPoint);
            this.fly(1, dropItem, flyTarget, ()=>{
                dropItem.destroy();
            });
    }

            //物品掉落效果
    public itemDropEffect(parentNode:cc.Node,dropItem:cc.Node, dropPoint:cc.Vec3, flyTarget:cc.Node){
        dropItem.position = cc.v3(dropPoint);
        this.jumpOutAndFly(parentNode, dropItem, flyTarget, ()=>{
             dropItem.destroy();
        });
    }

    //物品掉落效果
    public showDropEffect(parentNode:cc.Node, dropItem:cc.Prefab, dropPoint:cc.Vec3, dropNum:number, flyTarget:cc.Node,scale?:number, callBack?:Function){
        for (let index = 0; index < dropNum; index++) {
            let drop = cc.instantiate(dropItem);
            drop.parent = parentNode;
            drop.position = cc.v3(dropPoint);
            if(scale==null||scale==0){
                scale=1;
            }
            drop.scale = scale;
            drop.opacity = 255;
            this.jumpOutAndFly(parentNode, drop, flyTarget, ()=>{
                drop.destroy();
                if(callBack&&index>=(dropNum-1)){
                    callBack &&  callBack.call(null);
                }
            });
        }
    }

    //物品掉落效果
    public showFlyEffect(parentNode:cc.Node, dropItem:cc.Prefab, dropPoint:cc.Vec3, dropNum:number, flyTarget:cc.Node,scale?:number,delayTime?:number, callBack?:Function){
        for (let index = 0; index < dropNum; index++) {
            let drop = cc.instantiate(dropItem);
            drop.zIndex = 1000;
            drop.parent = parentNode;
            drop.position = cc.v3(dropPoint);
            if(scale==null||scale==0){
                scale=1;
            }
            drop.scale = scale;
            drop.opacity = 255;

            this.fly(delayTime+0.1*index, drop, flyTarget, ()=>{
                drop.destroy();                
                if(callBack&&index>=(dropNum-1)){
                    callBack &&  callBack.call(null);
                }
               
            },scale);
        }
    }

    public jumpOutAndFly(parentNode:cc.Node, dropNode:cc.Node, flyTarget:cc.Node, callBack:Function) {
        let sign = Math.random() > 0.5 ? 1 : -1;
        let randomX = Math.random() * -50 * sign;
        let randomY = Math.random() * -25 * sign;
        let randomH = CommonTool.getRandomByInt(-5, 5);
        let randomt = CommonTool.getRandomByInt(60, 80)*0.01;
        
        let wordPos = flyTarget.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetPos = parentNode.convertToNodeSpaceAR(wordPos);

        let cb = () => {
            flyTarget.scale = 1.3;
            let actionTo = cc.scaleTo(0.1, 1);
            flyTarget.runAction(actionTo);
        };
        dropNode.stopAllActions();
        dropNode.runAction(
            cc.sequence(
                cc.jumpTo(randomt, cc.v2(dropNode.x + randomX, dropNode.y + randomY), 150 + randomH, 1).easing(cc.easeIn(1)),
                cc.jumpTo(randomt*0.7, cc.v2(dropNode.x + randomX*1.5, dropNode.y + randomY), 60 + randomH, 1).easing(cc.easeIn(1)),
                cc.jumpTo(randomt*0.4, cc.v2(dropNode.x + randomX*2, dropNode.y + randomY), 30 + randomH, 1).easing(cc.easeIn(1)),
                cc.delayTime(0.2),
                cc.spawn(cc.scaleTo(0.3, 1), cc.moveTo(0.3, targetPos).easing(cc.easeIn(1))),
                cc.callFunc(cb),
                cc.delayTime(0.1),
                cc.callFunc(callBack)
            )
        );
    }

    private fly(delayTime:number, dropNode:cc.Node, flyTarget:cc.Node,  callBack:Function,scale?:number) {
        let targetWPos = flyTarget.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetNPos = dropNode.parent.convertToNodeSpaceAR(targetWPos);
        dropNode.stopAllActions();
        if(scale==null||scale==0){
            scale=1;
        }
        dropNode.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.spawn(
                    cc.sequence(
                        cc.scaleTo(0.2, 1*scale), 
                        cc.scaleTo(0.2, 0.5*scale)), 
                        cc.moveTo(1.5, targetNPos).easing(cc.easeBackInOut()
                    )
                ),
                cc.fadeOut(0.1),
                cc.callFunc(callBack)
            )
        );
    }
}