import { tcLog } from '../../../script/framework/log/log';
import GameNet from '../net/GameNet';
import GameNetEvent from '../net/GameNetEvent';
import { Result } from '../net/Result';
import { GlobalEvents } from '../tools/GlobalEvents';
import { player } from './player';
const { ccclass, property } = cc._decorator;

@ccclass
export class myplayer extends cc.Component {
    private pl: player = new player();

    private static instance: myplayer = null;

    private constructor() {
        super();
    }

    public static getInstance(): myplayer {
        if (!this.instance) {
            this.instance = new myplayer();
            this.instance.onLoad();
        }
        return this.instance;
    }

    public static getPlayer(): player {
        return this.getInstance().get();
    }

    onLoad() {
        GameNet.getInstance().on(GameNetEvent.loginOK, (data) => {
            if (data.tableid)
                data.pinfo.tableid = data.tableid;
            this.pl.init(data.pinfo);
            cc.sys.localStorage.setItem("sessionid", this.pl.getInfo().sessionid);
            cc.sys.localStorage.setItem("uid", this.pl.getInfo().uid);

            // tcLog.log("myplayer info", JSON.stringify(this.pl.getInfo()));

        });
    }

    start() {

    }

    update(deltaTime: number) {

    }

    public get(): player {
        return this.pl;
    }

    public getUid(): any {
        return this.pl.getInfo().uid;
    }

    public getInfo(): any {
        return this.pl.getInfo();
    }

    public updateInfo(data: any) {
        this.pl.updateInfo(data);
    }

    public requestUserInfo(cb?: (rtn: any) => void) {
        GlobalEvents.getInstance().luck();
        var self = this;
        let msg = {
            cmd: 'Info'
        };
        GameNet.getInstance().request(GameNet.cmdCall, msg, (rtn) => {
            GameNet.getInstance().log(JSON.stringify(rtn));
            if (rtn.result == Result.Success) {
                self.updateInfo(rtn.pinfo);
                if (cb) {
                    cb(rtn);
                }
            }
        });
    }
}


