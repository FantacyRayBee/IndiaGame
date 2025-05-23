// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { tcLog } from "../framework/log/log";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FacebookHandler extends cc.Component {
    public handleLogin(data: string) {
        tcLog.debug(`facebook login data: ${data}`);
        cc.systemEvent.emit("facebook-login-callback", data);
    }
}

export namespace facebookHandler {
    export enum Code {
        Success = 0,
        Cancel = 1,
        Unknown = 2,
    }

    interface loginResult {
        code: Code;
        token: string;
    }

    export function handleLogin(data: string) {
        tcLog.debug(`facebook login data: ${data}`);
        cc.systemEvent.emit("facebook-login-callback", data);
    }

    function loginCallback(data: any) {
        const resp: loginResult = {
            code: 0,
            token: "",
        };

        tcLog.debug(`facebook login resp: ${JSON.stringify(data)}`);
        if (data.status === "connected") {
            // success
            if (data.authResponse) {
                resp.code = Code.Success;
                resp.token = data.accessToken;
            } else {
                resp.code = Code.Cancel;
            }
        } else {
            resp.code = Code.Unknown;
        }

        handleLogin(JSON.stringify(resp));
    }

    // 参考链接：https://juejin.cn/post/7121965933605683207
    export function webLogin() {
        globalThis.FB.getLoginStatus(function (response: any) {
            if (response.status !== "connected") {
                globalThis.FB.login(loginCallback, { scope: "public_profile" });
                return;
            }
            loginCallback(response);
        });
    }

    export function webLoginWithWebView() {
        // @ts-ignore
        window.facebookLoginCallback = loginCallback;
        // @ts-ignore
        globalThis.webAppInterface.facebookLogin("602684875263955", "1e5d2219391f08ca1604760626524ffa");
    }

    // 参考链接：https://developers.facebook.com/docs/sharing/reference/share-dialog
    export function share(quote: string, content: string) {
        globalThis.FB.ui(
            {
                method: "share",
                href: content,
            },
            function (response: any) {
                tcLog.debug(`facebook share resp: ${JSON.stringify(response)}`);
            }
        );
    }

    export function shareWithWebView(quote: string, content: string) {
        // @ts-ignore
        globalThis.webAppInterface.facebookShare(quote, content);
    }
}
