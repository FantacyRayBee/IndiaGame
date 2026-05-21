let LiveHostAdapter = cc.Class({
    statics: {
        // 判断当前场景是否需要走主播宿主适配流程。
        shouldHandleScene(sceneName) {
            let isAnchorModeEnabled = GlobalCfg.IS_ANCHOR_MODE && GlobalCfg.server_id == "0";
            if (!isAnchorModeEnabled) {
                return false;
            }
            return sceneName === "lhdGame/LHD";
        },

        // 返回主播宿主场景的 fire 路径。
        getHostScenePath() {
            return "ResourcesBundle/NewPlan/gameFire/LiveHost";
        },

        // 按配置加载被宿主承载的游戏预制体。
        loadHostedPrefab(sceneName) {
            let config = this.getHostedSceneConfig(sceneName);
            if (!config) {
                return Promise.reject(`unsupported live host scene: ${sceneName}`);
            }

            return new Promise((resolve, reject) => {
                CommonFun.getInstance().loadBundle(config.bundleName, (bundle) => {
                    bundle.load(config.prefabPath, cc.Prefab, (err, prefab) => {
                        if (!err) {
                            resolve(prefab);
                        }
                        else {
                            reject(`loading hosted prefab failed: ${err}`);
                        }
                    });
                }, (err) => {
                    reject(`failed to load ${config.bundleName}-bundle: ${err}`);
                });
            });
        },

        // 将游戏预制体挂到主播宿主场景下，并同步布局。
        mountHostedPrefab(sceneName, prefab) {
            let config = this.getHostedSceneConfig(sceneName);
            if (!config) {
                throw new Error(`unsupported live host scene: ${sceneName}`);
            }

            let roots = this.ensureLiveHostRoots();
            let gameNode = cc.instantiate(prefab);
            this.normalizeLiveHostPrefabRoot(gameNode);
            this.installLiveHostFindBridge(gameNode);
            GlobalCfg.LIVE_HOST_GAME_ROOT = roots.gameRoot;
            GlobalCfg.LIVE_HOST_LIVE_ROOT = roots.liveRoot;
            roots.gameRoot.addChild(gameNode);
            this.updateHostRootAlignment(roots);
            CommonFun.getInstance().applyAnchorPortraitGameLayout(gameNode, roots.gameRoot);
            this.syncAnchorPreviewViewport(roots, gameNode);
        },

        // 这里维护“宿主场景 -> 子游戏资源”的映射关系。
        getHostedSceneConfig(sceneName) {
            const configMap = {
                "lhdGame/LHD": {
                    bundleName: "lhdGame",
                    prefabPath: "lhdPab/LHD",
                },
            };
            return configMap[sceneName] || null;
        },

        // 取得主播宿主场景中的几个根节点，并清空旧的游戏内容。
        ensureLiveHostRoots() {
            let scene = cc.director.getScene();
            if (!scene) {
                throw new Error("LiveHost scene is not active");
            }
            let canvas = scene.getChildByName("Canvas");
            if (!canvas) {
                throw new Error("LiveHost Canvas not found");
            }

            let gameRoot = canvas.getChildByName("game_root");
            if (!gameRoot) {
                throw new Error("LiveHost game_root not found");
            }

            let liveRoot = canvas.getChildByName("live_root");
            if (!liveRoot) {
                throw new Error("LiveHost live_root not found");
            }

            gameRoot.removeAllChildren();
            return {
                canvas: canvas,
                gameRoot: gameRoot,
                liveRoot: liveRoot,
            };
        },

        // 主动刷新 Widget 对齐，避免挂载后节点位置未更新。
        updateHostRootAlignment(roots) {
            if (!roots) {
                return;
            }

            let nodeList = [roots.canvas, roots.gameRoot, roots.liveRoot];
            nodeList.forEach((node) => {
                if (!node || !cc.isValid(node)) {
                    return;
                }
                let widget = node.getComponent(cc.Widget);
                if (widget && widget.enabled) {
                    widget.updateAlignment();
                }
            });
        },

        // 桥接 cc.find("Canvas/...")，让旧逻辑仍能在宿主模式下找到子游戏节点。
        installLiveHostFindBridge(gameCanvas) {
            if (!gameCanvas || !cc.isValid(gameCanvas)) {
                return;
            }
            GlobalCfg.LIVE_HOST_GAME_CANVAS = gameCanvas;
            if (cc.find.__liveHostBridged) {
                return;
            }

            let originalFind = cc.find;
            let bridgeFind = function(path, referenceNode) {
                if (!referenceNode && typeof path === "string" && path.indexOf("Canvas/") === 0 && GlobalCfg.LIVE_HOST_GAME_CANVAS) {
                    let subPath = path.substring("Canvas/".length);
                    if (!subPath) {
                        return GlobalCfg.LIVE_HOST_GAME_CANVAS;
                    }
                    return originalFind.call(cc, subPath, GlobalCfg.LIVE_HOST_GAME_CANVAS);
                }
                return originalFind.call(cc, path, referenceNode);
            };

            bridgeFind.__liveHostBridged = true;
            bridgeFind.__originalFind = originalFind;
            cc.find = bridgeFind;
        },

        // 退出宿主模式时恢复原始 cc.find。
        uninstallLiveHostFindBridge() {
            GlobalCfg.LIVE_HOST_GAME_CANVAS = null;
            GlobalCfg.LIVE_HOST_GAME_ROOT = null;
            GlobalCfg.LIVE_HOST_LIVE_ROOT = null;
            if (cc.find && cc.find.__liveHostBridged && cc.find.__originalFind) {
                cc.find = cc.find.__originalFind;
            }
            if (window.APPManager && APPManager.clearAnchorPreviewViewport) {
                APPManager.clearAnchorPreviewViewport();
            }
        },

        // 去掉子游戏根节点上与独立场景相关的组件，避免和宿主场景冲突。
        normalizeLiveHostPrefabRoot(rootNode) {
            if (!rootNode || !cc.isValid(rootNode)) {
                throw new Error("live host prefab root invalid");
            }

            let canvasComp = rootNode.getComponent(cc.Canvas);
            if (canvasComp && canvasComp.designResolution) {
                let originalSize = cc.size(canvasComp.designResolution.width, canvasComp.designResolution.height);
                rootNode.__liveHostOriginalSize = originalSize;
                rootNode.setContentSize(originalSize);
                canvasComp.destroy();
            }
            else {
                let nodeSize = rootNode.getContentSize ? rootNode.getContentSize() : cc.size(1835, 750);
                rootNode.__liveHostOriginalSize = cc.size(nodeSize.width, nodeSize.height);
            }

            let widgetComp = rootNode.getComponent(cc.Widget);
            if (widgetComp) {
                widgetComp.destroy();
            }

            let mainCamera = rootNode.getChildByName("Main Camera");
            if (mainCamera && cc.isValid(mainCamera)) {
                mainCamera.destroy();
            }

            rootNode.setAnchorPoint(0.5, 0.5);
            return rootNode;
        },

        syncAnchorPreviewViewport(roots, gameNode) {
            if (!roots || !roots.canvas || !cc.isValid(roots.canvas) || !window.APPManager || !APPManager.updateAnchorPreviewViewport) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] skip sync: invalid roots or APPManager bridge");
                return;
            }

            this.updateHostRootAlignment(roots);
            let rect = this.getPreviewWorldRectFromLiveRoot(roots.liveRoot);
            if (!rect) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] live_root rect unavailable, fallback to canvas gap");
                rect = this.getPreviewWorldRectFromCanvasGap(roots.canvas, gameNode);
            }
            if (!rect) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] skip sync: no rect available");
                return;
            }

            let visibleSize = cc.view.getVisibleSize();
            let frameSize = cc.view.getFrameSize();
            if (!visibleSize || !frameSize || visibleSize.width <= 0 || visibleSize.height <= 0) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] skip sync: invalid visible/frame size");
                return;
            }

            let scaleX = frameSize.width / visibleSize.width;
            let scaleY = frameSize.height / visibleSize.height;
            let left = Math.round(rect.left * scaleX);
            let top = Math.round((visibleSize.height - rect.top) * scaleY);
            let viewportWidth = Math.round((rect.right - rect.left) * scaleX);
            let viewportHeight = Math.round((rect.top - rect.bottom) * scaleY);
            if (viewportWidth <= 0 || viewportHeight <= 0) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] skip sync: invalid viewport size", JSON.stringify({ left: left, top: top, width: viewportWidth, height: viewportHeight }));
                return;
            }

            cc.log("[LIVEHOST_PREVIEW_TRACE][JS] sync viewport", JSON.stringify({
                canvasWidth: roots.canvas.width,
                canvasHeight: roots.canvas.height,
                gameRootWidth: roots.gameRoot ? roots.gameRoot.width : 0,
                gameRootHeight: roots.gameRoot ? roots.gameRoot.height : 0,
                liveRootWidth: roots.liveRoot ? roots.liveRoot.width : 0,
                liveRootHeight: roots.liveRoot ? roots.liveRoot.height : 0,
                gameNodeX: gameNode ? gameNode.x : 0,
                gameNodeY: gameNode ? gameNode.y : 0,
                gameNodeScaleX: gameNode ? gameNode.scaleX : 0,
                gameNodeScaleY: gameNode ? gameNode.scaleY : 0,
                rectLeft: rect.left,
                rectRight: rect.right,
                rectTop: rect.top,
                rectBottom: rect.bottom,
                visibleWidth: visibleSize.width,
                visibleHeight: visibleSize.height,
                frameWidth: frameSize.width,
                frameHeight: frameSize.height,
                viewportLeft: left,
                viewportTop: top,
                viewportWidth: viewportWidth,
                viewportHeight: viewportHeight,
            }));
            APPManager.updateAnchorPreviewViewport({
                left: left,
                top: top,
                width: viewportWidth,
                height: viewportHeight,
            });
        },

        getPreviewWorldRectFromLiveRoot(liveRoot) {
            if (!liveRoot || !cc.isValid(liveRoot)) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] live_root invalid");
                return null;
            }

            let widget = liveRoot.getComponent && liveRoot.getComponent(cc.Widget);
            if (widget && widget.enabled) {
                widget.updateAlignment();
            }

            let width = liveRoot.width || 0;
            let height = liveRoot.height || 0;
            if (width <= 0 || height <= 0) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] live_root empty", JSON.stringify({ width: width, height: height, x: liveRoot.x, y: liveRoot.y }));
                return null;
            }

            let anchorX = typeof liveRoot.anchorX === "number" ? liveRoot.anchorX : 0.5;
            let anchorY = typeof liveRoot.anchorY === "number" ? liveRoot.anchorY : 0.5;
            let leftBottom = liveRoot.convertToWorldSpaceAR(cc.v2(-width * anchorX, -height * anchorY));
            let rightTop = liveRoot.convertToWorldSpaceAR(cc.v2(width * (1 - anchorX), height * (1 - anchorY)));
            let rect = {
                left: leftBottom.x,
                right: rightTop.x,
                top: rightTop.y,
                bottom: leftBottom.y,
            };
            cc.log("[LIVEHOST_PREVIEW_TRACE][JS] live_root rect", JSON.stringify(rect));
            return rect;
        },

        getPreviewWorldRectFromCanvasGap(canvas, gameNode) {
            if (!canvas || !cc.isValid(canvas) || !gameNode || !cc.isValid(gameNode)) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] canvas gap invalid args");
                return null;
            }

            let canvasWidth = canvas.width || 0;
            let canvasHeight = canvas.height || 0;
            if (canvasWidth <= 0 || canvasHeight <= 0) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] canvas size invalid", JSON.stringify({ width: canvasWidth, height: canvasHeight }));
                return null;
            }

            let canvasAnchorX = typeof canvas.anchorX === "number" ? canvas.anchorX : 0.5;
            let canvasAnchorY = typeof canvas.anchorY === "number" ? canvas.anchorY : 0.5;
            let canvasLeftTop = canvas.convertToWorldSpaceAR(cc.v2(-canvasWidth * canvasAnchorX, canvasHeight * (1 - canvasAnchorY)));
            let canvasRightBottom = canvas.convertToWorldSpaceAR(cc.v2(canvasWidth * (1 - canvasAnchorX), -canvasHeight * canvasAnchorY));

            let originalSize = gameNode.__liveHostOriginalSize || gameNode.getContentSize();
            if (!originalSize || !originalSize.width || !originalSize.height) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] game original size invalid");
                return null;
            }

            let gameAnchorX = typeof gameNode.anchorX === "number" ? gameNode.anchorX : 0.5;
            let gameAnchorY = typeof gameNode.anchorY === "number" ? gameNode.anchorY : 0.5;
            let gameTopLeft = gameNode.convertToWorldSpaceAR(cc.v2(
                -originalSize.width * gameAnchorX,
                originalSize.height * (1 - gameAnchorY)
            ));

            let top = canvasLeftTop.y;
            let bottom = gameTopLeft.y;
            if (top <= bottom) {
                cc.log("[LIVEHOST_PREVIEW_TRACE][JS] canvas gap invalid rect", JSON.stringify({
                    canvasTop: top,
                    gameTop: bottom,
                    gameNodeX: gameNode.x,
                    gameNodeY: gameNode.y,
                    gameScaleX: gameNode.scaleX,
                    gameScaleY: gameNode.scaleY,
                }));
                return null;
            }

            let rect = {
                left: canvasLeftTop.x,
                right: canvasRightBottom.x,
                top: top,
                bottom: bottom,
            };
            cc.log("[LIVEHOST_PREVIEW_TRACE][JS] canvas gap rect", JSON.stringify({
                rect: rect,
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                gameOriginalWidth: originalSize.width,
                gameOriginalHeight: originalSize.height,
                gameNodeX: gameNode.x,
                gameNodeY: gameNode.y,
                gameScaleX: gameNode.scaleX,
                gameScaleY: gameNode.scaleY,
            }));
            return rect;
        },
    },
});

module.exports = LiveHostAdapter;
