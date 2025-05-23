// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { config, gameHelper } from "../../../../../script/config/config";
import { AudioClipName, uAudio } from "../../../../../script/framework/audio/audio";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
import { UIDateSelect } from "../history/UIDateSelect";
import { UIselectdate } from "../history/UIselectdate";
import { gameLoadingDialog } from "../../gameCommon/script/game-loading";
import { pgGameEvent } from "./PgEvent";
import { SharedRecordCustomDate } from "../history/shared_record_custom_date";
// import { gameLoadingDialog } from "../../../gameCommon/script/game-loading";

/**
 * PG  slot游戏规则弹框
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PgGameHistoryView extends cc.Component {
    private btnClose: cc.Node | undefined;
    private nodeRuleContentParent: cc.Node | undefined;
    private label: cc.Label | undefined;
    // private scrollbar: cc.Node | undefined;
    // private scrollView: cc.ScrollView | undefined;
    // private clickBtnSound: string = AudioClipName.CLICKBTN;

    onLoad(): void {
        this.btnClose = cc.find("aniRoot/btn_close", this.node);
        this.btnClose.addComponent(cc.Button)
        // this.nodeRuleContentParent = cc.find("body/content/view/content", this.node);
        // this.label = cc.find("body/title/label", this.node).getComponent(cc.Label);
        // this.scrollbar = cc.find("body/content/scrollBar", this.node);
        // this.scrollView = cc.find("body/content", this.node).getComponent(cc.ScrollView);
        this.btnClose.on("click", () => {
            // uAudio.getInstance().playEffect(this.clickBtnSound);
            this.node.active = false;
        });
        cc.systemEvent.on(pgGameEvent.open_history_view, this.show, this);
        cc.systemEvent.on(pgGameEvent.close_history_view, this.onCloseHistoryView, this);

        cc.systemEvent.on(pgGameEvent.open_his_selectdate_view, this.onOpenSelectDateView, this);
        cc.systemEvent.on(pgGameEvent.close_his_selectdate_view, this.onCloseSelectDateView, this);
        cc.systemEvent.on(pgGameEvent.open_his_dateSelect_view, this.onOpenDateSelectView, this);
        cc.systemEvent.on(pgGameEvent.close_his_dateSelect_view, this.onCloseDateSelectView, this);
    }
    public onCloseHistoryView() {
        this.node.active = false;
    }


    public async addContent(gameId: number, title: string, ruleNodeUrl?: string, clickBtnSound: string = AudioClipName.CLICKBTN) {
        // this.clickBtnSound = clickBtnSound;
        // this.initScrollBar();
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
    public show() {
        this.node.active = true;
    }

    private nodeSelectdate: UIselectdate
    public async onOpenSelectDateView() {
        if (!this.nodeSelectdate) {
            try {
                gameLoadingDialog.show({ duration: 20 });
                let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/history/UIselectdate");
                let viewNode = cc.instantiate(node);
                viewNode.setParent(config.uiNode.dialog);
                this.nodeSelectdate = viewNode.getComponent(UIselectdate);
                // this.nodeSelectdate.start()
                gameLoadingDialog.close();
            } catch (err) {
                tcLog.error(`PgGameControlPanellogic show onClickBtnHistory error,${err}`);
            }
        }
        this.nodeSelectdate?.show();
    }
    public onCloseSelectDateView() {
        this.nodeSelectdate.node.active = false
    }
    private nodeDateselect: UIDateSelect
    public async onOpenDateSelectView() {
        // if (this.nodeDateselect) {
        //     this.nodeDateselect.removeAllChildren()
        // }
        // if (!this.nodeDateselect) {
        try {
            gameLoadingDialog.show({ duration: 20 });
            let node = await tcRes.load("PGGameRes", cc.Prefab, "prefab/history/UIDateSelect");
            let viewNode = cc.instantiate(node);
            viewNode.setParent(config.uiNode.dialog);
            this.nodeDateselect = viewNode.getComponent(UIDateSelect);
            this.nodeDateselect?.show();
            gameLoadingDialog.close();
        } catch (err) {
            tcLog.error(`PgGameControlPanellogic show onClickBtnHistory error,${err}`);
        }
        // }
    }


    public onCloseDateSelectView() {
        // this.nodeDateselect.node.active = false

        // let _haredRecordCustomDate = this.nodeDateselect.node.getComponent(SharedRecordCustomDate)
        // this.node.destroy();

        this.nodeDateselect.node.destroy();

    }

}
