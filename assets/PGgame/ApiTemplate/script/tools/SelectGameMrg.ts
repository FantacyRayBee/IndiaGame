import { ApiTipManage } from "../../../bundles/update-v2/script/api/api-tip-manage";
import GameNet from "../net/GameNet";

const { ccclass, property } = cc._decorator;

@ccclass
export class SelectGameMrg {
    private static instance: SelectGameMrg

    public static getInstance(): SelectGameMrg {
        if (!this.instance) {
            this.instance = new SelectGameMrg();
        }
        return this.instance;
    }



    public preDoTime: number = new Date().getTime()

    testCount = 0
     spr = false

    spin(betIndex: number, mutipleIndex: number, cb?: (rtn: any) => void) {


        if (ApiTipManage.getInstance().isTest) {

            let rnd = Math.random()
            let rtn 
            
            if(rnd < 0.1){
                rtn =  {"screen":[{"id":82},{"id":1},{"id":4},{"id":1},{"id":51},{"id":51},{"id":4},{"id":51},{"id":2},{"id":0},{"id":3},{"id":0}],"hits":[{"lineId":3,"win":10000,"pos":[1,5,6],"symbol":82},{"lineId":5,"win":200,"pos":[4,5,6],"symbol":1},{"lineId":6,"win":200,"pos":[4,8,6],"symbol":1},{"lineId":8,"win":1000,"pos":[7,8,6],"symbol":4}],"trigger":0,"bet":1000,"balance":987400,"leftTimes":-1,"priseTrigger":0,"rabbitWin":0,"isWish":0,"totalWin":11400}

            }else if(rnd < 0.2){
                rtn= {
                        "screen": [{ "id": 2 }, { "id": 4 }, { "id": 9, "multi": 5 },
                        { "id": 4 }, { "id": 1 }, { "id": 82 },
                        { "id": 9, "multi": 10 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 5 },
                        { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 0 }],
                        "trigger": 0, "bet": 1000, "balance": 957200, "leftTimes": -1,
                        "priseTrigger": 1, "rabbitWin": 0, "isWish": 0, "totalWin": 5500
                    }

            }else if(rnd < 0.3){
                rtn = {"screen":[{"id":2},{"id":2},{"id":2},{"id":2},{"id":2},{"id":1},{"id":51},{"id":51},{"id":3},{"id":0},{"id":3},{"id":0}],"hits":[{"lineId":1,"win":300,"pos":[1,2,3],"symbol":2},{"lineId":2,"win":300,"pos":[1,5,3],"symbol":2},{"lineId":4,"win":300,"pos":[4,5,3],"symbol":2},{"lineId":8,"win":200,"pos":[7,8,6],"symbol":1},{"lineId":9,"win":500,"pos":[7,8,9],"symbol":3},{"lineId":10,"win":500,"pos":[7,11,9],"symbol":3}],"trigger":0,"bet":1000,"balance":958700,"leftTimes":-1,"priseTrigger":0,"rabbitWin":0,"isWish":0,"totalWin":2100}


            }else if(rnd < 0.4){
                rtn = {"screen":[{"id":9,"multi":10},{"id":3},{"id":81},{"id":4},{"id":9,"multi":5},{"id":3},{"id":51},{"id":9,"multi":5},{"id":9,"multi":5},{"id":0},{"id":9,"multi":5},{"id":0}],"trigger":0,"bet":1000,"balance":998500,"leftTimes":-1,"priseTrigger":1,"rabbitWin":0,"isWish":0,"totalWin":3000}

            }else if(rnd < 0.5){
                this.spr = true

            }else {
                rtn = {"screen":[{"id":3},{"id":3},{"id":2},{"id":3},{"id":51},{"id":1},{"id":82},{"id":4},{"id":2},{"id":0},{"id":1},{"id":0}],"trigger":0,"bet":1000,"balance":999000,"leftTimes":-1,"priseTrigger":0,"rabbitWin":0,"isWish":0,"totalWin":0}
            }



            if(this.spr){
                //特殊模式0
                if (this.testCount == 0) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 1, "bet": 1000, "balance": 1023600, "leftTimes": 7, "priseTrigger": 0, "rabbitWin": 0, "isWish": 1 }
                } else if (this.testCount == 1) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 9, "multi": 5 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 6, "priseTrigger": 0, "rabbitWin": 0, "isWish": 0 }
                } else if (this.testCount == 2) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 9, "multi": 5 }, { "id": 0 }, { "id": 9, "multi": 5 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 5, "priseTrigger": 0, "rabbitWin": 0, "isWish": 0 }
                } else if (this.testCount == 3) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 4, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
                } else if (this.testCount == 4) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 9, "multi": 20 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 3, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
                } else if (this.testCount == 5) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 9, "multi": 20 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 0 }, { "id": 0 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 2, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
                } else if (this.testCount == 6) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 5 }, { "id": 9, "multi": 10 }, { "id": 9, "multi": 20 }, { "id": 0 }, { "id": 9, "multi": 10 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1023600, "leftTimes": 1, "priseTrigger": 0, "rabbitWin": 5500, "isWish": 0 }
                } else if (this.testCount == 7) {
                    rtn = { "screen": [{ "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 9, "multi": 30 }, { "id": 9, "multi": 50 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }, { "id": 0 }], "trigger": 0, "bet": 1000, "balance": 1039100, "leftTimes": 0, "priseTrigger": 0, "rabbitWin": 15500, "isWish": 0, "totalWin": 15500 }
                    this.testCount = 0

                    this.spr = false
                }

                this.testCount ++
            }
            
            cc.systemEvent.emit('endGame', rtn);


            return
        }


        let msg = { betIndex, mutipleIndex };
        GameNet.getInstance().requestToTableMsg('spin', msg, (rtn) => {
            if (cb) {
                cb(rtn);
            }
        });
    }


    history(msg: any) {
        return new Promise(resolve => {


        if (ApiTipManage.getInstance().isTest) {
            
            let rnd = Math.random()
            let rtn 
            
            if(rnd < 0.5){
                    rtn = {"result":0,"historylist":[{"createTime":1721986353599,"order":"1810263536066987248","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986350695,"order":"1810263503790010268","bet":1000,"win":1100,"leftTimes":-1,"groupId":""},{"createTime":1721986349776,"order":"1810263491835491568","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986348875,"order":"1810263480601578189","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986347975,"order":"1810263476641540790","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986347075,"order":"1810263478690647276","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986343563,"order":"1810263431770044803","bet":1000,"win":-400,"leftTimes":-1,"groupId":""},{"createTime":1721986342640,"order":"1810263424872107127","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986341755,"order":"1810263416661566650","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986340815,"order":"1810263400016438977","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986339920,"order":"1810263394024879867","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986339015,"order":"1810263396645597502","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986338123,"order":"1810263381257330046","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986337215,"order":"1810263379212023769","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986336311,"order":"1810263367406739995","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986335416,"order":"1810263355317012195","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986334496,"order":"1810263344607218314","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986331595,"order":"1810263312985321806","bet":1000,"win":2500,"leftTimes":-1,"groupId":""},{"createTime":1721986330691,"order":"1810263307148455128","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986329787,"order":"1810263295794417472","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""}]}
               
            }else {
                 rtn = {"result":0,"historylist":[{"createTime":1721986328891,"order":"1810263288877806716","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986327959,"order":"1810263275879793510","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986327056,"order":"1810263274700211501","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986326140,"order":"1810263261537300394","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986323216,"order":"1810263237449799190","bet":1000,"win":-800,"leftTimes":-1,"groupId":""},{"createTime":1721986322300,"order":"1810263223393460234","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986321399,"order":"1810263210455505951","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986319859,"order":"1810263197903968441","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986318963,"order":"1810263184326793020","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986318066,"order":"1810263182278358113","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986317160,"order":"1810263172764549466","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986316263,"order":"1810263167163737263","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986315360,"order":"1810263156953035699","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986312456,"order":"1810263120310728880","bet":1000,"win":2000,"leftTimes":-1,"groupId":""},{"createTime":1721986311555,"order":"1810263110193678641","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986310655,"order":"1810263108423897288","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986309755,"order":"1810263096631587333","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986308236,"order":"1810263081472953562","bet":1000,"win":-1000,"leftTimes":-1,"groupId":""},{"createTime":1721986305335,"order":"1810263054872739492","bet":1000,"win":1500,"leftTimes":-1,"groupId":""},{"createTime":1721986289568,"order":"1810262892271393340","bet":1000,"win":10100,"leftTimes":-1,"groupId":""}]}

            }
            resolve(rtn);
            }

            msg.cmd = 'history'
            GameNet.getInstance().request(GameNet.cmdCall, msg, (rtn) => {
                resolve(rtn);
            });
        })
    }

    historyDetail(msg: any) {
        return new Promise(resolve => {

            if (ApiTipManage.getInstance().isTest) {
                let rnd = Math.random()
                let rtn 
                
                if(rnd < 0.5){
                 rtn =  {"result":0,"historyDetail":[{"createTime":1721986350695,"order":"1810263503790010268","bet":1000,"win":1100,"leftTimes":-1,"screen":[{"id":2},{"id":2},{"id":2},{"id":2},{"id":2},{"id":1},{"id":51},{"id":51},{"id":3},{"id":0},{"id":3},{"id":0}],"hits":[{"lineId":1,"win":300,"pos":[1,2,3],"symbol":2},{"lineId":2,"win":300,"pos":[1,5,3],"symbol":2},{"lineId":4,"win":300,"pos":[4,5,3],"symbol":2},{"lineId":8,"win":200,"pos":[7,8,6],"symbol":1},{"lineId":9,"win":500,"pos":[7,8,9],"symbol":3},{"lineId":10,"win":500,"pos":[7,11,9],"symbol":3}],"moneyAfter":958700,"betIndex":0,"mutipleIndex":1}]}
    
                }else {
                    rtn = {"result":0,"historyDetail":[{"createTime":1721986347075,"order":"1810263478690647276","bet":1000,"win":-1000,"leftTimes":-1,"screen":[{"id":51},{"id":4},{"id":1},{"id":3},{"id":2},{"id":82},{"id":1},{"id":2},{"id":2},{"id":0},{"id":1},{"id":0}],"moneyAfter":960600,"betIndex":0,"mutipleIndex":1}]}

                }
               resolve(rtn);
            }
    





            msg.cmd = 'historyDetail'
            GameNet.getInstance().request(GameNet.cmdCall, msg, (rtn) => {
                resolve(rtn);
            });
        })
    }



}


