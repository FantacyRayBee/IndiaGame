// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export namespace tcRes {
    const resCache: Map<string, cc.Asset> = new Map();

    /**
     * 加载bundle
     * @param bundleName bundle 名字
     * @returns bundle
     */
    export async function loadBundle(bundleName: string): Promise<cc.AssetManager.Bundle> {
        return new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
            const bundle = cc.assetManager.getBundle(bundleName);
            if (bundle) {
                resolve(bundle);
                return;
            }

            cc.assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(bundle);
            });
        });
    }

    /**
     * 加载资源
     * @param bundleName bundle 名字
     * @param type
     * @param assetUrl 资源路径
     * @returns 资源
     */
    export async function load<T extends cc.Asset>(bundleName: string, type: { prototype: T }, assetUrl: string, onProgress?: Function): Promise<T> {
        const key = `${bundleName}-${assetUrl}`;
        const res = resCache.get(key);
        if (res) {
            return res as T;
        }

        return new Promise<T>((resolve, reject) => {
            loadBundle(bundleName)
                .then((bundle) => {
                    bundle.load<T>(
                        `${assetUrl}`,
                        type,
                        (finish: number, total: number, item: any) => {
                            onProgress && onProgress(finish / total);
                        },
                        (err, asset) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            resCache.set(key, asset);

                            resolve(asset);
                        }
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * 加载远程资源
     * @param assetUrl 资源地址
     * @returns 资源
     */
    export async function loadRemote<T extends cc.Asset>(assetUrl: string, options?: Record<string, any>): Promise<T> {
        const key = `${assetUrl}`;
        const res = resCache.get(key);
        if (res) {
            return res as T;
        }

        return new Promise<T>((resolve, reject) => {
            cc.assetManager.loadRemote<T>(assetUrl, options ?? {}, (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }

                resCache.set(key, asset);

                resolve(asset);
            });
        });
    }

    export function releaseAssets(bundleName: string, assertUrl?: string) {}

    export function releaseBundle(bundleName: string) {}

    export function getBundle(bundleName: string) {
        return cc.assetManager.getBundle(bundleName);
    }
}
