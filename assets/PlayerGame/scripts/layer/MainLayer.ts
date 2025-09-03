

import Constants from "../Constants";
import { ItemDesc, ItemUnlockLevel } from "../datacenter/ItemData";
import { ENUM_AUDIO_CLIP, ENUM_GAME_LOSE_TYPE, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import CommonTool from "../framework/utils/CommonTool";
import { i18nManage } from "../i18n/i18nManage";
import AudiosManager from "../manager/AudiosManager";
import DataManager from "../manager/DataManager";
import PoolManager from "../manager/PoolManager";
import { StaticInstance } from "../StaticInstance";
import { formatSeconds, shuffle, toXY } from "../Utils";
import BaseDialog from "./BaseDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainLayer extends BaseDialog {

    btnPause: cc.Node = null
    levelLabel: cc.Node = null
    timerLabel: cc.Label = null
    timerIndex: number = -1
    combo: cc.Node = null
    comboTip: cc.Label = null
    comboProgress: cc.ProgressBar = null
    comboTime: number = 0
    comboTimeCurrent: number = 0
    starCollect: cc.Node = null
    starIcon: cc.Node = null
    tipsNode: cc.Node = null
    guideMaskNode: cc.Node = null
    guideNode: cc.Node = null
    bottomNode: cc.Node = null
    headerNode: cc.Node = null
    onLoad() {
        this.btnPause = cc.find('header/btn_pause', this.node)
        this.btnPause.on('click', this.onPauseClick, this)
        this.levelLabel = cc.find('header/level', this.node)
        const timerNum = cc.find('header/timer/num', this.node);
        this.headerNode = cc.find('header', this.node)
        this.bottomNode = cc.find('bottom', this.node)
        this.timerLabel = timerNum.getComponent(cc.Label)
        for (let index = 0; index < 4; index++) {
            const skill = this.bottomNode.getChildByName('skill' + index)
            const effNode = skill.getChildByName("effSprite");
            effNode.active = false;
            skill.on('click', () => {
                this.onSkillClick(index)
            })
        }
        this.combo = cc.find('combo', this.bottomNode)
        const ctip = this.combo.getChildByName('tip')
        this.comboTip = ctip.getComponent(cc.Label)
        const cprogress = this.combo.getChildByName('progress')
        this.comboProgress = cprogress.getComponent(cc.ProgressBar)
        this.starIcon = cc.find('header/star/icon', this.node)
        this.starCollect = cc.find('header/star/num', this.node)
        this.tipsNode = cc.find('tipsSprite', this.node)
        this.tipsNode.getChildByName("btn_close").on('click', this.onCloseTipsClick, this);
        this.tipsNode.active = false;

        this.guideMaskNode = cc.find('guideMaskNode', this.node)
        this.guideMaskNode.active = false;
        this.guideNode = cc.find('guideSprite', this.node)
        this.guideNode.active = false;

        console.log("winSizePixels.height",cc.winSize.height);

        let winSizePixels=cc.winSize;
        let num=winSizePixels.height/winSizePixels.width;

        if(!CommonTool.isFullScreen()){
            //非全面屏手机做适配
          //适配分辨率
         
          this.headerNode.y=this.headerNode.y-50;
          
          //15:9
          if(num<1.7){
              this.bottomNode.y=this.bottomNode.y+80;
              this.tipsNode.y=this.tipsNode.y+30;
          }else{
              this.bottomNode.y=this.bottomNode.y+60;
              this.tipsNode.y=this.tipsNode.y+30;
          }         
       }else{
            if(num>2.2){
               /// this.tabNode.y=this.tabNode.y-10;
            }
            else if(num<2.1&&num>2){
               // this.tabNode.y=this.tabNode.y+40;
            }else{
               // this.tabNode.y=this.tabNode.y+80;
            }
       } 
    }

    onShown(){
        
        if(DataManager.instance.levelData.level==1){
            this.bottomNode.active=false;
            this.headerNode.active=false;
         
        }else{
            this.bottomNode.active=true;
            this.headerNode.active=true;
            this.checkItemUnlock();
            this.checkItemGuide();
            this.updateItem();
        }
        
    }

    onHide(){
        this.unscheduleAllCallbacks();
        this.hideTips();
        this.hideItemGuide(false);
    }
    //掉落飞的效果
    public showDropEffect(dropInfo){
        const flyTarget = this.bottomNode.getChildByName('skill' + dropInfo.index)
        for (let index = 0; index < 3; index++) {
            let drop: cc.Node = cc.instantiate(dropInfo.item);
            drop.parent = this.node;
            drop.position = cc.v3(dropInfo.pos);
            drop.setContentSize(80, 80);
            drop.opacity = 255;

            this.fly(index, drop, flyTarget, ()=>{
                drop.removeFromParent();
                DataManager.instance.itemData.unlockItemData(dropInfo.index);
                this.updateItem();

                let action = cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(()=>{
                        this.checkItemGuide();
                    })
                );
                cc.tween(this.node).then(action).start();
            });
        }
    }
    //飞的效果
    private fly(flyIdx:number, dropNode:cc.Node, flyTarget:cc.Node,  callBack:Function) {
        let targetWPos = flyTarget.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetNPos = dropNode.parent.convertToNodeSpaceAR(targetWPos);
        dropNode.stopAllActions();
        let action = cc.sequence(
            cc.delayTime(0.1*flyIdx),
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(0.2, 1), 
                    cc.scaleTo(0.2, 0.5)), 
                    cc.moveTo(0.5, targetNPos).easing(cc.easeIn(1)
                )
            ),
            cc.fadeOut(0.1),
            cc.callFunc(callBack)
        );
        cc.tween(dropNode).then(action).start();
    }
    //检测道具解锁
    private checkItemUnlock(){
        const data = DataManager.instance.itemData.getItemData();
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (!element.isUnlock && DataManager.instance.levelData.level == ItemUnlockLevel[index]) {
                console.log("解锁新道具", element, ItemUnlockLevel[index]);
                StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ITEMUNLOCK, true, {
                    index: index,
                    callback: (dropInfo)=>{
                        console.log("效果参数：", dropInfo);
                        this.showDropEffect(dropInfo);
                    }
                });
                break;
            }
        }
    }
    //检测道具引导
    private m_curGuideIdx = -1;
    private checkItemGuide(){
        const data = DataManager.instance.itemData.getItemData();
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.isUnlock && !element.isGuide && DataManager.instance.levelData.level == ItemUnlockLevel[index]) {
                this.m_curGuideIdx = index;
                this.showItemGuide();
                break;
            }
        }
    }
    //显示道具引导
    private showItemGuide(){
        this.guideMaskNode.active = true;
        this.guideNode.active = true;
        this.tipsNode.active = true;
        this.tipsNode.getChildByName("Label").getComponent(cc.Label).string = ItemDesc[this.m_curGuideIdx];
        this.tipsNode.getChildByName("btn_close").active = false;

        for (let i = 0; i < 4; i++) {
            const skill = this.bottomNode.getChildByName('skill' + i)
            if (i === this.m_curGuideIdx) {
                skill.zIndex = this.guideMaskNode.zIndex + 1;
                const effNode = skill.getChildByName("effSprite");
                effNode.active = true;
                effNode.stopAllActions();
                const act = cc.repeatForever(
                    cc.sequence(
                        cc.scaleTo(0.3, 1.08),
                        cc.scaleTo(0.3, 1),
                        cc.delayTime(0.2),
                    )
                )
                cc.tween(effNode).then(act).start();
            
                const y = -426;
                const x = skill.position.x;
                console.log("箭头位置：", x, y);
                this.guideNode.setPosition(x, y);
                this.guideNode.stopAllActions();
                const act2 = cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(0.3, cc.v2(x, y)),
                        cc.moveTo(0.3, cc.v2(x, y + 50)),
                        cc.delayTime(0.2),
                    )
                )
                cc.tween(this.guideNode).then(act2).start();
            } else {
                skill.zIndex = this.guideMaskNode.zIndex - 1;
            }
        }
    }
    //隐藏道具引导
    private hideItemGuide(bGuide: boolean){
        this.guideMaskNode.active = false;
        this.guideNode.active = false;
        this.guideNode.stopAllActions();
        this.tipsNode.active = false;
        this.tipsNode.getChildByName("btn_close").active = true;

        for (let i = 0; i < 4; i++) {
            const skill = this.bottomNode.getChildByName('skill' + i)
            skill.zIndex = this.guideMaskNode.zIndex + 1;

            const effNode = skill.getChildByName("effSprite");
            effNode.active = false;
            effNode.stopAllActions();
        }

        if (bGuide && this.m_curGuideIdx != -1) {
            DataManager.instance.itemData.guideItemData(this.m_curGuideIdx);
            this.m_curGuideIdx = -1;
        }
    }

    //显示tips
    private showTips(){
        const s = [];
        let order = 0;
        const data = DataManager.instance.itemData.getItemData();
        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            if (e.isUnlock && index !== 2) {
                if (DataManager.instance.levelData.level == ItemUnlockLevel[index]) {
                    s.unshift({
                        order: 999,
                        index: index,
                        cnt: e.itemNum
                    });
                } else {
                    s.push({
                        order: order++,
                        index: index,
                        cnt: e.itemNum
                    });
                }
            }
        }
        if (s.length <= 0) {
            return;
        }
        s.sort((a, b)=>{
            return b.order - a.order;
        })
        s.sort((a, b)=>{
            return b.cnt - a.cnt;
        });
        console.log(s);
        let temp = s.filter((e)=> {
            if (e.cnt <= 0) {
                return e;
            }
        });
        console.log(temp);
        let tipSkill = null;
        if (s.length === temp.length) {
            temp = shuffle(s);
            tipSkill = temp[0];
        } else {
            tipSkill = s[0];
        }
        console.log(tipSkill);
        this.tipsNode.active = true;
        this.tipsNode.stopAllActions();
        this.tipsNode.getChildByName("Label").getComponent(cc.Label).string = ItemDesc[tipSkill.index];

        const skill = this.bottomNode.getChildByName('skill' + tipSkill.index)
        const effNode = skill.getChildByName("effSprite");
        effNode.active = true;
        effNode.stopAllActions();
        const act = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.3, 1.08),
                cc.scaleTo(0.3, 1),
                cc.delayTime(0.2),
            )
        )
        cc.tween(effNode).then(act).start();
    }

    //隐藏tips
    private hideTips(){
        this.tipsNode.active = false;
        this.tipsNode.stopAllActions();
        for (let index = 0; index < 4; index++) {
            const skill = this.bottomNode.getChildByName('skill' + index)
            const effNode = skill.getChildByName("effSprite");
            effNode.active = false;
            effNode.stopAllActions();
        }
    }

    //更新技能图标状态
    private updateItem() {
        const data = DataManager.instance.itemData.getItemData();
        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            const skill = this.bottomNode.getChildByName('skill' + index)
            skill.getChildByName("icon").active = e.isUnlock;
            skill.getChildByName("lock").active = !e.isUnlock;
            if (!e.isUnlock) {
                skill.getChildByName("labelBg").active=false;
                skill.getChildByName("label").getComponent(cc.Label).string = `Lv.${ItemUnlockLevel[index]}`;
            } else {
                skill.getChildByName("labelBg").active=true;
                skill.getChildByName("label").getComponent(cc.Label).string = e.itemNum > 0 ? `${e.itemNum}` : '+';
            }
        };
    }

    onDestroy() {
        this.btnPause.off('click', this.onPauseClick, this)
        this.tipsNode.getChildByName("btn_close").off('click', this.onCloseTipsClick, this);
        this.unscheduleAllCallbacks();
        this.hideTips();
    }

    onEnable() { }

    onDisable() { }

    rendorLevel() {
        this.levelLabel.getComponent(cc.Label).string = i18nManage._getLabel('txt_showlevel',[DataManager.instance.levelData.level+""]);
        this.checkItemUnlock();
    }

    rendorStarCollect() {
        this.starCollect.getComponent(cc.Label).string = `${DataManager.instance.levelData.currentStarScore}`
    }

    onPauseClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.setMainTimer(false)
        StaticInstance.uiManager.setMainTimerSound(false);
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING,true,Constants.GAME_SCENCE.MAIN);
    }

    onTimerStart() {
        this.onTimerStop()
        this.timerLabel.string = formatSeconds(`${DataManager.instance.levelData.timer}`, 'i:s')
        this.timerLabel.schedule(() => {
            if (DataManager.instance.levelData.timer <= 1) this.timerLabel.unscheduleAllCallbacks()
                if (DataManager.instance.isSchedule) {
                    DataManager.instance.levelData.timer--
                    if (DataManager.instance.levelData.timer < 0) DataManager.instance.levelData.timer = 0
                    this.timerLabel.string = formatSeconds(`${DataManager.instance.levelData.timer}`, 'i:s')
                    this.onTimerSoundStart();
                    if (DataManager.instance.levelData.timer <= 0) {
                        StaticInstance.gameManager.onGameOver(false,ENUM_GAME_LOSE_TYPE.TIME)
                    }
                }
                
                //检测道具提示
                if (DataManager.instance.isTip&&DataManager.instance.levelData.level>2) {
                    DataManager.instance.tipTime--;
                    if(DataManager.instance.tipTime<=0){
                        this.showTips();
                        DataManager.instance.isTip=false;
                    }
                }    
        }, 1)
    }

    //冰冻定时器
    private iceScheduler: Function = null;   
    private iceTime=15;
    onTimerPause(time:number) {
        this.onTimerStop();
        this.iceTime=time;
        this.timerLabel.string = formatSeconds(`${DataManager.instance.levelData.timer}`, 'i:s');

            this.iceScheduler = ()=>{
              this.iceTime--;
              if(this.iceTime<=0){
                  StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE,false);
                  this.stopIceCountDown();
                  this.onTimerStart();
              }
            };
            this.schedule(this.iceScheduler, 1);
        
    }

    stopIceCountDown() {
        if(this.iceScheduler) {
            this.unschedule(this.iceScheduler);
            this.iceScheduler = null;
        }
    }

    onTimerStop() {
        this.timerLabel.unscheduleAllCallbacks()
    }

    async onTimerSoundStart() {
        if (DataManager.instance.levelData.timer <= 10 && DataManager.instance.levelData.timer > 0 && this.timerIndex < 0) {
            this.timerIndex = await AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.TIMER, true)
        }
    }

    onTimerSoundStop() {
        AudiosManager.instance.stopSound(this.timerIndex)
        this.timerIndex = -1
    }

    onProgressStart(isInit: boolean) {

        if (isInit) {
            this.combo.opacity = 0
            return
        }
        this.combo.opacity = 255
        DataManager.instance.levelData.combo += 1
        // 收集星星
        const endPos = toXY(this.starIcon, StaticInstance.gameManager.stage)
        DataManager.instance.starStartPosArr.forEach(startPos => {
            const star = PoolManager.instance.getNode('Star', StaticInstance.gameManager.stage, cc.v3(startPos.x, startPos.y))
            const act = cc.spawn(cc.moveTo(0.5, cc.v2(endPos.x, endPos.y)), cc.scaleTo(0.5, 0.1))
            cc.tween(star).then(act).call(() => {
                star.removeFromParent()
                DataManager.instance.levelData.currentStarScore += DataManager.instance.levelData.combo
                this.rendorStarCollect()
            }).start()
        })
        DataManager.instance.starStartPosArr = []
        // 连击
        this.comboTip.string = `Combox${DataManager.instance.levelData.combo}`
        this.comboTime = DataManager.instance.levelData.comboTimer / DataManager.instance.levelData.combo
        this.comboTimeCurrent = this.comboTime
    }

    private onCloseTipsClick(){
        this.hideTips();
    }

    onSkillClick(index: number) {
        if (DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING) return
        const data = DataManager.instance.itemData.getItemData();
        if (!data[index].isUnlock) {
            return;
        }

        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.setMainTimer(false);
        StaticInstance.uiManager.setMainTimerSound(false);
      
        if (data[index].itemNum <= 0) {
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ITEM, true, {
                index: index,
                callback: ()=>{
                    this.updateItem()
                }
            });
            return;
        }
       

        const act = cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(()=>{
                if (!StaticInstance.uiManager.isActive(ENUM_UI_TYPE.ICE)) {
                    StaticInstance.uiManager.setMainTimer(true)
                    StaticInstance.uiManager.setMainTimerSound(true)
                }
            }),
        )
        this.node.stopAllActions();
        cc.tween(this.node).then(act).start();
       
        // 触发技能
        switch (index) {
            case 0:
                {
                    StaticInstance.gameManager.onSkillDelete()
                }
                break
            case 1:
                {
                    StaticInstance.gameManager.onSkillMagic();
                }
                break
            case 2:
                {
                    StaticInstance.gameManager.onSkillTime()
                }
                break
            case 3:
                {
                    StaticInstance.gameManager.onSkillShuffle()
                }
                break
        }

        if (this.m_curGuideIdx != -1) {
            this.hideItemGuide(true);
        } else {
            DataManager.instance.itemData.useItemData(index);
        }
        this.onCloseTipsClick();
        this.updateItem();
    }

    protected update(dt: number): void {
        if (this.comboTimeCurrent > 0) {
            this.comboTimeCurrent -= dt
            this.comboProgress.progress = this.comboTimeCurrent / this.comboTime
        } else {
            if (this.combo.opacity == 255) {
                this.comboTime = 0
                this.comboTimeCurrent = 0
                this.combo.opacity = 0
                DataManager.instance.levelData.combo = 0
            }
        }
    }
}
