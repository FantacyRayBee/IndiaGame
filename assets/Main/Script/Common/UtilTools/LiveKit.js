/**
 * LiveKit: 跨平台直播能力入口
 * 业务脚本只依赖这里，不直接依赖 WebHybrid 或原生类名
 */

const LiveKit = {
    initialized: false,
    debug: false,
    defaultAudienceUrl: "http://192.168.110.28:5173/room?roomId=10001&userId=user_1&nickname=观众1&role=audience&debugMedia=1",

    /**
     * 初始化 LiveKit
     * @param {Object} config - 配置对象
     * @param {string} config.defaultAudienceUrl - 默认直播间 URL
     * @param {boolean} config.debug - 是否启用调试日志
     */
    init: function(config) {
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
    },

    /**
     * 获取当前运行环境的模式
     * @returns {string} "h5" | "android-native" | "unsupported"
     */
    getMode: function() {
        if (cc.sys.isBrowser) {
            return "h5";
        }
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            return "android-native";
        }
        return "unsupported";
    },

    /**
     * 进入大厅
     */
    enterLobby: function() {
        const mode = this.getMode();
        if (mode === "h5") {
            // WebHybrid.enterLobbyMode();
            this.log("enterLobby[h5]");
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("backToLobby", "()V");
            this.log("enterLobby[android]");
        }
    },

    /**
     * 观众端：进入直播页面
     * @param {string} url - 直播间 URL
     */
    enterAudience: function(url) {
        const liveUrl = url || this.defaultAudienceUrl;
        const mode = this.getMode();
        if (mode === "h5") {
            // WebHybrid.setLiveRoomUrl(liveUrl);
            // WebHybrid.enterLiveMode();
            this.log("enterAudience[h5]", liveUrl);
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("openLivePanelWithUrl", "(Ljava/lang/String;)V", liveUrl);
            this.log("enterAudience[android]", liveUrl);
        }
    },

    /**
     * 主播端入口：开始直播
     * 不传参数时，Android 会弹出"RTMP 地址 + 密钥"的配置面板，并自动读取历史记录。
     * 传入 RTMP 配置时，Android 会直接启动原生推流流程。
     * @param {string} url - 可选的直播间 URL
     */
    startAnchor: function(url) {
        if (url) {
            GlobalCfg.IS_ANCHOR_MODE = true;
            this.enterAudience(url);
            this.log("startAnchor[h5-url]", url);
            return;
        }
        const mode = this.getMode();
        if (mode === "android-native") {
            GlobalCfg.IS_ANCHOR_MODE = true;
            this.callAndroid("showAnchorSetupDialog", "()V");
            this.log("startAnchor[android-config-dialog]");
            return;
        }
        this.log("startAnchor: RTMP native push is only implemented on Android now");
    },

    /**
     * 传入 RTMP 配置后直接启动推流
     * @param {Object} config - RTMP 配置对象
     * @param {string} config.serverUrl - RTMP 服务器地址
     * @param {string} config.streamKey - 推流密钥
     * @param {string} config.roomId - 房间 ID（可选）
     * @param {string} config.userId - 用户 ID（可选）
     * @param {string} config.nickname - 昵称（可选）
     */
    startAnchorWithRtmpConfig: function(config) {
        if (!config || !config.serverUrl || !config.streamKey) {
            cc.log("[LiveKit] RTMP config requires serverUrl and streamKey");
            return;
        }
        const mode = this.getMode();
        if (mode === "android-native") {
            GlobalCfg.IS_ANCHOR_MODE = true;
            this.callAndroid(
                "startAnchorWithRtmpConfig",
                "(Ljava/lang/String;)V",
                JSON.stringify(config)
            );
            this.log("startAnchorWithRtmpConfig[android]", config);
            return;
        }
        this.log("startAnchorWithRtmpConfig: unsupported mode", mode);
    },

    /**
     * 停止推流
     */
    stopAnchor: function() {
        GlobalCfg.IS_ANCHOR_MODE = false;
        const mode = this.getMode();
        if (mode === "android-native") {
            this.callAndroid("stopAnchorPush", "()V");
            this.log("stopAnchor[android]");
            return;
        }
        this.enterLobby();
        this.log("stopAnchor");
    },

    /**
     * 退出直播间
     */
    exitLiveRoom: function() {
        this.enterLobby();
        this.log("exitLiveRoom");
    },

    /**
     * 切换游戏窗口的显示/隐藏
     */
    toggleGameWindow: function() {
        const mode = this.getMode();
        if (mode === "h5") {
            this.log("toggleGameWindow[h5]: use UI button in overlay");
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("toggleGameVisibility", "()V");
            this.log("toggleGameWindow[android]");
        }
    },

    /**
     * 强制刷新直播页面
     */
    reloadLivePage: function() {
        const mode = this.getMode();
        if (mode === "h5") {
            // WebHybrid.forceRefreshLivePage();
            this.log("reloadLivePage[h5]");
            return;
        }
        if (mode === "android-native") {
            this.callAndroid("forceRefreshLivePanel", "()V");
            this.log("reloadLivePage[android]");
        }
    },

    /**
     * 切换屏幕方向
     */
    toggleScreenOrientation: function() {
        const mode = this.getMode();
        if (mode === "android-native") {
            this.callAndroid("toggleScreenOrientation", "()V");
            this.log("toggleScreenOrientation[android]");
            return;
        }
        this.log("toggleScreenOrientation: only implemented on Android native");
    },

    /**
     * 设置默认的观众直播间 URL
     * @param {string} url - 直播间 URL
     */
    setDefaultAudienceUrl: function(url) {
        if (!url) {
            return;
        }
        this.defaultAudienceUrl = url;
        this.log("setDefaultAudienceUrl", url);
    },

    /**
     * 销毁 LiveKit（清理资源）
     */
    destroy: function() {
        this.initialized = false;
        this.log("destroy");
    },

    /**
     * 调用 Android 层的方法
     * @param {string} method - 方法名
     * @param {string} signature - JNI 签名
     * @param {string} arg - 参数（可选）
     * @private
     */
    callAndroid: function(method, signature, arg) {
        const jsbObj = window.jsb;
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
    },

    /**
     * 输出调试日志
     * @param {...*} args - 日志参数
     * @private
     */
    log: function() {
        if (!this.debug) {
            return;
        }
        const args = Array.from(arguments);
        args.unshift("[LiveKit]");
        cc.log.apply(cc, args);
    }
};

module.exports = LiveKit;
