const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/CompareCardLineCtrl')
export default class CompareCardLineCtrl extends cc.Component {

    @property(sp.Skeleton)
    private sp_line: sp.Skeleton = null;


    setCompareCardLinePosition(pos: cc.Vec3) {
        this.sp_line.node.setPosition(pos);
    }

    setCompareCardLineRotation(angle: number) {
        this.sp_line.node.angle = angle - 90;
    }

    setCompareCardLinDistance(distance: number) {
        let scale = distance / 185;
        this.sp_line.node.setScale(2, scale);
    }

    setCompareCardLineAnim() {
        this.sp_line.clearTracks();
        this.sp_line.setAnimation(0, "duan", true);
    }
}
