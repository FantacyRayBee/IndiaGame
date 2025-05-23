// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { gameHelper } from "../../../../../script/config/config";
import { AudioClipName, uAudio } from "../../../../../script/framework/audio/audio";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
import { gameLoadingDialog } from "../../gameCommon/script/game-loading";
// import { gameLoadingDialog } from "../../../gameCommon/script/game-loading";

/**
 * PG  slot游戏规则弹框
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PgGameRuleView extends cc.Component {
    private btnClose: cc.Node | undefined;
    private nodeRuleContentParent: cc.Node | undefined;
    private label: cc.Label | undefined;
    private scrollbar: cc.Node | undefined;
    private scrollView: cc.ScrollView | undefined;
    private clickBtnSound: string = AudioClipName.CLICKBTN;

    onLoad(): void {
        this.btnClose = cc.find("body/title/btnClose", this.node);
        this.nodeRuleContentParent = cc.find("body/content/view/content", this.node);
        this.label = cc.find("body/title/label", this.node).getComponent(cc.Label);
        this.scrollbar = cc.find("body/content/scrollBar", this.node);
        this.scrollView = cc.find("body/content", this.node).getComponent(cc.ScrollView);
        this.btnClose.on("click", () => {
            uAudio.getInstance().playEffect(this.clickBtnSound);
            this.node.active = false;
        });
    }

    public async addContent(gameId: number, title: string, ruleNodeUrl?: string, clickBtnSound: string = AudioClipName.CLICKBTN) {
        this.clickBtnSound = clickBtnSound;
        this.initScrollBar();
        this.label && (this.label.string = title);
        if (!ruleNodeUrl || !this.nodeRuleContentParent) {
            return;
        }
        try {
            let bundleName = gameHelper.getBundleName(gameId);
            if (!bundleName) {
                tcLog.error("pgGameRuleView get bundlename null");
                return;
            }
            gameLoadingDialog.show({ duration: 20 });
            let ruleNode = await tcRes.load(bundleName, cc.Prefab, ruleNodeUrl);
            this.nodeRuleContentParent?.addChild(cc.instantiate(ruleNode!));
            gameLoadingDialog.close();
        } catch (err: any) {
            tcLog.error(`PgGameRuleView.error,${err}`);
        }
    }

    private initScrollBar() {
        //node 滚动条节点，监听scrollbar节点的触摸移动事件
        //scrollView 滚动节点，设置滚动位置
        this.scrollbar?.on(
            "touchmove",
            (event: any) => {
                //获取一下当前的滚动视图的可滚动的最大偏移量
                let maxScrollOffset = this.scrollView!.getMaxScrollOffset();
                //>0表示可进行滚动
                //isVertical 滚动的方向（是否是垂直滚动）
                //Offset 滚动条的相对位置，如果是全屏的滚动视图则不需要这个参数
                if (maxScrollOffset.y > 0) {
                    let delta = event.getLocationY() + 100;
                    //计算比例，根据鼠标移动的距离计算出需要滚动的百分比
                    let p = delta / this.node.height;
                    //设置百分比
                    this.scrollView!.scrollTo(cc.v2(0, p));
                }
            },
            this
        );
    }

    public show() {
        this.node.active = true;
    }
}
