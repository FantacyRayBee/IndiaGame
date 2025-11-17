cc.Class({
    extends: cc.Component,

    properties: {
        webview: cc.WebView,
    },

    onLoad() {
        this._createDomCloseBtn();

    },

    start() {
        this._updateDomClosePos(); // 首次定位
    },

    update(dt) {
        // 每帧检测 WebView 位置变化（如屏幕旋转、动画）
        this._updateDomClosePos();
    },

    onDestroy() {
        this._removeDomCloseBtn();
        delete window.onDomCloseClick; // 移除方法
    },

    setURL(url, isVertical, parentIndex, gameId) {
        this.webview.url = url;
        this.isVertical = isVertical;
        this.parentIndex = parentIndex;
        this.gameId = parseInt(gameId);
        // 将 _onDomCloseClick 方法注册到 window 对象
        if (this.gameId < 200) { //只有PG游戏生效
            window.onDomCloseClick = this._onDomCloseClick.bind(this);
        }
        else {
            window.onDomCloseClick = () => { };
        }
    },

    // ===============================
    // 点击关闭逻辑
    // ===============================
    _onDomCloseClick() {
        LoggerUtil.getInstance().log("caojun WebView关闭按钮点击");

        GlobalCfg.G_COMPONENTS.Audio.playBack?.();

        this.node.destroy();
        if (!this.isVertical) {
            CommonFun.getInstance().addVerticalAcc();
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: "CLOSE_GAMEWEBVIEW",
                msgData: {
                    parentIndex: this.parentIndex,
                }
            });
        }
        this._removeDomCloseBtn();
        GlobalCfg.G_COMPONENTS.Audio.openMusic();
        SceneManager.getInstance().changeScene(
            SceneManager.getInstance().sceneType.WEBVIEW,
            SceneManager.getInstance().sceneType.LOBBY
        );
    },
    // ===============================
    // DOM关闭按钮
    // ===============================
    _createDomCloseBtn() {
        if (this._domCloseBtn) return;

        const btn = document.createElement("button");
        btn.id = "webview-close-btn";
        btn.innerHTML = "&times;";
        Object.assign(btn.style, {
            position: "absolute",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            outline: "none",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: "21px",
            lineHeight: "32px",
            textAlign: "center",
            cursor: "pointer",
            zIndex: "9999",
            boxShadow: "0 1.5px 6px rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            WebkitTapHighlightColor: "transparent",
            transition: "all 0.1s ease-out",
        });

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            this._onDomCloseClick();
        });

        document.body.appendChild(btn);
        this._domCloseBtn = btn;
    },

    _removeDomCloseBtn() {
        if (this._domCloseBtn && this._domCloseBtn.parentNode) {
            this._domCloseBtn.parentNode.removeChild(this._domCloseBtn);
            this._domCloseBtn = null;
        }
    },

    // ===============================
    // 按钮实时对齐 WebView 左上角
    // ===============================
    _updateDomClosePos() {
        if (!this._domCloseBtn || !this.webview) return;
        const iframe = this.webview._impl?._iframe || this.webview._impl?._frame || this.webview._impl?._domEL;
        if (!iframe) return;

        const rect = iframe.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        // 偏移一点，避免挡住边缘
        const offset = 8;
        this._domCloseBtn.style.left = rect.left + offset + "px";
        this._domCloseBtn.style.top = rect.top + offset + "px";
    },
});
