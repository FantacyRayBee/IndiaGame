import { config } from "../config/config";
import { tcLog } from "../framework/log/log";
import { tcRes } from "../framework/res/res";
import { PgGameLoading } from "./pgGameLoading";
import { event } from "../../script/event/event";
import { GameLoadingNormal } from "./gameLoadingNormal";
import { GameLoading } from "./gameLoading";

// export class GameLoadingBase extends cc.Component {
//     updateLoadProgress(value: number) {}
//     updateView(bundleName?: string, type?: any) {}
// }

export enum gameLoadType {
    GAME_ICON_ANI, //代公司图标动画的（默认带进度条）
    GAME_PROGROGRESS, //带进度条的
    GAME_PROGROGRESS_BTNOK, //带进度条和确定按钮
    GAME_NO_PROGRESS, //带旋转等待图标
}
export interface loadTypeConfig {
    showBtnOk: boolean;
}

export interface gameLoadingBaseView {
    updateView: Function;
    updateLoadProgress: Function;
}

export namespace GameLoadingHelper {
    let loadingPrefabCache: cc.Prefab | undefined;
    let loadView: gameLoadingBaseView | undefined;

    export async function initLoading() {
        const fun = async () => {
            if (!loadingPrefabCache) {
                const prefab = await tcRes.load<cc.Prefab>("gameCommon", cc.Prefab, "prefab/gameLoading");
                if (!prefab) {
                    return;
                }

                loadingPrefabCache = prefab;
            }
        };
        try {
            await fun();
        } catch (err: any) {
            tcLog.error(`load gameLoading err: ${err.message}`);
            return;
        }
    }

    export async function openLoading(option?: { bundleName: string; duration?: number; loadType?: gameLoadType }) {

        const old = cc.find("loadingHelper", config.uiNode.loading ?? undefined);
        if (old || !loadingPrefabCache) {
            return;
        }

        const node = cc.instantiate(loadingPrefabCache);
        node.name = "loadingHelper";
        let param;
        switch (option?.loadType) {
            case gameLoadType.GAME_ICON_ANI:
                loadView = node.addComponent(PgGameLoading);
                break;
            case gameLoadType.GAME_PROGROGRESS:
                param = { showBtnOk: false };
                loadView = node.addComponent(GameLoading);
                break;
            case gameLoadType.GAME_PROGROGRESS_BTNOK:
                param = { showBtnOk: true };
                loadView = node.addComponent(GameLoading);
                break;
            default:
                loadView = node.addComponent(GameLoadingNormal);
                break;
        }

        node.setParent(config.uiNode.loading);
        await loadView?.updateView(option?.bundleName, param);
        node.setPosition(cc.Vec3.ZERO);
    }

    export function closeLoading() {
        const node = cc.find("loadingHelper", config.uiNode.loading ?? undefined);
        node?.destroy();
        cc.systemEvent.emit(event?.showGameView);
    }

    export function updateLoadProgress(value: number) {
        if (!loadView) {
            return;
        }
        if (typeof (loadView as any).updateLoadProgress === "function") {
            (loadView as any)?.updateLoadProgress(value);
        }
    }
}
