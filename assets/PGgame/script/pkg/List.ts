// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

class ItemNodeData {
    node: cc.Node | undefined;
    index: number = 0;

    constructor(itemNode: cc.Node, itemIndex: number) {
        this.node = itemNode;
        this.index = itemIndex;
    }
    public setParent(parent: cc.Node) {
        this.node?.setParent(parent);
    }
    public setPosition(x: number, y: number) {
        this.node?.setPosition(x, y);
    }

    public reset() {
        this.node?.removeFromParent();
        this.index = -1;
    }
}

/**
 * 纵向：view和content的y轴锚点设为1
 * 横向：view和content的x锚点设为0
 * content不能添加layout
 */
@ccclass
export default class List extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView | undefined = undefined;
    @property(cc.Node)
    view: cc.Node | undefined = undefined;
    @property(cc.Node)
    itemPrefab: cc.Node | undefined = undefined;
    @property(cc.Node)
    content: cc.Node | undefined = undefined;
    @property(cc.Float)
    spaceValue: number = 0; //间隔

    itemSize: cc.Size = cc.Size.ZERO;
    itemWidth: number = 0;
    maxItemCount: number = 0;
    curItemStartIndex: number = 0; //当前渲染起点
    curItemEndIndex: number = 0; //当前可渲染终点
    viewSize: cc.Size = cc.Size.ZERO; //可见区域高度

    curScrollViewPos: cc.Vec2 = cc.Vec2.ZERO;

    fristVisibleIndex: number = 0; //当前第一个可见项序号
    totalCount: number = 0; //当前总在数量
    startPosY: number = 0;
    startPosX: number = 0; //

    itemPool: cc.NodePool | undefined;
    showItems: ItemNodeData[] = [];

    contentSize: cc.Size = cc.Size.ZERO;
    contentHeight: number = 0;

    _itemDatas: ItemNodeData[] = [];
    private _itemRender: Function | undefined;
    public set ItemRander(value: Function) {
        this._itemRender = value;
    }

    public set Items(count: number) {
        for (let i = 0; i < count; ++i) {
            this.add(1);
        }
    }

    onLoad() {
        if (this.scrollView) {
            this.scrollView.node.on("scrolling", this.onScrolling, this);
        }

        this.reset();
    }

    onScrolling() {
        if (!this.scrollView) {
            return;
        }
        this.curScrollViewPos = this.scrollView?.getContentPosition()!;
        if (this.scrollView.vertical && (this.curScrollViewPos.y <= 0 || this.curScrollViewPos.y > this.contentSize.height - this.viewSize.height)) {
            return;
        } else if (this.scrollView.horizontal && (this.curScrollViewPos.x >= 0 || this.curScrollViewPos.x < -(this.contentSize.width - this.viewSize.width))) {
            return;
        }

        if (this.scrollView.vertical) {
            this.fristVisibleIndex = Math.floor(this.curScrollViewPos.y / (this.itemSize.height + this.spaceValue));
        } else if (this.scrollView.horizontal) {
            this.fristVisibleIndex = Math.floor(-this.curScrollViewPos.x / (this.itemSize.width + this.spaceValue));
        }
        if (this.fristVisibleIndex != this.curItemStartIndex) {
            this.curItemStartIndex = this.fristVisibleIndex;
            this.curItemEndIndex = this.curItemStartIndex + this.maxItemCount - 1;
            for (let i = this.showItems.length - 1; i >= 0; --i) {
                let itemData = this.showItems[i];
                if (itemData.index < this.curItemStartIndex - 1 || itemData.index > this.curItemEndIndex) {
                    let unActiveItem = this.showItems.splice(i, 1);
                    if (unActiveItem[0]) {
                        unActiveItem[0]?.reset();
                        this._itemDatas.push(unActiveItem[0]);
                    }
                }
            }

            for (let i = 0; i < this.maxItemCount; ++i) {
                let itemIndex = this.curItemStartIndex + i;
                if (itemIndex >= this.totalCount) {
                    break;
                }
                let index = this.showItems.findIndex((ele) => {
                    return ele.index == itemIndex;
                });
                if (index == -1) {
                    //需要新增
                    this.renderNewItem(itemIndex);
                }
            }
        }
    }

    reset(): void {
        this.curItemStartIndex = 0;
        this.curItemEndIndex = 0;
        this.totalCount = 0;
        this.curScrollViewPos = cc.Vec2.ZERO;
        this.itemSize = this.itemPrefab?.getContentSize() || cc.Size.ZERO;
        this.startPosY = -this.itemSize.height / 2;
        this.startPosX = this.itemSize.width / 2;

        this.viewSize = this.view?.getContentSize() || cc.Size.ZERO;
        this.showItems.forEach((itemNode) => {
            itemNode.reset();
            this._itemDatas!.push(itemNode);
        });
        this.showItems = [];
        this.content!.setContentSize(this.itemPrefab?.getContentSize()!);

        this.maxItemCount = this.scrollView?.vertical
            ? Math.ceil(this.view!.getContentSize().height / this.itemSize.height) + 3
            : Math.ceil(this.view!.getContentSize().width / this.itemSize.width) + 3;
    }

    add(count: number) {
        if (this.scrollView?.vertical) {
            this.curItemStartIndex = Math.floor(this.curScrollViewPos.y / (this.itemSize.height + this.spaceValue));
        } else {
            this.curItemStartIndex = Math.floor(this.curScrollViewPos.x / (this.itemSize.width + this.spaceValue));
        }

        this.curItemEndIndex = this.curItemStartIndex + this.maxItemCount;

        for (let i = 0; i < count; ++i) {
            let itemIndex = this.totalCount + i;
            if (this.scrollView?.vertical) {
                this.content!.setContentSize(this.content!.getContentSize().width, (itemIndex + 1) * this.itemSize.height + itemIndex * this.spaceValue);
            } else {
                this.content!.setContentSize((itemIndex + 1) * this.itemSize.width + itemIndex * this.spaceValue, this.content!.getContentSize().height);
            }
            if (itemIndex >= this.curItemStartIndex && itemIndex <= this.curItemEndIndex) {
                this.renderNewItem(itemIndex);
            }
        }
        this.totalCount += count;
        this.contentSize = this.content?.getContentSize() || cc.Size.ZERO;
    }

    renderNewItem(itemIndex: number) {
        let itemData = this.getItem(itemIndex);
        if (this.scrollView?.vertical) {
            itemData?.setPosition(0, this.startPosY - itemIndex * (this.itemSize.height + this.spaceValue));
        } else {
            itemData?.setPosition(this.startPosX + itemIndex * (this.itemSize.width + this.spaceValue), 0);
        }
        itemData?.setParent(this.content!);
        this.renderItem?.(itemData);
        this.showItems.push(itemData!);
    }

    getItem(itemIndex: number) {
        let itemData = this._itemDatas!.pop();
        if (!itemData && this.itemPrefab) {
            let itemNode = cc.instantiate(this.itemPrefab);
            itemNode.active = true;
            itemData = new ItemNodeData(itemNode, itemIndex);
        }
        itemData!.index = itemIndex;
        return itemData;
    }

    renderItem(itemData?: ItemNodeData) {
        if (this._itemRender && itemData) {
            this._itemRender(itemData.node, itemData.index);
        }
    }

    // update (dt) {}
}
