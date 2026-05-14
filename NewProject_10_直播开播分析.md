# NewProject_10 直播开播板块分析

## 概览
NewProject_10 是一个直播融合 Demo 工程（Cocos Creator 2.4.15），结合了 **H5 直播页面**与 **Cocos 游戏窗口** 的混合架构。

---

## 1. 核心架构

### 1.1 分层设计

| 层级 | 技术栈 | 职责 |
|------|--------|------|
| **TypeScript 脚本层** | LiveKit.ts | 统一的直播能力入口，屏蔽 H5/Android 差异 |
| **H5 直播层** | WebHybrid.ts | iframe 嵌入外部 H5 直播页，管理分辨率策略、拖拽缩放 |
| **Android Native 层** | LiveHybridController.java | 原生 UI、推流、权限、屏幕方向控制 |

---

## 2. 开播流程（主播端）

### 2.1 TypeScript 层触发

**文件**: [NewProject_10/assets/Script/anchorButton.ts](NewProject_10/assets/Script/anchorButton.ts)

```typescript
click() {
    cc.log("[AnchorButton] start anchor");
    LiveKit.init({ debug: true });
    LiveKit.startAnchor();  // 触发开播
}
```

---

### 2.2 LiveKit.startAnchor() 流程

**文件**: [NewProject_10/assets/Script/livekit.ts](NewProject_10/assets/Script/livekit.ts)

#### 核心方法签名

```typescript
static startAnchor(url?: string) {
    if (url) {
        this.enterAudience(url);
        this.log("startAnchor[h5-url]", url);
        return;
    }
    const mode = this.getMode();
    if (mode === "android-native") {
        this.callAndroid("showAnchorSetupDialog", "()V");  // ⭐ 调用 Android 显示 RTMP 配置弹窗
        this.log("startAnchor[android-config-dialog]");
        return;
    }
    this.log("startAnchor: RTMP native push is only implemented on Android now");
}
```

#### 分支逻辑

| 条件 | 行为 | 说明 |
|------|------|------|
| 传了直播间 URL | 调用 `enterAudience(url)` | 以观众身份进入直播页 |
| Android 原生环境 | 调用 `showAnchorSetupDialog()` | **主播端流程** |
| 其他环境（H5、iOS） | 打印日志 | 暂不支持 |

---

### 2.3 RTMP 配置弹窗

#### 调用方式

```typescript
private static callAndroid(method: string, signature: string, arg?: string) {
    const jsbObj = (window as any).jsb;
    if (!jsbObj || !jsbObj.reflection) {
        cc.log("[LiveKit] jsb.reflection is unavailable");
        return;
    }
    jsbObj.reflection.callStaticMethod(
        "org/cocos2dx/javascript/LiveKitBridge",  // Java 类路径
        method,                                   // 方法名
        signature,                                // JNI 签名
        arg                                       // 参数（JSON 字符串）
    );
}
```

#### 调用方法映射

| Cocos 调用 | 对应 Java 方法 | 签名 | 说明 |
|-----------|-----------------|------|------|
| `showAnchorSetupDialog` | `LiveKitBridge.showAnchorSetupDialog()` | `()V` | **显示 RTMP 配置对话框** |
| `startAnchorWithRtmpConfig` | `LiveKitBridge.startAnchorWithRtmpConfig(String config)` | `(Ljava/lang/String;)V` | 传入 RTMP 配置后直接开播 |
| `stopAnchorPush` | `LiveKitBridge.stopAnchorPush()` | `()V` | 停止推流 |

---

## 3. Android Native 实现（待补齐）

### 3.1 现状

**文件**: `build/jsb-default/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/`

目前工程中有 **LiveHybridController.java**（处理直播页面混合容器、拖拽缩放等），但**缺少 LiveKitBridge.java** 这个关键的推流桥接类。

### 3.2 缺失的 LiveKitBridge.java

根据 Cocos 调用栈，应该存在一个类似以下结构的类：

```java
package org.cocos2dx.javascript;

public class LiveKitBridge {
    
    /**
     * 弹出 RTMP 配置对话框
     * - 展示编辑框：服务器地址（RTMP URL）
     * - 展示编辑框：推流密钥（Stream Key）
     * - 两个按钮：开始直播、取消
     * - 记录历史配置，方便下次快速填充
     */
    public static void showAnchorSetupDialog() {
        // 1. 创建 AlertDialog（或 BottomSheetDialog）
        // 2. 添加文本输入框：RTMP Server URL
        // 3. 添加文本输入框：Stream Key
        // 4. 从 SharedPreferences 读取历史值，自动填充
        // 5. 点击"开始直播"后：
        //    - 解析用户输入的 RTMP 配置
        //    - 构建 LiveKitRtmpConfig 对象
        //    - 调用 startAnchorWithRtmpConfig()
    }
    
    /**
     * 传入 RTMP 配置后直接启动推流
     * @param configJson JSON 格式：
     *        {
     *          "serverUrl": "rtmp://example.com/live",
     *          "streamKey": "abc123xyz",
     *          "roomId": "10001",
     *          "userId": "user_1",
     *          "nickname": "主播名"
     *        }
     */
    public static void startAnchorWithRtmpConfig(String configJson) {
        // 1. 解析 JSON 配置
        // 2. 请求摄像头 + 麦克风权限
        // 3. 启动 MediaProjection 用于屏幕录制（截屏直播）
        //    或使用摄像头 + 麦克风（摄像头直播）
        // 4. 连接 RTMP 推流引擎（如 librtmp、ijkplayer、FFmpeg 等）
        // 5. 开始推流
        // 6. 回调 JS：推流成功/失败
    }
    
    /**
     * 停止推流
     */
    public static void stopAnchorPush() {
        // 1. 断开 RTMP 连接
        // 2. 释放摄像头、麦克风资源
        // 3. 停止 MediaProjection 录制
        // 4. 返回大厅
    }
}
```

### 3.3 推流方案选择

#### A. 截屏直播（Screen Share）

```java
// 使用系统 MediaProjection 能力录制屏幕并推流
MediaProjectionManager projectionMgr = 
    (MediaProjectionManager) context.getSystemService(Context.MEDIA_PROJECTION_SERVICE);

// 需要用户授权（Android 5.0+ 弹出系统对话框）
Intent intent = projectionMgr.createScreenCaptureIntent();
startActivityForResult(intent, REQUEST_MEDIA_PROJECTION);

// 授权后获取 MediaProjection，传入推流引擎
MediaProjection mediaProjection = projectionMgr.getMediaProjection(resultCode, data);
rtmpPusher.setVideoSource(mediaProjection);  // 伪代码
rtmpPusher.start();
```

**特点**:
- ✅ 可推流任意应用内容（包括 Cocos 游戏）
- ✅ 无需额外的摄像头权限（Android 10+）
- ❌ 需要用户手动授权
- ❌ 大量屏幕数据，码率占用大

#### B. 摄像头直播（Camera + Mic）

```java
// 直接使用设备摄像头 + 麦克风
Camera camera = Camera.open(0);
AudioRecord audioRecord = new AudioRecord(
    AudioSource.MIC, 
    44100, 
    AudioFormat.CHANNEL_IN_MONO,
    AudioFormat.ENCODING_PCM_16BIT, 
    bufferSize);

rtmpPusher.setVideoSource(camera);
rtmpPusher.setAudioSource(audioRecord);
rtmpPusher.start();
```

**特点**:
- ✅ 权限简单（静态声明即可）
- ✅ 码率低，更流畅
- ❌ 只能推摄像头画面（无法同时显示游戏）
- ❌ 需要物理摄像头设备

#### C. 混合模式（推荐）

1. **用户选择**：弹窗让用户选择"截屏直播"或"摄像头直播"
2. **截屏直播**：推屏幕内容 + 实时游戏画面
3. **摄像头直播**：主播头像 + 语音讲解

---

## 4. 弹窗流程详解

### 4.1 RTMP 配置弹窗（showAnchorSetupDialog）

```
┌─────────────────────────────────────┐
│   开始直播 - RTMP 配置               │
├─────────────────────────────────────┤
│                                     │
│  RTMP 服务器地址:                   │
│  ┌───────────────────────────────┐ │
│ │ rtmp://example.com/live        │ │
│ └───────────────────────────────┘ │
│                                     │
│  推流密钥:                         │
│  ┌───────────────────────────────┐ │
│ │ stream_key_abc123              │ │
│ └───────────────────────────────┘ │
│                                     │
│  □ 记住配置                         │
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │  开始直播    │  │   取消       ││
│  └──────────────┘  └──────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**交互**:
1. 显示两个 EditText（RTMP URL、Stream Key）
2. 读取 SharedPreferences 历史值，自动填充
3. 用户编辑后点击"开始直播"
4. 校验输入不为空
5. 保存到 SharedPreferences（下次记住）
6. 进入权限请求流程

---

### 4.2 推流方式选择弹窗（startAnchorWithRtmpConfig）

```
┌─────────────────────────────────────┐
│   选择直播方式                       │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────┐    │
│  │  📱 截屏直播               │    │
│  │  推送整个屏幕内容           │    │
│  │  包含游戏、聊天等           │    │
│  └────────────────────────────┘    │
│          ↓ 点击                      │
│  ⚠️ 需要授予屏幕录制权限             │
│  [系统弹窗] 允许 / 取消             │
│                                     │
│  ┌────────────────────────────┐    │
│  │  📹 摄像头直播              │    │
│  │  推送前置摄像头 + 麦克风     │    │
│  │  适合主播脸部互动           │    │
│  └────────────────────────────┘    │
│          ↓ 点击                      │
│  ⚠️ 需要授予相机、麦克风权限        │
│  [系统弹窗] 允许 / 取消             │
│                                     │
│         ┌──────────────┐            │
│         │   取消       │            │
│         └──────────────┘            │
│                                     │
└─────────────────────────────────────┘
```

**两种推流方式对应代码**:

```typescript
// 选择截屏直播
static startAnchorWithRtmpConfig(config: LiveKitRtmpConfig) {
    const modeSelected = "screen-share";
    // 调用 Java: startAnchorWithRtmpConfig(JSON.stringify(config), "screen-share")
}

// 选择摄像头直播  
static startAnchorWithRtmpConfig(config: LiveKitRtmpConfig) {
    const modeSelected = "camera";
    // 调用 Java: startAnchorWithRtmpConfig(JSON.stringify(config), "camera")
}
```

---

## 5. 权限申请流程

### 5.1 截屏直播所需权限

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

**运行时权限**:
- **屏幕录制** (`MediaProjection`)：系统级弹窗，用户选择要录制的内容
- **麦克风** (`RECORD_AUDIO`)：Android 6.0+ 需要动态申请

### 5.2 摄像头直播所需权限

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

**运行时权限** (Android 6.0+):
- `Manifest.permission.CAMERA`
- `Manifest.permission.RECORD_AUDIO`

---

## 6. 完整调用链路

```
┌───────────────── Cocos 脚本层 ───────────────────┐
│                                                  │
│  Button 点击                                     │
│       ↓                                          │
│  LiveKit.startAnchor()                          │
│       ↓                                          │
│  jsb.reflection.callStaticMethod(               │
│      "org/cocos2dx/javascript/LiveKitBridge",  │
│      "showAnchorSetupDialog",                  │
│      "()V"                                      │
│  )                                              │
│                                                  │
└─────────────────────────────────────────────────┘
                      ↓
┌────────── Android Native 层 ───────────────────┐
│                                                │
│  LiveKitBridge.showAnchorSetupDialog()        │
│       ↓                                        │
│  [对话框] RTMP Server URL + Stream Key        │
│       ↓                                        │
│  用户输入 + 点击"开始直播"                    │
│       ↓                                        │
│  LiveKitBridge.startAnchorWithRtmpConfig()   │
│       ↓                                        │
│  请求权限（屏幕录制 / 摄像头）                │
│       ↓                                        │
│  [弹窗] 选择推流方式（截屏 / 摄像头）        │
│       ↓                                        │
│  初始化 RTMP 推流引擎                          │
│       ↓                                        │
│  开始推流 📡                                   │
│       ↓                                        │
│  主播端显示"直播中..."UI                     │
│       ↓                                        │
│  点击"结束直播"                               │
│       ↓                                        │
│  LiveKitBridge.stopAnchorPush()              │
│       ↓                                        │
│  停止推流，释放资源                            │
│       ↓                                        │
│  返回大厅                                      │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 7. H5 直播页面支持（观众端）

**文件**: [NewProject_10/assets/Script/webHybrid.ts](NewProject_10/assets/Script/webHybrid.ts)

```typescript
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
```

**H5 页面框架**:
- 外部 H5 直播间页面（支持 WebRTC / HLS 等）
- 通过 iframe 嵌入 Cocos 应用
- Cocos 游戏可拖拽缩放，放在右下角作为辅助窗口

---

## 8. 需要补齐的组件

| 组件 | 位置 | 优先级 | 说明 |
|------|------|-------|------|
| **LiveKitBridge.java** | `proj.android-studio/app/src/org/cocos2dx/javascript/` | 🔴 关键 | RTMP 推流桥接类，处理权限、弹窗、推流引擎初始化 |
| **RTMP 推流库** | `proj.android-studio/app/libs/` 或 gradle dependency | 🔴 关键 | 可选用 librtmp、ijkplayer、obs-android 等 |
| **权限申请工具类** | `proj.android-studio/app/src/org/cocos2dx/javascript/` | 🟡 重要 | 动态请求相机、麦克风、屏幕录制权限 |
| **推流 UI 控件** | `proj.android-studio/app/res/layout/` | 🟡 重要 | RTMP 配置对话框、推流方式选择、推流状态条 |

---

## 9. 参考配置

### 9.1 示例 RTMP 配置

```json
{
  "serverUrl": "rtmp://live.example.com/app",
  "streamKey": "unique_stream_key_12345",
  "roomId": "10001",
  "userId": "anchor_user_001",
  "nickname": "主播名称"
}
```

### 9.2 示例直播间 URL

```
http://192.168.110.28:5173/room?roomId=10001&userId=user_1&nickname=观众1&role=audience&debugMedia=1
```

---

## 10. 总结

NewProject_10 的直播开播板块采用了 **三层架构**：
1. **TypeScript 层** (livekit.ts): 统一 API，屏蔽平台差异
2. **H5 直播层** (webHybrid.ts): iframe 嵌入、窗口管理
3. **Android Native 层** (LiveKitBridge.java 待实现): RTMP 推流、权限、UI

**主播开播流程**:
- 点击"开始直播"按钮
- 弹出 RTMP 配置对话框（服务器地址 + 推流密钥）
- 用户选择推流方式（截屏 / 摄像头）
- 请求相应权限
- 初始化 RTMP 推流引擎
- 开始推流

**观众进入直播**:
- 通过直播间 URL 打开 iframe 页面
- 在右下角显示可拖拽缩放的 Cocos 游戏窗口
- 支持全屏、隐藏游戏等操作

