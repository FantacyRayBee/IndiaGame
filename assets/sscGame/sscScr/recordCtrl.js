
cc.Class({
    extends: cc.Component,

    properties: {
        btn_close : cc.Button,
        pab_winTepy : cc.Prefab,
        node_content : cc.Node,
        node_redDot : cc.Node,
        labs : [cc.Label],
       
    },

  
    onLoad () {
        this.btn_close.node.on('click',function(){
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        },this)
    },

    setRecordDate:function(notify) {
        let index = 0;
        let posX = 0;
        let recordLen = 0;
        let list = notify.list;
        let unJackpotCount = notify.unJackpotCount
        this.setLab(list,unJackpotCount);
        let len = list.length <=55 ? list.length : list.length-55;
        this.node_content.destroyAllChildren()
        this.node_redDot.destroyAllChildren()
        for (let i = len; i < list.length; i++) {
            let pab_winTepy = cc.instantiate(this.pab_winTepy);
            this.node_content.addChild(pab_winTepy);
            let Ctrl = pab_winTepy.getComponent('winTepyCtrl');
            Ctrl.showNode("record",list[i]);
            if( i == list.length-1) {
                pab_winTepy.getChildByName("bq_new").active = true;
            }
        }

        if(list.length > 27 ) {   //设置红点坐标
            posX = -390;
            recordLen = list.length >27 ? list.length -27 : 0;
        } else {
            recordLen = 0 ;
            posX = 520;
        }
        for (let i = recordLen; i < list.length; i++) {
            let pab_winTepy = cc.instantiate(this.pab_winTepy);
            this.node_redDot.addChild(pab_winTepy);
            let Ctrl = pab_winTepy.getComponent('winTepyCtrl');
            Ctrl.showNode("redDot",list[i])
            pab_winTepy.x = posX + index * 35
            index++
        }
    },


    setLab:function(list,unJackpotCount) {
        let SET = 0;
        let PURESEQ = 0;
        let SEQ = 0;
        let COLOR = 0;
        let PAIR = 0;
        let HIGHCARD = 0;

        for (let i = 0; i < list.length; i++) {
            let date = list[i];
            if( date == 0) {
                SET++
            } else if (date == 1) {
                PURESEQ++
            } else if (date == 2) {
                SEQ++
            } else if (date == 3) {
                COLOR++
            } else if (date == 4) {
                PAIR++
            } else if (date == 5) {
                HIGHCARD++
            }
        }

        this.labs[0].string = list.length;
        this.labs[1].string = SET;
        this.labs[2].string = PURESEQ;
        this.labs[3].string = SEQ;
        this.labs[4].string = COLOR;
        this.labs[5].string = PAIR;
        this.labs[6].string = HIGHCARD;
        this.labs[7].string = "JACKPOT  " + unJackpotCount + "  DRAWS LEFT";
    },
});
