export const Result = {

   //common for all games
   Success:0,
   Fail:1,


   verifyPlayerFail:2,
   emailUsed:3,
   emailValid:4,
   invalidMail:5,
   playerNotFound:6,
   guestCanNotRecommend:7,
   canNotLogin:8,
   alreadyInGame:9,
   keepInGame:10,
   ban:11,  // 封禁
   //

   hadGetReward:12, //已经领取奖励

   UnknownGame : 13, //未知游戏
   canNotCreateGame : 14, //不允许创建游戏

   sqlError:30,
   lessMoney:31,
   lessCoin:32,

   clientRestart:33,
   clientUpdate:34,
   bindError:35,



   joinRoomOK:36,
   cfgVersionChange:37,
   alreadyInRoom:38,
   roomFull:39,
   slotNotFound:40,
   roomNotFound:41,
   minVersion:42,
   daikaiRoomFull:43, //代开房间满
   fzbTooClose:44, //防作弊开启 房间内有距离过近玩家

   zjhCfgChange:50,
   zjhDateEnd:51,
   zjhCfgStop:52,
   roomInPlay:53,
   playerNotWaitStart:54,
   cd:55, // 冷却中 此时一般会带个时间过去



   joinActOK:60,
   canNotJoinActInPlay:61,
   joinWrongAct:62,
   alreadyInAct:63,
   actClosed:64, //no use
   invalidActPos:65,
   invalidActRoom:66,
   actEnd:67,
   invalidReward:68,
   lessCount:69,
   notEnoughCondition:70, // 未满足条件
   actNotStart:71, // 未开始


   //add member to myroom
   canNotAddSelf:80,
   isMemberAlready:81,
   memberNotFound:82,
   addMemberOK:83,
   removeMemberOK:84,
   membersNumLimit:85,
   memberofNumLimit:86,
   authAddPlayerExist:87,


   rpcErr:100,
   loginToMuch:101,
   errorState:102,
   serverFull:103,


   //俱乐部
   noRedis:120,   // 没有开启redis
   redisError:121,   // redis连接有错
   noClub:122, // 没有此俱乐部
   clubsLimit:123,   // 俱乐部数量已到上限
   clubIn:124, // 已经是该俱乐部成员
   applyLimit:125,   //申请加入俱乐部限制
   notInClub:126, // 不在此俱乐部中
   ownerCanntExitClub:127, // 会长不能退出俱乐部
   noCreatePara:128, // 没有设置玩法
   clubMemberLimit:129, //俱乐部人数超出上限
   SetFrequently:130, //设置频繁
   limitMemberInClub:131, // 俱乐部中最少成员才可以创建新的俱乐部
   RoomServerIsLevelUp:150,   // 房间正在升级请稍后
   noRound:151,         // 创建房间的时候没有对应的round

   PhoneError:170,      //无效的手机号
   PhoneVerCd:171,      //发送验证码cd中
   PhoneVerError:172,   //后台发送失败 请联系客服
   VerCodeError:173,    //验证码错误
   verCodeLimit:174,    //验证码已失效
   PhoneBeBinded:175,   //手机号已经被注册
   OldPasswdWrong:176,  //老密码不正确
   passError:178,       //密码错误
   needChangePwd:179,   //需要修改密码


   // 比赛
   matchNotExist:200,   //比赛不存在
   matchStopped:201,    //比赛已经被停止,后台将status设置为0了
   inMatch:202,         //已经在比赛中了
   notInMatch:203,      //不在比赛中
   Exchanging:204,      //正在兑换红包

   //
   UnkownCmd:250,       //没有对应的cmd
   invalidParam:251,     //无效的请求参数
   Frequent:252,        //操作太频繁

   //更换微信
   Chwxing: 261,        //已有更换申请
   ChwxLimit: 262,      //已达今日上限
   ChwxOtherNotFound: 263, //对方玩家不存在
   ChwxCheckError: 264,    //更换微信检查错误
   ChwxIdRandError: 265,   //更换微信申请方ID或验证码错误
   WxNotBound: 266,        //未绑定微信
   NoIcOrIi: 267,          //未绑定邀请码或没有邀请人
   ChwxNotToSelf: 268,  //不能与自己更换微信

   // 大厅相关错误码
   hallClosed:400,       //大厅未开启
   hallNoServer:401,     //没有可用服务器 不可进入大厅
   hallSignError:402,    //验证错误,请重试
   hallTimeOut:403,      //登录已超时, 需要重连
   hallLoginError:404,   //大厅服禁止其他登录方式
   hallCfgErr:405,         //金币场配置有错误
   hallNoGame:406,         //金币场没有此玩法
   hallCoinLimit:407,      //金币限制无法进入
   hallMatching:408,       //正在匹配其他场次或玩法
   hallInGame:409,          //正在金币场游戏中
   hallRelieved:410,  //金币场救济金领取次数不足
   hallOverRelieve:411, //金币场当前金币超过可领取限制
   hallLessMoney:412, //金币场小游戏 米币不足
   hallSessionKeyInvalid:413, //金币场小游戏 用户未登录或登录态已过期
   hallNotInvite:414, //金币场小游戏请求玩家不可领取邀请奖励

   idLoginError: 414,   // id登录失败 弹窗显示tips字符串


   OSFail:420, //订单错误
   OSDBFail:421, //数据库状态修改错误

   ///////////////////////////////////////////////////////////////////////////

   DBFail: 999,               //数据库错误
   AccountIsNull:1001,        //账号为空
   PasswdIsNull:1002,         //密码为空
   AccountNotExists:1003,     //帐号不存在
   PasswdFail:1004,           //密码错误
   AccountAlreadyExists:1005,  //账号已存在

   ////////////////////////////////////////////////////////////////////////////
   gameNotStart : 2000,
   notMoney : 2001            //金币不足
};
