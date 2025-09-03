// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tip extends cc.Component {



  private beginPosition=cc.v3(-40,160);

  private endPosition=cc.v3(-220,-20);

  handNode:cc.Node;
  bgNode:cc.Node;

  step=1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onLoad () {
        this.handNode=cc.find("handNode",this.node);
        this.bgNode=cc.find("bgNode",this.node);
        this.handNode.x=this.beginPosition.x;
        this.handNode.y=this.beginPosition.y;

    }

    init(){
       this.handNode.active=true;
       this.bgNode.active=true;
       this.step=1;
       this.beginPosition=cc.v3(-40,160);
       this.endPosition=cc.v3(-220,-20);
        
    }

    startTip(step:number){
        this.step=step;
        this.handNode.active=true;

        if(step==2){
            this.beginPosition=cc.v3(30,160);
            this.endPosition=cc.v3(130,-20);
            this.bgNode.active=false;
        }
        this.handNode.stopAllActions();

        cc.tween(this.handNode)
            .repeatForever(
                cc.tween(this.handNode)
                  .to(1.3, {position: this.endPosition})
                  .call(() => { 
                  //  console.log("start0", this.guideFingerTipNode.active);
                      this.handNode.active = false;
                      this.handNode.position =this.beginPosition;
                  })
                  
                  .call(() => {       
                    //  console.log("start1", this.guideFingerTipNode.active);           
                      this.handNode.active = true;
                   
                  })
                  .delay(0.3)
            ).start();
        
    }

    hideTip(){
        this.node.active=false;
    }

    // update (dt) {}
}
