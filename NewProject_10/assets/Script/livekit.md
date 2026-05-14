# LiveKit 封装说明（可迁移）

## 目标
- 让 Cocos 业务层只依赖统一接口，不直接依赖 WebView/原生细节。
- 同一套调用同时支持 H5 与 Android。

## 核心文件
- `assets/Script/livekit.ts`: Cocos 统一入口。
- `assets/Script/webHybrid.ts`: H5 直播容器实现。
- `build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/LiveKitBridge.java`: Android 反射桥接入口。
- `build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/AppActivity.java`: Android 混合容器实现。

## 统一 API（Cocos）
- `LiveKit.init(config)`
- `LiveKit.enterLobby()`
- `LiveKit.enterAudience(url?)`
- `LiveKit.startAnchor(url?)`
- `LiveKit.startAnchorWithRtmpConfig(config)`
- `LiveKit.stopAnchor()`
- `LiveKit.reloadLivePage()`
- `LiveKit.toggleGameWindow()`
- `LiveKit.exitLiveRoom()`

## 主播 RTMP 推流
- `LiveKit.startAnchor()`：Android 会弹出 RTMP 配置面板。
- `LiveKit.startAnchorWithRtmpConfig({ serverUrl, streamKey })`：直接用配置启动主播推流。
- Android 会保存最近 8 条 `serverUrl + streamKey` 历史记录。
- Android 使用 RootEncoder 的 `RtmpDisplay` 做真实屏幕采集推流，内容是当前游戏画面 + 麦克风音频。
- 首次开播会依次申请麦克风权限和系统屏幕录制授权。

## 接入方式
1. 在大厅按钮点击时调用 `LiveKit.enterAudience(url)`。
2. 在返回大厅时调用 `LiveKit.enterLobby()`。
3. 直播调试时调用 `LiveKit.reloadLivePage()`。

## 迁移到新项目
1. 复制 `livekit.ts` 到新项目脚本目录。
2. Android 工程复制 `LiveKitBridge.java`，并确保 `AppActivity` 实现对应静态方法。
3. 业务只改 URL，不改桥接类名和方法签名。

## 注意
- 若改了 Cocos 脚本，需重新构建 Cocos 再编译 Android。
- 若改了 Android 原生，按你的流程执行：`clean -> assembleDebug -> install -> start`。
