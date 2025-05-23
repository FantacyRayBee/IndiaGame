const { ccclass, property } = cc._decorator;

@ccclass
export class player extends cc.Component {

    private info: any | null = null;

    start() {

    }

    update(deltaTime: number) {

    }

    public init(pl: any) {
        this.info = pl;
    }

    public getInfo(): any {
        return this.info;
    }

    public updateInfo(data: any) {
        for (let k in data) {
            this.info[k] = data[k];
        }
    }
}


