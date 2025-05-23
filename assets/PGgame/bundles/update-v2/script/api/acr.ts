import { Game_Const } from "../../../../ApiTemplate/script/config/GameConst";

export namespace acr {
    /**
        * 
        * @param route 路由
        * @param params 
        * @returns 
        */
    export function post<T>(url: string, params?: any): Promise<T | null> {


        return new Promise(resolve => {

            const timer = setTimeout(() => {
                resolve(null)
                console.warn("http post timeout...")
            }, 5000)

            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    const response = xhr.responseText

                    console.warn("http respones:", response)

                    clearInterval(timer)
                    const data = JSON.parse(response)
                    resolve && resolve(data.data)
                }
            };

            xhr.open("POST", Game_Const.Game_Host + url, true)
            xhr.timeout = 5000
            xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8")
            const data = JSON.stringify(params)
            xhr.send(data);

        })

    }

}
