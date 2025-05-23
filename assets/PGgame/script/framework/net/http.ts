// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { tcLog } from "../log/log";

export namespace tcHttp {
    type SupportType = "POST" | "GET";

    export enum Code {
        Success = 0,
        ErrorUnknown = 901, // 未知错误
        ErrorInernal = 902, // 内部错误
        ErrorServer = 903, //    服务器错误
        ErrorRequestMany = 904, // 请求次数过多
        ErrorAuthentication = 905, // 认证错误
        ErrorNet = 906, // 网络无法连接
        ErrorTimeout = 907, // 请求超时
        ErrorAbort = 908, // 终止请求
    }

    const requestMap: Map<string, XMLHttpRequest> = new Map();
    let requestCount = 0;

    export async function post(url: string, data?: any, header?: Map<string, string>, reqKey?: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            send(
                "POST",
                url,
                data,
                (resp: any) => resolve(resp),
                (err: any) => reject(err),
                header,
                reqKey
            );
        });
    }

    export async function get(url: string, data?: any, header?: Map<string, string>, reqKey?: string): Promise<any> {
        let params = "";
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                params += `${key}=${value}&`;
            });
            params = params.slice(0, -1);
        }

        return new Promise<any>((resolve, reject) => {
            send(
                "GET",
                `${url}?${params}`,
                null,
                (resp: any) => resolve(resp),
                (err: any) => reject(err),
                header,
                reqKey
            );
        });
    }

    function send(method: SupportType, url: string, data?: any, onSuccess?: Function, onFail?: Function, header?: Map<string, string>, reqKey?: string): void {
        requestCount++;
        const key = reqKey ?? `${Date.now() + requestCount}`; // key 生成规则：如果有传，则直接使用 reqKey；如果没有，则自动生成不重复的 key

        if (requestMap.get(key)) {
            // 请求中
            onFail?.({ code: Code.ErrorRequestMany });
            return;
        }

        const payload = data ? JSON.stringify(data) : null;
        const xhr = new XMLHttpRequest();
        xhr.timeout = 1000 * 10;

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status === 0) {
                return;
            }

            tcLog.debug(`key: ${key}, request: ${url}, payload: ${payload}, resp code: ${xhr.status}, resp body: ${xhr.response}`);
            
            requestMap.delete(key);

            // 认证错误
            if (xhr.status === 401) {
                onFail?.({ code: Code.ErrorAuthentication });
                const resp = JSON.parse(xhr.responseText);
                if (resp.status === 2) {
                    // token timeout
                    cc.systemEvent.emit("token-timeout");
                } else if (resp.status === 3) {
                    // token illegal
                    cc.systemEvent.emit("token-illegal");
                }
                return;
            }

            // 请求次数过多
            if (xhr.status === 429) {
                onFail?.({ code: Code.ErrorRequestMany });
                return;
            }

            // 请求错误
            if (xhr.status < 200 || xhr.status >= 400) {
                onFail?.({ code: Code.ErrorServer });
                return;
            }

            const resp = JSON.parse(xhr.responseText);
            if (resp.code !== 1) {
                onFail?.({ code: resp.code, msg: resp.msg });
                return;
            }

            onSuccess?.(resp.data);
        };
        xhr.onerror = () => {
            requestMap.delete(key);
            onFail?.({ code: Code.ErrorNet });
        };
        xhr.ontimeout = () => {
            requestMap.delete(key);
            onFail?.({ code: Code.ErrorTimeout });
        };
        xhr.onabort = () => {
            requestMap.delete(key);
            onFail?.({ code: Code.ErrorAbort });
        };
        xhr.open(method, url, true);
        header?.forEach((value, key) => {
            xhr.setRequestHeader(key, value);
        });
        xhr.withCredentials = true;
        xhr.send(payload);

        requestMap.set(key, xhr);
    }

    /**
     * 取消请求
     * @param reqKey 请求 Key
     * @returns
     */
    export function abort(reqKey: string) {
        requestMap.forEach((value, key) => {
            if (key !== reqKey) {
                return;
            }

            value.abort();
            requestMap.delete(key);
        });
    }
}
