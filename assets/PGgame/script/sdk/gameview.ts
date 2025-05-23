// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { event } from "../event/event";
import { tcI18n } from "../framework/i18n/i18n";
import { tcLog } from "../framework/log/log";
// import { bwsdk } from "./sdk";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameViewHandler extends cc.Component {
    public closeView() {
        tcLog.debug("will close game view");

    }

    public showGameExitTips() {
        tcLog.debug(`will exit game`);

        // bwsdk.showNativeTips(tcI18n.i18nLabel("tips_tips"), tcI18n.i18nLabel("alert_logout"), tcI18n.i18nLabel("tips_confirm"), tcI18n.i18nLabel("tips_cancel"));
    }
}
