

cc.Class({
    extends: cc.Component,

    properties: {
        pab_icon : cc. Prefab,
        atlas_chart: cc.SpriteAtlas,
        lab_tiger :cc.Label,
        lab_dragon:cc.Label,
        lab_set:cc.Label,
        lab_tie:cc.Label,
        lab_red :cc.Label,
        lab_blue:cc.Label,
        btn_colse : cc.Button,
        layout_lower:cc.Node,
        layout_up:cc.Node,
        node_blue:cc.Node,
        nodes:[cc.Node],

    },

    //设置下面的趋势图的数据
    setChartDate:function(){        
        this.recordlist = GlobalCfg.ACT_SCENE_CTRL.recordlist;
        let arr = this.recordlist;
        this.long = 0;
        this.hu = 0;
        this.he = 0;
        let atlasName = '';
        this.layout_lower.removeAllChildren();
        for (let i = 0; i < arr.length; i++) {
            let typeNum = arr[i];
            if(typeNum == 0) {
                this.long++;
                atlasName = "icon_d";
            } else if (typeNum == 1) {
                this.hu++;
                atlasName = "icon_t";
            } else if (typeNum == 2) {
                this.he++;
                atlasName = "icon_tie";
            }
            let pab_icon = cc.instantiate(this.pab_icon);
            let icon_t = pab_icon.getChildByName("icon_t").getComponent(cc.Sprite)
            icon_t.spriteFrame = this.atlas_chart.getSpriteFrame(atlasName);
            this.layout_lower.addChild(pab_icon);
            pab_icon.name = ""+typeNum;
        }
        this.lab_set.string = lhdLanguage.lab_set[language]+ " "+ arr.length;
        this.setWinningLab();
        this.setUP(arr)
    },

    //设置上面的大陆图的数据
    setUP:function(arr){
        let longArr = [];    // 虎数组
        let huArr = [];      // 龙数组
        this.AllArr = []      // 总数组
        this.layout_up.removeAllChildren();
        for (let i = arr.length - 1; i >= 0; i--) {
            let typeNum = arr[i];
            if( typeNum == 0 ) {
                longArr.push(typeNum);
                if(huArr.length > 0 || i == 0) {
                    this.AllArr.push(huArr)
                    huArr = [];
                }
            } else if (typeNum == 1 || i == 0 ) {
                huArr.push(typeNum);
                if(longArr.length > 0) {
                    this.AllArr.push(longArr)
                    longArr = [];
                } 
            } 
            if(i==0){
                if(longArr.length > 0) {
                    this.AllArr.push(longArr)
                }
                if(huArr.length > 0) {
                    this.AllArr.push(huArr)
                }
            }
        }
        this.setPos(this.AllArr)
    },

     // 动态添加势图添加输赢图标
    addWinOrLoseIcon:function(typeNum){
        LoggerUtil.getInstance().log("当前获胜的是：",typeNum);
        let atlasName = '';
        if(typeNum == 0) {
            atlasName = "icon_d";
            this.long++
        } else if (typeNum == 1) {
            atlasName = "icon_t";
            this.hu++;
        } else if (typeNum == 2) {
            atlasName = "icon_tie";
            this.he++;
        }

        let children = this.layout_lower.children;
        if(children.length > 0 ) {
            if(children[0].name = "0"){
                this.long--
            }else if (children[0].name = "1"){
                this.hu--;
            } else if(children[0].name = "2") {
                this.he--;
            }
            children[0].destroy()
            let pab_icon = cc.instantiate(this.pab_icon);
            let icon_t = pab_icon.getChildByName("icon_t").getComponent(cc.Sprite)
            icon_t.spriteFrame = this.atlas_chart.getSpriteFrame(atlasName);
            this.layout_lower.addChild(pab_icon);
            pab_icon.name = ""+typeNum;
        }

        this.setUP(this.recordlist)
        this.setWinningLab()
    },

    ctor: function () {
       this.count = 0;
    },

    onLoad () {
        this.btn_colse.node.on("click",function(){
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        },this)

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].active = language-1 == i;  
        }
    
    },

    start () {
        let arr = [[2,2,2,2,2,2,2,2],[1,1,1,1,1,1,1,1,1],[2,2],[1,1,1],[2,2,2],[1,1,1,1,1,1,1],[2,2,2,2,2,2],
                    [1,1,1],[2,2,2,2,2],[1,1,1],[2],[1,1],[2,2,2],[1],[2,2,2],[1],[2],[1],[2,2,2,2,2,2,2,2,2,2]
                  ]
    },


    setPos:function(arr){
        let newArr = this.splitArray(arr);
        let nodeX = null;
        if( newArr.length > 33){
            nodeX = 455;
        } 
        else {
            // nodeX = 455-newArr.length*29
            nodeX = 455;
        }

        for (let i = 0; i < newArr.length; i++) {
            let len = newArr[0].length > 6 ? newArr[0].length -6 : 0;
            let PosY = 72.5+29;
            let PosX = nodeX - (i+len)*29;
            for (let k = 0; k < newArr[i].length; k++) {
                if(k >= 6){
                    PosX +=29;
                } else {
                    PosY -=29;
                }
                let atlasName = newArr[i][k];
                if(atlasName == 0){
                    atlasName = "icon_02"
                }  else if (atlasName == 1) {
                    atlasName = "icon_01"
                } 
              
                let pab_icon = cc.instantiate(this.pab_icon);
                let icon_t = pab_icon.getChildByName("icon_t").getComponent(cc.Sprite)
                icon_t.spriteFrame = this.atlas_chart.getSpriteFrame(atlasName);
                pab_icon.setPosition(PosX,PosY);
                this.layout_up.addChild(pab_icon);
            }
        } 
    },

    //  拆分数组
    splitArray:function(arr){
        let array = [];
        let arr1 = [];
        let arr2 = []
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            if( i==0 ){
                array[0] = arr[i];
            } else {
                count++
                let len = arr[i].length;
                arr1 = [];
                arr2 = [];
                if(len-6 >= count){
                    for (let k = 0; k < len; k++) {
                        if( k >= 6){
                            arr1.push(arr[i][k]);
                        }else{
                            arr2.push(arr[i][k]);
                        }
                    }
                    count = 0;
                    array.push(arr1);
                    array.push(arr2);
                } else {
                    array.push(arr[i]);
                }
            }
        }
        return array

    },

    // 设置输赢lab
    setWinningLab :function () {
        let red = (this.long/(this.long+this.hu)).toFixed(2)
        let blue =  FloatCalculation.accSub(1,Number(red))
        this.lab_tiger.string = lhdLanguage.lab_tiger[language] + " " +this.hu;  
        this.lab_dragon.string = lhdLanguage.lab_dragon[language] + " "+ this.long;
        this.lab_tie.string = lhdLanguage.lab_tie[language] + " "+ this.he;
        this.lab_red.string = FloatCalculation.accMul(red,100) + "%"
        this.lab_blue.string =  FloatCalculation.accMul(blue,100) + "%"
        this.node_blue.scaleX = red;
    },
});
