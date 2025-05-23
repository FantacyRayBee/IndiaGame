
const { ccclass, property } = cc._decorator;

@ccclass
export class NodeEx {
    static addClick(node: cc.Node, callback: (Function)) {
        // let btn = node.addComponent(Button);
        // btn.target = node
        node.on(cc.Node.EventType.TOUCH_START, () => { ((node) as any)._pressed = true; }, node);

        node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            let _pressed = ((node) as any)._pressed;
            ((node) as any)._pressed = false;
            if (_pressed) {
                let startPoint = event.touch.getStartLocation()
                let endPoint = event.touch.getLocation()
                if (Math.abs(endPoint.x - startPoint.x) + Math.abs(endPoint.y - startPoint.y) < 10) {
                    if (callback) {
                        callback(event)
                    }
                }
            }
        }, node);

        node.on(cc.Node.EventType.TOUCH_CANCEL, () => { ((node) as any)._pressed = false; }, node);
    }

    static getWorldPosition(node: cc.Node, localPosition?: cc.Vec3) {
        let uiTransform = node
        if (localPosition) {
            return uiTransform.convertToWorldSpaceAR(localPosition);
        }
        return uiTransform.convertToWorldSpaceAR(cc.Vec3.ZERO);
    }

    static getLocalPosition(target: cc.Node, worldPosition: cc.Vec3) {
        let uiTransform = target
        return uiTransform.convertToNodeSpaceAR(worldPosition)
    }

    static getSize(node: cc.Node) {
        let uiTransform = node
        return uiTransform.getContentSize().clone();
    }

    static setSize(node: cc.Node, width: number, height: number) {
        let uiTransform = node
        if (width == null) {
            uiTransform.height = height;
            return
        }

        if (height == null) {
            uiTransform.width = width;
            return
        }

        uiTransform.setContentSize(width, height);
    }

    static getAnchorPoint(node: cc.Node) {
        let uiTransform = node
        return uiTransform.getContentSize().clone()
    }

    static setPosition(node: cc.Node, x: number, y: number) {
        let pos = node.position;
        if (x == null) {
            node.position = new cc.Vec3(pos.x, y, pos.z);
            return;
        }
        if (y == null) {
            node.position = new cc.Vec3(x, pos.y, pos.z);
            return;
        }

        node.position = new cc.Vec3(x, y, pos.z);
    }

    static setOpacity(node: cc.Node, opacity: number) {
        let uiTransform = node
        let oldColor = uiTransform.color;
        uiTransform.color = new cc.Color(oldColor.r, oldColor.g, oldColor.b, opacity);
    }

    // 递归更新颜色
    static recursionColor(nd: cc.Node, color: cc.Color) {
        if (nd.children.length == 0) {
            return;
        }

        let uiRander: cc.Node = null;
        nd.children.forEach((child: cc.Node) => {
            uiRander = child
            if (uiRander != null) {
                if (uiRander["__default_color"]) {
                    uiRander.color = color;
                    this.recursionColor(child, color);
                    return
                }

                if (!uiRander["__first_change"]) {
                    let isWhite = uiRander.color.equals(cc.Color.WHITE);
                    uiRander["__default_color"] = isWhite;
                    if (!isWhite) {
                        uiRander["__original_color"] = uiRander.color.clone();
                    }
                    uiRander["__first_change"] = true;

                    if (uiRander["__default_color"]) {
                        uiRander.color = color;
                        this.recursionColor(child, color);
                        return
                    }
                }

                let original = uiRander["__original_color"] as cc.Color;
                let r = color.r / 255 * original.r;
                let g = color.g / 255 * original.g;
                let b = color.b / 255 * original.b;
                let a = color.a / 255 * original.a;

                uiRander.color = new cc.Color(r, g, b, a);
            }
            this.recursionColor(child, color);
        })
    }

    static setColor(nd: cc.Node, color: cc.Color) {
        let uiRander = nd
        if (!uiRander) {
            return
        }
        uiRander.color = color;
    }
}


