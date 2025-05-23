import { cmd } from "../../../../script/config/cmd";
import { config, gameHelper } from "../../../../script/config/config";
import { uAudio } from "../../../../script/framework/audio/audio";
import { tcLog } from "../../../../script/framework/log/log";
import { tcRes } from "../../../../script/framework/res/res";
import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { FortuneRabbitTable } from "./fortune-rabbit-table";

export namespace FortuneRabbitRes {
    /** 图案编号 */
    const cacheItemIcons: Map<number, cc.SpriteFrame> = new Map<number, cc.SpriteFrame>();
    let cacheCellItem: cc.Prefab | undefined;
    let scoreItem: cc.Prefab | undefined;
    let aniLayer: cc.Prefab | undefined;

    const audioNames: string[] = [];
    let itemSkeletionMap: Map<number, sp.SkeletonData> = new Map<number, sp.SkeletonData>();
    let avatar_rabbit_atlas_avatar;

    export function clearCache(): void {
        cacheCellItem = undefined;
        aniLayer = undefined;
        avatar_rabbit_atlas_avatar = undefined;
        itemSkeletionMap.clear();
        cacheItemIcons.clear();
        clearAudioRes();
    }

    /**
     * @method 异步加载游戏资源
     */
    export async function loadResAsync(): Promise<void> {
        try {
            let bundleName = gameHelper.getBundleName(cmd.SERVER_TYPE_FORTUNE_RABBIT);
            tcRes
                .load(bundleName, cc.SpriteFrame, `artwork/table/landScape_bg`)
                .then((asset) => {
                    let tmpNode: cc.Node = new cc.Node();
                    tmpNode.setParent(config.uiNode.bg);
                    tmpNode.addComponent(cc.Sprite).spriteFrame = asset;
                    tmpNode.scale = 1.8;
                })
                .catch((err) => {
                    tcLog.error(`load landScape_bg : ${JSON.stringify(err)}`);
                });

            loadSound();

            for (let i = 0; i < FortuneRabbitTable.itemsIds.length; ++i) {
                let url = `artwork/itemIcons/${FortuneRabbitTable.itemsIds[i]}`;
                let spriteframe = await tcRes.load<cc.SpriteFrame>(bundleName, cc.SpriteFrame, url);
                cacheItemIcons.set(FortuneRabbitTable.itemsIds[i], spriteframe);
                url = `artwork/itemIcons/${FortuneRabbitTable.itemsIds[i] * 10}`;
                spriteframe = await tcRes.load<cc.SpriteFrame>(bundleName, cc.SpriteFrame, url);
                cacheItemIcons.set(FortuneRabbitTable.itemsIds[i] * 10, spriteframe);
            }

            cacheCellItem = await tcRes.load<cc.Prefab>(bundleName, cc.Prefab, "prefab/fortune-rabbit-Item");
            scoreItem = await tcRes.load<cc.Prefab>(bundleName, cc.Prefab, "prefab/fortune-score-item");
            aniLayer = await tcRes.load<cc.Prefab>(bundleName, cc.Prefab, "prefab/fortune-rabbit-bigWin");

            avatar_rabbit_atlas_avatar = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/avatar_atlas_avatar`);
            let itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/h_angbao_atlas_symbols`);
            itemSkeletionMap.set(4, itemSkeletion);
            itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/h_packet_atlas_symbols`);
            itemSkeletionMap.set(81, itemSkeletion);
            itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/h_carrot_atlas_symbols`);
            itemSkeletionMap.set(1, itemSkeletion);
            itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/h_firecracker_atlas_symbols`);
            itemSkeletionMap.set(2, itemSkeletion);
            itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/h_ingot_atlas_symbols`);
            itemSkeletionMap.set(82, itemSkeletion);
            itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/s_wild`);
            itemSkeletionMap.set(51, itemSkeletion);
            itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/h_coins_atlas_symbols`);
            itemSkeletionMap.set(3, itemSkeletion);
            itemSkeletion = await tcRes.load<sp.SkeletonData>(bundleName, sp.SkeletonData, `artwork/spine/banzi`);
            itemSkeletionMap.set(9, itemSkeletion);
        } catch (err) {
            tcLog.error(`fortune-ox-res loadResAsync,${err.message}`);
        }
    }

    export function getItemSkeletionData(itemid: number) {
        return itemSkeletionMap.get(itemid);
    }

    export function getCellItem(): cc.Prefab {
        return cacheCellItem!;
    }

    export function getScoreItem(): cc.Prefab {
        return scoreItem!;
    }

    export function getItemIconById(itemId: number): cc.SpriteFrame | undefined {
        return cacheItemIcons.get(itemId);
    }

    async function loadSound() {
        let bundleName = gameHelper.getBundleName(cmd.SERVER_TYPE_FORTUNE_RABBIT);
        let soundNames = Object.keys(FortuneRabbitDefine.soundNames);
        for (let i = 0; i < soundNames.length; ++i) {
            let key = soundNames[i] as keyof typeof FortuneRabbitDefine.soundNames;
            const intro = await tcRes.load<cc.AudioClip>(bundleName, cc.AudioClip, `sound/${FortuneRabbitDefine.soundNames[key]}`);
            addClip(FortuneRabbitDefine.soundNames[key], intro);
        }
    }
    function addClip(name: string, clip: cc.AudioClip | null) {
        if (!clip) {
            return;
        }
        audioNames.push(name);
        uAudio.getInstance().addClip(name, clip);
    }

    /**
     * 清理
     */
    export function clearAudioRes() {
        audioNames.forEach((name) => {
            uAudio.getInstance().removeClip(name);
        });
        audioNames.length = 0;
    }
}
