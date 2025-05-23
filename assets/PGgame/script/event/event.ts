// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export namespace event {
    export const showGameView = "showGameView"; //加载界面关闭，显示游戏场景
    export const sendLeaveGameReq = "sendLeaveGameReq"; // 发送离开桌子信息

    export const reconnectGame = "reconnectGame"; //重回游戏
    export const loadGameResOver = "loadGameResOver"; // 进入游戏

    export const LEAVE_TABLE = "LEAVE_TABLE"; //108
    export const getencode = "getencode";

    export const getEncodeConfirm = "getEncodeConfirm";
    export const getGatewayConfirm = "getGatewayConfirm";
    export const banlanceNoEnough = "banlanceNoEnough";
    export const loginSuccess = "loginSuccess"; // 登录成功
    export const getServerConfirm = "getServerConfirm";

    export const BTNSPIN_STATUS_CHANGE = "btnSpinStatusChange"; //改变spin按钮状态

    export const UPDATEBET = "updateBet";


    export const disconnect = "disconnect";

    export const resetLoadView = "resetLoadView"; // 
}
