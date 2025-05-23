import { tcLog } from "../../../../../../script/framework/log/log";
import { NodeEx } from "./NodeEx";
import { SharedRecordDateItem } from "./shared_record_date_item";

const { ccclass, property } = cc._decorator;

// 选择日期

@ccclass
export class SharedRecordCustomSelectList extends cc.Component {
    @property({ type: cc.Node })
    ndContent: cc.Node;

    @property({ type: cc.Layout })
    content: cc.Layout; // 列表

    @property({ type: cc.Scrollbar })
    scrollBar: cc.Scrollbar; // 滚动条

    @property({ type: cc.ScrollView })
    svContent: cc.ScrollView;

    @property({ type: cc.Prefab })
    recordDateItem: cc.Prefab

    private szData: number[];
    private selectData: number = null;
    private maxSize: cc.Size; // 最大原始范围
    private target: cc.Node
    private closeCallback: (data: number) => void;

    protected onLoad(): void {
        tcLog.log("SelectList onLoad:");
    }

    mystart() {
        // this.test()
        tcLog.log("SelectList start:");


        let uiTransform = this.ndContent
        this.maxSize = new cc.Size(uiTransform.width, 330)     //uiTransform.getContentSize().clone();

        this.scrollBar.node.on(cc.Node.EventType.TOUCH_MOVE, (ev: cc.Event.EventTouch) => {
            let local = ev.getLocation();
            let p = this.scrollBar.node.convertToNodeSpaceAR(cc.v3(local.x, local.y, 0));
            let bar = this.scrollBar.node.getChildByName("bar");
            let size = bar.getContentSize();
            let sSize = this.scrollBar.node.getContentSize();
            if (-p.y > sSize.height - size.height / 2) {
                p.y = -sSize.height + size.height / 2;
            } else if (-p.y < size.height / 2) {
                p.y = -size.height / 2;
            }
            let bl = (-p.y - size.height / 2) / (sSize.height - size.height);
            this.svContent.scrollTo(cc.v2(0, 1 - bl));
        })
    }

    protected onDestroy(): void {
        if (this.closeCallback) {
            this.closeCallback(this.selectData);
        }
    }

    getTarget() { return this.target; }
    getSelectData() { return this.selectData; }

    setData(szData: number[], currentData: number) {
        this.szData = szData;
        this.selectData = currentData;
        this.reflush();
    }

    setCallback(cb: (data: number) => void) {
        this.closeCallback = cb;
    }

    setPosition(worldPos: cc.Vec3) {
        this.ndContent.position = NodeEx.getLocalPosition(this.node, worldPos);
    }
    setTarget(target: cc.Node) { this.target = target; }

    destroySelf() {
        this.node.destroy()
    }

    private reflush() {
        this.content.node.removeAllChildren();

        let selectRecordDateItem: SharedRecordDateItem = null;
        for (let i = 0, len = this.szData.length; i < len; i++) {
            let dateItem = cc.instantiate(this.recordDateItem)
            dateItem.parent = this.content.node;

            let recordDateItem = dateItem.getComponent(SharedRecordDateItem);
            recordDateItem.setString(`${this.szData[i]}`);
            recordDateItem.setCallback(this.onClickDateItem.bind(this, this.szData[i]));

            if (this.selectData == this.szData[i]) {
                selectRecordDateItem = recordDateItem;
            }
        }

        this.content.updateLayout();

        // 显示内容太少，更新显示范围
        let uiTransform = this.ndContent
        let contentUiTransform = this.content
        let height = Math.min(contentUiTransform.node.height, this.maxSize.height)
        uiTransform.height = height;

        this.scrollBar.node.active = contentUiTransform.node.height > this.maxSize.height;

        this.content.getComponent(cc.Widget).updateAlignment();

        if (!this.scrollBar.node.active) {
            return
        }

        // 跳转到选中的位置
        if (selectRecordDateItem != null) {
            this.scheduleOnce(() => { this.scrollTo(selectRecordDateItem.node); }, 0)
        }
    }

    private scrollTo(node: cc.Node) {
        let uiTransform = node
        let worldPos = uiTransform.convertToWorldSpaceAR(new cc.Vec3(0, -0.5 * uiTransform.height));

        let contentUiTransform = this.content;
        let localPos = contentUiTransform.node.convertToNodeSpaceAR(worldPos);
        let viewY = -1 * this.maxSize.height;
        if (0 >= localPos.y && localPos.y >= viewY) { // 在视野范围内
            return
        }

        let offsetY = viewY - localPos.y;
        this.svContent.scrollToOffset(new cc.Vec2(0, offsetY))
    }

    private onClickDateItem(data: number) {
        this.selectData = data;
        // tcLog.log(data)
        this.destroySelf();
    }

    // private test(){
    //     this.setData([
    //         2001, 2002,
    //          2003, 
    //         2004, 2005
    //     ], 2003)
    // }
}


