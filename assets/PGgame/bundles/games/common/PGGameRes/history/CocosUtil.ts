import { tcLog } from "../../../../../script/framework/log/log";
import { BlockComp } from "./BlockComp";
import { isNil } from "./Globals";

const { ccclass, property } = cc._decorator;


@ccclass
export default class CocosUtil {

    public static initComponent<T extends cc.Component>(node: cc.Node, comp: { new(): T }): T {
        if (node.getComponent(comp)) {
            return node.getComponent(comp);
        }
        return node.addComponent(comp);
    }

    static wait(time) {
        return new Promise((res) => {
            setTimeout(() => {
                res(null);
            }, time * 1000);
        });
    }

    //遍历root节点，将挂在它身上的所有子层次节点根据名字索引到tbl表中
    public static traverseNodes(root: cc.Node, tbl: { [key: string]: cc.Node }) {
        if (!root || !root.children) {
            return;
        }
        var childlist = root.children;
        for (var i = 0; i < childlist.length; i++) {
            tbl[childlist[i].name] = childlist[i];
            CocosUtil.traverseNodes(childlist[i], tbl);
        }
    }

    public static traverseLabels(root: cc.Node, tbl: { [key: string]: cc.Label }) {
        if (!root) {
            return;
        }
        var comps = root.getComponentsInChildren(cc.Label);
        for (var i in comps) {
            tbl[comps[i].node.name] = comps[i];
        }
    }

    public static findNode(root: cc.Node, name: string): cc.Node {
        if (!root) {
            return null;
        }
        if (root.name == name) {
            return root;
        }
        var childlist = root.children;
        for (var i = childlist.length - 1; i >= 0; i--) {
            let nd = CocosUtil.findNode(childlist[i], name);
            if (nd) {
                return nd;
            }
        }
        return null;
    }

    //-------------------------------------------------------------------------------

    //将obj节点设置为模态对话框
    public static setModal(obj: cc.Node, bCloseWhenClickMask: boolean) {
        if (obj.getComponent(cc.BlockInputEvents)) { return; }
        CocosUtil.initComponent(obj, BlockComp).closeWhenClick = bCloseWhenClickMask;
    }



    private static tmr_click = 0;
    private static mark_click() { this.tmr_click = 0; }

    //点击事件
    public static addClickEvent(target: cc.Node, callback: Function, thisObj?: any, arg?: any, zoomScale: number = 1.02, closeClickControl = false) {
        if (isNil(target)) {
            console.warn("fail addClickEvent as target is nil");
            return;
        }
        let clickState = 0;
        let mark_click = () => {
            clickState = 0;
        }

        let btn = target.getComponent(cc.Button);
        if (!btn) {
            btn = target.addComponent(cc.Button);
            btn.transition = cc.Button.Transition.SCALE;
            btn.duration = 0.06;
            btn.zoomScale = zoomScale;
        } else {
            if (btn.transition == cc.Button.Transition.SCALE) {
                btn.zoomScale = zoomScale;
                btn.duration = 0.06;
            }
        }

        var cb = function () {
            if (!closeClickControl && clickState > 0) {
                tcLog.log("频繁点击", clickState);
                return;
            }
            setTimeout(() => {
                mark_click()
            }, 300);

            if (!btn.interactable) {
                return
            }
            if (arg !== null && arg !== undefined) {
                callback.call(thisObj, arg);
            } else {
                callback.call(thisObj);
            }
        }
        target.off(cc.Node.EventType.TOUCH_END, cb, thisObj);
        target.on(cc.Node.EventType.TOUCH_END, cb, thisObj);
    }

    //移除节点上到点击事件
    public static delClickEvent(target: cc.Node, callback: Function, thisObj?: any) {
        target.off(cc.Node.EventType.TOUCH_END, callback, thisObj);
    }

    //坐标空间转换（原点为锚点）
    //返回srcObj在dstObj坐标空间的位置
    public static convertSpaceAR(srcObj: cc.Node, dstObj: cc.Node, x: number = 0, y: number = 0): cc.Vec3 {
        var pt = srcObj.convertToWorldSpaceAR(cc.v3(x, y));
        return dstObj.convertToNodeSpaceAR(pt);
    }
}
