import SystemData, { dc, field } from "../framework/SystemData";

//配置道具解锁关卡
export const ItemUnlockLevel = [2, 6, 2, 4];
//道具描述
export const ItemDesc = [
    "Eliminate 3 models",
    "Eliminate 9 models",
    "Pause time for 15 seconds",
    "Refresh all models",
];

@dc("ItemData")
export default class ItemDataClass extends SystemData{

    init(){
        
    }

    @field() //金币数量
    coins:number = 100;
   
    //局内道具   0-锤子  1-魔法  2-冰冻 3-刷新
    itemDatas = [
        {
            itemNum : 3,
            isUnlock: false,
            isGuide: false,
        },
        {
            itemNum : 3,
            isUnlock: false,
            isGuide: false,
        },
        {
            itemNum : 3,
            isUnlock: false,
            isGuide: false,
        },
        {
            itemNum : 3,
            isUnlock: false,
            isGuide: false,
        },
    ];

    addCoin(num:number){
        this.coins += num;  
        if(this.coins < 0){
            this.coins = 0;
        }
    }
    
    loadItemData(){
        let str = localStorage.getItem("ItemData.itemDatas");
        if (str){
            this.itemDatas = JSON.parse(str);
        }
    }

    getItemData(){
        return this.itemDatas;
    }

    useItemData(index: number){
        this.itemDatas[index].itemNum -= 1;
        if (this.itemDatas[index].itemNum <= 0) {
            this.itemDatas[index].itemNum = 0;
        }
        this.saveItemData();
    }

    unlockItemData(index: number){
        this.itemDatas[index].isUnlock = true;
        this.saveItemData();
    }

    guideItemData(index: number){
        this.itemDatas[index].isGuide = true;
        this.saveItemData();
    }

    addItemData(index: number){
        this.itemDatas[index].itemNum += 1;
        this.saveItemData();
    }

    saveItemData(){
        let str = JSON.stringify(this.itemDatas);
        localStorage.setItem("ItemData.itemDatas", str);
    }
}

export var itemData:ItemDataClass = SystemData.register(ItemDataClass)