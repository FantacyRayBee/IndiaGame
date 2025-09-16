cc.Class({
    extends: cc.Component,

    properties: {
        sp_bg: cc.Sprite,
        spriteframe_bg: [cc.SpriteFrame],
        
        node_normal: cc.Node,
        node_pass: cc.Node,
        node_success: cc.Node,
        node_fail: cc.Node,
        node_final: cc.Node,
        node_light: cc.Node,

        skel_fire: sp.Skeleton,
        skel_defeat: sp.Skeleton,

        spriteframe_egg1: cc.SpriteFrame,
        spriteframe_egg2: cc.SpriteFrame,

        spriteframe_light1: cc.SpriteFrame,
        spriteframe_light2: cc.SpriteFrame,
    },

    ctor() {
        this.isPass = false;
        this._fireLoopActive = false;
        this._fireTimerCb = null; // 保存 scheduleOnce 回调，便于取消
    },

    start() {
    },
    onDestroy() {
        this.unschedule(this._fireTimerCb);
    },

    setPanel(index, isEnd) {
        this.sp_bg.spriteFrame = isEnd ? this.spriteframe_bg[4] : this.spriteframe_bg[index];
        this.init(isEnd);
    },

    init(isEnd){
        this.isPass = false;    
        this.node_normal.active = true;
        this.node_normal.scaleX = 1;
        this.node_pass.active = false;
        this.node_success.active = false;
        this.node_fail.active = false;
        this.node_final.active = false;
        this.node_light.active = false
        if (isEnd) {
            this.node_normal.active = false;
            this.node_final.active = true;
            this.node_final.getComponent(cc.Animation).play("wing"); 
            this.node_light.getComponent(cc.Sprite).spriteFrame = this.spriteframe_light1;
            this.node_final.getComponent(cc.Sprite).spriteFrame = this.spriteframe_egg1;
            this.node_final.getChildByName('lab_final').active = true;
            this.node_final.getChildByName('lab_final2').active = false;
        }
        // 如需开局就开始随机播放火焰动画
        this.startFireLoop();
    },
    
    setData(mult){
        this.node_normal.getChildByName('lab_normal').getComponent(cc.Label).string = mult + 'x';
        this.node_pass.getChildByName('lab_pass').getComponent(cc.Label).string = mult + 'x';
        this.node_final.getChildByName('lab_final').getComponent(cc.Label).string = mult + 'x';
        this.node_final.getChildByName('lab_final2').getComponent(cc.Label).string = mult + 'x';
    },

    /**
     * 通用切换动画 (scaleX 翻转衔接)
     */
    switchNode(fromNode, toNode) {
        if (!fromNode || !toNode) return;

        toNode.scaleX = 0;
        toNode.active = false;

        cc.tween(fromNode)
            .to(0.2, { scaleX: 0 })
            .call(() => {
                fromNode.active = false;
                toNode.active = true;
                cc.tween(toNode).to(0.2, { scaleX: 1 }).start();
            })
            .start();
    },

    rotate(type) {
        this.node_light.active = false;
        if (type == 1) { // normal -> pass
            this.isPass = true;
            this.node_light.active = true;
            this.switchNode(this.node_normal, this.node_pass);
            // 达成 pass 后，不再触发火焰动画
            this.stopFireLoop();
        }
        else if (type == 2) { // pass -> success
            this.switchNode(this.node_pass, this.node_success);
        }
        else if (type == 3) { // normal -> fail
            this.switchNode(this.node_normal, this.node_fail);
        }
        else if (type == 4) { // 达到终点
            this.node_light.active = true;
            this.node_light.getComponent(cc.Sprite).spriteFrame = this.spriteframe_light2;
            this.node_final.getComponent(cc.Sprite).spriteFrame = this.spriteframe_egg2;
            this.node_final.getChildByName('lab_final').active = false;
            this.node_final.getChildByName('lab_final2').active = true;
        }
        else if (type == 5) { // pass -> normal
            this.switchNode(this.node_pass, this.node_normal);
        }
        else if (type == 6) { // final -> normal
            this.node_light.active = false;
            this.node_light.getComponent(cc.Sprite).spriteFrame = this.spriteframe_light1;
            this.node_final.getComponent(cc.Sprite).spriteFrame = this.spriteframe_egg1;
            this.node_final.getChildByName('lab_final').active = true;
            this.node_final.getChildByName('lab_final2').active = false;
        }
    },

    playDead(callback) {
        this.stopFireLoop();
        this._playSkeletonOnceAndHide(this.skel_defeat, "1", callback);
    },
    /** -------- 火焰动画循环：每 5~8 秒随机触发一次 -------- */
    startFireLoop() {
        this.stopFireLoop();          // 先清理，避免重复
        this._fireLoopActive = true;
        this._scheduleNextFire();
    },

    stopFireLoop() {
        this._fireLoopActive = false;
        if (this._fireTimerCb) {
            this.unschedule(this._fireTimerCb);
            this._fireTimerCb = null;
        }
        if (this.skel_fire) {
            this.skel_fire.node.active = false;
            try {
                this.skel_fire.clearTracks();
                this.skel_fire.setToSetupPose();
            } catch(e) {}
        }
    },

    _scheduleNextFire() {
        if (!this._fireLoopActive || this.isPass) return;
        const delay = 5 + Math.random() * 3; // 5~8 秒
        this._fireTimerCb = () => {
            this._fireTimerCb = null;
            this._playFireOnce();
        };
        this.scheduleOnce(this._fireTimerCb, delay);
    },

    _playFireOnce() {
        // 触发时再次确认状态
        if (!this._fireLoopActive || this.isPass || !this.skel_fire) return;

        const node = this.skel_fire.node;
        node.active = true;

        // 播放一次动画 "1"
        const entry = this.skel_fire.setAnimation(0, "1", false);

        // 监听一次完成事件，播完隐藏并计划下次
        const onComplete = () => {
            node.active = false;
            // 清掉监听，避免重复触发
            if (this.skel_fire && this.skel_fire.setCompleteListener) {
                this.skel_fire.setCompleteListener(null);
            }
            this._scheduleNextFire();
        };

        // 使用 trackEntry 的 listener（优先，不影响其他动画）
        if (entry) {
            entry.listener = { complete: onComplete };
        } else if (this.skel_fire.setCompleteListener) {
            // 兼容处理：fallback 到 skeleton 的全局 complete 回调
            this.skel_fire.setCompleteListener(onComplete);
        }
    },

    /**
     * 播放某个 skeleton 的动画一次，完毕后隐藏
     * @param {sp.Skeleton} skel
     * @param {string} animName
     * @param {Function} [cb]
     */
    _playSkeletonOnceAndHide(skel, animName, cb) {
        if (!skel) return;
        const node = skel.node;

        // 每次播放前清理旧动画
        try {
            // skel.clearTracks();
            skel.setToSetupPose();
        } catch (e) {}

        node.active = true;

        const entry = skel.setAnimation(0, animName, false);

        const onComplete = () => {
            node.active = false;
            cb && cb();
        };

        // 推荐使用 trackEntry 的 listener，不会影响全局
        if (entry) {
            entry.listener = { complete: onComplete };
        } else {
            // fallback，部分 Creator 版本 entry 可能为空
            skel.setCompleteListener(onComplete);
        }
    },
});
