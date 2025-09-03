import { StaticInstance } from './StaticInstance';
import { ENUM_RESOURCE_TYPE, ENUM_UI_TYPE } from './Enum';
import AudiosManager from "./manager/AudiosManager";
import DataManager from './manager/DataManager';
import ResourceManager from "./manager/ResourceManager";
import SdkManager from './manager/SdkManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    onLoad() {
        this.node.getChildByName('UI').opacity = 255
        cc.view.setResizeCallback(() => this.responsive())
        this.responsive()
        DataManager.instance.loadingRate = 0
    }

    async start() {
        // ==== 调试：逐个 prefab 定位报错 ====
        // probeDir('prefab/effect');
        // probeDir('prefab/ui');

        // ==== 原本的逻辑先注释，等定位完再恢复 ====
         for (const index in ENUM_RESOURCE_TYPE) {
             const resource = ENUM_RESOURCE_TYPE[index];   
             await ResourceManager.instance.loadRes(resource)
         }
         StaticInstance.uiManager.init();
         DataManager.instance.restore();
         AudiosManager.instance.playMusic();
         SdkManager.instance.initBannerAd();
         SdkManager.instance.initInterstitialAd();
         SdkManager.instance.initVideoAd();
         this.onHeartIncrease()
        //  if(DataManager.instance.levelData.level==1){
        //      StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
        //      StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN, true,null, () => {
        //          DataManager.instance.loadingRate = 1
        //      })
        //      StaticInstance.gameManager.onGameStart();
        //  }else{
             StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, true,null, () => {
                 console.log("loadingRate");
                 DataManager.instance.loadingRate = 1
             })
        //  }
    }

    // 屏幕响应式
    responsive() {
        const designSize = cc.view.getDesignResolutionSize();
        const viewSize = cc.view.getFrameSize();

        const setFitWidth = () => {
            cc.Canvas.instance.fitHeight = false;
            cc.Canvas.instance.fitWidth = true;
        }

        const setFitHeight = () => {
            cc.Canvas.instance.fitHeight = true;
            cc.Canvas.instance.fitWidth = false;
        }

        const setFitBoth = () => {
            cc.Canvas.instance.fitHeight = true;
            cc.Canvas.instance.fitWidth = true;
        }

        const designRatio = designSize.width / designSize.height
        const viewRatio = viewSize.width / viewSize.height
        if (designRatio < 1) {
            if (viewRatio < 1) {
                if (viewRatio > designRatio) {
                    setFitBoth()
                } else {
                    setFitWidth()
                }
            } else {
                setFitBoth()
            }
        } else {
            if (viewRatio > 1) {
                if (viewRatio < designRatio) {
                    setFitBoth()
                } else {
                    setFitHeight()
                }
            } else {
                setFitBoth()
            }
        }
    }

    onHeartIncrease() {
        if (DataManager.instance.hearts < 5) {
            const now = new Date().getTime()
            const seconds = Math.floor((now - DataManager.instance.lastHeartUpdateTime) / 1000)
            const hearts = Math.floor(seconds / DataManager.instance.heartRefreshTime)
            if (DataManager.instance.hearts + hearts >= 5) {
                DataManager.instance.hearts = 5
                DataManager.instance.lastHeartRefreshTime = 0
            } else {
                DataManager.instance.hearts += hearts
            }
            DataManager.instance.save()
        }
    }
}

// ========== A 段探针函数 ==========

// 列出目录下所有 prefab 路径（不实例化）
function listPrefabPaths(dir: string): string[] {
    const getDirWithPath = (cc.resources as any)?.getDirWithPath;
    if (typeof getDirWithPath !== 'function') {
        console.warn('[probe] getDirWithPath 不可用');
        return [];
    }
    const infos = getDirWithPath.call(cc.resources, dir, cc.Prefab) || [];
    return infos.map((i: any) => i.path).filter(Boolean);
}

// 加载单个 prefab
async function loadOne(path: string): Promise<void> {
    return new Promise((resolve) => {
        cc.resources.load(path, cc.Prefab, (err: any, prefab: cc.Prefab) => {
            if (err) {
                console.error(`[probe] FAIL: ${path}`, err.message || err, err?.stack || '');
            } else {
                console.log(`[probe] OK:   ${path} (${prefab?.name})`);
            }
            resolve();
        });
    });
}

// 批量加载某个目录
async function probeDir(dir: string) {
    console.log(`[probe] start dir=${dir}`);
    const paths = listPrefabPaths(dir);
    if (!paths.length) {
        console.warn(`[probe] ${dir} 下没有 prefab`);
        return;
    }
    paths.sort();
    for (const p of paths) {
        await loadOne(p);
    }
    console.log(`[probe] done dir=${dir}`);
}
