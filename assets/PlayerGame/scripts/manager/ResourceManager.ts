
import { settingData } from '../datacenter/SettingData';
import NativeUtils from '../framework/NativeUtils';
import { i18nManage } from '../i18n/i18nManage';
import DataManager from './DataManager';
import PoolManager from './PoolManager';

export default class ResourceManager {

    public clipMap = {}

    public spriteMap = {}

    public jsonMap = {}

    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<ResourceManager>()
    }

    public async loadRes(resource: any, ratio: number = 0) {
        return new Promise<void>((resolve, reject) => {
            const rate = DataManager.instance.loadingRate;
    
            console.log(`[loadRes] start path=${resource.path}, type=${resource.type}, content=`, resource.content);
    
            cc.resources.loadDir(resource.path, resource.content,
                (finished: number, total: number, item?: any) => {
                  // 记录每一个正在处理的条目
                  if (item && item.url) {
                    console.log(`[loadRes] progress ${finished}/${total} url=${item.url}`);
                  }
                  if (resource.ratio > 0 && total > 0) {
                    const loadingRate = Math.floor((rate + resource.ratio * finished / total) * 100) / 100;
                    DataManager.instance.loadingRate = Math.max(loadingRate, DataManager.instance.loadingRate);
                  }
                },
                (err, assets: any) => {
                    if (err) {
                        // 打印更详细的错误 + 最近 1~2 个进度日志可以直接看到“最后一次加载哪条 url”
                        console.error(`[loadRes] ERROR loading dir=${resource.path}, type=${resource.type} ::`, err.message || err);
                        // 如果有 stack，顺便打出来
                        if ((err as any).stack) {
                        console.error('[loadRes] stack:\n', (err as any).stack);
                        }
                        reject && reject(err);
                        return;
                    }
    
                    let asset: any;
                    if (resource.type === 'audio') {
                        for (let i = 0; i < (assets?.length || 0); i++) {
                            asset = assets[i];
                            if (asset?.name && !this.clipMap[asset.name]) {
                                this.clipMap[asset.name] = asset;
                            }
                        }
                    }
    
                    if (resource.type === 'prefab') {
                        for (let i = 0; i < (assets?.length || 0); i++) {
                            asset = assets[i];
                            // 注意：直接用 asset.name
                            PoolManager.instance.setPrefab(asset.name, asset);
                        }
                    }
    
                    if (resource.type === 'sprite') {
                        for (let i = 0; i < (assets?.length || 0); i++) {
                            asset = assets[i];
                            if (asset?.name && !this.spriteMap[asset.name]) {
                                this.spriteMap[asset.name] = asset;
                            }
                        }
                    }
    
                    if (resource.type === 'i18n') {
                        if (!settingData.lockLanguage) {
                            const lang = NativeUtils.getCurrentLanguage();
                            console.log(`[loadRes] set i18n to ${lang}`);
                            i18nManage.setLanguage(lang);
                            settingData.currLanguage = lang;
                        } else {
                            console.log(`[loadRes] keep i18n locked to ${settingData.currLanguage}`);
                            i18nManage.setLanguage(settingData.currLanguage);
                        }
                    }
    
                    resolve && resolve();
                }
            );
        });
    }


    public getClip(name: string) {
        return this.clipMap[name]
    }

    public getSprite(name: string) {
        return this.spriteMap[name]
    }

    public getJson(name: string) {
        return this.jsonMap[name];
    }
}
