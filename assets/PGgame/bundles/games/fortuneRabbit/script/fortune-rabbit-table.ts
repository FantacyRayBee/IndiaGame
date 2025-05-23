import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { CellItemData } from "./fortune-rabbit-logic";
import * as proto from "./protocol/slot_fortune_rabbit";
/** 图案编号 */
export namespace FortuneRabbitTable {
    export const itemsIds = [0, 9, 1, 2, 3, 4, 51, 81, 82];
    export const lines = {
        1: [0, 0, 0],
        2: [0, 1, 0],
        3: [0, 1, 1],
        4: [1, 1, 0],
        5: [1, 1, 1],
        6: [1, 2, 1],
        7: [1, 2, 2],
        8: [2, 2, 1],
        9: [2, 2, 2],
        10: [2, 3, 2]
    }



    export const tabelInfo = {
        roomId: 0,
        type: 0,
        screen: undefined,
        //缓存feature模式时的台面item数据
        featureScreen: [0],
        /** 转动圈数 */
        circle: 2,
        /** 标记游戏是否滚动中 */
        bRolling: false,
        /** 是否freespin 模式 */
        isFree: false,
        musicName: "",
        tablebg: "normal",
        isInit: false,
        /** 所有动画结束后才能spin */
        isAnimEnd: true,
        //任务队列开关
        task: false,
        //bigWin的倍数等级
        winLevel: [20, 35, 50],
        //当前是否是福牛模式
        bTrigger: false,
        //当前福牛模式还有几次滚动
        rollLeftCountForTrigger: 0,
        //本轮滚动完成列数
        rollendCount: 0,
        //是否是快速模式
        isQuickModel: false,
        //当前是否中奖
        bWin: false,
        //当前是否处于得分滚动过程中(该过程不允许打断)
        bWinScoreRuning: false,
        //是否ball中奖
        bBallWin: false,
        //免费模式数据
        featureData: new Array<number>(),
        //跑分倍数间隔
        runScoreLevels: [5, 20],
        //减去下注额后的余额
        lastBonus: 0,
        //当前是否是假免费模式
        bWish: false,
        //curBet
        curBet: 0,
        isRollEnd: false,
        wildCount: 0,
        startRollTime: 0,
    };

    export function reset() {
        FortuneRabbitTable.tabelInfo.musicName = "";
        FortuneRabbitTable.tabelInfo.bRolling = false;
        FortuneRabbitTable.tabelInfo.isFree = false;
        FortuneRabbitTable.tabelInfo.isInit = false;
        FortuneRabbitTable.tabelInfo.isAnimEnd = true;
        FortuneRabbitTable.tabelInfo.task = false;
        FortuneRabbitTable.tabelInfo.rollendCount = 0;
        FortuneRabbitTable.tabelInfo.isQuickModel = false;
        FortuneRabbitTable.tabelInfo.bTrigger = false;
        FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger = 0;
    }

    export function setFirstScreen(): void {
        tabelInfo.screen = FortuneRabbitDefine.firstScreen;
    }

    export function setScreen(screen: proto.slot_fortune_rabbit.ISymbol[], betValue?: number) {
        const cells: CellItemData[][] = [];

        screen.forEach((ele, index) => {
            let cellIndex = index % 3;
            let rowIndex = Math.floor(index / 3);
            let value = ele.id == 9 ? ele.multi : 0;
            !cells[cellIndex] && (cells[cellIndex] = []);
            cells[cellIndex][rowIndex] = { itemId: ele.id, value: value };
        });

        tabelInfo.screen = cells;
    }

    export function getPatternByCellId(bTrigger: boolean = false) {
        const list = [];
        if (bTrigger) {
            //feature模式，只能生成0和9
            for (let index = 0; index < 4; index++) {
                const itemId = Math.random() > 0.8 ? 9 : 0;
                list.push(itemId);
            }
        } else {
            //不能生成0，9
            for (let index = 0; index < 4; index++) {
                const rand = 2 + Math.floor(Math.random() * (itemsIds.length - 2));
                list.push(itemsIds[rand]);
            }
        }
        return list;
    }
}
