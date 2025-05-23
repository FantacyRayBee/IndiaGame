import { acr } from "./acr";
import { apiConfig } from "./api-config";

export namespace api_act {
    async function post(router: string, data?: any): Promise<any> {
        // const _dev = localStorage.getItem("dev");

        if (window.apiUrl == undefined || window.apiUrl == "") {
            return acr.post(`${apiConfig.env.getAwayUrl_dev}/${router}`, data);
        } else {
            return acr.post(`${window.apiUrl}/${router}`, data);
        }
    }

    /**
     * 获取网关
     * @param data 请求的数据
     * @returns
     */
    export async function fetchGateway(data?: any) {
        return post("game/v1/gateway", data);
    }

    export function gethref() {
        const href = window.location.search.substring(1);
        return decodeURIComponent(href);
    }

    export class match {
        constructor(public url: string) {}
        get(name: string) {
            const Reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            const match = this.url.match(Reg);
            return match && unescape(match[2]);
        }
    }
}
