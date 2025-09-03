

const { ccclass, property } = cc._decorator;

import { ENUM_AUDIO_CLIP, ENUM_GAME_LOSE_TYPE, ENUM_GAME_STATUS, ENUM_LEVEL_TYPE, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import { shuffle, random, toXY } from "../Utils";
import Goods from "../game/Goods";
import Container from "../game/Container";
import AudiosManager from "./AudiosManager";
import DataManager from "./DataManager";
import PoolManager from "./PoolManager";
import { LEVEL_CONFIG } from "../config/LevelsConfig";
import Levels from "../game/Levels";
import Tip from "../ui/Tip";
import CommonTool from "../framework/utils/CommonTool";
import EffectManager from "./EffectManager";

type OldGoods = {
    goodsId: number;
    containerId: number;  //所在货架id
    layer: number;        //所在货架层级 1-2-3-4-5。。。。。
  };

@ccclass
export default class GameManager extends cc.Component {
    stage: cc.Node = null
  //  containers: cc.Node[] = [];
    levels:Levels=null;
    tipNode: cc.Node = null

    onLoad() {
        StaticInstance.setGameManager(this)
        this.stage = cc.find('Stage', this.node)
    }

    onDestroy() { }

    // 开始游戏
    onGameStart() {
        DataManager.instance.reset()
        this.initGame()
    }

    // 获取牌面状态
    getGameStatus() {
        let count = 0
        let indexs = new Map<number, number>();

        const frontContainers = DataManager.instance.frontContainers.filter(frontContainer => !frontContainer.parent.parent.getComponent(Container).isLock)
        for (let i = 0; i < frontContainers.length; i++) {
            const goods = frontContainers[i].getChildByName('Goods');
            if (!goods) {
                count++
            } else {
                const goodsComponent = goods.getComponent(Goods)
                const key = goodsComponent.id
                if (indexs.has(key)) {
                    indexs.set(key, indexs.get(key) + 1)
                } else {
                    indexs.set(key, 1)
                }
            }
        }

       // console.log("count",count);

       // console.log("indexs",indexs);

        let max: number | undefined;
        indexs.forEach(value => {
            if (max === undefined || value > max) {
                max = value;
            }
        })

       // console.log("max",max);

        return { isGameLose: count == 0, isGameShuffle: (max < 3 && (count <= 2)) }
    }

    // 洗牌
    onGameShuffle(deletePairs: number = 0) {
        let handleRefresh = ()=>{    
            DataManager.instance.isShuffling = true
            console.log('开始洗牌:', DataManager.instance.shuffleLoopNum, deletePairs)
            let goodsIndexArr = []
            this.levels.containers.forEach(container => {
                const backContainers = container.node.getChildByName('back').children
                backContainers.forEach(back => {
                    const goods = back.getChildByName('Goods')
                    if (goods) {
                        goodsIndexArr.push(goods.getComponent(Goods).id)
                        goods.destroy()
                    }
                })
                const frontContainer = container.node.getChildByName('front').children
                frontContainer.forEach(front => {
                    const goods = front.getChildByName('Goods')
                    if (goods) {
                        goodsIndexArr.push(goods.getComponent(Goods).id)
                        goods.destroy()
                    }
                })
            })
            DataManager.instance.goodsData.forEach(data => {
                data.forEach((d: any) => {
                    if (d && d.length > 0) goodsIndexArr.push(...d)
                })
            })
            // 删除deletePairs对数据
            if (deletePairs > 0) {
                let deleteIndexArr: number[] = []
                for (let d = 0; d < goodsIndexArr.length; d++) {
                    const tempIndex = goodsIndexArr[d]
                    if (deleteIndexArr.length >= deletePairs) {
                        break
                    } else {
                        if (deleteIndexArr.indexOf(tempIndex) >= 0) {
                            continue
                        } else {
                            deleteIndexArr.push(tempIndex)
                        }
                    }
                }
                // 解锁
                this.levels.locks.forEach((lock, index) => {
                    lock.updateLockNum();
                })
                
                // 取消时停技能
                if (StaticInstance.uiManager.isActive(ENUM_UI_TYPE.ICE)) {
                    StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE, false)
                    StaticInstance.uiManager.setMainTimer(true)
                    StaticInstance.uiManager.setMainTimerSound(true)
                }
                // 效果
                this.levels.containers.forEach(container => {
                    const collect = PoolManager.instance.getNode('Collect', container.node)
                    // 收集星星起始点
                    const starStartPos = toXY(container.node, this.stage)
                    DataManager.instance.starStartPosArr.push(starStartPos)
                })
                //差集
                goodsIndexArr = goodsIndexArr.filter(function (v) { return deleteIndexArr.indexOf(v) == -1 })
                DataManager.instance.levelData.currentClearNums+= deleteIndexArr.length;
                DataManager.instance.levelData.clearAllNums+=deleteIndexArr.length;
            }

            // 数据为空，判断胜利
            if (goodsIndexArr.length <= 0) {
                
                this.onGameOver(true,null)
                return
            }

            // 随机重组数据
            goodsIndexArr = shuffle(goodsIndexArr)
            this.generateGroupData(goodsIndexArr)

            // 重新生成牌局
            for (let i = 0; i < this.levels.containers.length; i++) {
                const container = this.levels.containers[i]
                const containerComponent = container.getComponent(Container)
                containerComponent.initFront()
                containerComponent.initBack()
            }
            const allGoodsList: Goods[] = [];
            this.levels.containers.forEach(container => {
                const backContainers = container.node.getChildByName('back').children
                backContainers.forEach(back => {
                    const goods = back.getChildByName('Goods')
                    if (goods) {
                        goods.opacity = 0;
                        allGoodsList.push(goods.getComponent(Goods))
                    }
                })
                const frontContainer = container.node.getChildByName('front').children
                frontContainer.forEach(front => {
                    const goods = front.getChildByName('Goods')
                    if (goods) {
                        goods.opacity = 0;
                        allGoodsList.push(goods.getComponent(Goods))
                    }
                 })
            })
            console.log("allGoodsList数量。。。。", allGoodsList);
            for (let index = 0; index < allGoodsList.length; index++) {
                const element = allGoodsList[index];
                element.backFrontEffect(()=>{});
            }
            console.log("this.getGameStatus().isGameShuffle",this.getGameStatus().isGameShuffle);

            // 判断洗牌是否成功
            this.scheduleOnce(() => {
                if (this.getGameStatus().isGameShuffle) {
                    DataManager.instance.shuffleLoopNum += 1
                    if (DataManager.instance.shuffleLoopNum < 1000) {
                        this.onGameShuffle()
                    } else {
                        // console.log('洗牌无解')
                        DataManager.instance.isShuffling = false
                        this.onGameOver(false,ENUM_GAME_LOSE_TYPE.CLEAR)
                    }
                } else {
                    // console.log('洗牌成功')
                    DataManager.instance.isShuffling = false
                }
            }, 0.01)
        }

        //开始刷新动画
        const allGoodsList: Goods[] = [];
        this.levels.containers.forEach(container => {
            const backContainers = container.node.getChildByName('back').children
            backContainers.forEach(back => {
                const goods = back.getChildByName('Goods')
                if (goods) {
                    allGoodsList.push(goods.getComponent(Goods))
                }
            })
            const frontContainer = container.node.getChildByName('front').children
            frontContainer.forEach(front => {
                const goods = front.getChildByName('Goods')
                if (goods) {
                    allGoodsList.push(goods.getComponent(Goods))
                }
             })
        })
        console.log("allGoodsList数量。。。。", allGoodsList);
        let s = StaticInstance.gameManager.stage.getContentSize();
        const targetWPos = cc.v2(s.width/2, s.height/2);
        let i = 0;
        for (let index = 0; index < allGoodsList.length; index++) {
            const element = allGoodsList[index];
            element.node.active = false;

            const wpos = toXY(element.node, StaticInstance.gameManager.stage);
            const flyNode = cc.instantiate(element.node);
            flyNode.active = true;
            flyNode.parent = StaticInstance.gameManager.stage;
            flyNode.stopAllActions();
            flyNode.setPosition(wpos);
          
            const goodsComponent = flyNode.getComponent(Goods)
            goodsComponent.toFrontEffect(()=>{
                const pos = flyNode.parent.convertToNodeSpaceAR(targetWPos);
                let dist = cc.Vec2.distance(flyNode.position, cc.v3(pos));
                let time = dist/500;
                let action = cc.sequence(
                    cc.delayTime(0.1),
                    cc.moveTo(time, cc.v2(pos)).easing(cc.easeIn(1)),
                    cc.callFunc(()=>{
                        i++;
                        EffectManager.instance.play('Collect', flyNode.parent, {pos: flyNode.position});
                        if (i >= allGoodsList.length) {
                            console.log("飞完收集一个星星.")
                            //收集星星
                            DataManager.instance.starStartPosArr.push(flyNode.position);
                            this.scheduleOnce(()=>{
                                handleRefresh();
                            }, 0.5)
                        }
                    }),
                    cc.destroySelf()
                );
                cc.tween(flyNode).then(action).start();
            })
        }
    }

    // 游戏检测
    onGameCheck() {
        // 两种情况
        let goodsCount=0;
        for (let index = 0; index < this.levels.containers.length; index++) {
            let count = this.levels.containers[index].goodsCount;
            console.log(this.levels.containers[index].col,this.levels.containers[index].row,count);
            goodsCount=goodsCount+count;
        }
        console.log("goodsCount",goodsCount);
       // const level = Math.min(DataManager.instance.levelData.level, LEVEL_DATA.length)
      //  const total = LEVEL_DATA[level - 1]['pairs'] * 3
        //if (DataManager.instance.clearNums >= total) {
        if(goodsCount<=0){
            // 其一，已全部消除，判定了挑战成功
            this.onGameOver(true,null);
        } else {
            // 其二，不存在可消除的情况，失败或提示
            const status = this.getGameStatus();
            console.log("status",status);
            if (status.isGameLose) {
                this.onGameOver(false,ENUM_GAME_LOSE_TYPE.CLEAR)
            } else if(status.isGameShuffle){
                //提示用户使用刷新道具,下一版本实现
               /* if(DataManager.instance.levelData.level>6&&!DataManager.instance.isTipRefresh){
                    DataManager.instance.isTipRefresh=true;
                    if (status.isGameShuffle) {
                        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.SHUFFLE)
                        this.onGameShuffle()
                    }*/
              //  }else{
                    this.onGameOver(false,ENUM_GAME_LOSE_TYPE.CLEAR);
               // }
                
            }
        }
    }

    // 游戏结算  loseTye,失败类型 
    onGameOver(iswin:boolean,loseTye:ENUM_GAME_LOSE_TYPE) {
        if (StaticInstance.uiManager.isActive(ENUM_UI_TYPE.ICE)) StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE, false);
        StaticInstance.uiManager.setMainTimer(false)
        StaticInstance.uiManager.setMainTimerSound(false)
       /* if (!iswin&& DataManager.instance.status==ENUM_GAME_STATUS.RUNING) {
            DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING;
            this.scheduleOnce(() => {
                StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE)
            }, 0.5);
            return;
        }   */
        if (iswin) {
            DataManager.instance.status = ENUM_GAME_STATUS.WIN
            AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.WIN)
            this.scheduleOnce(() => {
                let level = DataManager.instance.levelData.level
                level += 1
                DataManager.instance.levelData.level = level
                if (level > DataManager.instance.levelData.levelMax) {
                    DataManager.instance.levelData.levelMax = level
                }
                DataManager.instance.rankInfoData.isRankList=true;
                DataManager.instance.rankInfoData.initRankInfo();
                DataManager.instance.levelData.succCount++;
                DataManager.instance.levelData.failCount=0;
                DataManager.instance.levelData.revivewCount=0;
                DataManager.instance.levelData.restartCount=0;
                DataManager.instance.levelData.todayPlayCount++;
                DataManager.instance.levelData.todayPlayLevels++;
                DataManager.instance.levelData.saveCurrData();
                DataManager.instance.levelData.saveData();

                DataManager.instance.rankInfoData.todayScore+=DataManager.instance.levelData.currentStarScore;
                DataManager.instance.rankInfoData.todayScore+=DataManager.instance.levelData.currentStarScore;
                DataManager.instance.rankInfoData.todayScore+=DataManager.instance.levelData.currentStarScore;
                DataManager.instance.rankInfoData.todayScore+=DataManager.instance.levelData.currentStarScore;
                DataManager.instance.rankInfoData.todayScore+=DataManager.instance.levelData.currentStarScore;
                DataManager.instance.rankInfoData.saveBestRankData();
                StaticInstance.uiManager.toggle(ENUM_UI_TYPE.WIN)
            }, 0.8)
        } else {
            DataManager.instance.status = ENUM_GAME_STATUS.LOSE
            AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.LOSE);
            
                this.scheduleOnce(() => {
                    StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE,true,loseTye);
                }, 0.8)
           
            
        }
    }

    // 初始化游戏
    async initGame() {
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
       // this.containers = []
        this.stage.removeAllChildren();
        if(this.levels){
            this.levels.release();
        }
        this.levels=null;

        /*
        const level = Math.min(DataManager.instance.levelData.level, LEVEL_DATA.length)
        const { prefab, pairs, isRandom } = LEVEL_DATA[level - 1];
        */
        let level = Math.min(DataManager.instance.levelData.level, LEVEL_CONFIG.length);
        let levelData=LEVEL_CONFIG[level - 1];

        //初始化关卡
         let type=levelData.type;
        let prefabName="NormalLevel";
        if(level==1){
            prefabName="Level1";
        }
        else if(type==ENUM_LEVEL_TYPE.NORMAL){
            prefabName="NormalLevel";
        }else if(type==ENUM_LEVEL_TYPE.MOVE){
            prefabName="MoveLevel"+levelData.move;
        }
        const levelNode = PoolManager.instance.getNode(prefabName, this.stage);
        this.levels=levelNode.getComponent(Levels);

        // 所有goods
        let goodsIndexArr=this.levels.initLevel(level);
        let isRandom=false;


        // 初始化货柜
       /* const levelNode = PoolManager.instance.getNode(prefab, this.stage)
        const containers = levelNode.children
        this.containers = containers
        for (let i = 0; i < containers.length; i++) {
            const container = containers[i]
            container.getComponent(Container).init(i, isRandom)
        }*/

      //  if (isRandom) {
         /*   if (this.levels.goodsCount > 60) return
            // 60个图
            let spriteIndexArr = []
            for (let s = 1; s <= 60; s++) {
                spriteIndexArr.push(s)
            }
            spriteIndexArr = shuffle(spriteIndexArr)
            
           // let goodsIndexArr = []
            for (let p = 0; p < this.levels.goodsCount; p++) {
                const index = spriteIndexArr.pop()
                goodsIndexArr.push(index, index, index)
            }
            goodsIndexArr = shuffle(goodsIndexArr)*/

            // 分组数据
            this.generateGroupData(goodsIndexArr);

            for (let i = 0; i < this.levels.containers.length; i++) {
                const container = this.levels.containers[i];
                container.initFront();
                container.initBack();
            }
        //}

       // console.log("getGameStatus",this.getGameStatus());
        // 初始化洗牌
        if (this.getGameStatus().isGameShuffle) {          
            this.onGameShuffle()
        }

        // ui渲染
        StaticInstance.uiManager.setMainLevel();
        StaticInstance.uiManager.setMainTimer(true);
        StaticInstance.uiManager.setMainProgress(true)
        StaticInstance.uiManager.setMainPowerCollect();
        DataManager.instance.status = ENUM_GAME_STATUS.RUNING

        // 第一关加载tip手势
        if (DataManager.instance.levelData.level == 1) {
            this.tipNode = PoolManager.instance.getNode('Tip', this.stage);
            let tip=this.tipNode.addComponent(Tip);
            tip.init();
            tip.startTip(1);
        }

        await StaticInstance.fadeManager.fadeOut()
    }

    // 生成分组数据
    generateGroupData(goodsIndexArr: number[]) {
        // 结果集
        let res = []
        // 按照容器分组
        for (let i = 0; i < this.levels.containers.length; i++) {
            res[i] = []
        }

        console.log("goodsIndexArr",goodsIndexArr);
        // 分组入柜  index=0代表留空
        for (let j = 0; j < goodsIndexArr.length; j++) {

            const index = goodsIndexArr[j]
            const arr = res[j % this.levels.containers.length] //第几个容器的数组
            if (arr.length) {
                const last = arr[arr.length - 1]  //last为货架最上面一层的商品数组，长度为3
                if (last.length == 1) {
                    last.push(index)
                } else if (last.length == 2) {
                    if (index!=0&&last[0] == index && last[1] == index) {  //如果该层前两个商品和第三个商品一致，将该商品放到更上一层
                        arr.push([index])
                    } else {

                        if(DataManager.instance.levelData.level==1){
                            last.push(index);
                        }else{
                            // 随机
                            
                         if (random(0, 1)) {
                                arr.push([index])
                            } else {
                                // 最后一组数据留空位
                                if ((j == goodsIndexArr.length - 1)&&DataManager.instance.levelData.level!=1) {
                                    arr.push([index])
                                } else {
                                    last.push(index)
                                }
                            }
                        }
                       
                    }
                } else {
                    arr.push([index])
                }
            } else {
                arr.push([index]);  //放了一个数组进去
            }
        }

        
        for (let i = 0; i < this.levels.containers.length; i++) {
            let arry=res[i];
            //console.log("res"+i,res[i]);
            for (let j = 0; j < res[i].length; j++) {
                const element = res[i][j];
                //console.log("res"+i+j,element);
            }
            
        }
        
        DataManager.instance.goodsData = res
    }

    //时间暂停
    onSkillTime() {
        if (StaticInstance.uiManager.isActive(ENUM_UI_TYPE.ICE)) {
            return;
        }
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.SKILL_TIME);
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE);
        StaticInstance.uiManager.setMainPauseTimer(15);
        StaticInstance.uiManager.setMainTimerSound(false);
    }

    //刷新
    onSkillShuffle() {
        if (DataManager.instance.isShuffling) return
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.SHUFFLE)
        this.onGameShuffle()
    }

    //获得当前关卡的所有商品信息
    getAllGoods(){
        let  oldGoodsIsdMap=new Map<number, OldGoods[]>();


        //对front进行遍历
        this.levels.containers.forEach(container => {
            const frontContainers = container.node.getChildByName('front').children;
            for (let j = 0; j < frontContainers.length; j++) {
                const front = frontContainers[j];
                const goods = front.getChildByName('Goods')
                if (goods) {
                    const goodsComponent = goods.getComponent(Goods)
                    const key = goodsComponent.id
                    let oldGoods:OldGoods={goodsId:key,containerId:goodsComponent.container.index,layer:1};
                    if (oldGoodsIsdMap.has(key)) {
                        let s= oldGoodsIsdMap.get(key);
                        s.push(oldGoods);
                        oldGoodsIsdMap.set(key, s);
                    } else {
                        oldGoodsIsdMap.set(key, [oldGoods]);
                    }
                }
            }
        })

        //对back层进行遍历
        this.levels.containers.forEach(container => {
            const backContainers = container.node.getChildByName('back').children;
            for (let j = 0; j < backContainers.length; j++) {
                const back = backContainers[j];
                const goods = back.getChildByName('Goods')
                if (goods) {
                    const goodsComponent = goods.getComponent(Goods)
                    const key = goodsComponent.id;
                    let oldGoods:OldGoods={goodsId:key,containerId:goodsComponent.container.index,layer:2};

                    if (oldGoodsIsdMap.has(key)) {
                        let s= oldGoodsIsdMap.get(key);
                        s.push(oldGoods);
                        oldGoodsIsdMap.set(key, s);
                    } else {
                        oldGoodsIsdMap.set(key, [oldGoods]);
                    }
                }
            }
        })

        //对第三层以后的进行遍历
        for (let i = 0; i < this.levels.containers.length; i++) {
            let index = this.levels.containers[i].index;
            const arr = DataManager.instance.goodsData[index]; //取得货架暂存的所有商品
            if (!arr || arr.length <= 0) {
                continue;
            }else{
                for (let k = arr.length-1; k>=0; k--) {        //从上往下一层一层取
                    let  data: any = arr[k];
                    if (!data || data.length <= 0){
                        continue;
                    }
                    for (let l = 0; l < data.length; l++) {
                       let  key=data[l];
                       let oldGoods:OldGoods={goodsId:key,containerId:index,layer:2+(arr.length-k)};
                       if (oldGoodsIsdMap.has(key)) {
                           let s= oldGoodsIsdMap.get(key);
                           s.push(oldGoods);
                           oldGoodsIsdMap.set(key, s);
                       } else {
                           oldGoodsIsdMap.set(key, [oldGoods]);
                       }
                    }
                    
                }
            }
        }

        console.log("oldGoodsIsdMap",oldGoodsIsdMap);
        
        return  oldGoodsIsdMap;
    }

    onSkillMagic(){
        this.getAllGoods();
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.SKILL_DELETE);
        // 优先找牌面数据变身
        // 牌面数据
        const goodsfrontContainers = [];
        //back数据
        const goodsbackContainers = [];

        

        for (let i = 0; i < DataManager.instance.frontContainers.length; i++) {
            const goods = DataManager.instance.frontContainers[i].getChildByName('Goods')
            if (goods) {
                goodsfrontContainers.push(goods);
            }
        }
        for (let i = 0; i < DataManager.instance.backContainers.length; i++) {
            const goods = DataManager.instance.backContainers[i].getChildByName('Goods')
            if (goods) {
                goodsbackContainers.push(goods);
                const goodsComponent = goods.getComponent(Goods );
                const key=goodsComponent.id;
                
            }
        }

        let indexs = new Map<number, Goods>();
        let count=9;
        if(goodsfrontContainers.length<count){
            count=goodsfrontContainers.length;
        }
        let count2=10;
        //1.从front层随机找9个商品，不够9个按最多的找
        for (let i = 0; i < count; i++) {
            let goods=CommonTool.getRandomByArray(goodsfrontContainers);
            if (goods) {
                let goodsComponent = goods.getComponent(Goods);

                let key = goodsComponent.id+goodsComponent.container.index;
                while(indexs.has(key)&&count2>0) {
                    goods=CommonTool.getRandomByArray(goodsfrontContainers);                
                    goodsComponent = goods.getComponent(Goods);
                    key = goodsComponent.id+goodsComponent.container.index;
                    count2--;
                } 
                indexs.set(key, goodsComponent);
                count2=10;
            }
        }

        let handlerChangeGood = ()=>{
            //2.将这9个商品替换为统一的商品
            let oldGoodsIsdMap=new Map<number,number>();
            let changeId=null;
            let index=0;
            indexs.forEach((v, k) => {      
                let key = v.id;
                    if (oldGoodsIsdMap.has(key)) {
                        //如果=3，代表不需要从back层替换
                        if(oldGoodsIsdMap.get(key)==2){
                            oldGoodsIsdMap.delete(key);
                        }else{
                            oldGoodsIsdMap.set(key, oldGoodsIsdMap.get(key) + 1)
                        }                   
                    } else {
                        oldGoodsIsdMap.set(key, 1)
                    }     
                if(index==0){
                    changeId=v.id;
                }else{
                    
                    v.setId(changeId);
                }
                
                index++;
            });

            //3.获取当前所有的商品，对不是3的倍数的商品进行修正
            let allGoodsIdsMap=this.getAllGoods();
            //存放只有一个商品的商品数组
            let oldGoodsArray1=[];
            //存放有2个商品的商品数组
            let oldGoodsArray2=[];
            if(allGoodsIdsMap){
                allGoodsIdsMap.forEach((v, k) => {  
                    if(v.length%3==1){
                    let value=v[v.length-1];
                    oldGoodsArray1.push([value]);
                    }
                    if(v.length%3==2){
                        oldGoodsArray2.push([v[v.length-2],v[v.length-1]]);
                    }     
                    
                })
            }
            console.log("oldGoodsArray1",oldGoodsArray1);
            console.log("oldGoodsArray2",oldGoodsArray2);
            //还没有矫正数量的商品集合
            let noSetOldGoodsArray=[];
            //需要矫正的数量的商品集合里商品是1个还是2个。有1个需要矫正2个同样的商品。有2个需要矫正一个同样的商品。
            let noSetOldGoodsType=1;
            if(oldGoodsArray1==null||oldGoodsArray1.length==0||oldGoodsArray2==null||oldGoodsArray2.length==0){
                if(oldGoodsArray1!=null&&oldGoodsArray1.length>0){
                    noSetOldGoodsArray=oldGoodsArray1;
                    noSetOldGoodsType=1;
                }else{
                    noSetOldGoodsArray=oldGoodsArray2;
                    noSetOldGoodsType=2;
                }
                if(noSetOldGoodsArray&&noSetOldGoodsArray.length>0){
                    for (let index = 0; index < noSetOldGoodsArray.length; index++) {
                        const element = noSetOldGoodsArray[index];
                        let goodsInfo=noSetOldGoodsArray[index][0];
                        if(element.length==1){
                            console.log("this.addGoodsById000",this.addGoodsById(goodsInfo.goodsId,goodsInfo.containerId));
                            console.log("this.addGoodsById222",this.addGoodsById(goodsInfo.goodsId,goodsInfo.containerId));
                        }
                        if(element.length==2){
                            console.log("this.addGoodsById111",this.addGoodsById(goodsInfo.goodsId,goodsInfo.containerId));
                        }
                    }
                }
            }else{
                
                let count=oldGoodsArray1.length;
                if(oldGoodsArray1.length>oldGoodsArray2.length){
                    count=oldGoodsArray2.length;
                    for (let index = count; index < oldGoodsArray1.length; index++) {
                        noSetOldGoodsArray.push(oldGoodsArray1[index]);                   
                    }
                    noSetOldGoodsType=1;
                }else if(oldGoodsArray2.length>oldGoodsArray1.length){
                    for (let index = count; index < oldGoodsArray2.length; index++) {
                        noSetOldGoodsArray.push(oldGoodsArray2[index]);                   
                    }
                    noSetOldGoodsType=2;
                }
                //3.1. 对 1和2配对成功的商品进行数量矫正，将商品1的id改为商品2的id
                for (let index = 0; index <count; index++) {
                    let goods2 = oldGoodsArray2[index][0];
                    let goods1=oldGoodsArray1[index][0];
                    //将goods1换为goods2
                    let container=this.levels.getContainerByIndex(goods1.containerId);
                    container.updateGoodsById(goods1.layer,goods1.goodsId,goods2.goodsId);
                }
                this.getAllGoods();

                console.log("noSetOldGoodsArray",noSetOldGoodsArray);

                //3.2. 没有1-2匹配的商品重新矫正
                if(noSetOldGoodsArray&&noSetOldGoodsArray.length>0){
                    //3.3. 以3为倍数进行数据矫正
                    let noSetLastGoodsArray=[];
                    while(noSetOldGoodsArray.length%3>0){
                        noSetLastGoodsArray.push(noSetOldGoodsArray.pop);
                    }
                    if(noSetOldGoodsArray&&noSetOldGoodsArray.length>0){
                        for (let index = 0; index < noSetOldGoodsArray.length; index=index+3) {
                            let goodsInfo1=noSetOldGoodsArray[index][0];
                            let goodsInfo2=noSetOldGoodsArray[index+1][0];
                            let goodsInfo3=noSetOldGoodsArray[index+2][0];
                            if(noSetOldGoodsType==1){
                                //将2和3换成1的商品id
                                let container2=this.levels.getContainerByIndex(goodsInfo2.containerId);
                                container2.updateGoodsById(goodsInfo2.layer,goodsInfo2.goodsId,goodsInfo1.goodsId);
                                let container3=this.levels.getContainerByIndex(goodsInfo3.containerId);
                                container3.updateGoodsById(goodsInfo3.layer,goodsInfo3.goodsId,goodsInfo1.goodsId);
                            }
                            if(noSetOldGoodsType==2){
                                //将2个3的商品分别换成一个1和一个2的商品id                        
                                let container30=this.levels.getContainerByIndex(goodsInfo3.containerId);
                                container30.updateGoodsById(goodsInfo3.layer,goodsInfo3.goodsId,goodsInfo1.goodsId);

                                let goodsInfo31=noSetOldGoodsArray[index+2][1];
                                let container31=this.levels.getContainerByIndex(goodsInfo31.containerId);
                                container31.updateGoodsById(goodsInfo31.layer,goodsInfo31.goodsId,goodsInfo2.goodsId);
                            }
                            
                        }
                    }

                    //3.4. 对剩下的商品新生成商品来配对
                    for (let index = 0; index < noSetLastGoodsArray.length; index++) {
                        const element = noSetLastGoodsArray[index];
                        let goodsInfo=noSetLastGoodsArray[index][0];
                        if(element.length==1){
                            this.addGoodsById(goodsInfo.goodsId,goodsInfo.containerId);
                            this.addGoodsById(goodsInfo.goodsId,goodsInfo.containerId);
                        }
                        if(element.length==2){
                            this.addGoodsById(goodsInfo.goodsId,goodsInfo.containerId)
                        }
                    }
                }
            }
        }

        //开始播放魔法动画
        let bHandler = false;
        let lightEffect = (startPos: cc.Vec2)=>{
            indexs.forEach((v, k) => {
                const wpos = toXY(v.node, StaticInstance.gameManager.stage);
                let dist = cc.Vec2.distance(wpos, startPos);
                const effNode = PoolManager.instance.getNode(`light`, this.stage);
                effNode.position = cc.v3(startPos);
                effNode.setContentSize(effNode.width, dist);
                effNode.angle = -this.calculateAngle(startPos, wpos);
                v.toMagicFrontEffect(null);
                let action = cc.sequence(
                    cc.delayTime(0.4),
                    cc.callFunc(()=>{
                        const effNode2 = PoolManager.instance.getNode(`light2`, this.stage);
                        effNode2.position = cc.v3(wpos);  
                    }),
                    cc.delayTime(0.5),
                    cc.callFunc(()=>{
                        EffectManager.instance.play('Collect', v.node.parent)
                        v.backMagicFrontEffect(()=>{
                            if (!bHandler) {
                                bHandler = true;
                                console.log("魔法效果播放完了。。。");
                                handlerChangeGood();
                            }
                        });

                        const anim = effNode.getComponent(cc.Animation)
                        anim.stop();
                        effNode.removeFromParent();
                    }),
                );
                cc.tween(effNode).then(action).start();

                
            });
        };

        const magicPosNode = cc.find('magicPos', this.node)
        const effNode = PoolManager.instance.getNode(`magic`, StaticInstance.uiManager.getMainLayer().node);
        effNode.setPosition(magicPosNode.position);
        effNode.x = 700;
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(magicPosNode.position.x - 60, magicPosNode.position.y)).easing(cc.easeIn(1)),
            cc.moveTo(0.2, cc.v2(magicPosNode.position.x, magicPosNode.position.y)).easing(cc.easeIn(1)),
            cc.callFunc(()=>{
                lightEffect(cc.v2(effNode.position));        
            }),
            cc.delayTime(1),
            cc.destroySelf()
        );
        cc.tween(effNode).then(action).start();

        this.getAllGoods();
    }

    // 角度
    calculateAngle(first:cc.Vec2, second:cc.Vec2){
        let len_y = second.y - first.y;
        let len_x = second.x - first.x;
        let tan_yx = Math.abs(len_y / len_x);
        let temp = Math.atan(tan_yx) * 180/Math.PI;
        let angle = 0;
        if(len_y > 0 && len_x < 0){
            angle = temp - 90;
        }
        else if(len_y > 0 && len_x > 0){
            angle = -temp + 90;
        }
        else if(len_y < 0 && len_x < 0){
            angle = -temp - 90;
        }
        else if(len_y < 0 && len_x > 0){
            angle = temp + 90;
        }
        else if(len_y == 0 && len_x != 0){
            angle = len_x < 0 ? -90 : 90;
        }
        else if(len_x == 0 && len_y != 0){
            angle = len_y < 0 ? 180 : 0;
        }
        //console.log('Temp', temp);
        //console.log('Angle ', angle)
        return angle;
    }

    //添加商品到货架上，优先添加到第2层以后 startContainerId从这个货架开始查找位置
    addGoodsById(goodsId,startContainerId){
        let containerId=startContainerId+1;
        let containerLength=this.levels.containers.length
        if(containerId>=containerLength){
            containerId=0;
        }
        let container=this.levels.containers[containerId];
        let layer=container.getEmptyLayer(goodsId);
        //判断货架的第2或者第3层是否有空位
        while(layer==0&&startContainerId!=containerId){
            containerId++;
            if(containerId>=containerLength){
                containerId=0;
            }
            container=this.levels.containers[containerId];
            layer=container.getEmptyLayer();
        }
        if(startContainerId==containerId||layer==0){
            console.log("找不到合适位置:",goodsId,startContainerId,containerId,layer);
            return false;
        }
        //将商品加入
        return container.addGoodsById(layer,goodsId);
    }


    //消除
    onSkillDelete() {
            // 优先找牌面数据消除
            AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLEAR)
            // 牌面数据
            let backIds = new Map<number, number>()
            let frontIds = new Map<number, number>()
            this.levels.containers.forEach(container => {
                const backContainers = container.node.getChildByName('back').children;
                for (let j = 0; j < backContainers.length; j++) {
                    const back = backContainers[j];
                    const goods = back.getChildByName('Goods')
                    if (goods) {
                        const goodsComponent = goods.getComponent(Goods)
                        const key = goodsComponent.id
                        if (backIds.has(key)) {
                            backIds.set(key, backIds.get(key) + 1)
                        } else {
                            backIds.set(key, 1)
                        }
                    }
                }
            })

            this.levels.containers.forEach(container => {
                const frontContainers = container.node.getChildByName('front').children;
                for (let j = 0; j < frontContainers.length; j++) {
                    const front = frontContainers[j];
                    const goods = front.getChildByName('Goods')
                    if (goods) {
                        const goodsComponent = goods.getComponent(Goods)
                        const key = goodsComponent.id
                        if (frontIds.has(key)) {
                            frontIds.set(key, frontIds.get(key) + 1)
                        } else {
                            frontIds.set(key, 1)
                        }
                    }
                }
            })
            console.log("frontIds=============:", frontIds);
            console.log("backIds=============:", backIds);

            // 先在前排找到第一个满足3消的
            let key = -1;
            let flag = -1;
            frontIds.forEach((v, k) => {
                if (v >= 3) {
                    key = k;
                    flag = 3;
                }
            });
            if (key < 0) {
                //前排和后排一起找满足3消的
                frontIds.forEach((v, k) => {
                    if (v >= 2 && backIds.get(k) >= 1) {
                        key = k;
                        flag = 2;
                    }
                });
                if (key < 0) {
                    frontIds.forEach((v, k) => {
                        if (v >= 1 && backIds.get(k) >= 2) {
                            key = k;
                            flag = 1;
                        }
                    });
                }
            }
            // 牌面删除，若不足则魔棒刷新
            console.log("key =========", key, flag);
            if (key < 0) {
                this.onGameShuffle(1)
                this.checkGame();
            } else {
                console.log("走这里了。。。。");
                // 解锁
                if(this.levels.locks&&this.levels.locks.length>0){
                    this.levels.locks[0].updateLockNum();
                }
                // 取消时停技能
                if (StaticInstance.uiManager.isActive(ENUM_UI_TYPE.ICE)) {
                    StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE, false)
                    StaticInstance.uiManager.setMainTimer(true)
                    StaticInstance.uiManager.setMainTimerSound(true)
                }

                const frontGoodsList: Goods[] = [];
                this.levels.containers.forEach(container => {
                    const frontContainers = container.node.getChildByName('front').children;
                    for (let j = 0; j < frontContainers.length; j++) {
                        const front = frontContainers[j];
                        const goods = front.getChildByName('Goods')
                        if (goods) {
                            const goodsComponent = goods.getComponent(Goods)
                            if (goodsComponent.id == key) {
                                frontGoodsList.push(goodsComponent);
                            }
                        }
                    }
                })
                console.log("frontGoodsList数量。。。。", frontGoodsList);
                // 删除
                const delList: Goods[] = [];
                if (flag === 3) {
                    for (let index = 0; index < 3; index++) {
                        const e = frontGoodsList[index];
                        if (e) {
                            delList.push(e);
                        }
                    }
                } else {
                    const backGoodsList: Goods[] = [];
                    this.levels.containers.forEach(container => {
                        const backContainers = container.node.getChildByName('back').children;
                        for (let j = 0; j < backContainers.length; j++) {
                            const back = backContainers[j];
                            const goods = back.getChildByName('Goods')
                            if (goods) {
                                const goodsComponent = goods.getComponent(Goods)
                                if (goodsComponent.id == key) {
                                    backGoodsList.push(goodsComponent);
                                }
                            }
                        }
                    })
                    console.log("backGoodsList数量。。。。", backGoodsList);
                    for (let index = 0; index < frontGoodsList.length; index++) {
                        const e = frontGoodsList[index];
                        if (e) {
                            delList.push(e);
                        }
                    }
                    for (let index = 0; index < 3 - frontGoodsList.length; index++) {
                        const e = backGoodsList[index];
                        if (e) {
                            delList.push(e);
                        }
                    }
                }
                console.log("消除队列：", delList);
                //删除效果:往位置最高的商品往下50那里飞
                let t: cc.Vec2 [] = [];
                for (let index = 0; index < delList.length; index++) {
                    const element: Goods = delList[index];
                    const wpos = element.node.convertToWorldSpaceAR(cc.v2(0, 0))
                    t.push(wpos);
                }
                console.log(t);
                let targetWPos = cc.v2(0, 0);
                t.sort((a, b)=>{
                    return b.y - a.y;
                });
                targetWPos = t[0];
                targetWPos.y -= 150;
                console.log("目标位置：",targetWPos);
                let i = 0;
                for (let index = 0; index < delList.length; index++) {
                    const element = delList[index];
                    element.node.active = false;

                    const wpos = toXY(element.node, StaticInstance.gameManager.stage);
                    const flyNode = cc.instantiate(element.node);
                    flyNode.active = true;
                    flyNode.parent = StaticInstance.gameManager.stage;
                    flyNode.stopAllActions();
                    flyNode.setPosition(wpos);
                  
                    const goodsComponent = flyNode.getComponent(Goods)
                    goodsComponent.toFrontEffect(()=>{
                        element.setClear(false);
                        const pos = flyNode.parent.convertToNodeSpaceAR(targetWPos)
                        let action = cc.sequence(
                            cc.delayTime(0.1),
                            cc.moveTo(0.2, pos).easing(cc.easeIn(1)),
                            cc.callFunc(()=>{
                                i++;
                                EffectManager.instance.play('Collect', flyNode.parent, {pos: flyNode.position});
                                if (i >= 3) {
                                    console.log("飞完收集一个星星.")
                                    //收集星星
                                    DataManager.instance.starStartPosArr.push(flyNode.position);
                                    this.item1FlyCallBack();
                                }
                            }),
                            cc.delayTime(0.1),
                            cc.destroySelf()
                        );
                        cc.tween(flyNode).then(action).start();
                    })
                }
            }
    }

    private checkGame(){
        // 连击进度
        StaticInstance.uiManager.setMainProgress()
        // 如果死局则刷新,否则检测是否获胜
        /*const status = this.getGameStatus()
        if (status.isGameShuffle) {
            this.onGameShuffle()
        } else {
            
        }*/
        this.onGameCheck()
    }

    private item1FlyCallBack(){
        // 判空
        this.levels.containers.forEach(container => {
            const frontContainers = container.node.getChildByName('front').children
            let isEmpty = true
            for (let j = 0; j < frontContainers.length; j++) {
                const goodsContainer = frontContainers[j]
                if (goodsContainer.getChildByName('Goods')) {
                    isEmpty = false
                    break
                }
            }
            if (isEmpty) {
                // console.log('back to front')
                container.getComponent(Container).backToFront()
            } else {
                const backContainers = container.node.getChildByName('back').children
                let isEmpty = true
                for (let j = 0; j < backContainers.length; j++) {
                    const goodsContainer = backContainers[j]
                    if (goodsContainer.getChildByName('Goods')) {
                        isEmpty = false
                        break
                    }
                }
                if (isEmpty) {
                    // console.log('int back')
                    container.getComponent(Container).initBack()
                }
            }
        })
        this.checkGame();
    }

}
