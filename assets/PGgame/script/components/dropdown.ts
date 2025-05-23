// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { throttle } from "../descriptor/descriptor";
import { AudioClipName, uAudio } from "../framework/audio/audio";

const { ccclass, property } = cc._decorator;

@ccclass
export class Dropdown extends cc.Component {
    private labelTip: cc.Label | undefined;
    private nodeArrow: cc.Node | undefined;
    private nodeContent: cc.Node | undefined;
    private btnArrow: cc.Node | undefined;
    private itemTemple: cc.Node | undefined;
    // LIFE-CYCLE CALLBACKS:

    private selectCallback: Function | undefined;
    private itemDatas: string[] = [];
    private selecttedIndex: number = -1; //当前选中的序号
    private inittedList: boolean = false;
    private needChangeParent: boolean = false;
    private newParent: cc.Node | undefined;
    private v2ContentPos: cc.Vec2 = cc.Vec2.ZERO;

    onLoad() {
        this.labelTip = cc.find("labelTip", this.node).getComponent(cc.Label);
        this.btnArrow = cc.find("btnArrow", this.node);
        this.nodeArrow = cc.find("arrow", this.node);
        this.nodeContent = cc.find("content", this.node);
        this.itemTemple = cc.find("content/view/content/item", this.node);

        this.v2ContentPos = this.nodeContent.getPosition();
    }

    protected start(): void {
        this.btnArrow?.on(
            "click",
            () => {
                uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
                this.updateContentStatus(!this.nodeContent?.active);
            },
            this
        );
    }

    initView(items: string[], selectIndex: number = 0, callback?: Function) {
        this.itemDatas = items;
        this.selectCallback = callback;
        this.createList();
        this.select(selectIndex);
    }

    public setParentNode(need: boolean, ndParent: cc.Node) {
        this.needChangeParent = need;
        this.newParent = ndParent;
    }

    createList() {
        if (this.inittedList || !this.itemDatas) {
            return;
        }
        this.inittedList = true;
        for (let i = 0; i < this.itemDatas.length; ++i) {
            let itemNode = cc.instantiate(this.itemTemple);
            if (!itemNode) {
                continue;
            }
            this.itemTemple?.parent.addChild(itemNode);
            itemNode.active = true;
            itemNode.name = "item" + i;
            itemNode.getComponentInChildren(cc.Label).string = this.itemDatas[i];
            itemNode.on(
                "click",
                () => {
                    uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
                    this.select(i);
                },
                this
            );
        }
    }

    @throttle(1000)
    select(index: number) {
        if (this.selecttedIndex === index) {
            return;
        }

        this.selecttedIndex = index;
        this.labelTip && (this.labelTip.string = this.itemDatas[index] || "");
        this.updateContentStatus(false);
        this.selectCallback && this.selectCallback(index);
    }

    public setSelectNoEmit(index: number) {
        this.selecttedIndex = index;
        this.labelTip && (this.labelTip.string = this.itemDatas[index] || "");
        this.updateContentStatus(false);
    }

    showSelectStatus() {
        if (!this.itemDatas) {
            return;
        }
        this.itemDatas.forEach((info, idx) => {
            const item = this.itemTemple?.parent.getChildByName("item" + idx);
            if (item) {
                item.getChildByName("sprite").active = this.selecttedIndex == idx;
            }
        });
    }

    updateContentStatus(show: boolean) {
        if (show) {
            if (this.needChangeParent) {
                this.newParent && this.nodeContent?.setParent(this.newParent);
                const x1 = this.node.convertToWorldSpaceAR(this.v2ContentPos);
                const x2 = this.newParent?.convertToNodeSpaceAR(x1) ?? cc.Vec2.ZERO;
                this.nodeContent?.setPosition(x2);
            }
        } else {
            if (this.needChangeParent) {
                this.nodeContent?.setParent(this.node);
                this.nodeContent?.setPosition(this.v2ContentPos);
            }
        }
        this.nodeContent && (this.nodeContent.active = show);
        this.nodeArrow && (this.nodeArrow.angle = show ? 180 : 0);
        this.showSelectStatus();
    }

    getCurIndex() {
        return this.selecttedIndex;
    }

    // update (dt) {}
}
