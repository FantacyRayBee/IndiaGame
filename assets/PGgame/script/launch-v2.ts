// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import logger from "../ApiTemplate/script/net/logger";
import { env } from "./app/env";
import { LogLevel, config } from "./config/config";
import { tcI18n } from "./framework/i18n/i18n";
import { tcLog } from "./framework/log/log";
import { tcRes } from "./framework/res/res";
import { tcStorage } from "./framework/storage/storage";
import { AdapterV2 } from "./pkg/adapter-v2";
import FacebookHandler from "./sdk/facebook";
import GameViewHandler from "./sdk/gameview";
// import GoogleHandler from "./sdk/google";
import NativeFileHandler from "./sdk/native-file";

const { ccclass, property } = cc._decorator;

@ccclass
export class LaunchV2 extends cc.Component {
    private adapter: AdapterV2 | undefined;

    protected onLoad(): void {
        this.adapter = this.node.getComponent(AdapterV2);
    }

    protected async start() {
        this.adapter?.updateAlignment();
        const screenNode = cc.find("screen", this.node);
        const bgNode = cc.find("bg", this.node);

        const sceneNode = this.createNode("scene", screenNode);
        const fixedNode = this.createNode("fixed", screenNode);
        const dialogNode = this.createNode("dialog", screenNode);
        const tipsNode = this.createNode("tips", screenNode);
        const loadingNode = this.createNode("loading", screenNode);

        config.uiNode.bg = bgNode;
        config.uiNode.scene = sceneNode;
        config.uiNode.fixed = fixedNode;
        config.uiNode.dialog = dialogNode;
        config.uiNode.tips = tipsNode;
        config.uiNode.loading = loadingNode;

        // 设置语言
        const params = new URL(window.location.href).searchParams;

        // 设置日志等级
        // if (window.location.hostname == 'localhost' || params.get("log") == 'true') {
        //     config.logLevel = LogLevel.Debug;
        //     logger.logLevel = LogLevel.Debug;
        // } else {
        //     config.logLevel = LogLevel.Error;
        //     logger.logLevel = LogLevel.Error;
        // }
        config.logLevel = LogLevel.Debug;
        logger.logLevel = LogLevel.Debug;
        tcLog.setLevel(LogLevel.Debug);

        console.log("ver:     0605-1629     ", config.logLevel, logger.logLevel)

        const language = params.get("lang")?.toLocaleLowerCase() ?? "en";
        console.log("caojun language = ", language)
        if (tcI18n.isOfType(language)) {
            env.application.language = language;
        } else {
            env.application.language = tcI18n.defaultLanguage;
        }
        await tcI18n.switchLanguage(env.application.language as tcI18n.Language);

        document.title = tcI18n.i18nLabel("h5_name");

        // 增加 Facebook，Google 回调组件
        this.node.addComponent(FacebookHandler);
        // this.node.addComponent(GoogleHandler);
        this.node.addComponent(GameViewHandler);
        this.node.addComponent(NativeFileHandler);

        tcRes
            .load("update-v2", cc.Prefab, "prefab/update")
            .then((asset) => {
                const item = cc.instantiate(asset);
                item.setParent(config.uiNode.scene);
                item.setPosition(0, 0);
            })
            .catch((err) => {
                tcLog.error(`load table prefab: ${JSON.stringify(err)}`);
            });
    }

    private createNode(name: string, parent: cc.Node): cc.Node {
        const item = new cc.Node(name);
        item.setParent(parent);
        item.setPosition(0, 0);
        item.setAnchorPoint(0.5, 0.5);

        const widget = item.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.top = 0;
        widget.isAlignBottom = true;
        widget.bottom = 0;
        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;
        widget.updateAlignment();

        return item;
    }
}
