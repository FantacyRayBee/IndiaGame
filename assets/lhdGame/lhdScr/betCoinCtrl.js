

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

  

    onLoad () {
    },

    // 移动坐标
    setMovePos:function(node){
        let nodePos = this.betCoinAct(node);
        cc.tween(this.node)
        .delay((Math.random()/3).toFixed(2)) 
        .to(0.3 , { position: cc.v2(nodePos.x, nodePos.y)}) //{easing: "quadOut"}
        .start()
    },

    // 静态坐标
    setStaticPos :function (node) {
        let nodePos = this.betCoinAct(node);
        this.node.setPosition(nodePos)
    },

  
    betCoinAct:function(node) {
        let name = node.name; 
        let node_y = null;
        let node_x = null;
       
        if(name == "node_dragonChip") {   // 龙
            let Y =  Math.ceil(Math.random()*130)*-1;
            let Y1 = Math.ceil(Math.random()*45);
            node_y = Math.random() < 0.5 ? Y : Y1; 
            node_x = Math.ceil(Math.random()*205+195)*-1;

        } else if (name == "node_tigerChip") {   // 老虎
            let Y =  Math.ceil(Math.random()*130)*-1;
            let Y1 = Math.ceil(Math.random()*45);
            node_y = Math.random() < 0.5 ? Y : Y1; 
            node_x = Math.ceil(Math.random()*205+195);
        
        } else if (name == "node_tieChip") {     // 和
            let Y =  Math.ceil(Math.random()*130)*-1;
            let Y1 = Math.ceil(Math.random()*45);
            let X =  Math.ceil(Math.random()*100)*-1;
            let X1 = Math.ceil(Math.random()*100);

            node_y = Math.random() < 0.5 ? Y : Y1; 
            node_x = Math.random() < 0.5 ? X : X1;
        } 
        
        return cc.v2(node_x,node_y)

    },

    start () {

    },

    // update (dt) {},
});
