
export default class Constants  {


    //是否开启调试模式
    static isUseDebug = false;

    //是否开启广告 
    static isUseAD = true;
    
    static SupportLangugae =[
        "en","tw","pt","ko","es","zh","fr","ja","de"
    ]

    static GAME_SCENCE = {
        HOME :  "HOME",
        MAIN :  "MAIN"
    }


        //排名类型
        static RankType = {
            'TODAY':'TODAY',
            'WEEK':'WEEK',
            'MONTH':'MONTH',
            'YEAR':'YEAR',
            'ALL':'ALL',
            'LEVEL':'LEVEL'
        }
    
        //最初排名
        static RankStartBest = {
            'TODAY':150100,
            'WEEK':182300,
            'MONTH':520030,
            'YEAR':1120030,
            'ALL':1120030,
            'LEVEL':2312
        }
    
        //最高排名分数
        static RankBest = {
            'TODAY':180100,
            'WEEK':212300,
            'MONTH':550030,
            'YEAR':1320030,
            'ALL':1320030,
            'LEVEL':3012
        }
    
        //每个排名统计个数
        static RankTypeCount = {
            'TODAY':1000,
            'WEEK':2000,
            'MONTH':5000,
            'YEAR':10000,
            'ALL':10000,
            'LEVEL':10000
        }

    static RANK_NAME_DEFAULT="";
    
    //最初开始排名时间,超过这个时间后top分数开始按规则上涨
    static StartRankDate='2023-12-05';

    //year all 用户名称
    static rankNameArray1 = [
        'Noah-1','Liam-2','Jacob-3','Mason-4','Michael-5','Alexander-6','James-7','Daniel-8','Ethan-9','조정은-10'
        ,'Emma-1','Emily','Madison-3','Isabella-4','Ava-5','Sophia-6','Kaitlyn-7','Hannah-8','Hailey-9','Olivia-10'
        ,'ともみ-1','香り-2','ちはる-3','タドポール-4','たわごと-5','梓軒-6','宇軒-7','子謙-8','凱晴-9','芷晴-10'
        ,'Connell-1','Pierre-2','Leno-3','Alain-4','François-5','Blanca-6','Diana-7','Julio-8','Mónica-9','Lisa-10'
        ,'曉晴-1','Abigail-2','Lily-3','Mia-4','Aiden-5','Chloe-6','Avery-7','Riley-8','Lydia-9','Negra-10'
        ,'Alice-1','Valentino-2','Heleno-3','Graça-4','Miguel-5','Jessica-6','Gabriel-7','Kylie-8','오윤아-9','정지훈-10'
        ,'天佑-1','英傑-2','致遠-3','浅田-4','Pablo-5','Kyra-6','Carla-7','Anna-8','Adam-9','Erich-10'
        ,'Amélia-1','Julia-2','李子奇-3','Allison-4','Morgan-5','Erwin-6','秋津-7','Moore-8','Young-9','真っ直ぐ-10'
        ,'Alessia-1','박승미-2','가오 엔야-3','김현아-4','リナ-5','峰子-6','Joana-7','Pedro-8','Nuno-9','Jaime-10'
        ,'Criseth-1','Dreijan-2','Crygord-3','Elelani-4','Beamar-5','Edwynn-6','冰雪-7','代芹-8','雨一直下-9','天團-10'
        ,'李四-1','应小天-2','Caius-3','Irelyn-4','Dodie-5','Shanann-6','Brit-7','Ailin-8','Gricie-9','Hamo-10'
        ,'Tarrin-1','Saranna-2','Aliya-3','Irelyn-4','Taron-5','绝缘体-6','盗梦者-7','我乐意-8','重生-9','雞腿先生-10'
        ,'繼續幸福-1','愛你的猫-2','Abed-3','Amorica-4','Taron-5','Lolita-6','Knight-7','Lost-8','Sandm-9','Sandm-9'
        ,'Aaron-1','Edwin-2','Denny-3','Gino-4','Cody-5','Laurent-6','Oliver-7','Anthony-8','Ford-9','Cheney-10'
     ]

    //商品阴影坐标默认值
    static GOODS_SHADOW_X=10;
    static GOODS_SHADOW_Y=-5;
    //前排阴影默认值
    static GOODS_SHADOW_X_FRONT=20;

    //关卡默认货架数,行数
    static LEVEL_CONTAINER_ROW=6;
    //关卡默认货架数,列数
    static LEVEL_CONTAINER_COL=3;
    //关卡默认移动货架数,列数
    static LEVEL_CONTAINER_COL_MOVE=5;
    //货架长
    static CONTAINER_WIDTH=260;
    //货架宽
    static CONTAINER_HEIGHT=200;

    //商品宽，最大值
    static GOODS_WIDTH=73;
    //商品高，最大值
    static GOODS_HEIGHT=128;


    //每组商品颜色数量


    //商品类型定义数组 第四位为颜色
    static BEVERAGE_GOODS=[1017];
    static DAILY_GOODS=[201,202,203,204,205];
    static FOOD_GOODS=[301,302,303,304,305];
    static LETTER_GOODS=[401,402,403,404,405];
    static PLANT_GOODS=[501,502,503,504,505];
    static SNACKFOODS_GOODS=[6012];
    static TOY_GOODS=[7014,7024,7034];
    static JUICE_GOODS=[8013];

    //缺省值
    static DEFAULT_TIMER_SECONDS = 360



}

