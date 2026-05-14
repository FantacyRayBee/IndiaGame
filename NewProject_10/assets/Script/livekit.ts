import WebHybrid from "./webHybrid";

const DEFAULT_LIVE_ROOM_URL =
    "http://192.168.110.28:5173/room?roomId=10001&userId=user_1&nickname=观众1&role=audience&debugMedia=1";

export type LiveKitMode = "h5" | "android-native" | "unsupported";

export interface LiveKitConfig {
    defaultAudienceUrl?: string;
    debug?: boolean;
}

export interface LiveKitRtmpConfig {
    serverUrl: string;
    streamKey: string;
    roomId?: string;
    userId?: string;
    nickname?: string;
}

// LiveKit: 跨项目复用的直播能力入口。
// 目标：业务脚本只依赖这里，不直接依赖 WebHybrid 或原生类名。
export default class LiveKit {
    private static initialized = false;
    private static debug = false;
    private static defaultAudienceUrl = DEFAULT_LIVE_ROOM_URL;

    static init(config?: LiveKitConfig) {
        if (!config) {
            this.initialized = true;
            return;
        }
        if (config.defaultAudienceUrl) {
            this.defaultAudienceUrl = config.defaultAudienceUrl;
        }
        this.debug = !!config.debug;
        this.initialized = true;
        this.log("init", { url: this.defaultAudienceUrl, debug: this.debug });
    }

    static getMode(): LiveKitMode {
        if (cc.sys.isBrowser) {
            return "h5";
        }
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            return "android-native";
        }
        return "unsupported";
    }

    static enterLobby() {
        const mode = this.getMode();
        if (mode === "h5") {
            WebHybrid.enterLobbyMode();
            this.log("enterLobby[h5]");
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("backToLobby", "()V");
            this.log("enterLobby[android]");
        }
    }

    // 观众端：进入直播页面
    static enterAudience(url?: string) {
        const liveUrl = url || this.defaultAudienceUrl;
        const mode = this.getMode();
        if (mode === "h5") {
            WebHybrid.setLiveRoomUrl(liveUrl);
            WebHybrid.enterLiveMode();
            this.log("enterAudience[h5]", liveUrl);
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("openLivePanelWithUrl", "(Ljava/lang/String;)V", liveUrl);
            this.log("enterAudience[android]", liveUrl);
        }
    }

    // 主播端入口：
    // 不传参数时，Android 会弹出“RTMP 地址 + 密钥”的配置面板，并自动读取历史记录。
    // 传入 RTMP 配置时，Android 会直接启动原生推流流程。
    static startAnchor(url?: string) {
        if (url) {
            this.enterAudience(url);
            this.log("startAnchor[h5-url]", url);
            return;
        }
        const mode = this.getMode();
        if (mode === "android-native") {
            this.callAndroid("showAnchorSetupDialog", "()V");
            this.log("startAnchor[android-config-dialog]");
            return;
        }
        this.log("startAnchor: RTMP native push is only implemented on Android now");
    }

    static startAnchorWithRtmpConfig(config: LiveKitRtmpConfig) {
        if (!config || !config.serverUrl || !config.streamKey) {
            cc.log("[LiveKit] RTMP config requires serverUrl and streamKey");
            return;
        }
        const mode = this.getMode();
        if (mode === "android-native") {
            this.callAndroid(
                "startAnchorWithRtmpConfig",
                "(Ljava/lang/String;)V",
                JSON.stringify(config)
            );
            this.log("startAnchorWithRtmpConfig[android]", config);
            return;
        }
        this.log("startAnchorWithRtmpConfig: unsupported mode", mode);
    }

    static stopAnchor() {
        const mode = this.getMode();
        if (mode === "android-native") {
            this.callAndroid("stopAnchorPush", "()V");
            this.log("stopAnchor[android]");
            return;
        }
        this.enterLobby();
        this.log("stopAnchor");
    }

    static exitLiveRoom() {
        this.enterLobby();
        this.log("exitLiveRoom");
    }

    static toggleGameWindow() {
        const mode = this.getMode();
        if (mode === "h5") {
            // H5 下复用按钮逻辑：通过切换直播模式内部状态处理
            // 暂无公开 API，保持兼容只做 no-op 日志。
            this.log("toggleGameWindow[h5]: use UI button in overlay");
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("toggleGameVisibility", "()V");
            this.log("toggleGameWindow[android]");
        }
    }

    static reloadLivePage() {
        const mode = this.getMode();
        if (mode === "h5") {
            WebHybrid.forceRefreshLivePage();
            this.log("reloadLivePage[h5]");
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("forceRefreshLivePanel", "()V");
            this.log("reloadLivePage[android]");
        }
    }

    static toggleScreenOrientation() {
        const mode = this.getMode();
        if (mode === "android-native") {
            this.callAndroid("toggleScreenOrientation", "()V");
            this.log("toggleScreenOrientation[android]");
            return;
        }
        this.log("toggleScreenOrientation: only implemented on Android native");
    }

    static setDefaultAudienceUrl(url: string) {
        if (!url) {
            return;
        }
        this.defaultAudienceUrl = url;
        this.log("setDefaultAudienceUrl", url);
    }

    static destroy() {
        // 当前实现无重资源，保留 API 便于未来扩展。
        this.initialized = false;
        this.log("destroy");
    }

    private static callAndroid(method: string, signature: string, arg?: string) {
        const jsbObj = (window as any).jsb;
        if (!jsbObj || !jsbObj.reflection) {
            cc.log("[LiveKit] jsb.reflection is unavailable");
            return;
        }
        try {
            if (typeof arg === "string") {
                jsbObj.reflection.callStaticMethod(
                    "org/cocos2dx/javascript/LiveKitBridge",
                    method,
                    signature,
                    arg
                );
                return;
            }
            jsbObj.reflection.callStaticMethod(
                "org/cocos2dx/javascript/LiveKitBridge",
                method,
                signature
            );
        } catch (err) {
            cc.log("[LiveKit] callAndroid failed", method, err);
        }
    }

    private static log(...args: any[]) {
        if (!this.debug) {
            return;
        }
        cc.log("[LiveKit]", ...args);
    }
}
