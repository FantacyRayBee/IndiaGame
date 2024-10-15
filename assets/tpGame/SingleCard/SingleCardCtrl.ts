const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/SingleCardCtrl')
export default class SingleCardCtrl extends cc.Component {

    
    setSingleCardContentSize(contentSize: cc.Size){
        this.node.setContentSize(contentSize);
    }
}
