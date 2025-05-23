// import { _decorator, Component, Node, sys, Sprite, resources, SpriteFrame, Prefab, instantiate, RenderTexture, assetManager, ImageAsset, Texture2D, director } from 'cc';
import { Game_Const } from '../config/GameConst';
import { Language } from '../libs/Language';
import { Tools } from '../libs/Tools';
import GameNet from '../net/GameNet';
import GameNetEvent from '../net/GameNetEvent';
import { Result } from '../net/Result';
import { ResultText } from '../net/ResultText';
import { myplayer } from '../player/myplayer';
import { GlobalEvents } from './GlobalEvents';
const { ccclass, property } = cc._decorator;

@ccclass
export class GlobalGame extends cc.Component {
    private static instance: GlobalGame = null;
    public gameid: string = null; // Placeholder for jsclient.game_type_id
    public tableid: number | null = null;
    public order: string | null = null;
    public bOnRoom: boolean = false;
    public bet: number = -1;
    public level: number = 0;
    public GameResult: any | null = null;
    public tableData: any | null = null;
    public tData: any | null = null;   //同服务器 tData
    public tmpFaceID: string = '';
    public gamecfg: any | null = null;
    public playerlist: any | null = null;
    private icons: cc.Node = null;
    public mode: number = 0;
    public prefabTipsMsg: cc.Prefab = null;
    public prefabLock: cc.Prefab = null;
    private luckView: cc.Node[] = [];
    private images: any = {};

    public static globeWidth: number
    public static globeHeight: number




    private constructor() {
        super();
    }

    public static getInstance(): GlobalGame {
        if (!this.instance) {
            this.instance = new GlobalGame();
        }
        return this.instance;
    }

    onLoad() {
        GlobalGame.getInstance().init();
    }
    start() {

    }

    update(deltaTime: number) {

    }

    init() {
        var self = GlobalGame.getInstance();
        GameNet.getInstance().on("initSceneData", self.onInitSceneData, self);
        GlobalEvents.getInstance().on('luck', self.onLuck, self);
        GlobalEvents.getInstance().on('unluck', self.onUnluck, self);
    }

    onInitSceneData(event: any) {
        GameNet.getInstance().log("onInitSceneData", JSON.stringify(event));

    }

    public clear() {
        var self = GlobalGame.getInstance();
        self.bet = -1;
        self.level = 0;
        self.GameResult = null;
        self.tableData = null;
        self.tData = null;
        self.gamecfg = null;
        self.tableid = 0;
        //self.gameid = null;
    }

    public ellipsis(str: string, maxLength: number): string {
        if (str.length > maxLength) {
            return str.substring(0, maxLength - 3) + '...';
        }
        return str;
    }


    private extractNumberAfterPrefix(str: string, prefix: string = "avata:"): string | null {
        const regex = new RegExp(`${prefix}(\\d+)`); // 构建正则表达式，以匹配"avata:"后的数字
        const match = str.match(regex); // 使用正则表达式匹配字符串
        if (match && match[1]) { // 检查是否找到匹配项，并且匹配项中是否有数字部分
            return match[1]; // 返回匹配到的数字字符串
        } else {
            return null; // 如果没有找到匹配项，返回 null
        }
    }


    public endsWithSlash(url: string) {
        // 使用正则表达式匹配URL是否以斜杠结尾
        const regex = /\/$/;
        return regex.test(url);
    }

    public setFace(icon: cc.Sprite, face_id: string) {

        var self = GlobalGame.getInstance();

        let faceid = self.extractNumberAfterPrefix(face_id);
        if (faceid == null) {
            return;
        }
        let id = Math.max(1, Math.min(parseInt(faceid), 18));
        self.loadGameRes(`face/icon_${id}.png`, icon);
    }

    loadImage(url: string, sprite: cc.Sprite) {
        var self = GlobalGame.getInstance();
        if (!sprite) {
            return;
        }

        if (self.images[url]) {
            if (self.images[url].spriteFrame) {
                sprite.spriteFrame = self.images[url].spriteFrame;
                GameNet.getInstance().log('loadImage ===>>> sprite ', url);
            } else {
                self.images[url].sprites.push(sprite); //图片还在加载中
                GameNet.getInstance().log('loadImage ===>>> Cache ', url);
            }
        } else {
            GameNet.getInstance().log('loadImage ===>>> ', url);
            self.images[url] = {
                spriteFrame: null,
                sprites: [sprite]
            }
        }

        // 加载网络图片
        cc.assetManager.loadRemote<cc.Texture2D>(url, (err, imageAsset) => {
            var self = GlobalGame.getInstance();
            if (err) {
                console.error(err);
                return;
            }

            // // 创建一个新的 Texture2D 并将下载的 ImageAsset 赋给它
            // const texture = new cc.Texture2D();
            // texture.image = imageAsset;

            // // 创建一个新的 SpriteFrame 并将 Texture2D 赋给它
            // const spriteFrame = new cc.SpriteFrame();
            // spriteFrame.texture = texture;

            const spriteFrame = new cc.SpriteFrame(imageAsset);
            self.images[url].spriteFrame = spriteFrame;

            self.images[url].sprites.forEach((sp: cc.Sprite) => {
                if (sp.node == null) {
                    GameNet.getInstance().log("loadimage sprite is invalid", url);
                    return;
                }
                sp.spriteFrame = spriteFrame;

                GameNet.getInstance().log("loadimage set spriteFrame", sp.name, url);
            });
            self.images[url].sprites = [];
        });
    }

    getBaseURL(): string {
        var self = GlobalGame.getInstance();
        let baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/`;
        if (cc.sys.isBrowser && window.location.hostname == 'localhost') {
            baseUrl = Game_Const.Game_Host;
        }
        !self.endsWithSlash(baseUrl) ? baseUrl += '/' : 0;
        return baseUrl;
    }

    loadGameIcon(gameid: string, sprite: cc.Sprite) {
        var self = GlobalGame.getInstance();
        let baseUrl = self.getBaseURL();
        let url = `${baseUrl}gameicons/${gameid}.png`;
        self.loadImage(url, sprite);
    }

    loadGameRes(name: string, sprite: cc.Sprite) {
        var self = GlobalGame.getInstance();
        let baseUrl = self.getBaseURL();
        let url = `${baseUrl}resources/${name}`;
        self.loadImage(url, sprite);
    }

    JoinGame(tableid: number, cb?: (rtn: any) => void) {
        var self = GlobalGame.getInstance();
        let msg = {
            cmd: 'JoinGame',
            tableid: tableid
        };
        GameNet.getInstance().request(GameNet.cmdCall, msg, (rtn) => {
            GameNet.getInstance().log(JSON.stringify(rtn));
            if (rtn.result == Result.Success) {

                //self.bOnRoom = true;
                self.tableData = rtn.tableData;
                self.tData = rtn.tableData.tData;
                // if (self.tData.gameid != self.gameid){
                //     tcLog.log("gameid change",self.gameid,self.tData.gameid);
                //     self.gameid = self.tData.gameid;
                // }
                self.bet = self.tData.bet;
                self.level = self.tData.level;
                self.tableid = self.tData.tableid;
                if (self.tableData.tableResult) {
                    self.GameResult = self.tableData.tableResult;
                }
                if (self.tableData.gamecfg) {
                    self.gamecfg = self.tableData.gamecfg;
                }

                if (cb) {
                    cb(rtn);
                }
            }
            //房间已经没有了
            else if (rtn.result == Result.roomNotFound) {
                self.tableid == 0;  //清掉保存的 tableid
                myplayer.getInstance().getInfo().tableid = 0; //清掉玩家身上的 tableid
                if (cb) {
                    cb(null);
                }
            } else {
                self.ShowTipsByMsg(rtn, 0, (opt) => {
                    if (cb) cb(null);
                });
            }
        });
    }

    LeaveGame(cb?: (rtn: any) => void) {
        var self = GlobalGame.getInstance();
        let msg = {
            cmd: 'LeaveGame'
        };
        GameNet.getInstance().request("pkplayer.handler.ClientMommonCall", msg, (rtn) => {
            GameNet.getInstance().log(JSON.stringify(rtn));

            self.tableid == 0;  //清掉保存的 tableid
            myplayer.getInstance().getInfo().tableid = 0; //清掉玩家身上的 tableid

            if (rtn.result == Result.Success) {
                GlobalGame.getInstance().clear();
                if (cb) {
                    cb(rtn);
                }
            }
            //房间已经没有了
            else if (rtn.result == Result.roomNotFound) {

                if (cb) {
                    cb(null);
                }
            } else {
                //self.ShowTipsByMsg(rtn, 0, (opt) => {
                if (cb) cb(null);
                //});
            }
        });
    }

    // "直接退出旧房间"
    EndRoom(cb?: (rtn: any) => void) {
        GameNet.getInstance().log("EndRoom",);
        GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);

        var self = GlobalGame.getInstance();
        GlobalEvents.getInstance().luck();
        GameNet.getInstance().requestToTableMsg("EndRoom", {}, (rtn) => {
            self.tableid = 0;
            self.tableData = null;
            self.GameResult = null;
            self.bet = -1;
            // if (GameNet.getInstance().isDebug()) {
            //     self.clear();
            // }

            GlobalGame.getInstance().LeaveGame(cb);
        });
    }

    GameOver(score: number, cb?: (rtn: any) => void) {
        var self = GlobalGame.getInstance();
        let msg = {
            score: self.exchangeThird(score)
        };
        GameNet.getInstance().requestToTableMsg('GameOver', msg, (rtn) => {
            //GameNet.getInstance().log(JSON.stringify(rtn));
            if (rtn.result == Result.Success) {
                self.GameResult = rtn.tableResult;
                myplayer.getInstance().requestUserInfo();

                if (cb) {
                    cb(rtn);
                }
            } else {
            }
        });

    }

    GameCfg(cb?: (rtn: any) => void) {
        var self = GlobalGame.getInstance();
        GlobalEvents.getInstance().luck();
        let _msg = {
            cmd: 'GameCfg',
            gameid: self.gameid
        };
        GameNet.getInstance().request(GameNet.cmdCall, _msg, (rtn) => {
            GameNet.getInstance().log(JSON.stringify(rtn));
            if (rtn.result == Result.Success) {
                self.gamecfg = rtn.gamecfg;
                self.playerlist = rtn.playerlist;
                if (cb) {
                    cb(rtn);
                }
            }
            else {
                self.ShowTipsByMsg(rtn, 0, (opt) => {
                    GameNet.getInstance().gotoBack("");
                });
            }
        });
    }

    NewRoom(gameid: string, roomid: string, tparam: any, cb?: (rtn: any) => void) {
        var self = GlobalGame.getInstance();
        GlobalEvents.getInstance().luck();
        tparam.order = self.order || (Tools.Format(new Date, "yyyyMMddhhmmssS") + myplayer.getInstance().getUid().toString());
        let msg = {
            cmd: 'NewRoom',
            gameid: gameid,
            roomid: roomid,
            tparam: tparam
        };
        GameNet.getInstance().request(GameNet.cmdCall, msg, (rtn) => {
            GameNet.getInstance().log(JSON.stringify(rtn));
            if (rtn.result == Result.Success) {
                self.tableid = rtn.tableid;
                self.bet = 0; //先临时给个值，后面进入房间的时候，会被替换
                if (cb) cb(rtn);
            } else {
                self.ShowTipsByMsg(rtn, 0, (opt) => {
                    if (cb) cb(rtn);
                });
            }
        });
    }

    canStartGame(cb?: (rtn: any) => void) {
        var self = GlobalGame.getInstance();
        let msg = {
        };
        GameNet.getInstance().requestToTableMsg('canStartGame', msg, (rtn) => {
            if (rtn.result == Result.Success) {
                myplayer.getInstance().updateInfo(rtn.pinfo);
                if (cb) {
                    cb(rtn);
                }
            } else {
                self.ShowTipsByMsg(rtn, 0, (opt) => {
                    if (cb) {
                        cb(rtn);
                    }
                });
            }
        });
    }

    handleFloat(n: number): number {
        var n1 = 0;
        if (typeof n == 'number') {
            if (n > 0) {
                n1 = Math.floor((n) * 100);
            }
            else {
                n1 = Math.floor((n) * 100);
            }
            return n1 / 100;
        }
        return n;
    }

    handleFloatStr(n: number, len: number = 2): string {
        return this.exchangeSelf(n).toFixed(len);
    }

    handleNumber(n: number): string {
        if (n < 1000) {
            return n.toString();
        } else if (n > 100000000) {
            return (n / 100000000).toFixed(2) + "G";
        } else if (n > 10000) {
            return (n / 10000).toFixed(2) + "M";
        } else if (n > 1000) {
            return (n / 1000).toFixed(2) + "K";
        }
    }

    exchangeThird(n: number): number {
        return Math.floor(n * 1000);
    }

    exchangeSelf(n: number): number {
        return n / 1000;
    }

    //生成随机数。weights = [ {weight:xxxx, data...} , ... ];
    RandomWeight(weights: any): any {
        let base = 0;
        for (let i = 0; i < weights.length; i++) {
            base += weights[i].weight;
        }

        let weight = Math.random() * base;

        base = 0;
        for (let i = 0; i < weights.length; i++) {
            base += weights[i].weight;
            if (weight <= base) {
                return weights[i];
            }
        }

        return null;
    }
    ShowTipsByMsg(rtn: any, type: number, cb?: (opt: number) => void) {
        var self = GlobalGame.getInstance();
        if (rtn.msg) {
            self.ShowTips(rtn.msg, type, cb);
        } else if (rtn.result) {
            self.ShowTipsByCode(rtn, type, cb);
        } else {
            self.ShowTips("System unknown!", type, cb);
        }
    }

    ShowTipsByCode(rtn: any, type: number, cb?: (opt: number) => void) {
        var self = GlobalGame.getInstance();
        let text = rtn.msg || Language.GT("sysytem error code:") + rtn.result;
        for (let k in Result) {
            if (Result[k] == rtn.result) {
                if (ResultText[k]) {
                    text = Language.GT(ResultText[k]);
                }
                break;
            }
        }
        self.ShowTips(text, type, cb);
    }

    ShowTips(text: string, type: number, cb?: (opt: number) => void) {
        var self = GlobalGame.getInstance();
        if (!self.prefabTipsMsg) {
            if (cb) cb(1);
            return;
        }

        let curScene = cc.director.getScene();
        if (!curScene) {
            if (cb) cb(1);
            return;
        }
        let canvas = curScene.getChildByName('Canvas')
        if (!canvas) {
            if (cb) cb(1);
            return;
        }

        // let view = cc.instantiate(self.prefabTipsMsg);
        // view.setPosition(0, 0);
        // let tipsMsg = view.getComponent(TipsMsg);
        // if (tipsMsg) {
        //     tipsMsg.showTips(text, type, (opt: number) => {
        //         if (cb) {
        //             cb(opt);
        //         }
        //     });
        // }
        // view.active = true;
        // canvas.addChild(view);
        console.error("ShowTips:", text)
        if (cb) {
            if (cb) cb(type);
        }
    }

    onLuck(event: any) {
        // GameNet.getInstance().log("GlobalGame onLucky");
        var self = GlobalGame.getInstance();
        if (!self.prefabLock) {
            return;
        }

        if (self.luckView.length > 0) {
            return;
        }

        let curScene = cc.director.getScene();
        if (!curScene) {
            return;
        }
        let canvas = curScene.getChildByName('Canvas')
        if (!canvas) {
            return;
        }

        // let view = cc.instantiate(self.prefabLock);
        // view.setPosition(0, 0);

        // let luckView = view.getComponent(LockView);
        // if (luckView) {
        //     luckView.onLuck(event);
        // }
        // view.active = true;
        // canvas.addChild(view);
        // self.luckView.push(view);

        console.error("onLuck:")
    }


    onUnluck(event: any) {
        // GameNet.getInstance().log("GlobalGame onUnluck");
        var self = GlobalGame.getInstance();
        self.luckView.forEach((view) => {
            // let luckView = view.getComponent(LockView);
            // if (luckView){
            //     luckView.onUnluck(event);
            // }
            view.removeFromParent();
            view.destroy();
        });
        self.luckView = [];
    }

}


