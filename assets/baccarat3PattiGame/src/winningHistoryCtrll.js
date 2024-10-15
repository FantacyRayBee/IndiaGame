

cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        pab_cradType: cc.Node,
        node_cradType: cc.Node,
        node_BlueRed: cc.Node,
        lab_red: cc.Label,
        lab_blue: cc.Label,
        lab_redNun: cc.Label,
        lab_blueNun: cc.Label,
        node_blue: cc.Node,
        sprites: [cc.SpriteFrame],

      
    },



    onLoad () {
        this.btn_close.node.on('click',()=>{
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        },this)

        this.setCradType();
        this.setBlueRed();
        this.redORblue();
        
    },

    /**
     * 设置牌的类型记录
     */
    setCradType:function(){
        let openRecord = GlobalCfg.ACT_SCENE_CTRL.openRecord, list = [];
        let len = openRecord.length;
        if (len <= 60) {
            list = openRecord.slice();
        }
        else{
            list = openRecord.slice(len - 60, len);
        };
        for (let i = 0; i < list.length; i++) {
            let side = list[i];
            let pab_cradType = cc.instantiate(this.pab_cradType);
            pab_cradType.parent = this.node_cradType;
            let SET = pab_cradType.getChildByName("SET");
            SET.active = true;
            SET.getComponent(cc.Sprite).spriteFrame = this.sprites[side];

            if (side == 5) {
                let bg_hige = pab_cradType.getChildByName("bg_hige");
                if(bg_hige) bg_hige.active = true;
            } 
            else {
                let bg_cradType = pab_cradType.getChildByName("bg_cradType");
                if(bg_cradType) bg_cradType.active = true;
            };
            if(i == list.length - 1) {
                let bq_new = pab_cradType.getChildByName("bq_new");
                if(bq_new) bq_new.active = true;
            }
        }

    },

    /**
     * 设置红蓝记录
     */
    setBlueRed:function() { //33
        let list = GlobalCfg.ACT_SCENE_CTRL.openBlueRed;
        let newList = this.reorganizeOpenBlueRed(list);
        let count = 0;
        let newListLen = newList.length;

        for (let i = 0; i < newListLen; i++) {
            let sideArr = newList[i];
            let posX = 0;
            let posY = 0;
            for (let k = 0, len = sideArr.length; k < len; k++) {
                posX = -472 + i * 29;
                posY = 72 + k * (-29);
                let side = sideArr[k];
                let node = GlobalCfg.ACT_SCENE_CTRL.utils.installWinIcon(side);
                node.setPosition(cc.v2(posX, posY));
                this.node_BlueRed.addChild(node);
            };
        };

        // for (let i = newListLen - 1; i >= 0; i--) {
        //     let sideArr = newList[i];
        //     let len = sideArr.length;
        //     let posX = 0;
        //     let posY = 0;
        //     if (len >= 6 && len <= 8) {
        //         for (let j = len -1; j >= 0; j--) {
        //             if (j > 5) {
        //                 posX = 455 - count * 29;
        //                 posY = -72;
        //                 count++
        //             }
        //             else {
        //                 posX = 455 - count * 29;
        //                 posY = 73 + j * (-29);
        //             };
        //             let side = sideArr[j];
        //             let node = GlobalCfg.ACT_SCENE_CTRL.utils.installWinIcon(side);
        //             node.parent = this.node_BlueRed;
        //             node.setPosition(posX,posY);
        //         }
        //         count++
        //     }
        //     else {
        //         for (let j = 0; j < len; j++) {
        //             posX = 455 - count * 29;
        //             posY = 73 + j * (-29);
        //             let side = sideArr[j];
        //             let node = GlobalCfg.ACT_SCENE_CTRL.utils.installWinIcon(side);
        //             node.parent = this.node_BlueRed;
        //             node.setPosition(posX,posY);
        //         }
        //         count++
        //     }
        // }
    },

    /**
     * 红蓝比
     */
    redORblue:function() {
        let list = GlobalCfg.ACT_SCENE_CTRL.openBlueRed;
        let count = 0;
        for (let i = 0; i < list.length; i++) {
            let date = list[i];
            if(date == 6) {
                count++
            }
        }

        this.lab_red.string = `${count}%`;
        this.lab_blue.string = `${100-count}%`;
        this.node_blue.scaleX = (100-count)/100;
        this.lab_redNun.string = `red  ：${count}`;
        this.lab_blueNun.string = `blue  ：${100 - count}`;

    },


    /**
     * 剔除牌型保留红蓝类型
     * @param {所有牌型} list 
     * @returns 
     */
    splitBlueRed:function(list) {
        let allArr = [], redArr = [], blueArr = [];
        let cutArrCount = 33;
        for (let i = 0; i < list.length; i++) {
            let side = list[i];
            if (side == 6) {
                blueArr.push(side);
                if (redArr.length > 0) {
                    allArr.push(redArr);
                    redArr = [];
                }
                if (blueArr.length == 8){
                    allArr.push(blueArr);
                    blueArr.length = 0;
                }
            }
            else {
                redArr.push(side);
                if(blueArr.length > 0) {
                    allArr.push(blueArr);
                    blueArr = [];
                }
                if(redArr.length == 8){
                    allArr.push(redArr);
                    redArr.length = 0;
                }
            };

            if(i == list.length - 1){
                if(blueArr.length > 0){
                    allArr.push(blueArr);
                }
                if(redArr.length > 0){
                    allArr.push(redArr);
                }
            }
        };

        if (allArr.length > cutArrCount) {
            return allArr.slice(allArr.length - cutArrCount, allArr.length)
        } else {
            return allArr
        }
    },


    reorganizeOpenBlueRed: function(list) {
        if (!Array.isArray(list)) {
            return [];
        };

        let allArr = [];
        let redArr = []; 
        let blueArr = [];

        for (let i = 0, len = list.length; i < len; i++) {
            let side = list[i];
            if (side == 6) {
                blueArr.push(side);
                
                if (blueArr.length == 6) {
                    allArr.push(blueArr);
                    blueArr = [];
                };

                if (redArr.length > 0) {
                    allArr.push(redArr);
                    redArr = [];
                };

                if (i == len - 1 && blueArr.length > 0) {
                    allArr.push(blueArr);
                };
            }
            else if (side == 7) {
                redArr.push(side);

                if (redArr.length == 6) {
                    allArr.push(redArr);
                    redArr = [];
                };

                if (blueArr.length > 0) {
                    allArr.push(blueArr);
                    blueArr = [];
                };

                if (i == len - 1 && redArr.length > 0) {
                    allArr.push(redArr);
                };
            };
        };

        let maxCount = 33;
        if (allArr.length > maxCount) {
            return allArr.slice(allArr.length - maxCount, allArr.length);
        } 
        else {
            return allArr;
        };
    },
});
