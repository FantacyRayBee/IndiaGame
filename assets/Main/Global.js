//定义全局配置 
window.GlobalCfg = {
  
  /**
   * 服务器重启
   */
  SERVERRELOAD: false,
  /**
   * 重启描述文本
   */
  SERVERRELOAD_Descr: "",
  /**
   * 平台标识
   */
  PRODUCT_ID: 2001, 
  /**
   * 渠道信息
   */
  CHANNEL_INFO: '',
  /**
   * Firebase Token
   */
  FIREBASE_TOKEN: '',
  /**
   * 包的数据上报类型,  1: 表示接ADjust; 2: 表示接AppsFlyer; 3: 表示不接ADjust, AppsFlyer;
   */
  PACKAGE_REPORT_METHOD: 0,
  /**
  * 是否不使用Facebook, 0:表示使用; 1:表示不使用
  */
  UNUSE_FACEBOOK: 0,
  /**
  * 是否是代理模式, 0:不是; 1:表示是
  */
  IS_CLUB_MODE: 0,
  /**
  * 是否是需要充值才能进入的游戏
  */
  isPayGame: true,
  /**
   * 消息订阅的大类型
   */
  MSG_TYPE: {
    serverMsg: "serverMsg",
    clientMsg: "clientMsg",
  },

  CURSCENE_DIRECTION: "horizontal",   // 当前场景方向 horizontal， vertical
  FIRST_RECHARGE_TIPS_SHOW: false,    // 是否展示首充之后的提示弹窗
  FIRST_RECHARGE_TIPS_SHOW_10: false,    // 是否展示首充之后的提示弹窗
  FIRST_RECHARGE_REWARD_SHOW: false,    // 是否展示首充之后获得的金币 弹窗
  /**
   * 是否存在 divertFreeTp界面
   */
  IS_EXIST_DIVERSIONFREETP_VIEW: false,

  /**
   * 是否触发热更（测试服专用，线上服这个值必须为true）
   */
   is_need_update: true,
  /**
   * 是否强制进测试服
   */
   is_force_gotoTest: true,

  /**
   * 渠道信息
   */
  CHANNEL_INFO_TEST: '',
  /**
   * 邀请码信息
   */
  OPENINSTALL_INVITE_CODE_TEST: '',
  /**
   * 自定义消息分发Id
   */
  CLIENT_MSG_ID: {
    NET_OPEN: "NET_OPEN",
    REMEMBER_LOGIN_FAIL: "REMEMBER_LOGIN_FAIL",
    LOGIN_GAME_EVENT_SHOW: "LOGIN_GAME_EVENT_SHOW",
    JJCDDZ_GAME_EVENT_SHOW: "JJCDDZ_GAME_EVENT_SHOW",
    JJCDDZ_GAME_EVENT_HIDE: "JJCDDZ_GAME_EVENT_HIDE",
    LOBBY_GAME_EVENT_SHOW: "LOBBY_GAME_EVENT_SHOW",
    LOBBY_GAME_EVENT_HIDE: "LOBBY_GAME_EVENT_HIDE",
    RECEIVE_BINDING_PHONE_SMS: "RECEIVE_BINDING_PHONE_SMS",
    ZJH_GAME_EVENT_SHOW: "ZJH_GAME_EVENT_SHOW",
    CURRENCY_CHANGED_USER_INFO: "CURRENCY_CHANGED_USER_INFO",
    HWZZ_GAME_EVENT_SHOW: "HWZZ_GAME_EVENT_SHOW",
    HWZZ_GAME_EVENT_HIDE: "HWZZ_GAME_EVENT_HIDE",
    DDS_GAME_EVENT_SHOW: "DDS_GAME_EVENT_SHOW",
    DDS_GAME_EVENT_HIDE: "DDS_GAME_EVENT_HIDE",
    CHECK_SMALL_GAME_UP: "CHECK_SMALL_GAME_UP",
    SMALL_GAME_UPDATE_PROGRESS: "SMALL_GAME_UPDATE_PROGRESS",
    SHOW_JJC_50Y_TIPS: "SHOW_JJC_50Y_TIPS",
    GD_SMALLGAME_LOAD_COMPLETE: "GD_SMALLGAME_LOAD_COMPLETE",
    GD_SMALLGAME_LOAD_PROGRESS: "GD_SMALLGAME_LOAD_PROGRESS",
    GD_SMALLGAME_LOAD_ERROR: "GD_SMALLGAME_LOAD_ERROR",
    KWX_GAME_EVENT_ENTERROOM: "KWX_GAME_EVENT_ENTERROOM",
    KWX_GAME_EVENT_LEAVEGAME: "KWX_GAME_EVENT_LEAVEGAME",
    KWX_GAME_EVENT_RECONNECT: "KWX_GAME_EVENT_RECONNECT",
    KWX_GAME_EVENT_SHOW: "KWX_GAME_EVENT_SHOW",
    KWX_GAME_EVENT_HIDE: "KWX_GAME_EVENT_HIDE",
    KWX_GAME_EVENT_ENTERLV_ERROR: "KWX_GAME_EVENT_ENTERLV_ERROR",
    CASH_IN_AND_OUT_ACTIVE: "CASH_IN_AND_OUT_ACTIVE",
    HAPPY_MATCH_CHANGE_SCORE: "HAPPY_MATCH_CHANGE_SCORE",
    FAILURE_TO_OBTAIN_USER_INFO: "FAILURE_TO_OBTAIN_USER_INFO",
    UPDATE_USER_INFO: "UPDATE_USER_INFO",
    CHALLENGES_ACT: "CHALLENGES_ACT",
    GET_MAIL_REWARD: "GET_MAIL_REWARD",
    GET_CHALLENGES_REWARD: "GET_CHALLENGES_REWARD",
    GET_TGY_REWARD: "GET_TGY_REWARD",
    HIDE_TGY_REDPOINT: "HIDE_TGY_REDPOINT",
    GET_FIRST_GIFT_REWARD: "GET_FIRST_GIFT_REWARD",
    GET_RELIEF_REWARD: "GET_RELIEF_REWARD",
    CLOSE_SSCGAME_REFRESH_LOBBY: "CLOSE_SSCGAME_REFRESH_LOBBY",
    READ_EMAIL: "READ_EMAIL",     // 读取邮件
    OPEN_EMAIL: "OPEN_EMAIL",
    ENTER_GAME_FROM_SELECT_ROOM: "ENTER_GAME_FROM_SELECT_ROOM",
    BINDPHONE_SUCCESS: "BINDPHONE_SUCCESS",
    REFRESH_SHOP_COMMODITY: "REFRESH_SHOP_COMMODITY",   
    FIRST_RECHARGE_TIPS: "FIRST_RECHARGE_TIPS",       // 首充提示
    EXIT_GAME: "EXIT_GAME",
    VIP_TAKE_WELFARE: "VIP_TAKE_WELFARE",  
    VIP_INFO_UPDATE: "VIP_INFO_UPDATE",  
    VIP_REWARD: "VIP_REWARD",
    APP_DOWNLOAD_PROGRESS: "APP_DOWNLOAD_PROGRESS",
    SIDEBAT_DISPLAYED: "sidebar_displayed",     // 侧边栏显示
    REMAIN_WITH_DRAW_UPDATE: "REMAIN_WITH_DRAW_UPDATE",
    ACTIVITY_CLOSE_VIEW: "ACTIVITY_CLOSE_VIEW",
    ACTIVITY_CHALLENGES_COLLECT: "ACTIVITY_CHALLENGES_COLLECT",
    ZEUS_SELECTED_BET_FRESH: "ZEUS_SELECTED_BET_FRESH",
    ZEUS_ALL_SPIN_FINISHED: "ZEUS_ALL_SPIN_FINISHED",
    ZEUS_SINGLE_SPIN_FINISHED: "ZEUS_SINGLE_SPIN_FINISHED",
    ZEUS_ONCE_ERASE_FINISHED: "ZEUS_ONCE_ERASE_FINISHED",
    ZEUS_SEND_SPIN_REQ: "ZEUS_SEND_SPIN_REQ",
    ZEUS_SPIN_STARTING: "ZEUS_SPIN_STARTING",
    ZEUS_TRIGGER_AUTO_TOGGLE: "ZEUS_TRIGGER_AUTO_TOGGLE",
    ZEUS_SEND_BUY_FREE_REQ: "ZEUS_SEND_BUY_FREE_REQ",
    ZEUS_SHOW_BUY_FREE_TIPS: "ZEUS_SHOW_BUY_FREE_TIPS",
    ZEUS_TRIGGER_DOUBLE_TOGGLE: "ZEUS_TRIGGER_DOUBLE_TOGGLE",
    ZEUS_ENTER_FREE_STATUS: "ZEUS_ENTER_FREE_STATUS",
    RECHARGED_DAILYBONUS_CARD: "RECHARGED_DAILYBONUS_CARD",
    CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
    GAME_GIF_CLICK_ITEM: "GAME_GIF_CLICK_ITEM",
    GAME_WORD_CLICK_ITEM: "GAME_WORD_CLICK_ITEM",
    GAME_FACE_CLICK_ITEM: "GAME_FACE_CLICK_ITEM",

    GAME_MENU_CLICK_OUT_TO_LOBBY: "GAME_MENU_CLICK_OUT_TO_LOBBY",
    GAME_MENU_CLICK_SWITCH_TABLE: "GAME_MENU_CLICK_SWITCH_TABLE",
    GAME_MENU_CLICK_HOW_TO_PLAY: "GAME_MENU_CLICK_HOW_TO_PLAY",
    GAME_MENU_CLOSE: "GAME_MENU_CLOSE",

    SHOP_SELECTED_ITEM: "SHOP_SELECTED_ITEM",
    WITHDRAW_SELECTED_ITEM: "WITHDRAW_SELECTED_ITEM",
    RECHARGED_DAILYBONUS_CARD: "RECHARGED_DAILYBONUS_CARD",
    ACTIVITY_GOBETTING_GET: "ACTIVITY_GOBETTING_GET",

    TPGAME_CLICK_RECHARGE: "TPGAME_CLICK_RECHARGE",
    TPGAME_CLICK_LUCKYPLAYER_GET: "TPGAME_CLICK_LUCKYPLAYER_GET",
  },

  
  /**
   * 埋点事件名称
   */
  BEHAVIOR_TYPE: {

    FIRST_ENTER: "首次启动游戏",

    LAUNCH_GAME: "启动游戏",

    REQ_APPINFO_START: "请求AppInfo信息开始",
    REQ_APPINFO_SUCCESS: "请求AppInfo信息成功",
    REQ_APPINFO_FAIL: "请求AppInfo信息失败",

    REQ_ADVERTISINGID_START: "请求AdvertisingId开始",
    REQ_ADVERTISINGID_SUCCESS: "请求AdvertisingId成功",
    REQ_ADVERTISINGID_FAIL: "请求AdvertisingId失败",

    REQ_APPSFLYID_START: "请求AppsFlyId开始",
    REQ_APPSFLYID_SUCCESS: "请求AppsFlyId成功",
    REQ_APPSFLYID_FAIL: "请求AppsFlyId失败",

    REQ_ADJUSTID_START: "请求AdjustId开始",
    REQ_ADJUSTID_SUCCESS: "请求AdjustId成功",
    REQ_ADJUSTID_FAIL: "请求AdjustId失败",

    SHOW_UPDATE_VIEW: "显示热更新界面",

    UPDATE_START: "热更新开始",
    UPDATE_PERFORM_RESOURCES_UPDATE: "热更新进行resources更新",
    UPDATE_PERFORM_BUNDLES_UPDATE: "热更新进行bundles更新",
    UPDATE_REQ_MANIFEST_INFO_START: "热更新请求manifest信息开始",
    UPDATE_REQ_MANIFEST_INFO_SUCCESS: "热更新请求manifest信息成功",
    UPDATE_REQ_MANIFEST_INFO_FAIL: "热更新请求manifest信息失败",
    UPDATE_COMPARE_FILES_START: "热更新比较差异性文件开始",
    UPDATE_COMPARE_FILES_END: "热更新比较差异性文件结束",
    UPDATE_LOAD_DIFF_FILES_START: "热更新下载差异性文件开始",
    UPDATE_LOAD_DIFF_FILES_WITH_LOADED_END: "热更新下载差异性文件结束(有下载)",
    UPDATE_LOAD_DIFF_FILES_WITH_NO_LOADED_END: "热更新下载差异性文件结束(无下载)",
    UPDATE_LOAD_BUNDLES_START: "热更新下载bundles文件开始",
    UPDATE_LOAD_BUNDLES_WITH_LOADED_END: "热更新下载bundles文件结束(有下载)",
    UPDATE_LOAD_BUNDLES_WITH_NO_LOADED_END: "热更新下载bundles文件结束(无下载)",
    UPDATE_END: "结束热更新",
    UPDATE_ERROR: "热更新错误",

    SHOW_LOGIN_VIEW: "显示登录界面",
  
    REQ_TOKEN_INFO_START: "请求TokenInfo信息开始",
    REQ_TOKEN_INFO_SUCCESS: "请求TokenInfo信息成功",
    REQ_TOKEN_INFO_FAIL: "请求TokenInfo信息失败",

    REQ_BEARER_INFO_START: "请求BearerInfo信息开始",
    REQ_BEARER_INFO_SUCCESS: "请求BearerInfo信息成功",
    REQ_BEARER_INFO_FAIL: "请求BearerInfo信息失败",

    REQ_USERDATA_INFO_START: "请求UserInfo信息开始",
    REQ_USERDATA_INFO_SUCCESS: "请求UserInfo信息成功",
    REQ_USERDATA_INFO_FAIL: "请求UserInfo信息失败",

    LOGIN_LOBBY_START:  "登录大厅开始",
    SHOW_LOBBY: "显示大厅界面",
    SHOW_CASH_GIFT: "显示新人礼界面",
    HIDE_CASH_GIFT: "关闭新人礼界面",
    CLICK_ADD_BUTTON: "点击大厅ADD按钮",
    SHOW_MOBILE_VIEW: "显示绑定手机界面",
    HIDE_MOBILE_VIEW: "关闭绑定手机界面",

    CLICK_LOGOUT_BUTTON: "点击LogOut按钮",

    CLICK_TP_PLAYNOW_BUTTON: "点击TP选场进入游戏按钮",
    CLICK_RUMMY_PLAYNOW_BUTTON: "点击RUMMY选场进入游戏按钮",
    CLICK_ANDAR_PLAYNOW_BUTTON: "点击ANDAR选场进入游戏按钮",

    CLICK_TP_BUTTON: "点击TP游戏按钮",
    SHOW_TP_GAME: "显示TP界面",
    EXIT_TP_GAME: "点击退出TP",

    CLICK_RUMMY_BUTTON: "点击RUMMY游戏按钮",
    SHOW_RUMMY_GAME: "显示RUMMY界面",
    EXIT_RUMMY_GAME: "点击退出RUMMY",

    CLICK_ANDAR_BUTTON: "点击ANDAR游戏按钮",
    SHOW_ANDAR_GAME: "显示ANDAR界面",
    EXIT_ANDAR_GAME: "点击退出ANDAR",

    CLICK_MTP_GAME: "点击MultiTeenPatti游戏按钮",
    SHOW_MTP_GAME: "显示MTP界面",
    EXIT_MTP_GAME: "点击退出MTP",

    CLICK_MUNDA_GAME: "点击MUNDA游戏按钮",
    SHOW_MUNDA_GAME: "显示MUNDA界面",
    EXIT_MUNDA_GAME: "点击退出MUNDA",

    CLICK_3PATTI_GAME: "点击3PATTI游戏按钮",
    SHOW_3PATTI_GAME: "显示3PATTI界面",
    EXIT_3PATTI_GAME: "点击退出3PATTI",

    CLICK_FRUIT_GAME: "点击FRUIT游戏按钮",
    SHOW_FRUIT_GAME: "显示FRUIT界面",
    EXIT_FRUIT_GAME: "点击退出FRUIT",

    CLICK_MAYA_GAME: "点击MAYA游戏按钮",
    SHOW_MAYA_GAME: "显示MAYA界面",
    EXIT_MAYA_GAME: "点击退出MAYA",

    CLICK_JOKER_GAME: "点击JOKER游戏按钮",
    SHOW_JOKER_GAME: "显示JOKER界面",
    EXIT_JOKER_GAME: "点击退出JOKER",

    CLICK_BULL_GAME: "点击BULL游戏按钮",
    SHOW_BULL_GAME: "显示BULL界面",
    EXIT_BULL_GAME: "点击退出BULL",

    CLICK_ZOO_GAME: "点击ZOO游戏按钮",
    SHOW_ZOO_GAME: "显示ZOO界面",
    EXIT_ZOO_GAME: "点击退出ZOO",

    CLICK_CRASH_GAME: "点击CRASH游戏按钮",
    SHOW_CRASH_GAME: "显示CRASH界面",
    EXIT_CRASH_GAME: "点击退出CRASH",

    CLICK_BENZ_GAME: "点击BENZ游戏按钮",
    SHOW_BENZ_GAME: "显示BENZ界面",
    EXIT_BENZ_GAME: "点击退出BENZ",

    CLICK_LHD_GAME: "点击LHD游戏按钮",
    SHOW_LHD_GAME: "显示LHD界面",
    EXIT_LHD_GAME: "点击退出LHD",

    CLICK_UPDOWN_GAME: "点击UPDOWN游戏按钮",
    SHOW_UPDOWN_GAME: "显示UPDOWN界面",
    EXIT_UPDOWN_GAME: "点击退出UPDOWN",

    CLICK_HORSE_GAME: "点击HORSE游戏按钮",
    SHOW_HORSE_GAME: "显示HORSE界面",
    EXIT_HORSE_GAME: "点击退出HORSE",

    CLICK_CRICKET_GAME: "点击CRICKET游戏按钮",
    SHOW_CRICKET_GAME: "显示CRICKET界面",
    EXIT_CRICKET_GAME: "点击退出CRICKET",

    CLICK_SSC_GAME: "点击SSC游戏按钮",
    SHOW_SSC_GAME: "显示SSC界面",
    EXIT_SSC_GAME: "点击退出SSC",

    CLICK_ZEUS_GAME: "点击ZEUS游戏按钮",
    SHOW_ZEUS_GAME: "显示ZEUS界面",
    EXIT_ZEUS_GAME: "点击退出ZEUS",
  },

  /**
   * 定义全局UI组件其中值null注册为常驻组件详见initChangZhu
   */
  G_COMPONENTS: {},

  /**
   * 界面zIndex
   */
  G_ZINDEX: {
    playerRole: 2000,
    tips: 19999,
    SHOP_WITHDRAW: 103,   // 充值提现
    POPUP_WITHDRAW: 102,  // 大厅弹框，提现
    POPUP_PDD: 101,       // 大厅弹框，PDD
  },

  /**
   * 当前游戏控制脚本
   */
  ACT_SCENE_CTRL: null,

  // 当前小游戏类型
  CUR_GAME_TYPE: null,

  // 设备类型
  DEVICE_MODEL: null,

  DOWN_H5_URL: "https://redpacket.aivined.com/#",

  DOWN_APK_URL: "http://ddz.aikayu.com/",

  DOWN_IPA_URL: "http://ddz.aikayu.com/",

  // 小游戏是否更新   true更新  false不更新
  IS_SMALL_GAME_UPDATE : true,  

  // 更新子游戏版本信息
  SUB_GAME_VERSION_INFO: null,

  // 更新子游戏资源目录
  SUB_GAME_ROOT_UPDATE: null,

  // 支付开关，即渠道风控，0关闭，1开启，2 IOS
  PAYMENT_SWITCH: null,    

  // 风控配置类型，1表示线下，2表示sdk风控，3表示自己的风控
  SWITCH_TYPE: 3, 
 
  // 苹果商城ios 
  CHANNEL : "Android", 

  // 默认选中充值的额度 
  SELECT_RECHARGE_ACOUNT: 20000,

  // 跑马灯数据
  MAR_QUEE_DATA:[],       

  // 跑马灯数据
  MAR_QUEE_DATA_ROBOT:[],       

  // 充值成功后游戏回调断网刷新金币（打补丁） 
  PUSH_PAY_SUCCESS: false,    
 
  // 是否第一次提现 
  HAVE_WITHDRAW : false, 

  // 
  GAID: "",

  // 表示是否从登录界面进入大厅界面，主要用于活动弹框的判断
  IS_FROM_LOGIN_TO_LOBBY: false, 

  // 表示设备是否安装了微信和支付宝，主要用于国内人进入游戏
  HAVE_WECHAT_AND_ALIPAY: false,     

  // 通过Openinstall的SDK收到的邀请码(上级的绑定码)             
  OPENINSTALL_INVITE_CODE: "",   
  
  // 落地页数据上报所需的fbclid，以便服务器上报事件给投放
  OPENINSTALL_FB_CLID: "",    
  
  // 落地页广告id，以便服务器上报事件给投放
  OPENINSTALL_ADS_ID: "",

  // AppFlyerId
  APPSFLYER_ID: "",

  // 广告id
  ADVERTISING_ID: "",

  // 商城角标
  PAY_CHANNEL: "",
  // 支付渠道
  PAY_CHANNEL2: "",
  
  /* APP_STATUS说明
    0: 未设置状态; 
    1：正式服谷歌审核状态, 俗称马甲状态; 
    2: 正式服谷歌已审核状态, 俗称非马甲状态; 
    3: 测试服对外包状态; 
    4: 测试服测试包状态;
    5: 正式服测试包状态;
    6：正式服正式包状态;
  */
  APP_STATUS: 0,    
  
  // 判断是否为谷歌审核状态时，获取相关信息的路径
  APP_INFO_URL: "",   
  /** 备用路径 */
  APP_INFO_URL_SPARE: "",
  /** APP 配置文件路径 */
  APP_CONFIG_URL: "",
  /** APP 配置文件备用路径 */
  APP_CONFIG_URL_SPARE: "",
  //破产弹框提示CD
  BANKRUPT_CD: 0,
  //破产弹框是否正在显示中
  IS_SHOW_BANKRUPT: false,
  // 谷歌id
  GOOGLE_ID: "",

  // facebookid
  FACEBOOK_ID: "",

  // 远程文件加密秘钥
  STR_KEY: "kb1234",
  
  ADS_ID: '',
  /**
   * 用于服务器做事件埋点
   */
  ADJUST_ID: '',
  /**
   * 远程App版本
   */
  REMOTE_APP_VERSION: 0,
  /**
   * 远程App地址
   */
  REMOTE_APP_URL: "",
  /**
   * 应用内大更新
   */
  REMOTE_APP_UPDATE: false,
  /**
   * 用户数据
   */
  USER_DATAS: {},

  /**
   * 应用配置数据
   */
  APP_CONFIG_DATAS: [],
  /**
   * 小游戏数据
   */
  SMALL_GAME_DATAS: {
    teenPattiData: {},
    benZData: {},
    sscData: {},
    mundaData: {},
    mtpData: {},
    lhdData: {},
    horseRaceData: {},
    rummyData: {},
    upDownData: {},
    andeerData: {},
    fruitMachineData: {},
    mayaMachineData: {},
    bullMachineData: {},
    jokerMachineData: {},
    indiaMachineData: {},
    vampireMachineData: {},
    mwData: {},
    baccaratData: {},
    rocketData: {},
    zooData: {},
    cricketData: {},
    zeusData: {},
  },

  // 当前渠道是否为特殊渠道, 0正常，1百人
  SPECIAL_CHANNEL: 0,

  // 是否上传错误事件
  IS_UPLOADERROR_EVENT: true,

  // 拒绝未充值玩百人,false(未支付可玩)  true(未支付不可玩)
  REFUSE_UNPAY_CANBET: true,


  NATIVE_CALL_URL: "kayo/maoka/gmp/JSCallJavaManager",
  /**
   * APP 服务器错误代码
   */
  APP_SERVER_ERR_CODE:{
    REPEAT_LOGIN: 9,      // 重复登录
    SERVER_RELOAD: 29,    // 服务器重启
  },
  
  OPEN_MODULES: {
    4: false,    // 充值
    5: false,    // 提现
    6: false,    // 绑定手机号
    7: false,    // 个人中心
    8: false,    // 签到活动
    9: false,    // 转盘活动
    10: false,   // 首充活动
    11: false,   // Bonus Card
    12: false,   // 奖券兑换活动
    13: false,   // 邮箱
    14: false,   // 拼多多
    15: false,   // 推广员系统
    16: false,   // 跑马灯
    17: false,   // 挑战任务

    20: false,   // 运营活动 SuperDiscount

    100: false,  // TeenPatti现金场
    101: false,  // TeenPatti体验场
    102: false,  // Rummy现金场
    103: false,  // Rummy体验场
    104: false,  // AnderBahar现金场
    105: false,  // AnderBahar体验场
    106: false,  // 7Up7Down
    107: false,  // LuckyLoto
    108: false,  // Baccarat3Patti
    109: false,  // 龙虎斗
    110: false,  // Benz
    111: false,  // JhandiMunda
    112: false,  // HorseRacing
    113: false,  // FruitParty
    114: false,  // 打地鼠
    115: false,  // 火箭    
    119: false,  // 玛雅机台
    120: false,  // 印度舞娘机台
  },

  ChildzIndex:{
    defaultChildViewIndex: 10,

    // 父节点为Lobby场景 Canvas
    lobby_IndexPriority_topLevel: 100,
    lobby_IndexPriority_Level_0: 90,
    lobby_IndexPriority_Level_1: 80,
    lobby_IndexPriority_Level_2: 70,
    lobby_IndexPriority_Level_3: 60,
    lobby_IndexPriority_Level_4: 50,
    // 默认层级，点击弹出的界面基本都为这个层级   GlobalCfg.ChildzIndex.lobby_IndexPriority_minLevel
    lobby_IndexPriority_minLevel: 10,

  },

  /**
   * APP 服务器错误代码
   */
  APP_SERVER_ERR_CODE:{
    REPEAT_LOGIN: 9,      // 重复登录
    SERVER_RELOAD: 29,    // 服务器重启
  },
  /**
   * 诱导充值配置
   */
  INDUCEMENT_INFO :{
      [1]: {taskName: 'Play 3 games of TeenPatti', reward: 4500, status: 1, pais: [], jump: 'TeenPatti', paiIndex: -1,tips:""},
      [2]: {taskName: 'Play 7 games of TeenPatti', reward: 4800, status: 1, pais: [], jump: 'TeenPatti', paiIndex: -1,tips:""},
      [3]: {taskName: 'Play 10 games of TeenPatti', reward: 4900, status: 1, pais: [], jump: 'TeenPatti', paiIndex: -1,tips:""},
      [4]: {taskName: 'Play 10 games of Fruit Machines', reward: 4990, status: 2, pais: [100,200,90,50], jump: 'Fruit', paiIndex: 2,tips:"Only need ₹10 to withdraw ₹5000"},
      [5]: {taskName: 'Play 10 games of Dragon VS Tiger', reward: 4999, status: 2, pais: [10,9,10,8], jump: 'Dragon', paiIndex: 1,tips:"Only need ₹1 to withdraw ₹5000"},
      [6]: {taskName: 'Complete a recharge of ₹500', reward: 4999.9, status: 2, pais: [0.1,0.9,0.5,1], jump: 'shop', paiIndex: 1,tips:"Only need ₹0.1 to withdraw ₹5000"},
      [7]: {taskName: 'Check the account is correct and complete a withdrawal', reward: 4999.99, status: 2, pais: [0.1,0.09,0.1,0.09], jump: 'withdraw', paiIndex: 1,tips:"Only need ₹0.01 to withdraw ₹5000"},
      [8]: {taskName: 'Total recharge ₹50000', reward: 5000, status: 1, pais: [], jump: 'shop', paiIndex: -1,tips:""},
  },
  /**
   * 预制体路径
   */
  PREFAB_PATH: {
    /**
     * 侧边栏
     */
    SIDEBAR: "ResourcesBundle/NewPlan/CommActivity/activityModules_ScrollView",
    /**
     * 标语提示框
     */
    TIPS: "ResourcesBundle/NewPlan/Tips/Tips",
    /**
     * 进度提示框
     */
    PROGRESS: "ResourcesBundle/NewPlan/Progress/Progress",
    /**
     * 通用提示操作框
     */
    MSGBOX: "ResourcesBundle/NewPlan/MsgBox/MsgBox",
    /**
     * 大厅设置
     */
    SETTING: "ResourcesBundle/NewPlan/Setting/Setting",
    /**
     * 小游戏中点击充值按钮所显示的金币界面
     */
    SMALLADDCASH: "ResourcesBundle/NewPlan/SmallAddCash/SmallAddCash",
    /**
     * 小游戏中点击充值按钮所显示的体验金币界面
     */
    SMALLADDEXPERIENCE: "ResourcesBundle/NewPlan/SmallAddExperience/SmallAddExperience",
    /**
     * 小游戏中玩家信息界面
     */
    USERHEAD: "ResourcesBundle/NewPlan/UserHead/UserHead",
    /**
     * 领取奖励，撒金币
     */
    SCATTERCOIN: "ResourcesBundle/NewPlan/ScatterCoin/ScatterCoin",
    /**
     * 领取奖励提示界面
     */
    REWARDSTIPS: "ResourcesBundle/NewPlan/RewardsTips/RewardsTips",
    /**
     * 文字，微表情
     */
    CHATACT: "ResourcesBundle/NewPlan/ChatAct/ChatAct",
    /**
     * 运营活动
     */
    ACTIVITY: "ResourcesBundle/NewPlan/Activity/Activity",
    /**
     * 运营活动中的挑战任务
     */
    ACTIVITYCHALLENGES: 'ResourcesBundle/NewPlan/Activity/ActivityChallenges',
    ACTIVITYCHALLENGESITEM: 'ResourcesBundle/NewPlan/Activity/ActivityChallengesItem',
    /**
     * 运营活动中的获取奖励
     */
    ACTIVITYGETBONUS: 'ResourcesBundle/NewPlan/Activity/ActivityGetBonus',
    /**
     * 运营活动中的转盘
     */
    ACTIVITYTURNTABLE: 'ResourcesBundle/NewPlan/Activity/ActivityTurnTable',
    /**
     * 运营活动中的签到
     */
    ACTIVITYSIGN: 'ResourcesBundle/NewPlan/Activity/ActivitySign',
    ACTIVITYSIGNITEM: 'ResourcesBundle/NewPlan/Activity/ActivitySignItem',
    /**
     * 首充
     */
    FIRSTRECHARGE: "ResourcesBundle/NewPlan/FirstRecharge/FirstRecharge",
    FIRSTRECHARGE_V: "ResourcesBundle/NewPlan/FirstRecharge/firstRecharge_V",
    /**
     * 联系我们 客服邮件地址
     */
    CONTACTUS: "ResourcesBundle/NewPlan/ContactUs/ContactUs",
    /**
     * 跑马灯
     */
    CAROUSELSTRIP: "ResourcesBundle/NewPlan/CarouselStrip/CarouselStrip",
    /**
     * 评价我们
     */
    RATEUS: "ResourcesBundle/NewPlan/RateUs/RateUs",
    /**
     * 绑定手机号奖励
     */
    BINDPHONEREWARDS: "ResourcesBundle/NewPlan/BindPhoneRewards/BindPhoneRewards",
    /**
     * 绑定手机号
     */
    BINDPHONE: "ResourcesBundle/NewPlan/BindPhone/BindPhone",
    /**
     * 推广员
     */
    PROMOTER: "ResourcesBundle/NewPlan/Promoter/Promoter",
    PROMOTERMAIN: "ResourcesBundle/NewPlan/Promoter/PromoterMain",
    PROMOTERRULE: "ResourcesBundle/NewPlan/Promoter/PromoterRule",
    /**
     * 推广员左侧详情
     */
    PROMOTERLEFTVIEW: "ResourcesBundle/NewPlan/Promoter/PromoterLeftView",
    /**
     * 救济金
     */
    RELIEF: "ResourcesBundle/NewPlan/Relief/Relief",
    /**
     * 邮箱
     */
    EMAIL: "ResourcesBundle/NewPlan/Email/Email",
    EMAILITEM: "ResourcesBundle/NewPlan/Email/Emailitem",
    /**
     * 反馈邮箱
     */
    FEEDBACKEMAIL: "ResourcesBundle/NewPlan/Email/FeedbackMail",
    /**
     * 超级折扣
     */
    SUPERDISCOUNT: "ResourcesBundle/NewPlan/SuperDiscount/SuperDiscount",
    /**
     * 客服
     */
    CUSTOMERSERVICE: "ResourcesBundle/NewPlan/CustomerService/CustomerService",
    /**
     * 快速反馈
     */
    FASTFEEDBACK: "ResourcesBundle/NewPlan/FastFeedBack/FastFeedBack",
    /**
     * 个人中心
     */
    PERSONAL: "ResourcesBundle/NewPlan/Personal/Personal",
    /**
     * 个人中心修改昵称
     */
    CHANGENAME: "ResourcesBundle/NewPlan/Personal/ChangeName",
    /**
     * 个人中心修改头像
     */
    CHANGEHEAD: "ResourcesBundle/NewPlan/Personal/ChangeHead",
    CHANGEHEADITEM: "ResourcesBundle/NewPlan/Personal/ChangeHeadItem",
    /**
     * 奖券转移
     */
    BONUSTRANSFER: "ResourcesBundle/NewPlan/BonusTransfer/BonusTransfer",
    /**
     * 选择房间
     */
    SELECTROOM: "ResourcesBundle/NewPlan/SelectRoom/SelectRoom",
    /**
     * 日常奖励卡
     */
    DAILYBONUSCARD: "ResourcesBundle/NewPlan/DailyBonusCard/DailyBonusCard",
    /**
     * 新人礼
     */
    FIRSTGIFTDIAMOND: "ResourcesBundle/NewPlan/FirstGiftDiamond/FirstGiftDiamond",
    /**
     * 规则
     */
    RULE: "ResourcesBundle/NewPlan/Rule/Rule",
    /**
     * 隐私政策
     */
    PRIVACYPOLICY: "ResourcesBundle/NewPlan/PrivacyPolicy/PrivacyPolicy",
    /**
     * 提现订单错误弹窗
     */
    WITHDRAWERRORTIPS: "ResourcesBundle/NewPlan/WithDrawErrorTips/WithDrawErrorTips",
    /**
     * 提现分享
     */
    WITHDRAWSHARE: "ResourcesBundle/NewPlan/WithDrawShare/WithDrawShare",
    /**
     * 首充之后，清空金币窗帘动画弹窗提示
     */
    NEW_FIRSTRECHARGETIPS:"ResourcesBundle/NewPlan/NewFirstRechargeTips/NewFirstRechargeTips",
    /**
     * 首充之后，清空金币弹窗提示
     */
    ADVANCEDMODE: "ResourcesBundle/NewPlan/AdvancedMode/AdvancedMode",
    ADVANCEDMODE_V: "ResourcesBundle/NewPlan/AdvancedMode/AdvancedMode_V",
    /**
     * 商城
     */
    SHOP: "ResourcesBundle/NewPlan/Shop/Shop",
    SHOPITEM: "ResourcesBundle/NewPlan/Shop/ShopItem",
    SHOPINSTRUCTIONS: "ResourcesBundle/NewPlan/Shop/ShopInstructions",
    SHOPTOGITEM: "ResourcesBundle/NewPlan/Shop/ShopTogItem",
    SHOPNEWTIP: "ResourcesBundle/NewPlan/Shop/ShopNewTip",
    SHOPNEWTIP10: "ResourcesBundle/NewPlan/Shop/ShopNewTip10",
    /**
     * 提现
     */
    WITHDRAW: "ResourcesBundle/NewPlan/WithDraw/WithDraw",
    WITHDRAWITEM: "ResourcesBundle/NewPlan/WithDraw/WithDrawItem",
    WITHDRAWTIPS: "ResourcesBundle/NewPlan/WithDraw/WithDrawTips",
    /**
     * 交易记录
     */
    TRANSACTIONRECORD: "ResourcesBundle/NewPlan/TransactionRecord/TransactionRecord",
    TRANSACTIONRECORDITEM: "ResourcesBundle/NewPlan/TransactionRecord/TransactionRecordItem",
    TRANSACTIONRECORDTIPS: "ResourcesBundle/NewPlan/TransactionRecord/TransactionRecordTips",
    TRANSACTIONRECORDHELP: "ResourcesBundle/NewPlan/TransactionRecord/TransactionRecordHelp",
    /**
     * 填写提现资料
     */
    WITHDRAWPREDATA:"ResourcesBundle/NewPlan/WithDrawPreData/WithDrawPreData",
    /**
     * 提现弹窗
     */
    POPUPWITHDRAW: "ResourcesBundle/NewPlan/PopUpWithDraw/PopUpWithDraw",
    /**
     * 我的VIP
     */
    MYVIP: "ResourcesBundle/NewPlan/MyVip/MyVip",
    /**
     * VIP幸运抽奖
     */
    VIPLUCKYDRAW: "ResourcesBundle/NewPlan/MyVip/VipLuckyDraw",
    /**
     * VIP规则
     */
    VIPRULES: "ResourcesBundle/NewPlan/MyVip/VipRules",
    VIPRULESRULE: "ResourcesBundle/NewPlan/MyVip/VipRulesRule",
    VIPRULESBENEFITS: "ResourcesBundle/NewPlan/MyVip/VipRulesBenefits",
    VIPRULESUPGIFT: "ResourcesBundle/NewPlan/MyVip/VipRulesUpGift",
    /**
     * VIP奖励领取
     */
    VIPREWARDTOAST: "ResourcesBundle/NewPlan/MyVip/VipRewardToast",
    /**
      * VIP充值提示弹框
      */
    VIPRECHARGETOAST: "ResourcesBundle/NewPlan/MyVip/VipRechargeToast",
    /**
      * VIP升级提示弹框
      */
    VIPUPGRADETOAST: "ResourcesBundle/NewPlan/MyVip/VipUpgradeToast",
    /**
      * VIP快充提示弹框
      */
    VIPFORONCETOAST: "ResourcesBundle/NewPlan/MyVip/VipForOnceToast",
    /**
     * 游戏开始遮罩
     */
    GAMESTARTMASK: "ResourcesBundle/NewPlan/GameStartMask/GameStartMask",
    /**
     * 游戏动画互动
     */
    GAMEGIFINTERACTION: "ResourcesBundle/NewPlan/GameGifInteraction/GameGifInteraction",
    GAMEGIFINTERACTIONITEM: "ResourcesBundle/NewPlan/GameGifInteraction/GameGifInteractionItem",
    GAMEGIFINTERACTIONSKE: "ResourcesBundle/NewPlan/GameGifInteraction/GameGifInteractionSke",
    /**
     * 游戏文字和笑脸互动
     */
    GAMEWORDINTERACTION: "ResourcesBundle/NewPlan/GameWordInteraction/GameWordInteraction",
    GAMEWORDINTERACTIONSHOW: "ResourcesBundle/NewPlan/GameWordInteraction/GameWordInteractionShow",
    GAMEWORDINTERACTIONWORDITEM: "ResourcesBundle/NewPlan/GameWordInteraction/GameWordInteractionWordItem",
    GAMEWORDINTERACTIONFACEITEM: "ResourcesBundle/NewPlan/GameWordInteraction/GameWordInteractionFaceItem",
    /**
     * 游戏中的设置
     */
    GAMESETTING: "ResourcesBundle/NewPlan/GameSetting/GameSetting",
    GAMESETTINGNEW: "ResourcesBundle/NewPlan/GameSetting/GameSettingNew",
    AUTOSPINSETTING: "ResourcesBundle/NewPlan/GameSetting/autoSpinSetting",
    /**
     * 游戏中的菜单
     */
    GAMEMENU: "ResourcesBundle/NewPlan/GameMenu/GameMenu",
    /**
     * 活动 Go Betting
     */
    ACTIVITY_GOBETTING: "ResourcesBundle/NewPlan/ConsumerActivities/ConsumerActivities",
    /**
     * 免费玩家百人类游戏赶场到免费TP弹框
     */
    DIVERSIONFREETP: "ResourcesBundle/NewPlan/DiversionFreeTP/DiversionFreeTP",
    /**
     * 签到弹框
     */
    SIGN: "ResourcesBundle/NewPlan/Sign/Sign",
    SIGNITEM: "ResourcesBundle/NewPlan/Sign/SignItem",
    /**
     * 破产礼包
     */
    BANKRUPTCY_GIFT: "ResourcesBundle/NewPlan/BankruptcyGift/BankruptcyGift",
    /**
     * 诱导充值
     */
    INDUCEMENT: "ResourcesBundle/NewPlan/Inducement/Inducement",
    INDUCEMENTPOP: "ResourcesBundle/NewPlan/Inducement/InducementPop",
    /**
     * 破产礼包
     */
    ONLY_PAY: "ResourcesBundle/NewPlan/OnlyPay/OnlyPay",
    /**
     * 强制引导弹窗
     */
    HALLTIP: "ResourcesBundle/NewPlan/HallTip/HallTip",
    /**
     * 第三方游戏跳转内嵌网页
     */
    GAMEWEBVIEW: "ResourcesBundle/NewPlan/webview/gameWebview",

    /**
     * 第三方游戏跳转内嵌网页
     */
    GAMEICONLIST: "ResourcesBundle/huanPi2/lobbyRes/gameIcon/gameIconList",
    /**
     * 俱乐部
     */
    CLUB: "ResourcesBundle/NewPlan/Club/ClubMain",
    /**
     * 俱乐部
     */
    WALLET: "ResourcesBundle/NewPlan/Club/walletMain",
  },


  /**
   * 预制体父节点
   */
  PREFAB_PARENT: {

    CAROUSELSTRIP: "CarouselLayer",

    SIDEBAR: "FirstLayer",  // 侧边栏
    SETTING: "FirstLayer",
    CHATACT: "FirstLayer",
    PROMOTER: "FirstLayer",
    SELECTROOM: "FirstLayer",
    MYVIP: "FirstLayer",
    GAMESTARTMASK: "FirstLayer",
    GAMEGIFINTERACTION: "FirstLayer",
    GAMEGIFINTERACTIONSKE: "FirstLayer",
    GAMEWORDINTERACTION: "FirstLayer",
    GAMEWORDINTERACTIONSHOW: "FirstLayer",
    GAMEMENU: "FirstLayer",
    SIGN: "FirstLayer",
    WITHDRAWPREDATA: "FirstLayer",
    PROMOTERMAIN: "FirstLayer",
    CLUB: "FirstLayer",
    WALLET: "FirstLayer",
    
    ACTIVITY: "SecondLayer",
    FIRSTRECHARGE: "SecondLayer",
    CONTACTUS: "SecondLayer",
    RATEUS: "SecondLayer",
    BINDPHONEREWARDS: "SecondLayer",
    BINDPHONE: "SecondLayer",
    PROMOTERLEFTVIEW: "SecondLayer",
    PROMOTERRULE: "FirstLayer",
    RELIEF: "SecondLayer",
    EMAIL: "SecondLayer",
    FEEDBACKEMAIL: "SecondLayer",
    SUPERDISCOUNT: "SecondLayer",
    CUSTOMERSERVICE: "SecondLayer",
    FASTFEEDBACK: "SecondLayer",
    PERSONAL: "SecondLayer",
    CHANGENAME: "SecondLayer",
    CHANGEHEAD: "SecondLayer",
    BONUSTRANSFER: "SecondLayer",
    DAILYBONUSCARD: "SecondLayer",
    FIRSTGIFTDIAMOND: "SecondLayer",
    RULE: "SecondLayer",
    VIPLUCKYDRAW: "SecondLayer",
    VIPRULES: "SecondLayer",
    GAMESETTING: "SecondLayer",
    GAMESETTINGNEW: "SecondLayer",
    AUTOSPINSETTING: "SecondLayer",
    ACTIVITY_GOBETTING: "SecondLayer",
    DIVERSIONFREETP: "SecondLayer",
    BANKRUPTCY_GIFT: "SecondLayer",
    INDUCEMENT: "SecondLayer",
    INDUCEMENTPOP: "SecondLayer",
    ONLY_PAY: "SecondLayer",
    GAMEICONLIST: "SecondLayer",

    SMALLADDCASH: "ThirdLayer",
    SMALLADDEXPERIENCE: "ThirdLayer",
    USERHEAD: "ThirdLayer",
    SCATTERCOIN: "ThirdLayer",
    REWARDSTIPS: "ThirdLayer",
    PRIVACYPOLICY: "ThirdLayer",
    VIPREWARDTOAST: "ThirdLayer",
    POPUPWITHDRAW: "ThirdLayer",

    VIPUPGRADETOAST: "ToastLayer",
    MSGBOX: "ToastLayer",
    WITHDRAWERRORTIPS: "ToastLayer",
    FIRSTRECHARGETIPS: "ToastLayer",
    VIPRECHARGETOAST: "ToastLayer",
    VIPFORONCETOAST: "ToastLayer",
    
    SHOP: "ShopLayer",
    WITHDRAW: "ShopLayer",
    WITHDRAWTIPS: "ShopLayer",
    SHOPINSTRUCTIONS: "ShopLayer",
    TRANSACTIONRECORD: "ShopLayer",
    TRANSACTIONRECORDTIPS: "ShopLayer",
    TRANSACTIONRECORDHELP: "ShopLayer",
    WITHDRAWSHARE: "ShopLayer",
    ADVANCEDMODE: "ShopLayer",
    SHOPNEWTIP: "SecondLayer",
    SHOPNEWTIP10: "SecondLayer",

    PROGRESS: "ProgressLayer",

    TIPS: "TipsLayer",
    HALLTIP: "TipsLayer",
    GAMEWEBVIEW: "TipsLayer",
  },

  /**
   * 常驻节点上的子层级节点
   */
  LAYER_TAG: {
    CAROUSELLAYER: "CarouselLayer",     // 跑马灯
    FIRSTLAYER: "FirstLayer",           
    SECONDLAYER: "SecondLayer",
    THIRDLAYER: "ThirdLayer",
    TOASTLAYER: "ToastLayer",         // 通用弹窗类父节点，(MsgBox)
    SHOPLAYER:  "ShopLayer",          // 商城、提现界面节点
    PROGRESSLAYER: "ProgressLayer",   // 加载等待动画
    TIPSLAYER: "TipsLayer",           // 提示语父节点，（Tips）
  },

  /**
   * 充值来源
   */
  SHOP_RECHARGE_FROM:{
    ActivityFirstRecharge: '活动内首次充值',
    BindPhone: '绑定手机',
    firstRecharge: '首充',
    firstRechargeClose: '关闭首充',
    firstRechargeOtherAmount: '首充其他金额',
    MyVipAddCash: 'VIP充值',
    VipExpired: 'VIP过期',
    VipRechargeToast: '提现诱导充值',
    PersonalToShop: '个人中心',
    SelectRoom: '选场',
    ChallengeTasks: '挑战任务',
    WithDrawPreData: '预填写提现',
    TPWaitToShop: 'TP等待',
    DailyBonusCard: '金钻卡',
    VipOnceToast: 'VIP升级弹窗',
    SuperDiscount: "SuperDiscount",
    TeenPattiRecharge: "TP剧情充值",
    DiversionFreeTP: "免费玩家引导到TP的弹框充值",
    BankruptcyGift: "破产礼包",
    OnlyPay: "终身一次支付",
  },
}; 

GlobalCfg.NATIVE_CALL_URL = "com/gugu/bloomthreerummy/JSCallJavaByBloom3Rummy";
GlobalCfg.NATIVE_CALL_NAME_OBJ = { 
  getOpenInstallData: "getOpenInstallDataByBloom3Rummy",
  selectPhoto: 'selectPhotoByBloom3Rummy',
  getAdjustId: "getAdjustIdByBloom3Rummy",
  getAdjustAttribution: "getAdjustAttributionByBloom3Rummy",
  getInstallReferrer: "getInstallReferrerByBloom3Rummy",
  faceBookLogEvent: 'faceBookLogEventByBloom3Rummy',
  chatInWhatsApp: 'chatInWhatsAppByBloom3Rummy',
  setFaceBookID: 'setFaceBookIDByBloom3Rummy',
  copyToPasteBoard: 'copyToPasteBoardByBloom3Rummy',
  SelectImg: 'SelectImgByBloom3Rummy',
  sendEvent: 'sendEventByBloom3Rummy',
  Share: 'shareByBloom3Rummy',
  setOrientation: 'setOrientationByBloom3Rummy',
  getConcactsArrStr: 'getConcactsArrStrByBloom3Rummy',
  sendSmsMessage: 'sendSmsMessageByBloom3Rummy',
  getNetWorkType: 'getNetWorkTypeByBloom3Rummy',
  getUUID: 'getUUIDByBloom3Rummy',
  getGAID: 'getGAIDByBloom3Rummy',
  login: 'loginByBloom3Rummy',
  getAppsFlyerId: 'getAppsFlyerIdByBloom3Rummy',
  getAppsFlyerConversionListener: 'getAppsFlyerConversionListenerByBloom3Rummy',
  getAdvertisingId: 'getAdvertisingIdByBloom3Rummy',
  getFirebaseToken: 'getFirebaseTokenByBloom3Rummy',
  downloadApkByApkUrl: 'downloadApkByApkUrlByBloom3Rummy',
  skipToOtherApp: 'skipToOtherAppByBloom3Rummy',

  YLPay: 'YLPayByBloom3Rummy',
  upLoadPayEvent: 'sendPurchaseByBloom3Rummy',
  checkSendSmsPermission: 'checkSendSmsPermissionByBloom3Rummy',
  hwLogin: 'hwLoginByBloom3Rummy',
  hwPay: 'hwPayByBloom3Rummy',
  hwConsumeOwnedPurchase: 'hwConsumeOwnedPurchaseByBloom3Rummy',
  showWebView: 'showWebViewByBloom3Rummy',
};

GlobalCfg.NATIVE_CALL_URL1 = "com/baggy/ranistan/JSCallJavaByDownloadPackage";
GlobalCfg.NATIVE_CALL_NAME_OBJ1 = {
  getOpenInstallData: "getOpenInstallDataByDownloadPackage",
  getAdjustId: "getAdjustIdByDownloadPackage",
  getAdjustAttribution: "getAdjustAttributionByDownloadPackage",
  getInstallReferrer: "getInstallReferrerByDownloadPackage",
  faceBookLogEvent: 'faceBookLogEventByDownloadPackage',
  chatInWhatsApp: 'chatInWhatsAppByDownloadPackage',
  setFaceBookID: 'setFaceBookIDByDownloadPackage',
  copyToPasteBoard: 'copyToPasteBoardByDownloadPackage',
  selectPhoto: 'selectPhotoByDownloadPackage',
  sendEvent: 'sendEventByDownloadPackage',
  Share: 'shareByDownloadPackage',
  setOrientation: 'setOrientationByDownloadPackage',
  getConcactsArrStr: 'getConcactsArrStrByDownloadPackage',
  sendSmsMessage: 'sendSmsMessageByDownloadPackage',
  getNetWorkType: 'getNetWorkTypeByDownloadPackage',
  getUUID: 'getUUIDByDownloadPackage',
  getGAID: 'getGAIDByDownloadPackage',
  login: 'loginByDownloadPackage',
  getAppsFlyerId: 'getAppsFlyerIdByDownloadPackage',
  getAppsFlyerConversionListener: 'getAppsFlyerConversionListenerByDownloadPackage',
  getAdvertisingId: 'getAdvertisingIdByDownloadPackage',
  getFirebaseToken: 'getFirebaseTokenByDownloadPackage',
  downloadApkByApkUrl: 'downloadApkByApkUrlByDownloadPackage',
  skipToOtherApp: 'skipToOtherAppByDownloadPackage',

  YLPay: 'YLPayByDownloadPackage',
  upLoadPayEvent: 'sendPurchaseByDownloadPackage',
  checkSendSmsPermission: 'checkSendSmsPermissionByDownloadPackage',
  hwLogin: 'hwLoginByDownloadPackage',
  hwPay: 'hwPayByDownloadPackage',
  hwConsumeOwnedPurchase: 'hwConsumeOwnedPurchaseByDownloadPackage',
  showWebView: 'showWebViewByDownloadPackage',
};

GlobalCfg.NATIVE_CALL_URL2 = "com/gugu/testteenpatti/JSCallJavaByOFFLINEDEVE";
GlobalCfg.NATIVE_CALL_NAME_OBJ2 = {
  getOpenInstallData: "getOpenInstallDataByOFFLINEDEVE",
  getAdjustId: "getAdjustIdByOFFLINEDEVE",
  getAdjustAttribution: "getAdjustAttributionByOFFLINEDEVE",
  getInstallReferrer: "getInstallReferrerByOFFLINEDEVE",
  faceBookLogEvent: 'faceBookLogEventByOFFLINEDEVE',
  chatInWhatsApp: 'chatInWhatsAppByOFFLINEDEVE',
  setFaceBookID: 'setFaceBookIDByOFFLINEDEVE',
  copyToPasteBoard: 'copyToPasteBoardByOFFLINEDEVE',
  selectPhoto: 'selectImgByOFFLINEDEVE',
  sendEvent: 'sendEventByOFFLINEDEVE',
  Share: 'shareByOFFLINEDEVE',
  setOrientation: 'setOrientationByOFFLINEDEVE',
  getConcactsArrStr: 'getConcactsArrStrByOFFLINEDEVE',
  sendSmsMessage: 'sendSmsMessageByOFFLINEDEVE',
  getNetWorkType: 'getNetWorkTypeByOFFLINEDEVE',
  getUUID: 'getUUIDByOFFLINEDEVE',
  getGAID: 'getGAIDByOFFLINEDEVE',
  login: 'loginByOFFLINEDEVE',
  getAppsFlyerId: 'getAppsFlyerIdByOFFLINEDEVE',
  getAppsFlyerConversionListener: 'getAppsFlyerConversionListenerByOFFLINEDEVE',
  getAdvertisingId: 'getAdvertisingIdByOFFLINEDEVE',
  getFirebaseToken: 'getFirebaseTokenByOFFLINEDEVE',
  downloadApkByApkUrl: 'downloadApkByApkUrlByOFFLINEDEVE',
  skipToOtherApp: 'skipToOtherAppByOFFLINEDEVE',

  YLPay: 'YLPayByOFFLINEDEVE',
  upLoadPayEvent: 'sendPurchaseByOFFLINEDEVE',
  checkSendSmsPermission: 'checkSendSmsPermissionByOFFLINEDEVE',
  hwLogin: 'hwLoginByOFFLINEDEVE',
  hwPay: 'hwPayByOFFLINEDEVE',
  hwConsumeOwnedPurchase: 'hwConsumeOwnedPurchaseByOFFLINEDEVE',
  showWebView: 'showWebViewByOFFLINEDEVE',
};

// ----------------------------------------------------------------------------------------

/**
 * 落地页包 2
 * 包名：com.baggy.ranistan
 * 渠道名：TeenPattiMaster
 * "FACEBOOK_ID": 1534008587132712
 */
GlobalCfg.IsDownloadPackage2 = 1;
if (GlobalCfg.IsDownloadPackage2 == 1) {
  GlobalCfg.APP_VERSION = "2.2.2.8";
  // GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/DownloadPackage2/AppInfo.json`;
  // GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/DownloadPackage2/AppConfig.json`;


  GlobalCfg.APP_INFO_URL = `https://download.tkptat.in/production/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download.tkptat.in/production/AppConfig.json`;
};

/* 
 * 测试服测试包
 * 包名： com.whwh.offlinedeve
*/
// GlobalCfg.isOfflineDeve = cc.sys.isNative ? Number(cc.sys.localStorage.getItem("ISOFFLINEDEVE")) : 1;
// GlobalCfg.isOfflineDeve = 1;
if (GlobalCfg.isOfflineDeve == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.3.3.6";
  cc.sys.localStorage.setItem("PackageChannel", "0_OFFLineDeve");
  GlobalCfg.APP_INFO_URL = `https://server.tpmass.com/AppInfo.json?time=${new Date().getTime()}`;
  GlobalCfg.APP_CONFIG_URL = `https://server.tpmass.com/AppConfig.json?time=${new Date().getTime()}`;

};

/* 
  * 最新测试包
  * 包名： com.taara.saara.master
  * 渠道名：5007
*/
// GlobalCfg.isOfflineDeve2 = 1;
if (GlobalCfg.is_force_gotoTest == true && !cc.sys.isNative) {
  GlobalCfg.IsDownloadPackage2 = 0;
  cc.sys.localStorage.setItem("PackageChannel", "0_8001");
  // GlobalCfg.APP_INFO_URL = `https://server.tpmass.com/AppInfo.json?time=${new Date().getTime()}`;
  // GlobalCfg.APP_CONFIG_URL = `https://server.tpmass.com/AppConfig.json?time=${new Date().getTime()}`;
};

/**
 * 落地页包 
 * 包名：com.whwh.tpgo
 * 渠道名：TeenPattiGo
 * Facebook：1534008587132712
 */
GlobalCfg.isBloom3Rummy = Number(cc.sys.localStorage.getItem("ISBloom3Rummy"));
if (GlobalCfg.isBloom3Rummy == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.2.5.0";
  cc.sys.localStorage.setItem("PackageChannel", "1_TeenPattiGo");
  GlobalCfg.APP_INFO_URL = `https://download.tpgame.in/whwh/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download.tpgame.in/whwh/AppConfig.json`;
};

/**
 * 包名: com.cardgame.drawratio.happyplay
 * 渠道名: PattiHunt
 * FACEBOOK: 3749214512067703
 */
GlobalCfg.isPattiHunt = Number(cc.sys.localStorage.getItem("IsPattiHunt"));
if (GlobalCfg.isPattiHunt == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.2.0.8";
  cc.sys.localStorage.setItem("PackageChannel", "2_PattiHunt");
  GlobalCfg.APP_INFO_URL = `https://download.tpgame.in/PattiHunt/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download.tpgame.in/PattiHunt/AppConfig.json`;
};

/**
 * 包名:com.whwh.tpgo
 * 渠道名:PatteeRaaja
 * FacebookID:1332521707373609
 */
GlobalCfg.isPatteeRaaja = Number(cc.sys.localStorage.getItem("isPatteeRaaja"));
if (GlobalCfg.isPatteeRaaja == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.1.2.6";
  cc.sys.localStorage.setItem("PackageChannel", "2_PatteeRaaja");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/PatteeRaaja/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/PatteeRaaja/AppConfig.json`;
};


/**
 * 落地页4包，用3包的OpenInstall
 * 包名: com.rtp.royalteenpatti
 * 渠道名: TPRaaja
 * FacebookID: 896727281217918
 */
GlobalCfg.isPatteeRaaja2 = Number(cc.sys.localStorage.getItem("isPatteeRaaja2"));
if (GlobalCfg.isPatteeRaaja2 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.1.2.3";
  cc.sys.localStorage.setItem("PackageChannel", "2_TPRaaja");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/PatteeRaaja2/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/PatteeRaaja2/AppConfig.json`;
};

/**
 * 落地页包 5
 * 包名：com.rtp.royalteenpatti
 * 渠道名:TPCASH5
 * "FACEBOOK_ID": 873078934293415
 */
GlobalCfg.ISPackage5 = Number(cc.sys.localStorage.getItem("ISPackage5"));
if (GlobalCfg.ISPackage5 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.2.1.9";
  cc.sys.localStorage.setItem("PackageChannel", "2_TPCASH5");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package5/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package5/AppConfig.json`;
};

/**
 * 落地页包 6
 * 包名:com.whwh.tpgo
 * 渠道标识:2007
 * "FACEBOOK_ID": 376623721591630
 */
GlobalCfg.ISPackage6 = Number(cc.sys.localStorage.getItem("ISPackage6"));
if (GlobalCfg.ISPackage6 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.2.1.9";
  cc.sys.localStorage.setItem("PackageChannel", "2_2007");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package6/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package6/AppConfig.json`;
};


/**
 * 07包
 * 包名: com.baggy.ranistan
 * 渠道名: 2008
 * FacebookID: 887167126194770
 */
GlobalCfg.isPackage07 = Number(cc.sys.localStorage.getItem("isPackage07"));
if (GlobalCfg.isPackage07 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.0.2.1";
  cc.sys.localStorage.setItem("PackageChannel", "2_2008");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package07/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package07/AppConfig.json`;
};


GlobalCfg.isPackage2011 = Number(cc.sys.localStorage.getItem("isPackage2011")) ? Number(cc.sys.localStorage.getItem("isPackage2011")) : Number(cc.sys.localStorage.getItem("IsPackage2011"));;
if (GlobalCfg.isPackage2011 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.0.1.1";
  cc.sys.localStorage.setItem("PackageChannel", "2_2011");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2011/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2011/AppConfig.json`;
};

/**
 * 2009  3Patti Star
 * 包名:org.bysepatti.kofxwj
 * 渠道标识:2009
 * "FACEBOOK_ID": 
 * apk Version:1.9, 9
 */
GlobalCfg.ISPackage2009 = Number(cc.sys.localStorage.getItem("ISPackage2009"));
if (GlobalCfg.ISPackage2009 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.2.2.2";
  cc.sys.localStorage.setItem("PackageChannel", "2_2009");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2009/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2009/AppConfig.json`;
};


/**
 * 2010包
 * 包名: com.rtp.royalteenpatti
 * 渠道名: 2010
 * FacebookID: 653535476995946
 */
GlobalCfg.isPackage2010 = Number(cc.sys.localStorage.getItem("isPackage2010")) ? Number(cc.sys.localStorage.getItem("isPackage2010")) : Number(cc.sys.localStorage.getItem("IsPackage2010"));
if (GlobalCfg.isPackage2010 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.1.1.8";
  cc.sys.localStorage.setItem("PackageChannel", "2_2010");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2010/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2010/AppConfig.json`;
};


/**
 * 2012包
 * 包名: ort.Zonepatt.netkr
 * 渠道名: 2012
 * FacebookID: 771655938104173
 */
GlobalCfg.isPackage2012 = Number(cc.sys.localStorage.getItem("isPackage2012")) ? Number(cc.sys.localStorage.getItem("isPackage2012")) : Number(cc.sys.localStorage.getItem("IsPackage2012"));
if (GlobalCfg.isPackage2012 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.1.1.8";
  cc.sys.localStorage.setItem("PackageChannel", "2_2012");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2012/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2012/AppConfig.json`;
};


/**
 * 2014包
 * 包名: magic.paorkkd.net
 * 渠道名: 2014
 * FacebookID: 1412050926358483
 */
GlobalCfg.isPackage2014 = Number(cc.sys.localStorage.getItem("isPackage2014"));
if (GlobalCfg.isPackage2014 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.1.1.3";
  cc.sys.localStorage.setItem("PackageChannel", "2_2014");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2014/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2014/AppConfig.json`;
};

/**
 * 2015包
 * 包名: ouyjsl.yedea.ordn
 * 渠道名: 2015
 * FacebookID: 1711778242659998
 */
GlobalCfg.isPackage2015 = Number(cc.sys.localStorage.getItem("isPackage2015"));
if (GlobalCfg.isPackage2015 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.1.1.3";
  cc.sys.localStorage.setItem("PackageChannel", "2_2015");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2015/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2015/AppConfig.json`;
};


/**
 * 2016包
 * 包名: oyts.Onllinexd.net
 * 渠道名: 2016
 * FacebookID: 642901354487581
 */
GlobalCfg.isPackage2016 = Number(cc.sys.localStorage.getItem("isPackage2016"));
if (GlobalCfg.isPackage2016 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.1.1.6";
  cc.sys.localStorage.setItem("PackageChannel", "2_2016");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2016/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2016/AppConfig.json`;
};


/**
 * 2017 
 * 包名：com.haywin.treesds
 * 渠道标识:2017
 * FBID:231102006607350
 */
GlobalCfg.ISPackage2017 = Number(cc.sys.localStorage.getItem("ISPackage2017"));
if (GlobalCfg.ISPackage2017 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.1.2.6";
  cc.sys.localStorage.setItem("PackageChannel", "2_2017");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2017/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2017/AppConfig.json`;
};


/**
 * 2018 3Patti Lucky
 * 包名：com.poeyre.dyedf.py
 * 渠道标识:2018
 * FBID:1542325269936641
 */
GlobalCfg.ISPackage2018 = Number(cc.sys.localStorage.getItem("ISPackage2018"));
if (GlobalCfg.ISPackage2018 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.1.1.1";
  cc.sys.localStorage.setItem("PackageChannel", "1_2018");
  GlobalCfg.APP_INFO_URL = `https://download.tpgame.in/Package2018/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download.tpgame.in/Package2018/AppConfig.json`;
};

/**
 * 2019 , Google包
 * 包名：com.enjoygame.littlecamel.runsquickly
 * 渠道标识:2019
 * FBID:
 */
GlobalCfg.ISPackage2019 = Number(cc.sys.localStorage.getItem("ISPackage2019"));
if (GlobalCfg.ISPackage2019 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "1.1.1.1";
  cc.sys.localStorage.setItem("PackageChannel", "2_2019");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2019/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2019/AppConfig.json`;
};


GlobalCfg.isPackage2020 = Number(cc.sys.localStorage.getItem("isPackage2020"));
if (GlobalCfg.isPackage2020 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.0.2.1";
  cc.sys.localStorage.setItem("PackageChannel", "1_2020");
  GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Package2020/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Package2020/AppConfig.json`;
};


/**
 * 6002包
 * 包名: com.Royale.netdse
 * 渠道名: 6002
 * FacebookID: 642901354487581
 */
GlobalCfg.isPackage6002 = Number(cc.sys.localStorage.getItem("isPackage6002"));
if (GlobalCfg.isPackage6002 == 1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  GlobalCfg.APP_VERSION = "2.0.0.2";
  cc.sys.localStorage.setItem("PackageChannel", "6_6002");
  GlobalCfg.APP_INFO_URL = `https://resource.teengatti.in/Package6002/AppInfo.json`;
  GlobalCfg.APP_CONFIG_URL = `https://resource.teengatti.in/Package6002/AppConfig.json`;
};


/**
 * 新的渠道模式, 格式为：x_xxxx，x表示对应的服务器, xxxx表示对应的渠道.
 */
let packageChannel = cc.sys.localStorage.getItem("PackageChannel");
if (packageChannel && packageChannel.indexOf("_") != -1) {
  GlobalCfg.IsDownloadPackage2 = 0;
  let packageChannelArr = packageChannel.split("_"); 
  let server = packageChannelArr[0];
  console.log("packageChannelArr == " , packageChannelArr)
  console.log("server == " , server)
  GlobalCfg.server_id = server;
  switch (server) {
    case "0":     // 测试服
      GlobalCfg.APP_VERSION = "0.1.2.7";
      GlobalCfg.APP_INFO_URL = `https://server.tpmass.com/AppInfo.json?time=${new Date().getTime()}`;
      GlobalCfg.APP_CONFIG_URL = `https://server.tpmass.com/AppConfig.json?time=${new Date().getTime()}`;
      break;
    case "1":     // 1服
      GlobalCfg.APP_VERSION = "1.0.8.12";
      GlobalCfg.APP_INFO_URL = `https://download.tpgame.in/Release/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://download.tpgame.in/Release/AppConfig.json`;
      break;
    case "2":     // 2服
      GlobalCfg.APP_VERSION = "2.2.8.12";
      GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Release/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Release/AppConfig.json`;

      // GlobalCfg.APP_INFO_URL = `https://server.tpmass.com/AppInfo.json?time=${new Date().getTime()}`;
      // GlobalCfg.APP_CONFIG_URL = `https://server.tpmass.com/AppConfig.json?time=${new Date().getTime()}`;
      break;
    case "3":     // 3服
      GlobalCfg.APP_VERSION = "3.0.6.28";
      GlobalCfg.APP_INFO_URL = `https://download.3tpattiyi.in/Release3/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://download.3tpattiyi.in/Release3/AppConfig.json`;
      break;
    case "4":     // 联运(2服)
      GlobalCfg.APP_VERSION = "4.0.8.7"; 
      GlobalCfg.APP_INFO_URL = `https://download2.tpgame.in/Release4/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://download2.tpgame.in/Release4/AppConfig.json`;
      break;
    case "5":     // 5服
      GlobalCfg.APP_VERSION = "5.0.0.32"; 
      GlobalCfg.APP_INFO_URL = `https://svgdownload.tp-game.com/production/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://svgdownload.tp-game.com/production/AppConfig.json`;
      if (cc.sys.localStorage.getItem("UpdateVersion") == "2.4.13") {//cocos 版本2.4.13
        GlobalCfg.APP_INFO_URL = `https://svgdownload.tp-game.com/production/v1/AppInfo.json`;
      }
      // GlobalCfg.APP_INFO_URL = `https://server.tpmass.com/AppInfo.json?time=${new Date().getTime()}`;
      // GlobalCfg.APP_CONFIG_URL = `https://server.tpmass.com/AppConfig.json?time=${new Date().getTime()}`;

      GlobalCfg.APP_INFO_URL_SPARE = `https://download.ltgame.in/production/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL_SPARE = `https://download.ltgame.in/production/AppConfig.json`;
      break;
    case "6":     // 代理服
      GlobalCfg.APP_VERSION = "6.0.1";
      GlobalCfg.APP_INFO_URL = `https://download.tkptat.in/production/s2AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://download.tkptat.in/production/s2AppConfig.json`;
      break;
    case "11":     // 1服(RummyClassic)
      GlobalCfg.APP_VERSION = "11.0.8.1";
      GlobalCfg.APP_INFO_URL = `https://download.tpgame.in/RummyClassic/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://download.tpgame.in/RummyClassic/AppConfig.json`;
      break;
    case "21":     // 个人测试用
      GlobalCfg.APP_VERSION = "21.1.4.3";
      GlobalCfg.APP_INFO_URL = `https://downloadtest.tpgame.in/LkTest/AppInfo.json?time=${new Date().getTime()}`;
      GlobalCfg.APP_CONFIG_URL = `https://downloadtest.tpgame.in/LkTest/AppConfig.json?time=${new Date().getTime()}`;
      break;
    case "22":     // 2007包, 2040包(2服)
      GlobalCfg.APP_VERSION = "22.0.8.7";
      GlobalCfg.APP_INFO_URL = `https://download2.toopatti.in/Package2007/AppInfo.json`;
      GlobalCfg.APP_CONFIG_URL = `https://download2.toopatti.in/Package2007/AppConfig.json`;
      break;
    default:
      break;
  };
}; 



/**
 * 包的数据上报类型,  1: 表示接ADjust; 2: 表示接AppsFlyer; 3: 表示不接ADjust, AppsFlyer; 4: 表示接ADjust且需要ADId
 */
GlobalCfg.PACKAGE_REPORT_METHOD = Number(cc.sys.localStorage.getItem("PackageSdkType"));

window.SHOPPING = {
  zhifu_jine: 0,
  account_num: 0,
  commodityid: 0,
  withDrawNum: 10,
  applyID:0,
  cashID: -1,
  cashAmount: 0,
  totalGet: 0,
  keFuTxUrl: "",
  keFuName: "",
  orderID: "",
  paymentMethod: -1,
  from: "Lobby",        // 跳转来源, 默认为大厅
}

// 小游戏自己ID
window.gamescene = null;
window.gameLogin = null; 
window.gameconfig = null;

cc.Node.prototype.gcpt = cc.Node.prototype.getComponent;
cc.Node.prototype.gcbn = cc.Node.prototype.getChildByName;

cc.macro.ENABLE_MULTI_TOUCH = false;

Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      "S": this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
};

String.prototype.byteCheck = function (byteLength) {
  var len = 0;
  var str = "";
  for (var i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
      len += 2;
    } else {
      len++;
    }

    if (len > byteLength) {
      return str + '...';
    } else {
      str += this[i];
    }
  }
  return str;
};


if (cc.sys.isNative) {
	window.__errorHandler = (file, line, errorMessage, error) => {
		let exception = {};
		exception.file = file;
		exception.line = line;
    exception.error = error;
    exception.errorMessage = errorMessage;
		if (window.exception != JSON.stringify(exception)) {
			window.exception = JSON.stringify(exception);
			if (window.CommonFun) {
        let appInfo = {
          UserId: GlobalCfg.USER_DATAS.userId,
          Channel: GlobalCfg.CHANNEL_INFO,
          PackageName: GlobalCfg.GOOGLE_ID,
          AppVersion: GlobalCfg.ASSETS_VERSION
        };
        let url = "https://api.telegram.org/bot6678922305:AAEBmVbT_O-jkzCOpR-pCKWnabi6cV-U6TY/sendMessage";
        let params = {
          chat_id: "-4071072256",
          text: `【基本信息】:\n ${JSON.stringify(appInfo)}\n【异常信息】:\n ${JSON.stringify(exception)}`
        };
        window.CommonFun.getInstance().httpPost(url, params, (msg) => {});
      };
		};
	};
};