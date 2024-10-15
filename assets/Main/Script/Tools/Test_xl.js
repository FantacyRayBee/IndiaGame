const { ccclass, property } = cc._decorator;

ccclass('test_xl')
export default class test_xl extends cc.Component {
    start() {

    }

    update(deltaTime) {

    }
}

if (cc.EDITOR) {
    // 重写 update 方法，以在编辑模式下自动播放动画
    sp.Skeleton.prototype.update = function (dt) {
        if (cc.EDITOR) {
            cc['engine']._animatingInEditMode = 1;
            cc['engine'].animatingInEditMode = 1;
        }
        if (this.paused) return;

        dt *= this.timeScale * sp.timeScale;

        if (this.isAnimationCached()) {
            // 缓存模式并且有动画队列
            if (this._isAniComplete) {
                if (this._animationQueue.length === 0 && !this._headAniInfo) {
                    let frameCache = this._frameCache;
                    if (frameCache && frameCache.isInvalid()) {
                        frameCache.updateToFrame();
                        let frames = frameCache.frames;
                        this._curFrame = frames[frames.length - 1];
                    }
                    return;
                }
                if (!this._headAniInfo) {
                    this._headAniInfo = this._animationQueue.shift();
                }
                this._accTime += dt;
                if (this._accTime > this._headAniInfo.delay) {
                    let aniInfo = this._headAniInfo;
                    this._headAniInfo = null;
                    this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
                }
                return;
            }

            this._updateCache(dt);
        } else {
            this._updateRealtime(dt);
        }
    };
}