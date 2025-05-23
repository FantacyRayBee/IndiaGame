const { ccclass, property } = cc._decorator;

@ccclass
export default class FortuneRabbitCoins extends cc.Component {
    public initial_velocity: cc.Vec2 = cc.v2(0, 0);
    public acceleration: cc.Vec2 = cc.v2(0, -2500);
    private _initial_position: cc.Vec2 = cc.v2(0, -20);

    private _emiting: boolean = false;
    private _time: number = 0;

    onLoad() {
        this._initial_position.x = this.node.x;
        this._initial_position.y = this.node.y;
    }

    emitCoin() {
        this._initial_position.x = this.node.x;
        this._initial_position.y = this.node.y;
        this._time = 0;
        this._emiting = true;
    }

    resetCoin() {
        this._emiting = false;
        this._time = 0;
    }

    start() {}

    update(dt: number) {
        if (this._emiting) {
            this._time += dt;
            this.node.x = this._initial_position.x + this.initial_velocity.x * this._time + (this.acceleration.x * this._time * this._time) / 2;
            this.node.y = this._initial_position.y + this.initial_velocity.y * this._time + (this.acceleration.y * this._time * this._time) / 2;

            if (this.node.y < -1000) {
                this._emiting = false;
            }
        }
    }
}
