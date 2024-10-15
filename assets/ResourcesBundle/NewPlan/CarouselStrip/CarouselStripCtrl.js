cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.RichText
    },



    ctor: function() {
        this.isPlayPMD = true;  // 是否播放下一条广播
        this.isRobot = 2;       // 0是机器人 1真人 2 没有人
    },
    
    onLoad: function() {
        this.node_PMD = this.node.getChildByName("pmd");
        this.showPMDlabel();
    },

	/**
	 * 监听有没有跑马灯消息
	 */
    showPMDlabel: function() {
        if (GlobalCfg.USER_DATAS.openModules.includes(16) == false) {
            return
        };
		this.unscheduleAllCallbacks();
        this.schedule(() => {
            if (this.isPlayPMD) {
                this.isPlayPMD = false;

                this.node_PMD.active = true;
                this.label.node.setPosition(340,0);
    
                if (GlobalCfg.MAR_QUEE_DATA.length > 0) {   // 真人
                    this.isRobot = 0;
                    this.label.string = this.switchText(GlobalCfg.MAR_QUEE_DATA[0]);
                }
                else if (GlobalCfg.MAR_QUEE_DATA_ROBOT.length > 0) {    //机器人     
                    this.isRobot = 1;        
                    this.label.string = this.switchText(GlobalCfg.MAR_QUEE_DATA_ROBOT[0]);
                } 
                else { // 没有人
                    this.node_PMD.active = false;
                };
    
                let X =  -324-this.label.node.width
            
                cc.tween(this.label.node)
                .tag(100)
                .to(10, { position: cc.v2(X,0)})
                .call(()=>{
                    if (this.isRobot == 0) {
                        GlobalCfg.MAR_QUEE_DATA.splice(0,1);
                    }
                    else if(this.isRobot == 1){
                        GlobalCfg.MAR_QUEE_DATA_ROBOT.splice(0,1);
                    };
                    this.isPlayPMD = true;
                })
                .start()
            }
        }, 0.5);
    },
    
    /**
	 * 显示跑马灯文字内容的颜色
	 * @param {跑马灯数据} data 
	 * @returns 
	 */
    switchText: function(data) {
        let event = data.event
        let str = ''
        let C1 = '<color=#98EAB0>player' + data.params[0];
        let C2 = "<color=#98EAB0>";
       
        let b = Number(data.params[1])/100;
        let c = data.params[3];
    
        if (event == 0) {
            str = data.params[0];
        }
        else if (event == 1) {
            str = `${C1}</c>  Recharge  ${C2}${b}</c>  Rs`;
        } 
        else if (event == 2) {
            str = `${C1}</c>  Withdraw  ${C2}${b}</c>  Rs`;
        } 
        else if (event == 3) {
            let productId = data.productId;
            let product = Reflect.has(data,'product') ? data.product : "";
            let gameName = "  in  "+data.params[2];
            if (product == "miniteenpatti") {
                str = `${C1}</c>  get ${C2}${c}</c>  and  win  ${C2}${b}</c>${gameName}`;
            } 
            else {
                str = `${C1}</c>  win ${C2}${c}</c>${C2} ${b}</c>${gameName}`;
            }
        };
        
        return str;
    },
});