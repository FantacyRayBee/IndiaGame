import SignItemCtrl from "./SignItemCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignCtrl extends cc.Component {

    @property(cc.Button)
    private btn_sign: cc.Button = null;

    @property(cc.Button)
    private btn_close: cc.Button = null;

    @property(cc.Label)
    private lab_day7: cc.Label = null;

    @property(cc.Label)
    private lab_day7Reward: cc.Label = null;

    @property(cc.Label)
    private lab_btnGetTip: cc.Label = null;

    @property(cc.Node)
    private node_day7Signed: cc.Node = null;

    @property(cc.Node)
    private node_day7Unsigned: cc.Node = null;

    private itemPosArr = [
        cc.v2(-165, 84), cc.v2(-40, 84), cc.v2(85, 84), 
        cc.v2(-165, -77), cc.v2(-40, -77), cc.v2(85, -77), cc.v2(85, -77),
    ];

    private signItemCtrlMap = new Map();

    private btn_sign_type = 0;

    protected onLoad(): void {
        //@ts-ignore
        this.btn_sign.node.on('click', CommonFun.getInstance().debounce(() => {
            if (this.btn_sign_type == 0) {
                this.onSignClick();
            }
            else {
                this.tryEnterMinScoreTP();
            };
        }, 1), this);
        //@ts-ignore
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(() => {
            this.node.destroy();
        }, 1), this);
        this.btn_sign.node.active = false;
        this.node_day7Signed.active = false;
        this.node_day7Unsigned.active = false;
    }

    protected start(): void {
        Promise.all([this.getSignList(), this.getSignItemPrefab()])
        .then((arr) => {
            this.setSignListItem(arr);
        })
        .catch((err) => {
            //@ts-ignore
            LoggerUtil.getInstance().error(err);
        });
    }


    protected onDestroy(): void {
        //@ts-ignore
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SIGNITEM);
        //@ts-ignore
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SIGN);
    }

    onSignClick() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
        //@ts-ignore
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/sign";
        //@ts-ignore
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            if (msg.result == 0 && msg.data) {
                let data = msg.data;
                //@ts-ignore
                if (data && CommonFun.getInstance().isValidForScr(this)) {
                    //@ts-ignore
                    CommonFun.getInstance().showRewardsTips([{ id: 10, amount: data.gift / 100 }]);
                    //@ts-ignore
                    if (GlobalCfg.USER_DATAS.signInfo) {
                        //@ts-ignore
                        GlobalCfg.USER_DATAS.signInfo.today = data.today;
                        //@ts-ignore
                        GlobalCfg.USER_DATAS.signInfo.done = true;
                    };

                    if (this.signItemCtrlMap.has(data.today)) {
                        let signItemCtrl = this.signItemCtrlMap.get(data.today);
                        signItemCtrl.setSignItemSigned();
                    };

                    if (data.today == 7) {
                        this.node_day7Signed.active = true;
                        this.node_day7Unsigned.active = false;
                    };

                    //@ts-ignore
                    if (GlobalCfg.USER_DATAS.recharged == 0 && CommonFun.getInstance().isNeedSignToastGetBtnChange()) {
                        this.btn_close.node.active = true; 
                        this.btn_sign_type = 1;
                        this.lab_btnGetTip.string = `Play Now`;
                        let actTime = 0.5;
                        this.btn_sign.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1), cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1))));
                    }
                    else {
                        this.btn_sign_type = 0;
                        this.btn_sign.interactable = false;
                        this.btn_sign.enableAutoGrayEffect = true; 
                        this.btn_close.node.active = true; 
                    };
                };
            }
            else {
                //@ts-ignore
                CommonFun.getInstance().showTips(msg.msg);
            };
           
        }, null, 
        //@ts-ignore
        GlobalCfg.USER_DATAS.BearerToken);
    }

    getSignList() {
        return new Promise((resolve, reject) => {
            //@ts-ignore
            if (GlobalCfg.USER_DATAS.signInfo != null) {
                //@ts-ignore
                resolve(GlobalCfg.USER_DATAS.signInfo);
                return;
            };
            //@ts-ignore
            let url =  GlobalCfg.HTTP_SERVER + "/v1/signlist"; 
            //@ts-ignore
            CommonFun.getInstance().httpGet(url, (strInfo) => {  
                if (strInfo.result == 0) { 
                    //@ts-ignore
                    GlobalCfg.USER_DATAS.signInfo = strInfo.data;
                    //@ts-ignore
                    resolve(GlobalCfg.USER_DATAS.signInfo);
                }
                else {
                    //@ts-ignore
                    CommonFun.getInstance().showTips(strInfo.msg);
                    reject(strInfo.msg);
                };
            }, null, 
            //@ts-ignore
            GlobalCfg.USER_DATAS.BearerToken);
        });  
    }

    getSignItemPrefab() {
        return new Promise((resolve, reject) => {
            //@ts-ignore
            let prefabPath = GlobalCfg.PREFAB_PATH.SIGNITEM;
            let arr = prefabPath.split("/");
            let bundleName = arr[0];
            let path = prefabPath.substring(bundleName.length + 1);
            //@ts-ignore
            CommonFun.getInstance().loadBundle(bundleName, (bundle) => {
                bundle.load(path, cc.Prefab, (error, prefab) => {
                    if (!error) {
                        resolve(prefab);
                    }
                    else {
                        reject(error);
                    };
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    setSignListItem(arr) {
        if (!Array.isArray(arr)) {
            return;
        };

        let signData = arr[0];
        let itemPrefab = arr[1];

        if (!itemPrefab) {
            return;
        };

        if (!signData) {
            //@ts-ignore
            LoggerUtil.getInstance().log(`No check-in data available`);
            return;
        };

        if (!signData.gifts || !Array.isArray(signData.gifts)) {
            //@ts-ignore
            LoggerUtil.getInstance().log(`The check-in list data is empty or not in array format`);
            return;
        };

        if (signData.gifts.length != 7) {
            //@ts-ignore
            LoggerUtil.getInstance().log(`Check in list data length error`);
            return;
        };

        let len = signData.gifts.length;
        let index = 0;
        let addSignItem = () => {
            let gift = signData.gifts[index];
            if (index <= 5) {
                let signItemPos = this.itemPosArr[index];
                let signItemNode = cc.instantiate(itemPrefab);
                let signItemCtrl = signItemNode.getComponent(SignItemCtrl);
                if (signItemCtrl) {
                    signItemCtrl.setSignItemData(gift, signData.today, signData.done, index + 1);
                    this.signItemCtrlMap.set(index + 1, signItemCtrl);
                };
                signItemNode.name = `signItemDay${index + 1}`;
                signItemNode.setPosition(signItemPos);
                this.node.addChild(signItemNode);
            }
            else if (index == 6) {
                this.lab_day7.string = "Day7";
                this.lab_day7Reward.string = `$${gift/100}`;
                if (signData.today > 7) {
                    this.node_day7Signed.active = true;
                    this.node_day7Unsigned.active = false;
                }
                else if (signData.today == 7 && signData.done == true) {
                    this.node_day7Signed.active = true;
                    this.node_day7Unsigned.active = false;
                }
                else if (signData.today == 7 && signData.done == false) {
                    this.node_day7Signed.active = false;
                    this.node_day7Unsigned.active = true;
                }
                else {
                    this.node_day7Signed.active = false;
                    this.node_day7Unsigned.active = false;
                };
            };
            index += 1;
            if (index == len) {
                this.btn_sign.node.active = true;
                this.btn_close.node.active = false;
                if (signData.done == true) {            
                    //@ts-ignore
                    if (GlobalCfg.USER_DATAS.recharged == 0 && CommonFun.getInstance().isNeedSignToastGetBtnChange()) {
                        this.btn_sign_type = 1;
                        this.lab_btnGetTip.string = `Play Now`;
                        this.btn_close.node.active = true; 
                        let actTime = 0.5;
                        this.btn_sign.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1), cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1))));
                    }
                    else {
                        this.btn_sign_type = 0;
                        this.btn_sign.interactable = false;
                        this.btn_sign.enableAutoGrayEffect = true;  
                        this.btn_close.node.active = true; 
                    };
                };
                this.unschedule(addSignItem);
                return;
            };
        };
        this.schedule(addSignItem, 2/cc.game.getFrameRate(), len - 1, 0);
    }


    tryEnterMinScoreTP() {
        //@ts-ignore
        if (CommonFun.getInstance().isNeedUpdata("tpGame") == false) {
            //@ts-ignore
            if (GlobalCfg.USER_DATAS.openModules.includes(100)) {
                //@ts-ignore
                let teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti;
                teenPattiRoomInfo = teenPattiRoomInfo.sort((a, b) => {
                    return a.entrycondition - b.entrycondition;
                });
                teenPattiRoomInfo = teenPattiRoomInfo.filter((item) => {
                    return item.trial == false && item.isblind == false;
                });
                let itemData = null;
                for (let i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
                    //@ts-ignore
                    if (teenPattiRoomInfo[i].entrycondition <= GlobalCfg.USER_DATAS.userDiamond && GlobalCfg.USER_DATAS.userDiamond <= teenPattiRoomInfo[i].entryconditionmax) {
                        itemData = teenPattiRoomInfo[i];
                        break;
                    };
                };
                if (!itemData) {
                    //@ts-ignore
                    window.isNeedShowRoomList = "tpGame";
                    //@ts-ignore
                    CommonFun.getInstance().showSelectRoom();
                    this.node.destroy();
                    return;
                };
                //@ts-ignore
                CommonFun.getInstance().showProgress();
                this.node.destroy();
                //@ts-ignore
                GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData.id;
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
            }
            else {
                //@ts-ignore
                CommonFun.getInstance().showTips(`TeenPatti is not open yet!`); 
            };
        }
        else {
            //@ts-ignore
            GameDownloader.getInstance().priorLoadGame("tpGame");
            this.node.destroy();
        };
    }
}
