//是否是全屏
function isFullScreen() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}

// 判断当前是否已经是 PWA 独立模式运行（即已经安装到桌面）
function isStandalone() {
    // 两种方式检测：
    // 1. matchMedia('(display-mode: standalone)') → 兼容大部分浏览器
    // 2. navigator.standalone → 专门兼容 iOS Safari
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

//启动全屏
function startquan() {
    const elem = document.documentElement;
    // 进入全屏模式
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

//自动锁定
function autoLock() {
    //   if (!isStandalone()) {
    //     console.log("不是pwa模式")
    //     return;
    //   }
    //启动一个检测计时器
    // const interval = setInterval(function () {
    //     if (!GlobalCfg.CURSCENE_DIRECTION) {
    //         console.log("GlobalCfg.CURSCENE_DIRECTION 不存在")
    //         return
    //     }
    //     if (GlobalCfg.CURSCENE_DIRECTION == "vertical") {
    //         if (screen.orientation.type.indexOf("portrait") == -1) {
    //             screen.orientation.lock("portrait-primary")
    //                 .then(() => console.log("锁定成功"))
    //                 .catch(err => console.error("锁定失败:", err));
    //         }
    //     }
    //     if (GlobalCfg.CURSCENE_DIRECTION == "horizontal") {
    //         if (screen.orientation.type.indexOf("landscape") == -1) {
    //             screen.orientation.lock("landscape-primary")
    //                 .then(() => console.log("锁定成功"))
    //                 .catch(err => console.error("锁定失败:", err));
    //         }
    //     }
    // }, 100)
    const parser = new UAParser(navigator.userAgent);
    const result = parser.getResult();
    if (result.os.name === "Android") {
        const interval1 = setInterval(function () {
            if (!isFullScreen()) {
                console.log("当前不是全屏");
                startquan();
            } else {
                console.log("当前是全屏");
            }
        }, 1000)
    }
}

autoLock();