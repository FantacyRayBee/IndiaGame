// 状态
export enum ENUM_GAME_STATUS {
    UNRUNING = 'UNRUNING',
    WIN = 'WIN',
    LOSE  ='LOSE',
    RUNING = 'RUNING'
}

//失败类型
export enum ENUM_GAME_LOSE_TYPE {
    TIME = 'TIME',
    CLEAR = 'CLEAR'
}

// 音效
export enum ENUM_AUDIO_CLIP {
    BGM = 'bgm',
    CLICK = 'click',
    LOSE = 'lose',
    WIN = 'win',
    COLLECT = 'collect',
    TIMER = 'timer',
    COLLECT_POWER = 'collect_power',
    LEVEL_UP = 'level_up',
    GET_IN = 'get_in',
    GET_OUT = 'get_out',
    CLEAR = 'clear',
    SHUFFLE = 'shuffle',
    SKILL_TIME = 'skill_time',
    SKILL_DELETE = 'skill_delete',
    MONEY = 'money',
    UNLOCK = 'unlock'
}

// ui层
export enum ENUM_UI_TYPE {
    MENU = 'MenuLayer',
    MAIN = 'MainLayer',
    SETTING = 'SettingDialog',
    LOSE = 'LoseDialog',
    WIN = 'WinDialog',
    RANK = 'RankListDialog',
    ICE = 'IceLayer',
    START = 'StartDialog',
    ITEM = 'ItemDialog',
    ITEMUNLOCK = 'ItemUnlockDialog',
    ADDHEART = 'AddHeartDialog'
}

// 事件
export enum ENUM_GAME_EVENT { }

// 资源
export const ENUM_RESOURCE_TYPE = ([
    { content: cc.Node, path: 'i18n', type: 'i18n', ratio: 0.1 },
    { content: cc.AudioClip, path: 'audio', type: 'audio', ratio: 0.3 },
    { content: cc.Prefab, path: 'prefab', type: 'prefab', ratio: 0.3 },
    { content: cc.SpriteFrame, path: 'sprite', type: 'sprite', ratio: 0.3 }
])

//关卡类型
export enum ENUM_LEVEL_TYPE {
    NORMAL = 0,   //普通
    MOVE = 1,     //左右移动
    UPDOWN = 2    //上下移动
}

//关卡难度
export enum ENUM_LEVEL_DIFFICULTY {
    EASY=0,            //新手
    SIMPLE =1,         //简单
    NORMAL = 2,     //普通
    DIFFICULT = 3,     //困难
    DEAD = 4           //必死
}

//货架类型
export enum ENUM_CONTAINER_TYPE {
    NORMAL = 0,   //普通
    MOVE = 1,     //左右移动
    REGULAR = 2,  //固定
    UP = 3,        //上移动
    DOWN = 4,      //下移动
    LOCK =10       //普通加锁货架
}

//商品大类型
export enum ENUM_GOODS_TYPE {
    BEVERAGE= 1,    //饮料
    DAILY = 2,      //日用品
    FOOD = 3,       //食物
    LETTER = 4,     //字母
    PLANT = 5,      //植物
    SNACKFOODS = 6, //零食
    TOY = 7,        //玩具
    JUICE = 8        //果汁
}

//货架所在位置
export enum ENUM_CONTAINER_POSTION {
    LEFT = 0,   //左边货架
    RIGHT = 1,     //中间货架
    CENTER = 2  //右边货架
}
