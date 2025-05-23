const { ccclass, property } = cc._decorator;
import { Game_Const } from '../config/GameConst';
import { GlobalEvents } from '../tools/GlobalEvents';
import { GlobalGame } from '../tools/GlobalGame';
import { Result } from './Result';
import GameNetEvent from './GameNetEvent';
import pomelo = require('pomelo-jsclient-websocket');
import logger from './logger';
import { LoginGameMrg } from '../Scene/LoginGameMrg';
import { Language } from '../libs/Language';

@ccclass
export default class GameNet extends cc.Component {
    // Define private members for event types and Pomelo connection
    public pomelo: any = pomelo;

    private reqPingPong: number[] = [];
    private reqStart: number = Date.now();
    private lastTableCmd: string | null = null;

    private heartBeatStartTime: number = Date.now();
    private heartBeatPingPong: number[] = [];
    private event: cc.EventTarget = new cc.EventTarget();

    private remoteCfg: any = {}; // Placeholder for remote configuration similar to jsclient.remoteCfg
    private priorityServer: string[] = []; // Placeholder for jsclient.getPriorityServer() data
    private lastPort: number | null = null; // Placeholder for jsclient.lastPort
    private servercfg: any | null = null;
    private sceneEvent: any = {}; //注册场景 或 界面事件，关闭界面的时候，统一注销


    public bDebug: boolean = false;
    public bHall: boolean = false;

    private static instance: GameNet = null;
    public homeURL: string = "";
    private server_ips: any | null = null;

    public reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5
    private sessionid: string = null;
    private uid: number = 0;
    private tmpLoginRequest = null;
    private cacheMeg: any = {};
    private cacheMegIndex: number = 0;


    static cmdCall = "pkplayer.handler.ClientMommonCall"


    private constructor() {
        super();
    }

    public static getInstance(): GameNet {
        if (!this.instance) {
            this.instance = new GameNet();
        }
        return this.instance;
    }

    // Lifecycle method for initial setup
    init() {
        var self = GameNet.getInstance();
        self.resetCallback();
    }

    public computePingPong(): void {
        var self = GameNet.getInstance();
        self.reqPingPong.push(Date.now() - self.reqStart);
        if (self.reqPingPong.length > 5) self.reqPingPong.splice(0, 1);
        const avgPing = self.reqPingPong.reduce((a, b) => a + b, 0) / self.reqPingPong.length;
        self.sendEvent(GameNetEvent.updateNetDelay, { averagePing: avgPing });
        // self.log("ping pone", Date.now());
    }

    // Emit a global event
    public sendEvent(eName: string, ePara?: any): void {
        var self = GameNet.getInstance();
        self.event.emit(eName, ePara);
        // EventCenter.getInstance().fire(eName, ePara);
    }

    // Listen to a global event
    public on(evt: string, callback: (event: any) => void, target?: Object): void {
        var self = GameNet.getInstance();
        self.event.on(evt, callback, target);
        // EventCenter.getInstance().listen(evt, callback, target);
    }

    // Stop listening to a global event
    public off(evt: string, callback?: (event: any) => void, target?: Object): void {
        var self = GameNet.getInstance();
        self.event.off(evt, callback, target);
        // EventCenter.getInstance().remove(evt, callback, target);
    }

    // 专门为 UI 临时注销事件使用
    public on_ui(name: string, evt: string, callback: (event: any) => void, target?: Object): void {
        var self = GameNet.getInstance();
        self.event.on(evt, callback, target);
        // EventCenter.getInstance().listen(evt, callback, target);

        if (!self.sceneEvent[name]) {
            self.sceneEvent[name] = [];
        }
        self.sceneEvent[name].push({ evt: evt, callback: callback, target: target });
    }

    // UI 关闭的时候，统一注销事件
    public off_all_ui(name: string): void {
        var self = GameNet.getInstance();
        if (!self.sceneEvent[name]) {
            return;
        }
        for (let i = 0; i < self.sceneEvent[name].length; i++) {
            let e = self.sceneEvent[name][i];
            self.event.off(e.evt, e.callback, e.target);
            // EventCenter.getInstance().remove(e.evt, e.callback, e.target);
        }

        self.sceneEvent[name] = null;

    }

    public setCallBack(evt: string, cb?: (data: any) => void): void {
        var self = GameNet.getInstance();
        self.pomelo.off(evt);
        if (cb) {
            self.pomelo.on(evt, (data: any) => {
                GlobalEvents.getInstance().unluck();

                logger.green(`<=== [Server Push] ${new Date().toISOString()} evt = ${evt}, data:  ${JSON.stringify(data)}`);

                if (evt === "onKick") {
                    self.sendEvent(GameNetEvent.Disconnect, 7);
                }
                if (self.lastTableCmd === evt) {
                    self.lastTableCmd = null;
                    self.computePingPong();
                }
                cb(data);
            });
        }
    }

    // Network connection management
    public connect(host: string, port: number, f_ok: () => void, f_fail: () => void): void {
        var self = GameNet.getInstance();
        self.reqPingPong = [];
        self.pomelo.disconnect();
        if (f_fail) self.setCallBack(GameNetEvent.Disconnect, f_fail);
        self.pomelo.init({ host: host, port: port, log: true, sendEvent: (e, p) => { self.sendEvent(e, p); } }, f_ok);
    }

    public disconnect(): void {
        var self = GameNet.getInstance();
        self.servercfg = null;
        self.setCallBack(GameNetEvent.Disconnect, () => {
        });
        // GameNet.getInstance().sendEvent(GameNetEvent.ShowDisconnectTip);
        self.pomelo.disconnect();
    }

    // Pomelo request with automatic ping-pong time calculation
    public request(type: string, msg: any, cb?: (rtn: any) => void): void {
        var self = GameNet.getInstance();
        logger.purple("GameNet request ===>", type, JSON.stringify(msg));
        self.reqStart = Date.now();
        try {
            if (arguments.length === 2) {
                self.pomelo.notify(type, msg);
                GlobalEvents.getInstance().unluck();
            } else {
                self.pomelo.request(type, msg, (rtn: any) => {

                    GlobalEvents.getInstance().unluck();
                    // self.log("GameNet reply", type, JSON.stringify(rtn));
                    logger.green("<=== GameNet reply", type, JSON.stringify(rtn));
                    self.computePingPong();
                    if (cb) cb(rtn);
                });
            }
        } catch (e) {
            self.sendEvent(GameNetEvent.Disconnect, 2);
        }
    }

    public requestToTableMsg(type: string, msg: any, cb?: (rtn: any) => void): void {
        var self = GameNet.getInstance();
        msg.cmd = type;
        logger.purple("requestToTableMsg  ===>", type, JSON.stringify(msg));
        self.reqStart = Date.now();
        try {
            if (arguments.length === 2) {
                self.pomelo.notify("pkroom.handler.tableMsg", msg);
                GlobalEvents.getInstance().unluck();
            } else {
                self.pomelo.request("pkroom.handler.tableMsg", msg, (rtn: any) => {
                    GlobalEvents.getInstance().unluck();
                    logger.green("<=== GameNet TableMsg reply", type, JSON.stringify(rtn));
                    self.computePingPong();
                    if (cb) cb(rtn);
                });
            }
        } catch (e) {
            self.sendEvent(GameNetEvent.Disconnect, 2);
        }
    }

    public notifyToTableMsg(type: string, msg: any, cb?: (rtn: any) => void): void {
        var self = GameNet.getInstance();
        msg.cmd = type;
        logger.purple("GameNet notifyToTableMsg ===>", type, JSON.stringify(msg));
        self.reqStart = Date.now();
        try {
            self.pomelo.notify("pkroom.handler.tableMsg", msg);
            GlobalEvents.getInstance().unluck();

        } catch (e) {
            logger.red("<=== GameNet notifyToTableMsg");
            self.sendEvent(GameNetEvent.Disconnect, 2);
        }
    }

    public isKick: boolean = false
    // Reset all callbacks to handle reconnections or initial setup
    private resetCallback(): void {
        var self = GameNet.getInstance();
        self.setCallBack(GameNetEvent.IoError, (data: any) => {
            logger.log("resetCallback IoError")
            self.onDisconnected(GameNetEvent.IoError, data);
        });
        self.setCallBack(GameNetEvent.OnKick, (data: any) => {
            logger.log("resetCallback OnKick")
            self.onDisconnected(GameNetEvent.OnKick, data);
            GameNet.getInstance().isKick = true
        });
        self.setCallBack(GameNetEvent.Error, (data: any) => {
            logger.log("resetCallback Error")
            self.onDisconnected(GameNetEvent.Error, data);
        });
        self.setCallBack(GameNetEvent.Close, (data: any) => {
            logger.log("resetCallback Close")
            self.onClose(GameNetEvent.Close, data);
        });
        self.setCallBack(GameNetEvent.Disconnect, (data: any) => {
            logger.log("resetCallback Disconnect")
            self.onDisconnected(GameNetEvent.Disconnect, data);
        });
        self.setCallBack(GameNetEvent.Reconnect, () => {
            logger.log("resetCallback Reconnect")
        });
        self.setCallBack(GameNetEvent.HeartbeatTimeout, () => {
            logger.log("resetCallback HeartbeatTimeout")

            self.checkReconnect()
        });
        // self.setCallBack(GameNetEvent.tryconnect, (data: any) => {
        //     self.log(GameNetEvent.tryconnect, JSON.stringify(data))
        // });
        //self.setCallBack("heartbeat",(data:any)=>{ self.log('heartbeat', Date.now()); });

        self.on("endRoom", self.onEndRoom, self);
    }

    private onClose(error: string, data) {
        var self = GameNet.getInstance();
        self.log(`onClose: code:${error}, data:${JSON.stringify(data)}`);
        if (!self.server_ips) {
            return; //主动关闭
        }
        self.servercfg = null;
        self.checkReconnect()
    }

    public reconnectTime: any
    public checkReconnect() {
        var self = GameNet.getInstance();
        if (self.reconnectAttempts < self.maxReconnectAttempts) {
            GlobalEvents.getInstance().luck(false);
            clearTimeout(self.reconnectTime)
            self.reconnectTime = setTimeout(() => {
                self.doAutoReconnect();
            }, 3 * 1000);

        } else {
            // GlobalGame.getInstance().ShowTips(Language.GT("Network Disconnected!! code:"), 3);
            self.log(`checkReconnect error`);
            GameNet.getInstance().sendEvent(GameNetEvent.tryFail);
        }
    }



    private onDisconnected(error: string, data) {
        var self = GameNet.getInstance();
        self.log(`onDisconnected: code:${error}, data:${JSON.stringify(data)}`);
    }

    private onEndRoom(event: any) {
        var self = GameNet.getInstance();
        self.log("endRoom", JSON.stringify(event));
    }

    public queueNetMsgCallback(evt: string, cb?: (data: any) => void): void {
        var self = GameNet.getInstance();
        // Example of queuing logic, adapt based on your needs
        self.setCallBack(evt, (data) => {
            // Queue the message or directly handle it
            self.log(`Queued message for event: ${evt}`, data);
            if (cb) cb(data);
        });
    }

    public resetHeartBeatTime(): void {
        var self = GameNet.getInstance();
        self.heartBeatStartTime = Date.now();
    }

    public computeNetDelayByHeartBeat(): void {
        var self = GameNet.getInstance();
        self.heartBeatPingPong.push(Date.now() - self.heartBeatStartTime);
        if (self.heartBeatPingPong.length > 1) {
            self.heartBeatPingPong.splice(0, 1);
            self.heartBeatPingPong.shift();
        }
        const avgHeartbeatPing = self.heartBeatPingPong.reduce((a, b) => a + b, 0) / self.heartBeatPingPong.length;
        self.sendEvent(GameNetEvent.updateNetDelay, { averageHeartbeatPing: avgHeartbeatPing });
    }

    // Integrates server configuration into the current configuration.
    public combineServerRemoteCfg(data: any): void {
        var self = GameNet.getInstance();
        // Adjusted to use properties within GameNet
        const mainGameId = GlobalGame.getInstance().gameid;
        if (data && data.gameInfo && data.gameInfo[mainGameId] && data.gameInfo[mainGameId].remoteCfg) {
            const serverRemoteCfg = data.gameInfo[mainGameId].remoteCfg;
            for (const key in serverRemoteCfg) {
                self.remoteCfg[key] = serverRemoteCfg[key];
            }
        }
    }

    // Selects a server based on predefined weights.
    public getServersByRandForWeights(servers: string[]): string {
        var self = GameNet.getInstance();
        const serversSelect = self.remoteCfg.serversSelect;
        if (serversSelect && serversSelect.length === servers.length) {
            let rand = Math.random() * 1000;
            let sum = 0;
            for (let i = 0; i < serversSelect.length; i++) {
                sum += serversSelect[i];
                if (rand <= sum) {
                    return servers[i];
                }
            }
        }
        return servers[Math.floor(Math.random() * servers.length)]; // Fallback to random selection
    }

    // Selects a port for the server based on the configuration.
    public getServerByRandForPort(parts: string[]): number {
        if (parts.length > 3) {
            return parseInt(parts[1 + Math.floor(Math.random() * (parts.length - 1))], 10);
        } else {
            const min = parseInt(parts[1], 10);
            const max = parseInt(parts[2], 10);
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    }

    public getServerCfgByRand(): any {
        var self = GameNet.getInstance();
        if (!self.server_ips || self.server_ips.length == 0) {
            self.server_ips = Game_Const.server_ips.concat();
        }
        if (self.servercfg == null) {
            let index = Math.floor(Math.random() * (self.server_ips.length));
            self.servercfg = self.server_ips[index];
            self.server_ips.splice(index, 1);
        }
        return self.servercfg;
    }

    // Refines the getServerByRandForPort method for specific port selection.
    public getServerPort(parts: string[]): number {
        var self = GameNet.getInstance();
        // Copy the parts array to avoid mutating the original array
        let array = parts.slice(0);
        // Remove the first element which is 'servers'
        array.splice(0, 1);

        let tempArray: number[] = [];
        let min = parseInt(array[0], 10);
        let max = parseInt(array[1], 10);

        for (let i = min; i <= max; i++) {
            if (self.lastPort !== i) {
                tempArray.push(i);
            }
        }

        // Choose a random port from the tempArray
        let chosenPort = tempArray[Math.floor(Math.random() * tempArray.length)];
        // Update the last used port
        self.lastPort = chosenPort;

        return chosenPort;
    }

    public tryshowCount = 0
    public doLogin(accounts: string, passwd: string, gametype: string, cb?: (err, rtn) => void) {
        GameNet.getInstance().loginLock = true

        var self = GameNet.getInstance();
        var loginData = {
            account: accounts,
            passwd: passwd,
            app: { os: cc.sys.os },
            geogData: { latitude: 0, longitude: 0 },
            fromHallGame: 1,
            gametype: gametype,
            autoCreate: 1
        };
        self.tmpLoginRequest = function (cb2?: (err: any, rtn: any) => void) {
            self.doLogin(accounts, passwd, gametype, cb2);
        }
        var cfg = self.getServerCfgByRand();
        self.connect(cfg.host, cfg.port, () => {
            self.log("connect server ok");
            GameNet.getInstance().tryshowCount = 0
            self.request("pkcon.handler.AccountLogin", loginData,
                function (rtn) {
                    if (rtn.result == Result.Success) {
                        self.reconnectAttempts = 0;
                        self.sessionid = rtn.pinfo.sessionid;
                        self.uid = rtn.pinfo.uid;
                        self.sendEvent(GameNetEvent.loginOK, rtn);
                        if (cb) {
                            cb(null, rtn);
                        }
                        return;
                    }
                    //self.sendEvent(GameNetEvent.loginFail, rtn);
                    if (cb) {
                        cb(rtn.result, rtn);
                    }
                    self.log("AccountLogin error", JSON.stringify(rtn));
                    //self.disconnect();
                    self.gotoBack("Login Fail!! code:" + rtn.result);
                });

        }, () => {
            self.log("doLogin connect server fail");
            GameNet.getInstance().loginLock = false
        });
    }

    public doRegister(accounts: string, passwd: string, gametype: string) {
        GameNet.getInstance().loginLock = true
        var self = GameNet.getInstance();
        var loginData = {
            account: accounts,
            passwd: passwd,
            app: { os: cc.sys.os },
            geogData: { latitude: 0, longitude: 0 },
            fromHallGame: 1,
            gametype: gametype
        };

        var cfg = self.getServerCfgByRand();
        self.connect(cfg.host, cfg.port, () => {
            self.log("connect server ok");
            GameNet.getInstance().tryshowCount = 0
            self.request("pkcon.handler.RegisterAccount", loginData,
                function (rtn) {
                    var unblock = true;
                    if (rtn.result == Result.Success) {
                        self.reconnectAttempts = 0;
                        self.sessionid = rtn.pinfo.sessionid;
                        self.uid = rtn.pinfo.uid;
                        self.sendEvent(GameNetEvent.loginOK, rtn);
                        return;
                    }
                    self.sendEvent(GameNetEvent.loginFail, rtn);
                    self.log("RegisterAccount error", JSON.stringify(rtn));
                    self.disconnect();
                });

        }, () => {
            self.log("doRegister connect server fail");
            GameNet.getInstance().loginLock = false
        });
    }

    public doLoginBySession(sessionid: string, uid: string, cb?: (err, rtn) => void) {
        GameNet.getInstance().loginLock = true
        var self = GameNet.getInstance();
        var loginData = {
            sessionid: sessionid,
            uid: uid,
            app: { os: cc.sys.os }
        };

        self.tmpLoginRequest = function (cb2?: (err, rtn) => void) {
            self.doLoginBySession(sessionid, uid, cb2);
        }

        var cfg = self.getServerCfgByRand();
        self.connect(cfg.host, cfg.port, () => {
            self.log("doLoginBySession connect server ok");
            GameNet.getInstance().tryshowCount = 0
            self.request("pkcon.handler.sessionLogin", loginData,
                function (rtn) {
                    var unblock = true;
                    if (rtn.result == Result.Success) {
                        self.reconnectAttempts = 0;
                        self.sessionid = rtn.pinfo.sessionid;
                        self.uid = rtn.pinfo.uid;
                        self.sendEvent(GameNetEvent.loginOK, rtn);
                        if (cb) {
                            cb(null, rtn);
                        }
                        return;
                    }
                    //self.sendEvent(GameNetEvent.loginFail, rtn);
                    if (cb) {
                        cb(rtn.result, rtn);
                    }
                    self.log("AccountLogin error", JSON.stringify(rtn));
                    //self.disconnect();
                    self.gotoBack("Login Fail!! code:" + rtn.result);
                });

        }, () => {
            GameNet.getInstance().log("doLoginBySession connect server fail");
            GameNet.getInstance().loginLock = false
        });

    }

    public tryshowTime = new Date().getTime()
    public loginLock = false
    //自动重连
    public doAutoReconnect() {
        var self = GameNet.getInstance();
        // self.reconnectAttempts++;
        // self.log("tye reconnect", self.reconnectAttempts);
        GameNet.getInstance().sendEvent(GameNetEvent.tryconnect);


        logger.log("GameNet  ok", GameNet.getInstance().tryshowTime);

        var type = "";
        let cb = (err, rtn) => {
            if (err) {
                return;
            }

            if (rtn.pinfo.tableid) {
                GlobalGame.getInstance().JoinGame(rtn.pinfo.tableid, (rtn) => {

                    self.log(" doAutoReconnec JoinGame", JSON.stringify(rtn));
                    GameNet.getInstance().sendEvent(LoginGameMrg.loginOver, rtn.tableData);
                });
            } else {
                LoginGameMrg.getInstance().tryNewRoom()
            }
        }

        if (self.sessionid && self.uid) {
            type = "doLoginBySession";
            self.doLoginBySession(self.sessionid, self.uid.toString(), cb);
        }
        else if (self.tmpLoginRequest) {
            type = "tmpLoginRequest";
            self.tmpLoginRequest(cb);
        }
    }




    public doLoginByUnionid(user_id: number, unionid: string, nickname: string, cb?: (err, rtn) => void) {
        var self = GameNet.getInstance();
        var loginData = {
            unionid: unionid,
            nickname: nickname,
            user_id: user_id,
            notify_url: Game_Const.loginData.notify_url,
            amount: Game_Const.loginData.amount,
            gameid: Game_Const.Gmee_Type,
            platform: Game_Const.loginData.platform,
            key: Game_Const.loginData.key,
            secret: Game_Const.loginData.secret,
            channel_id: Game_Const.loginData.channel_id
        };

        self.tmpLoginRequest = function (cb2?: (err: any, rtn: any) => void) {
            self.doLoginByUnionid(user_id, unionid, nickname, cb2);
        }

        var cfg = self.getServerCfgByRand();
        self.connect(cfg.host, cfg.port, () => {
            self.log("login unionid connect server ok", JSON.stringify(loginData));
            self.request("pkcon.handler.unionidLogin", loginData, function (rtn) {
                if (rtn.result == Result.Success) {
                    self.reconnectAttempts = 0;
                    self.sessionid = rtn.pinfo.sessionid;
                    self.uid = rtn.pinfo.uid;
                    self.sendEvent(GameNetEvent.loginOK, rtn);
                    if (cb) {
                        cb(null, rtn);
                    }
                    return;
                }

                self.sendEvent(GameNetEvent.loginFail, rtn);
                if (cb) {
                    cb(rtn.result, rtn);
                }
                self.log("doLoginByUnionid error", JSON.stringify(rtn));
                self.disconnect();
            });
        }, null);
    }

    // Handles the game login process, including server selection and connection.
    public loginGame(): void {
        var self = GameNet.getInstance();
        const servers = self.priorityServer;; // Assuming self is a method that returns server strings
        const selectedServer = self.getServersByRandForWeights(servers);
        const parts = selectedServer.split(':');
        const host = parts[0];
        const port = self.getServerPort(parts);

        self.connect(host, port,
            () => {
                // Successful connection logic
                self.sendEvent("connect"); // Notify the rest of the application
            },
            () => {
                // Failure logic
                self.sendEvent(GameNetEvent.Disconnect, 1); // Notify the rest of the application about the failure
            }
        );
    }


    // 定义一个函数来解析整个 URL 查询字符串并返回一个 JSON 对象
    public getAllQueryVariables(): Record<string, string> | undefined {
        // 首先检查是否是在 Web 平台上运行
        if (cc.sys.isBrowser) {
            let query = window.location.search.substring(1);
            let vars = query.split("&");
            let queryObject: Record<string, string> = {};

            vars.forEach((param) => {
                let pair = param.split("=");
                if (pair[0] && pair[1]) {
                    queryObject[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                }
            });

            return queryObject;
        } else {
            // 对于非 Web 平台，可能需要不同的处理方式或返回undefined
            //self.log('self platform does not support URL parameters.');
            return {};
        }
    }

    public gotoBack(msg: string) {
        var self = GameNet.getInstance();
        if (msg && msg != '') {
            self.log("goto back ======>>>> msg:" + msg);
            GlobalGame.getInstance().ShowTips(msg, 0, (opt: number) => {
                self.gotoBack('');
            });
            return;
        }

        self.log("goto back ======>>>> disconnect");
        self.server_ips = null;
        self.disconnect();
        // 检查当前平台是否为 Web
        if (cc.sys.isBrowser) {
            // 使用 window.history.back() 来返回上一个页面
            self.log("self function is Web platform.", " ===>>> goto history back");
            if (self.homeURL != "") {
                window.location.href = self.homeURL;
            } else {
                if (self.isDebug()) {

                } else {
                    // window.location.href = 'about:blank';
                }
            }

        } else {
            // 对于非 Web 平台，这里可以处理其他逻辑或不进行操作
            self.log("self function is only available on the Web platform.", " ===>>> goto back");
        }
    }

    public isHall() {
        var self = GameNet.getInstance();
        return self.bHall || (cc.sys.isBrowser && (window.location.hostname == 'localhost' ||
            window.location.hostname.indexOf("192.168.") != -1 ||
            window.location.hostname.indexOf("43.198.73.197") != -1));
    }

    public isDebug() {
        var self = GameNet.getInstance();
        return self.bDebug || (cc.sys.isBrowser && (window.location.hostname == 'localhost' ||
            window.location.hostname.indexOf("192.168.") != -1 ||
            window.location.hostname.indexOf("43.198.73.197") != -1)
        );
    }

    public log(...data: any[]) {
        var self = GameNet.getInstance();
        if (self.isDebug()) {
            if (data.length == 1) {
                logger.log(data[0]);
            } else if (data.length == 2) {
                logger.log(data[0], data[1]);
            } else if (data.length == 3) {
                logger.log(data[0], data[1], data[2]);
            } else if (data.length == 4) {
                logger.log(data[0], data[1], data[2], data[3]);
            } else if (data.length == 5) {
                logger.log(data[0], data[1], data[2], data[3], data[4]);
            } else {
                logger.log(...data);
            }
        }

    }
}


