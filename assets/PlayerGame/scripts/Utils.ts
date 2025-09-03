// 随机整数
export function random(lower: number, upper: number): number {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

// 数组打乱
export function shuffle(arr: any[]) {
    let length: number = arr.length,
        randomIndex: number,
        temp: any;
    while (length) {
        randomIndex = Math.floor(Math.random() * (length--));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr
}

export function splitArray(arr: number[], n: number, m: number): number[][] {
    const result: number[][] = [];

    let subArray: number[] = [];

    for (let i = 0; i < arr.length; i++) {
        subArray.push(arr[i]);

        if (subArray.length === m) {
            result.push(subArray);
            subArray = [];
        }

        if (result.length === n) {
            break;
        }
    }

    // 补充空数组
    while (result.length < n) {
        result.push([]);
    }

    return result;
}

// 字符串中包含数字，提取数字进行排序
export function sortSpriteNameByNum(frames: cc.SpriteFrame[]) {
    const getNumberInSpriteName = (name: string) => {
        const reg = /\d+/g
        return parseInt(name.match(reg)[0] || '0')
    }
    return frames.sort((a, b) => getNumberInSpriteName(a.name) - getNumberInSpriteName(b.name))
}


// 秒数转换
export function formatSeconds(seconds: number | string, dateFormat = 'h:i:s'): string {
    seconds = Number(seconds)
    let obj: any = {}
    obj.h = Number.parseInt(String(seconds / 3600));
    obj.i = Number.parseInt(String((seconds - obj.h * 3600) / 60));
    obj.s = Number.parseInt(String(seconds - obj.h * 3600 - obj.i * 60));
    if (obj.h < 10) obj.h = '0' + obj.h;
    if (obj.i < 10) obj.i = '0' + obj.i;
    if (obj.s < 10) obj.s = '0' + obj.s;
    // 3.解析
    var rs = dateFormat.replace('h', obj.h).replace('i', obj.i).replace('s', obj.s);
    return rs;
}

// 两点距离
export function getDistance(start: cc.Vec2, end: cc.Vec2) {
    const pos = cc.v2(start.x - end.x, start.y - end.y);
    const dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    return dis;
}

// 两点角度
export function getAngle(start: cc.Vec2, end: cc.Vec2) {
    //计算出朝向
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dir = cc.v2(dx, dy);
    //根据朝向计算出夹角弧度
    const angle = dir.signAngle(cc.v2(1, 0));
    //将弧度转换为欧拉角
    const degree = angle / Math.PI * 180;
    return -degree
}

// 把节点1转节点2坐标
export function toXY(node1: cc.Node, node2: cc.Node) {
    const wpos = node1.convertToWorldSpaceAR(cc.v2(0, 0))
    const pos = node2.convertToNodeSpaceAR(wpos)
    return pos
}

// 微信头像链接
export function wxAvatar(avatarUrl: string, isCached: boolean = true) {
    if (isCached) {
        avatarUrl += `?sail.jpg`
    } else {
        const time = new Date().getTime()
        avatarUrl += `?sail=${time}.jpg`
    }
    return new Promise<void>((resolve, reject) => {
        cc.loader.load(avatarUrl, function (err: any, texture: any) {
            if (err) reject && reject()
            resolve && resolve(texture)
        })
    })
}

// 生成uuid
export function uuid() {
    let d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}