const DEFAULT_LIVE_ROOM_URL =
    "http://192.168.110.28:5173/room?roomId=10001&userId=user_1&nickname=观众1&role=audience&debugMedia=1";
const VIDEO_LAYER_ID = "live-video-layer";
const CONTROL_LAYER_ID = "live-control-layer";
const BACK_BTN_ID = "live-back-btn";
const TOGGLE_BTN_ID = "live-toggle-btn";
const REFRESH_BTN_ID = "live-refresh-btn";
const DRAG_HANDLE_ID = "live-drag-handle";
const RESIZE_HANDLE_ID = "live-resize-handle";

type AnyObj = { [key: string]: any };

export default class WebHybrid {
    // ===== 状态字段说明 =====
    // initialized: 仅在浏览器中初始化一次 DOM 覆盖层，避免重复创建按钮/视频节点。
    private static initialized = false;
    // inLiveMode: 当前是否处于“直播模式”（背景视频 + 右下角小游戏窗口）。
    private static inLiveMode = false;
    // gameVisible: 在直播模式里，小游戏窗口是否显示（对应“隐藏游戏/显示游戏”按钮）。
    private static gameVisible = true;
    // liveFrameEl: 直播页 iframe 节点。直播由外部 H5 页面完整承载。
    private static liveFrameEl: any = null;
    // 当前直播间 URL，默认值可被脚本动态覆盖。
    private static liveRoomUrl = DEFAULT_LIVE_ROOM_URL;
    // syncHandleFn: 拖拽条/缩放角与小游戏窗口实时同步位置的方法引用。
    private static syncHandleFn: (() => void) | null = null;
    // 记录设计分辨率，用于大厅和直播之间切换时恢复/切换分辨率策略。
    private static designWidth = 0;
    private static designHeight = 0;
    // 保存进入直播前的样式，返回大厅时完整恢复，避免“卡住/黑边/布局错位”。
    private static originalGameRootStyle: string | null = null;
    private static originalCanvasStyle: string | null = null;
    // H5 watchdog: 监听直播页 postMessage 的媒体时间，检测“假死”并自动恢复。
    private static watchdogTimer: number | null = null;
    private static lastMediaTs = 0;
    private static lastMediaTime = -1;
    private static stalledRounds = 0;
    private static messageHandlerBound = false;

    // 进入大厅模式：
    // 1) 卸载直播 iframe
    // 2) 隐藏直播视频和控制按钮
    // 3) 恢复游戏全屏布局与大厅分辨率策略
    static enterLobbyMode() {
        if (!cc.sys.isBrowser) {
            return;
        }
        this.ensureDom();
        this.inLiveMode = false;
        this.gameVisible = true;

        this.stopLivePage();
        this.stopLiveWatchdog();
        this.setLayerVisible(VIDEO_LAYER_ID, false);
        this.setLayerVisible(CONTROL_LAYER_ID, false);
        this.applyResolutionPolicy(false);

        const gameRoot = this.getGameRoot();
        if (!gameRoot) {
            return;
        }
        this.applyLobbyCanvasStyle(gameRoot);
        this.syncHandles();
    }

    // 进入直播模式：
    // 1) 显示直播层和控制按钮
    // 2) 把 Cocos 游戏变成可拖拽/缩放的小窗
    // 3) 加载外部 H5 直播间页面
    static enterLiveMode() {
        if (!cc.sys.isBrowser) {
            return;
        }
        this.ensureDom();
        this.inLiveMode = true;
        this.gameVisible = true;

        this.setLayerVisible(VIDEO_LAYER_ID, true);
        this.setLayerVisible(CONTROL_LAYER_ID, true);
        this.applyResolutionPolicy(true);

        const gameRoot = this.getGameRoot();
        if (gameRoot) {
            this.applyLiveCanvasStyle(gameRoot);
            this.applyGameVisible(gameRoot, true);
        }
        this.setToggleButtonText();
        this.syncHandles();
        this.startLivePage();
        this.restartLiveWatchdog();
    }

    // 给外部脚本设置直播 URL（例如 Button.ts 在点击前注入）。
    static setLiveRoomUrl(url: string) {
        if (!url) {
            return;
        }
        this.liveRoomUrl = url;
    }

    // 创建并挂载所有 H5 直播相关 DOM（只执行一次）。
    // 包括：
    // - 全屏视频层（底层）
    // - 控制按钮层（返回大厅、显示/隐藏游戏）
    private static ensureDom() {
        if (this.initialized) {
            return;
        }
        const doc = (window as any).document;
        if (!doc || !doc.body) {
            return;
        }

        const videoLayer = doc.createElement("div");
        videoLayer.id = VIDEO_LAYER_ID;
        videoLayer.style.cssText = [
            "position:fixed",
            "left:0",
            "top:0",
            "width:100vw",
            "height:100vh",
            "background:#000",
            "z-index:0",
            "display:none",
            "overflow:hidden"
        ].join(";");

        // 直播页面由 iframe 承载，页面内可以是你完整的 H5 直播间实现。
        const frame = doc.createElement("iframe");
        frame.style.cssText = [
            "width:100%",
            "height:100%",
            "border:0",
            "background:#000"
        ].join(";");
        frame.setAttribute("allow", "autoplay; fullscreen; microphone; camera");
        videoLayer.appendChild(frame);
        doc.body.appendChild(videoLayer);
        this.liveFrameEl = frame;

        const controlLayer = doc.createElement("div");
        controlLayer.id = CONTROL_LAYER_ID;
        controlLayer.style.cssText = [
            "position:fixed",
            "left:12px",
            "top:12px",
            "z-index:40",
            "display:none"
        ].join(";");

        const backBtn = doc.createElement("button");
        backBtn.id = BACK_BTN_ID;
        backBtn.textContent = "返回大厅";
        this.applyBtnStyle(backBtn);
        backBtn.onclick = () => this.enterLobbyMode();

        const toggleBtn = doc.createElement("button");
        toggleBtn.id = TOGGLE_BTN_ID;
        toggleBtn.textContent = "隐藏游戏";
        this.applyBtnStyle(toggleBtn);
        toggleBtn.style.marginLeft = "8px";
        toggleBtn.onclick = () => {
            const gameRoot = this.getGameRoot();
            if (!gameRoot || !this.inLiveMode) {
                return;
            }
            // 只改“显示状态”，不销毁游戏实例，切换更快更稳定。
            this.gameVisible = !this.gameVisible;
            this.applyGameVisible(gameRoot, this.gameVisible);
            this.setToggleButtonText();
        };

        const refreshBtn = doc.createElement("button");
        refreshBtn.id = REFRESH_BTN_ID;
        refreshBtn.textContent = "强制刷新";
        this.applyBtnStyle(refreshBtn);
        refreshBtn.style.marginLeft = "8px";
        refreshBtn.onclick = () => this.forceRefreshLivePage();

        controlLayer.appendChild(backBtn);
        controlLayer.appendChild(toggleBtn);
        controlLayer.appendChild(refreshBtn);
        doc.body.appendChild(controlLayer);

        this.initialized = true;
        this.installHandles();
        this.bindFrameMessageHandler();
    }

    // 安装拖拽条 + 缩放角：
    // - 拖拽条：移动小游戏窗口位置
    // - 缩放角：调整小游戏窗口大小
    // 两者都是覆盖在 Cocos 容器外的 HTML 元素，便于鼠标/触摸统一处理。
    private static installHandles() {
        const doc = (window as any).document;
        const gameRoot = this.getGameRoot();
        if (!doc || !gameRoot) {
            return;
        }

        const drag = doc.createElement("div");
        drag.id = DRAG_HANDLE_ID;
        drag.style.cssText = "position:fixed;height:24px;background:transparent;z-index:45;display:none;cursor:move;";
        doc.body.appendChild(drag);

        const resize = doc.createElement("div");
        resize.id = RESIZE_HANDLE_ID;
        resize.style.cssText = "position:fixed;width:20px;height:20px;background:rgba(255,255,255,0.75);z-index:45;display:none;cursor:nwse-resize;";
        doc.body.appendChild(resize);

        const syncHandle = () => {
            if (!this.inLiveMode || !this.gameVisible) {
                drag.style.display = "none";
                resize.style.display = "none";
                return;
            }
            const rect = gameRoot.getBoundingClientRect();
            drag.style.display = "block";
            resize.style.display = "block";
            drag.style.left = rect.left + "px";
            drag.style.top = rect.top + "px";
            drag.style.width = rect.width + "px";
            resize.style.left = (rect.right - 20) + "px";
            resize.style.top = (rect.bottom - 20) + "px";
        };
        this.syncHandleFn = syncHandle;

        // 拖拽开始：
        // 记录“手指/鼠标”与窗口左上角的偏移量，移动时保持这个偏移，实现自然拖拽。
        const onDragStart = (startEvent: any) => {
            if (!this.inLiveMode || !this.gameVisible) {
                return;
            }
            startEvent.preventDefault();
            const rect = gameRoot.getBoundingClientRect();
            const startX = this.getEventX(startEvent);
            const startY = this.getEventY(startEvent);
            const offsetX = startX - rect.left;
            const offsetY = startY - rect.top;

            const move = (e: any) => {
                const x = this.getEventX(e) - offsetX;
                const y = this.getEventY(e) - offsetY;
                // 限制在视口范围内，避免拖出屏幕导致无法操作。
                const maxX = Math.max(0, window.innerWidth - rect.width);
                const maxY = Math.max(0, window.innerHeight - rect.height);
                gameRoot.style.left = Math.max(0, Math.min(maxX, x)) + "px";
                gameRoot.style.top = Math.max(0, Math.min(maxY, y)) + "px";
                gameRoot.style.right = "auto";
                gameRoot.style.bottom = "auto";
                syncHandle();
            };
            const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
                window.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            window.addEventListener("touchmove", move, { passive: false } as AnyObj);
            window.addEventListener("touchend", up);
        };

        // 缩放开始：
        // 记录初始尺寸 + 起始指针位置，移动时计算增量得到新尺寸。
        const onResizeStart = (startEvent: any) => {
            if (!this.inLiveMode || !this.gameVisible) {
                return;
            }
            startEvent.preventDefault();
            const rect = gameRoot.getBoundingClientRect();
            const startX = this.getEventX(startEvent);
            const startY = this.getEventY(startEvent);
            const startW = rect.width;
            const startH = rect.height;

            const move = (e: any) => {
                const dw = this.getEventX(e) - startX;
                const dh = this.getEventY(e) - startY;
                // 设定最小尺寸，保证内部 UI 可操作；最大尺寸不超过可视区域。
                const minW = 220;
                const minH = 124;
                const maxW = window.innerWidth - rect.left;
                const maxH = window.innerHeight - rect.top;
                const w = Math.max(minW, Math.min(maxW, startW + dw));
                const h = Math.max(minH, Math.min(maxH, startH + dh));
                gameRoot.style.width = w + "px";
                gameRoot.style.height = h + "px";
                gameRoot.style.right = "auto";
                gameRoot.style.bottom = "auto";
                syncHandle();
            };
            const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
                window.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            window.addEventListener("touchmove", move, { passive: false } as AnyObj);
            window.addEventListener("touchend", up);
        };

        drag.addEventListener("mousedown", onDragStart);
        drag.addEventListener("touchstart", onDragStart, { passive: false } as AnyObj);
        resize.addEventListener("mousedown", onResizeStart);
        resize.addEventListener("touchstart", onResizeStart, { passive: false } as AnyObj);

        window.addEventListener("resize", syncHandle);
        syncHandle();
    }

    // 统一读取指针坐标：触摸优先取 touches[0]，鼠标则取 clientX/clientY。
    private static getEventX(e: any): number {
        if (e.touches && e.touches.length > 0) {
            return e.touches[0].clientX;
        }
        return e.clientX;
    }

    private static getEventY(e: any): number {
        if (e.touches && e.touches.length > 0) {
            return e.touches[0].clientY;
        }
        return e.clientY;
    }

    // 控制按钮的统一视觉样式，避免每个按钮重复写 CSS。
    private static applyBtnStyle(btn: any) {
        btn.style.cssText = [
            "padding:6px 12px",
            "border:0",
            "border-radius:8px",
            "background:rgba(32,32,32,0.75)",
            "color:#fff",
            "font-size:14px",
            "cursor:pointer"
        ].join(";");
    }

    // 根据当前状态刷新“隐藏游戏/显示游戏”按钮文案。
    private static setToggleButtonText() {
        const doc = (window as any).document;
        if (!doc) {
            return;
        }
        const btn = doc.getElementById(TOGGLE_BTN_ID);
        if (btn) {
            btn.textContent = this.gameVisible ? "隐藏游戏" : "显示游戏";
        }
    }

    // 统一控制某个覆盖层显示/隐藏。
    private static setLayerVisible(id: string, visible: boolean) {
        const doc = (window as any).document;
        if (!doc) {
            return;
        }
        const el = doc.getElementById(id);
        if (el) {
            el.style.display = visible ? "block" : "none";
        }
    }

    // 控制 Cocos 游戏根节点是否可见，并同步拖拽/缩放句柄显隐。
    private static applyGameVisible(gameRoot: any, visible: boolean) {
        gameRoot.style.display = visible ? "block" : "none";
        this.syncHandles();
    }

    // 应用大厅样式（全屏）：
    // - 优先恢复“进入直播前”的原始样式
    // - 若没有记录到原始值，则兜底设为全屏
    // - 恢复 canvas 样式，防止小窗样式残留
    private static applyLobbyCanvasStyle(gameRoot: any) {
        const canvas = this.getGameCanvasFromRoot(gameRoot);
        if (this.originalGameRootStyle !== null) {
            gameRoot.style.cssText = this.originalGameRootStyle;
        } else {
            gameRoot.style.position = "fixed";
            gameRoot.style.left = "0px";
            gameRoot.style.top = "0px";
            gameRoot.style.width = "100vw";
            gameRoot.style.height = "100vh";
        }
        if (this.originalCanvasStyle !== null && canvas) {
            canvas.style.cssText = this.originalCanvasStyle;
        }
        gameRoot.style.display = "block";
        gameRoot.style.zIndex = "20";
        gameRoot.style.right = "auto";
        gameRoot.style.bottom = "auto";
        gameRoot.style.maxWidth = "";
        gameRoot.style.maxHeight = "";
        gameRoot.style.minWidth = "";
        gameRoot.style.minHeight = "";
        gameRoot.style.borderRadius = "";
        gameRoot.style.overflow = "";
        // 强制刷新 frame，保证返回大厅后立即回到全屏绘制区域。
        cc.view.setFrameSize(window.innerWidth, window.innerHeight);
    }

    // 应用直播样式（小窗）：
    // - 首次进入时先缓存原样式，方便返回大厅恢复
    // - 固定到右下角，允许后续拖拽/缩放覆盖这些初始值
    private static applyLiveCanvasStyle(gameRoot: any) {
        if (this.originalGameRootStyle === null) {
            this.originalGameRootStyle = gameRoot.style.cssText || "";
        }
        const canvas = this.getGameCanvasFromRoot(gameRoot);
        if (canvas && this.originalCanvasStyle === null) {
            this.originalCanvasStyle = canvas.style.cssText || "";
        }
        gameRoot.style.position = "fixed";
        gameRoot.style.left = "auto";
        gameRoot.style.top = "auto";
        gameRoot.style.right = "16px";
        gameRoot.style.bottom = "16px";
        gameRoot.style.width = "52vw";
        gameRoot.style.height = "34vh";
        gameRoot.style.maxWidth = "860px";
        gameRoot.style.maxHeight = "520px";
        gameRoot.style.minWidth = "220px";
        gameRoot.style.minHeight = "124px";
        gameRoot.style.zIndex = "30";
        gameRoot.style.borderRadius = "8px";
        gameRoot.style.overflow = "hidden";
        this.fitCanvasToRoot(gameRoot);
    }

    // 获取 Cocos 根容器：
    // 优先用 cc.game.container（标准）
    // 其次用 canvas.parentElement
    // 最后兜底查 DOM（兼容部分运行环境）
    private static getGameRoot(): any {
        if (cc.game && (cc.game as AnyObj).container) {
            return (cc.game as AnyObj).container;
        }
        if (cc.game && (cc.game as AnyObj).canvas && (cc.game as AnyObj).canvas.parentElement) {
            return (cc.game as AnyObj).canvas.parentElement;
        }
        const doc = (window as any).document;
        if (!doc) {
            return null;
        }
        return doc.getElementById("GameDiv") || doc.getElementById("GameCanvas");
    }

    // 让 canvas 永远铺满小游戏窗口容器，避免“内容没铺满小窗”的问题。
    private static fitCanvasToRoot(gameRoot: any) {
        if (!gameRoot) {
            return;
        }
        const canvas = this.getGameCanvasFromRoot(gameRoot);
        if (!canvas) {
            return;
        }
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "absolute";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.transform = "none";
    }

    // 从根节点中拿到 canvas。优先 cc.game.canvas，其次 DOM 查询。
    private static getGameCanvasFromRoot(gameRoot: any): any {
        if (cc.game && (cc.game as AnyObj).canvas) {
            return (cc.game as AnyObj).canvas;
        }
        if (!gameRoot) {
            return null;
        }
        return gameRoot.querySelector("canvas");
    }

    // 切换分辨率策略：
    // - 直播小窗：EXACT_FIT（强制铺满窗口，减少黑边）
    // - 大厅全屏：SHOW_ALL（保持内容比例，避免变形过大）
    private static applyResolutionPolicy(inLive: boolean) {
        if (!cc.view) {
            return;
        }
        if (!this.designWidth || !this.designHeight) {
            const size = cc.view.getDesignResolutionSize();
            this.designWidth = size.width;
            this.designHeight = size.height;
        }
        const policy = inLive
            ? cc.ResolutionPolicy.EXACT_FIT
            : cc.ResolutionPolicy.SHOW_ALL;
        cc.view.setDesignResolutionSize(this.designWidth, this.designHeight, policy);
    }

    // 加载直播页面（iframe）。
    // 注意：若目标站点开启 X-Frame-Options/CSP frame-ancestors 限制，iframe 会被拒绝嵌入。
    private static startLivePage() {
        if (!this.liveFrameEl) {
            return;
        }
        this.stopLivePage();
        this.liveFrameEl.src = this.liveRoomUrl;
    }

    // 手动强制刷新：附加时间戳，避免缓存命中。
    static forceRefreshLivePage() {
        if (!this.liveFrameEl) {
            return;
        }
        const base = this.liveRoomUrl || DEFAULT_LIVE_ROOM_URL;
        const delim = base.indexOf("?") >= 0 ? "&" : "?";
        const nextUrl = base + delim + "_h5_reload_ts=" + Date.now();
        this.liveFrameEl.src = "about:blank";
        this.liveFrameEl.src = nextUrl;
        this.lastMediaTs = Date.now();
        this.lastMediaTime = -1;
        this.stalledRounds = 0;
    }

    // 卸载直播页面，释放播放资源并避免大厅模式继续占用带宽。
    private static stopLivePage() {
        if (!this.liveFrameEl) {
            return;
        }
        this.liveFrameEl.src = "about:blank";
    }

    // 触发句柄位置同步，避免在窗口变化后拖拽条/缩放角跑偏。
    private static syncHandles() {
        if (this.syncHandleFn) {
            this.syncHandleFn();
        }
    }

    // 接收直播页 postMessage 媒体状态：
    // 建议直播页每 1s 发送:
    // window.parent.postMessage({type:'live-media-debug', currentTime, readyState, paused}, '*')
    private static bindFrameMessageHandler() {
        if (this.messageHandlerBound || typeof window === "undefined") {
            return;
        }
        window.addEventListener("message", (evt: MessageEvent) => {
            const data: AnyObj = (evt && evt.data) || {};
            if (!data || data.type !== "live-media-debug") {
                return;
            }
            const t = Number(data.currentTime);
            if (!isNaN(t)) {
                this.lastMediaTime = t;
            }
            this.lastMediaTs = Date.now();
        });
        this.messageHandlerBound = true;
    }

    private static restartLiveWatchdog() {
        this.stopLiveWatchdog();
        this.lastMediaTs = Date.now();
        this.lastMediaTime = -1;
        this.stalledRounds = 0;
        this.watchdogTimer = window.setInterval(() => {
            if (!this.inLiveMode || !this.liveFrameEl) {
                return;
            }
            const now = Date.now();
            // 超过 6 秒没收到媒体心跳，认为直播页可能卡死，执行一次刷新。
            if (now - this.lastMediaTs > 6000) {
                this.stalledRounds++;
                if (this.stalledRounds >= 2) {
                    this.forceRefreshLivePage();
                    this.stalledRounds = 0;
                }
                return;
            }
            this.stalledRounds = 0;
            // 给直播页一个可选的 ping，便于你前端联动。
            try {
                const win = this.liveFrameEl.contentWindow;
                if (win) {
                    win.postMessage({ type: "hybrid-watchdog-ping", ts: now }, "*");
                }
            } catch (e) {
                // ignore cross-origin errors
            }
        }, 2000);
    }

    private static stopLiveWatchdog() {
        if (this.watchdogTimer !== null) {
            window.clearInterval(this.watchdogTimer);
            this.watchdogTimer = null;
        }
        this.stalledRounds = 0;
        this.lastMediaTs = 0;
        this.lastMediaTime = -1;
    }
}
