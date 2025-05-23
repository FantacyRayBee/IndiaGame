import { ApiTipManage } from "../../../bundles/update-v2/script/api/api-tip-manage";
import { tcLog } from "../../../script/framework/log/log";
import { Game_Const } from "../config/GameConst";
import { Language } from "../libs/Language";
import GameNet from "../net/GameNet";
import GameNetEvent from "../net/GameNetEvent";
import { Result } from "../net/Result";
import logger from "../net/logger";
import { myplayer } from "../player/myplayer";
import { GlobalGame } from "../tools/GlobalGame";
import LoginUtil from "./LoginUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoginGameMrg {
    private static instance: LoginGameMrg

    public static getInstance(): LoginGameMrg {
        if (!this.instance) {
            this.instance = new LoginGameMrg();
        }
        return this.instance;
    }
    /** 平台登录流程结束 */
    static loginStart = "loginStart";
    static loginOver = "loginOver";


    onLogin() {
        let querys = GameNet.getInstance().getAllQueryVariables();
        GlobalGame.getInstance().gameid = querys['gameid'] || Game_Const.Gmee_Type;

        GlobalGame.getInstance().order = querys['order']
        logger.purple("order:", GlobalGame.getInstance().order)

        Language.getInstance();
        GameNet.getInstance().init();

        tcLog.log("init gameid", GlobalGame.getInstance().gameid);
        if (querys['test']) {
            GameNet.getInstance().bDebug = true;
        }
        if (querys['hall']) {
            GameNet.getInstance().bHall = true;
        }
        myplayer.getInstance();
        GlobalGame.getInstance().init();
        GameNet.getInstance().on_ui('login', GameNetEvent.loginOK, this.onLoginOK, this);
        GameNet.getInstance().on_ui('login', GameNetEvent.loginFail, this.onLoginFail, this);


        if (ApiTipManage.getInstance().isTest) {
            cc.systemEvent.emit(LoginGameMrg.loginOver, {
                "tData": {
                    "tState": 400, "playNum": 0, "maxPlayers": 1, "tableid": 139624,
                    "gameid": "sw_tiger", "owner": 315527, "level": 1, "betIndex": 0,
                    "mutipleIndex": 0, "baseBet": 80, "bet": 400, "order": "20240726200421435315527"
                },
                "tableResult": { "money": 1000000 }
            });
            return
        }

        //cocos 调试模式 正式发布时，要记得删除 包含 doLoginByUnionid
        if (GameNet.getInstance().isDebug()) {
            let unionid = localStorage.getItem('unionid') || LoginUtil.newUUID();
            let nickname = localStorage.getItem('nickname') || "playeruser";
            let user_id = localStorage.getItem('user_id') || LoginUtil.generateUserID();
            if (!unionid || !nickname) {
                GameNet.getInstance().gotoBack("Login not unionid or nickname");
                return;
            }
            localStorage.setItem('unionid', unionid);
            localStorage.setItem('nickname', nickname);
            localStorage.setItem('user_id', user_id);
            GameNet.getInstance().doLoginByUnionid(Number.parseInt(user_id), unionid, nickname);
            return;
        }

        let homeURL = querys['homeURL'];
        if (homeURL) {
            GameNet.getInstance().homeURL = homeURL;
        }

        let sessionid = querys['sessionid'];
        let uid = querys['uid'];
        if (!sessionid || !uid) {
            GameNet.getInstance().gotoBack("Login not sessionid or uid");
            return;
        }

        GameNet.getInstance().doLoginBySession(sessionid, uid);
    }


    onLoginFail(msg: any) {
        // 注意这种方式注册的事件，无法传递 customEventData
        GameNet.getInstance().gotoBack("Login Fail!! code:" + msg.result);
    }
    onLoginOK(msg: any) {
        GameNet.getInstance().log("onLoginOK:", JSON.stringify(msg));

        // if (msg.pinfo.tableid && msg.pinfo.tableid > 0) {
        //     this.LoginOKjoinGame()
        //     return;
        // }
        cc.systemEvent.emit(LoginGameMrg.loginStart);

        LoginGameMrg.getInstance().LoginOKjoinGame()
    }


    private LoginOKjoinGame() {
        GlobalGame.getInstance().clear();

        GameNet.getInstance().log("gamecfg:", GlobalGame.getInstance().gamecfg);
        //没有 gamescfg 先获取配置
        if (!GlobalGame.getInstance().gamecfg) {
            GlobalGame.getInstance().GameCfg((rtn) => {
                this.JoinGameOrNewRoom();
            });
            return;
        }
        let gameid = Game_Const.Gmee_Type
        GlobalGame.getInstance().gameid = gameid
        this.JoinGameOrNewRoom();
    }


    JoinGameOrNewRoom() {
        //可能是断线重连，直接进房间，跳过流程，（注：tableid == 0 表示还没有创建或者加入房间）
        GameNet.getInstance().log("JoinGameOrNewRoom myplayer tableid:", myplayer.getInstance().getInfo().tableid,
            " GlobalGame tableid:", GlobalGame.getInstance().tableid);

        if (myplayer.getInstance().getInfo().tableid &&
            myplayer.getInstance().getInfo().tableid > 0 &&
            !GlobalGame.getInstance().tableid) {

            GlobalGame.getInstance().JoinGame(myplayer.getInstance().getInfo().tableid, (rtn) => {
                if (rtn.result == Result.Success) {

                    GameNet.getInstance().log(" order:", GlobalGame.getInstance().order,
                        "   rtn order:", rtn.tableData.tData.order);

                    if (GlobalGame.getInstance().order && rtn.tableData && rtn.tableData.tData &&
                        rtn.tableData.tData.order &&
                        GlobalGame.getInstance().order != rtn.tableData.tData.order) {

                        GlobalGame.getInstance().EndRoom(() => {
                            this.tryNewRoom()
                        });

                        return
                    }


                    if (GlobalGame.getInstance().GameResult) {

                        cc.systemEvent.emit(LoginGameMrg.loginOver, rtn.tableData);

                    } else {
                        GlobalGame.getInstance().EndRoom(() => {
                            this.tryNewRoom()
                        });
                    }

                } else {
                    GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);
                }
            });


            return;
        }

        this.tryNewRoom()
    }

    // isNewRoom: boolean = false
    public tryNewRoom() {
        //没有房间，新建一个
        tcLog.log(" tryNeRoo...  ")
        let roomid = GlobalGame.getInstance().playerlist[0].roomid

        var game = GlobalGame.getInstance();
        var tparam = {
            betIndex: 0,
            mode: game.mode
        }

        // LoginGameMrg.getInstance().isNewRoom = true

        game.NewRoom(game.gameid, roomid, tparam, (rtn) => {
            if (rtn.result == Result.Success) {
                this.NewRoomtryJoinGame()
            } else {
                game.clear();
                console.warn("NewRoom error");
            }
        });
    }


    NewRoomtryJoinGame() {
        tcLog.log("JoinGam... tableid", GlobalGame.getInstance().tableid,
            GlobalGame.getInstance().tableData,
            GlobalGame.getInstance());

        //有 tableid 就直接进游戏 ，没有 tableData 说明还没有进房间，先进房间
        if (GlobalGame.getInstance().tableid > 0 && !GlobalGame.getInstance().tableData) {

            this.tryJoiGame(GlobalGame.getInstance().tableid)

        } else {
            this.tryNewRoom()
        }
    }


    tryJoiGame(tableid: number) {
        logger.log("tryJoinGame :", tableid)
        GlobalGame.getInstance().JoinGame(tableid, (rtn) => {
            if (rtn.result == Result.Success) {


                GameNet.getInstance().log(" order:", GlobalGame.getInstance().order,
                    "   rtn order:", rtn.tableData.tData.order);

                if (GlobalGame.getInstance().order && rtn.tableData && rtn.tableData.tData &&
                    rtn.tableData.tData.order &&
                    GlobalGame.getInstance().order != rtn.tableData.tData.order) {

                    GlobalGame.getInstance().EndRoom(() => {
                        this.tryNewRoom()
                    });

                    return
                }

                logger.log("emit: LoginGameMrg.loginOver")

                if (rtn.tableData) {
                    cc.systemEvent.emit(LoginGameMrg.loginOver, rtn.tableData);
                } else {
                    GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);
                }
            } else {
                logger.log("GetGatewayConfirm")
                GameNet.getInstance().sendEvent(GameNetEvent.GetGatewayConfirm);
            }
        });
    }



}


