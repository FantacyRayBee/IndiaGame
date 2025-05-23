export namespace creatorUtils {
    export function setActive(target: cc.Component | cc.Node | undefined | null, active: boolean) {
        if (!target) {
            return;
        }

        if (!target.isValid) {
            return;
        }

        if (target instanceof cc.Component) {
            if (target.node.active !== active) {
                target.node.active = active;
            }
        } else if (target instanceof cc.Node) {
            if (target.active !== active) {
                target.active = active;
            }
        }
    }

    export function setButtonInteractable(target: cc.Button, interactable: boolean) {
        if (!target.isValid) {
            return;
        }

        if (target.interactable === interactable) {
            return;
        }

        target.interactable = interactable;
    }

    //置灰
    export function setNodeGray(node?: cc.Node, bGray: boolean = false) {
        let sprites = node?.getComponentsInChildren(cc.Sprite);
        if (!sprites || sprites.length == 0) {
            return;
        }
        let material: cc.Material;
        sprites.forEach((sprite) => {
            if (bGray) {
                material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
            } else {
                material = cc.Material.getBuiltinMaterial("2d-sprite");
            }
            sprite.setMaterial(0, material);
        });
    }

    /**
     * 弹窗动画
     * @param node
     */
    export function moveIn(node?: cc.Node, onCompleteCallback?: Function) {
        if (!node) {
            return;
        }
        node.setScale(0);
        cc.tween(node)
            .to(
                0.3,
                { scale: 1 },
                {
                    easing: "quintOut",
                }
            )
            .call(() => {
                onCompleteCallback && onCompleteCallback();
            })
            .start();
    }

    export function moveOut(node?: cc.Node, onCompleteCallback?: Function) {
        if (!node) {
            return;
        }
        cc.tween(node)
            .to(0.3, { scale: 0 })
            .call(() => {
                onCompleteCallback && onCompleteCallback();
            })
            .start();
    }

    export function moveOpacityIn(node?: cc.Node, onCompleteCallback?: Function) {
        if (!node) {
            return;
        }
        node.setScale(1);
        cc.tween(node)
            .set({ opacity: 0 })
            .to(
                0.3,
                { opacity: 255 },
                {
                    easing: "quintOut",
                }
            )
            .call(() => {
                onCompleteCallback && onCompleteCallback();
            })
            .start();
    }

    export function moveSpin(node?: cc.Node) {
        if (!node) {
            return;
        }
        node.angle = 0;
        cc.tween(node).to(2, { angle: -360 }).repeatForever().start();
    }

    /**
     * 弹窗动画
     * @param node
     */
    export function moveInv2(node: cc.Node, onCompleteCallback?: Function) {
        cc.Tween.stopAllByTarget(node);
        cc.tween(node)
            .to(0.3, { position: cc.Vec3.ZERO }, { easing: "quintOut" })
            .call(() => onCompleteCallback && onCompleteCallback())
            .start();
    }

    export function moveOutv2(node: cc.Node, onCompleteCallback?: Function) {
        cc.Tween.stopAllByTarget(node);
        const size = cc.view.getVisibleSize();
        cc.tween(node)
            .to(0.3, { position: cc.v3(size.width, 0) }, { easing: "quintOut" })
            .call(() => onCompleteCallback && onCompleteCallback())
            .start();
    }

    //根据16进制字符串生成color对象
    export function hexStrToColor(hexString: string) {
        let hex = hexString.replace("#", "");
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        let a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) : 255;
        return new cc.Color(r, g, b, a);
    }
}
