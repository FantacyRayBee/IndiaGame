const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/CompareCardVSCtrl')
export default class CompareCardVSCtrl extends cc.Component {

    @property(sp.Skeleton)
    private sp_vs: sp.Skeleton = null;


    setCompareCardVSAnim() {
        this.sp_vs.clearTracks();
        this.sp_vs.setAnimation(0, "chuxian", false);
    }
}
