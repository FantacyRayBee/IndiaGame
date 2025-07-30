"use strict";
cc._RF.push(module, 'de49d+HbkpE36c9yNCQ+IAW', 'ProtoCfg');
// Main/Script/Common/Config/ProtoCfg.js

"use strict";

cc.Class({
  ctor: function ctor() {
    var _this$protoZJH, _this$protoHW, _this$protoHorseRace, _this$protoBaccarat3P;
    this.protoLOBBY = {
      "lobbyservice.pingpang": "PingPang",
      "lobbyservice.login": "LoginAck",
      "lobbyservice.lobbyinit": "LobbyInitAck",
      "lobbyservice.taskaward": "TaskAwardAck",
      //领取任务奖励
      "lobbyservice.contactinfo": "ContactInfoAck",
      //客服联系信息
      "lobbyservice.bindpromoter": "BindPromoterAck",
      //绑定上级
      "lobbyservice.kickout": "KickOut",
      //踢人
      "lobbyservice.currencyconvert": "CurrencyConvertAck",
      "lobbyservice.sendverifycode": "SendVerifyCodeAck",
      //活动 绑定有礼 发送手机验证码 
      "lobbyservice.bindphonenumber": "BindPhoneNumberAck",
      //活动 绑定有礼 绑定手机号
      "lobbyservice.updatesignature": "UpdateSignatureAck",
      //个性签名
      "lobbyservice.querymaillist": "QueryMailListAck",
      //邮件列表
      "lobbyservice.newmailnotify": "NewMailNotifyAck",
      //   系统退赛邮件，收到新邮件
      "lobbyservice.takemailattachment": "TakeMailAttachmentAck",
      //领取奖励 领取后邮件直接删除
      "lobbyservice.deletemail": "DeleteMailAck",
      //删除邮件
      "lobbyservice.querymaildetail": "QueryMailDetailAck",
      //已读邮件

      "lobbyservice.signininfo": "SignInInfoAck",
      //获取签到信息

      "lobbyservice.watchneptuneeducation": "WatchNeptuneEducationAck",
      "lobbyservice.pushpaysuccess": "PushPaySuccessAck",
      // 印度项目 充值成功
      "lobbyservice.pushtransfersuccess": "PushTransferSuccessAck",
      // 印度项目 提现成功
      "lobbyservice.pushcurrencychanged": "PushCurrencyChanged",
      "lobbyservice.onseriescardopened": "OnSeriesCardOpened",
      // 钻卡开通通知
      "lobbyservice.marquee": "Marquee",
      // 跑马灯
      'lobby.marquee': 'Marquee',
      "lobbyservice.newmail": "NewEmail",
      // 新邮件
      "lobbyservice.withdrawcallback": "WithdrawCallback",
      // 提现回调通知
      "lobbyservice.pushnotice": "Notice",
      // 停服弹框公告
      "lobbyservice.kicktolobby": "KickToLobby",
      // 从游戏中踢出到大厅
      "lobbyservice.gobroke": "Broke",
      // 破产
      "lobbyservice.firstchargenotification": "FirstChargeNotification" // 首充通知
    };

    // 炸金花游戏协议
    this.protoZJH = (_this$protoZJH = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.querygoldlist": "QueryGoldListAck",
      //游戏类型(金币)
      "gameservice.enterlv": "EnterLvAck",
      //入场
      "gameservice.kickout": "KickOutAck",
      //异地登录踢人
      "gameservice.receivefreetrial": "ReceiveFreeTrialAck"
    }, _this$protoZJH["gameservice.querygoldlist"] = "QueryGoldListAck", _this$protoZJH["gameservice.exitgame"] = "ExitGameAck", _this$protoZJH["gameservice.changeroom"] = "ChangeRoomAck", _this$protoZJH["gameservice.shortmessage"] = "ShortMessageAck", _this$protoZJH["gameservice.shortmessagenotify"] = "ShortMessageNotify", _this$protoZJH["gameservice.updatecoinnotify"] = "UpdateCoinNotify", _this$protoZJH["gameservice.gamescene"] = "GameSceneNotify", _this$protoZJH["gameservice.playerjoinnotify"] = "PlayerJoinNotify", _this$protoZJH["gameservice.playerleavenotify"] = "PlayerLeaveNotify", _this$protoZJH["gameservice.playerofflinenotify"] = "PlayerOfflineNotify", _this$protoZJH["gameservice.gamestartnotify"] = "GameStartNotify", _this$protoZJH["gameservice.askchipnotify"] = "AskChipNotify", _this$protoZJH["gameservice.chip"] = "ChipAck", _this$protoZJH["gameservice.playerchipnotify"] = "PlayerChipNotify", _this$protoZJH["gameservice.drop"] = "DropAck", _this$protoZJH["gameservice.playerdropnotify"] = "PlayerDropNotify", _this$protoZJH["gameservice.look"] = "LookAck", _this$protoZJH["gameservice.playerlooknotify"] = "PlayerLookNotify", _this$protoZJH["gameservice.launchcompare"] = "LaunchCompareAck", _this$protoZJH["gameservice.playerlaunchcomparenotify"] = "LaunchCompareNotify", _this$protoZJH["gameservice.answercompare"] = "AnswerCompareAck", _this$protoZJH["gameservice.playeranswercomparenotify"] = "AnswerCompareNotify", _this$protoZJH["gameservice.gameovernotify"] = "GameOverNotify", _this$protoZJH["gameservice.playerluanchcomparenotify"] = "LaunchCompareNotify", _this$protoZJH["gameservice.preparepayment"] = "PreparePaymentAck", _this$protoZJH["gameservice.preparepaymentnotify"] = "PreparePaymentNotify", _this$protoZJH["gameservice.paymentfinishnotify"] = "PaymentFinishNotify", _this$protoZJH["gameservice.destroyandmatchingnotify"] = "DestroyAndMatchingNotify", _this$protoZJH);

    // 7上7下游戏协议
    this.protoUPDOWN = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.kickout": "KickOutAck",
      //踢人
      "gameservice.gameconfig": "GameConfigAck",
      //游戏配置
      "gameservice.joinvip": "JoinVipReq",
      //vip入座请求
      "gameservice.joinvipnotify": "JoinVipNotify",
      //vip入座进入
      "gameservice.leavevipnotify": "LeaveVipNotify",
      //玩家离开
      "gameservice.gamestartnotify": "GameStartNotifyAck",
      //游戏开始
      "gameservice.gamescene": "GameSceneAck",
      //刚进入游戏后游戏场景发送
      "gameservice.playerlist": "PlayerListAck",
      //进入游戏后返回所有玩家列表
      "gameservice.gamerecordlist": "GameRecordListAck",
      //进入游戏后返回所有埋雷列表
      "gameservice.call": "CallNotifyAck",
      //发射
      "gameservice.callnotify": "CallNotifyAck",
      //vip发射广播
      "gameservice.gameendnotify": "GameEndNotify",
      //游戏结果
      "gameservice.changefort": "ChangeFortAck",
      //切换炮台
      "gameservice.vipchangefortnotify": "VipChangeFortNotify",
      //vip切换炮台通知
      "gameservice.exitgamereq": "ExitGameAck",
      //退出游戏
      "gameservice.querygameendinfo": "QueryGameEndInfoAck",
      //请求上一局结算结果
      "gameservice.updatebalance": "UpdateBalanceAck",
      "gameservice.refreshusernotify": "CoinPlayer",
      "gameservice.currencycovert": "CovertAck",
      "gameservice.updatesafe": "UpdateSafeAck",
      "gameservice.querysafeleft": "QuerySafeLeftAck",
      "gameservice.vipplayerlist": "VipPlayerListAck",
      "gameservice.shortmessage": "ShortMessageAck",
      //短消息
      "gameservice.shortmessagenotify": "ShortMessageNotify" //短消息广播
    };

    // 安德尔游戏
    this.protoAndeer = {
      "gameservice.login": "LoginAck",
      // 登录
      "gameservice.enterroom": "EnterRoomAck",
      // 进入房间
      "gameservice.exitroom": "ExitRoomAck",
      // 退出房间   
      "gameservice.changeroom": "ChangeRoomAck",
      // 换房间
      "gameservice.playerenternotify": "PlayerEnterNotify",
      // 玩家进入广播
      "gameservice.playerexitnotify": "PlayerExitNotify",
      // 玩家离开广播
      "gameservice.gamescene": "GameSceneAck",
      // 刷新游戏场景
      "gameservice.firstbetstatusstartnotify": "FirstBetStatusStartNotify",
      // 第一次下注状态开始
      "gameservice.abdealnotify": "ABDealNotify",
      // 发牌通知
      "gameservice.secondbetstatusstartnotify": "SecondBetStatusStartNotify",
      // 第二次下注状态开始
      "gameservice.call": "CallAck",
      // 下注
      "gameservice.callnotify": "CallNotify",
      // 下注通知
      "gameservice.gamesettlenotify": "GameSettleNotify",
      // 游戏结束通知
      "gameservice.shortmessage": "ShortMessageAck",
      // 短消息
      "gameservice.shortmessagenotify": "ShortMessageNotify",
      // 短消息广播
      "gameservice.updatecoinnotify": "UpdateCoinNotify",
      // 货币更新广播(非游戏行为)
      "gameservice.asktrial": "AskTrialAck" // 获取积分
    };

    // 打地鼠游戏
    this.protoDds = {
      "gameservice.login": "LoginAck",
      // 登录游戏
      "gameservice.gameconfig": "GameConfigAck",
      // 游戏配置
      "gameservice.call": "CallReq",
      // 发射
      "gameservice.updatebalance": "UpdateBalanceAck",
      // 刷新金币
      "gameservice.kickout": "KickOutAck",
      // 踢人
      "gameservice.changefort": "ChangeFortAck",
      //更换锤子
      "gameservice.refreshusernotify": "CoinPlayer",
      //通知刷新玩家当前金币数量 
      "gameservice.currencycovert": "CovertAck",
      //
      "gameservice.updatesafe": "UpdateSafeAck",
      //更新保险箱
      "gameservice.querysafeleft": "QuerySafeLeftAck",
      //保险箱
      "gameservice.exitgamereq": "ExitGameAck",
      //退出游戏
      "gameservice.gamescene": "GameSceneAck",
      //刚进入游戏后游戏场景发送
      "gameservice.joinvipnotify": "JoinVipNotify",
      //控制VIP上下座.

      "gameservice.enterusernotify": "EnterUserNotify",
      //玩家加入房间
      "gameservice.callnotify": "CallNotify",
      //打地鼠广播
      "gameservice.leaveusernotify": "LeaveUserNotify"
    };
    this.protoHW = (_this$protoHW = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.gamescenenotify": "GameSceneNotify",
      //刚进入游戏后游戏场景发送
      "gameservice.gamestartnotify": "GameStartNotify",
      //游戏开始
      "gameservice.gameconfignotify": "GameConfigNotify",
      //游戏配置
      "gameservice.joinvipnotify": "JoinVipNotify",
      //vip入座请求
      "gameservice.gamestatusnotify": "GameStatusNotify",
      "gameservice.call": "CallAck",
      //发射
      "gameservice.callnotify": "CallNotify",
      //vip发射广播
      "gameservice.joinvip": "JoinVipAck",
      //vip入座请求
      "gameservice.vipplayerlist": "VipPlayerListAck",
      //vip请求列表
      "gameservice.gamerecordlist": "GameRecordListAck",
      //进入游戏后历史记录
      "gameservice.vipchangefort": "VipChangeFortAck",
      //自己切换炮台
      "gameservice.vipchangefortnotify": "VipChangeFortNotify",
      //VIP切换炮台通知
      "gameservice.playerlist": "PlayerListAck",
      //拉取所有玩家列表
      "gameservice.querygameendinfo": "QueryGameEndInfoAck",
      //拉取游戏结算结果

      "gameservice.kickout": "KickOutAck"
    }, _this$protoHW["gameservice.joinvipnotify"] = "JoinVipNotify", _this$protoHW["gameservice.leavevipnotify"] = "LeaveVipNotify", _this$protoHW["gameservice.gameendnotify"] = "GameEndNotify", _this$protoHW["gameservice.changefort"] = "ChangeFortAck", _this$protoHW["gameservice.vipchangefortnotify"] = "VipChangeFortNotify", _this$protoHW["gameservice.exitgamereq"] = "ExitGameAck", _this$protoHW["gameservice.updatebalance"] = "UpdateBalanceAck", _this$protoHW["gameservice.refreshusernotify"] = "CoinPlayer", _this$protoHW["gameservice.currencycovert"] = "CovertAck", _this$protoHW["gameservice.updatesafe"] = "UpdateSafeAck", _this$protoHW["gameservice.querysafeleft"] = "QuerySafeLeftAck", _this$protoHW["gameservice.vipplayerlist"] = "VipPlayerListAck", _this$protoHW);

    // Rummy游戏
    this.protoRummy = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.queryroomlist": "QueryRoomListAck",
      //获取房间列表
      "gameservice.enterroom": "EnterRoomAck",
      //进入房间
      "gameservice.changetable": "ChangeTableAck",
      //换桌
      "gameservice.exitgame": "ExitGameAck",
      //离开游戏
      // "gameservice.ready": "ReadyAck",                                              //游戏准备
      "gameservice.onplayerready": "OnPlayerReady",
      // 准备 广播
      "gameservice.onkickout": "OnKickout",
      //踢人 广播
      "gameservice.shortmessage": "ShortMessageAck",
      //短消息
      "gameservice.shortmessagenotify": "ShortMessageNotify",
      //短消息广播
      "gameservice.ongamestart": "OnGameStart",
      //游戏开始广播
      "gameservice.pickcard": "PickCardAck",
      //起牌
      "gameservice.onplayerpick": "OnPlayerPick",
      //玩家起牌广播
      "gameservice.onflowrefresh": "OnFlowRefresh",
      //流局流局刷新牌库 广播
      "gameservice.outcard": "OutCardAck",
      //出牌
      "gameservice.onplayerout": "OnPlayerOut",
      //玩家出牌广播
      "gameservice.drop": "DropReq",
      //弃牌
      "gameservice.choosehu": "ChooseHuAck",
      //选择胡   
      "gameservice.onplayerjoin": "OnPlayerJoin",
      //新玩家进入  广播
      "gameservice.onplayerleave": "OnPlayerLeave",
      //玩家离开房间  广播
      "gameservice.onstartgametimer": "OnStartGameTimer",
      //游戏开始倒计时  广播
      "gameservice.refreshgamescene": "RefreshGameSceneAck",
      //游戏场景刷新
      "gameservice.ongamecalc": "OnGameCalc",
      //游戏结束 广播
      "gameservice.onchoosehu": "OnChooseHu",
      //胡牌广播
      "gameservice.tidyfinalcards": "TidyFinalCardsAck",
      //胡牌后摆牌
      "gameservice.setcontinue": "SetContinueAck",
      //继续下一局
      "gameservice.lookoutpool": "LookOutPoolAck",
      //获取出牌库
      "gameservice.movehandgroup": "MoveHandGroupAck",
      //摆牌
      "gameservice.receivefreetrial": "ReceiveFreeTrialAck",
      //领取体验币
      "gameservice.ondiamondupdate": "OnDiamondUpdate",
      //货币刷新
      "gameservice.ondrop": "OnDrop",
      //弃牌广播
      "gameservice.ontidyfinalcards": "OnTidyFinalCards" //摆牌广播
    };

    //弹弹球游戏协议
    this.protoTTQ = {
      "gameservice.pingpang": "PingPang",
      "gameservice.login": "LoginAck",
      // 登录游戏
      "gameservice.gameconfig": "GameConfigAck",
      // 游戏配置
      "gameservice.call": "CallNotify",
      // 发射
      "gameservice.updatebalance": "UpdateBalanceAck",
      // 刷新金币
      "gameservice.kickout": "KickOutAck",
      // 踢人
      "gameservice.changefort": "ChangeFortAck",
      //更换锤子
      "gameservice.refreshusernotify": "CoinPlayer",
      //通知刷新玩家当前金币数量 
      "gameservice.currencycovert": "CovertAck",
      //
      "gameservice.updatesafe": "UpdateSafeAck",
      //更新保险箱
      "gameservice.querysafeleft": "QuerySafeLeftAck",
      //保险箱
      "gameservice.exitgamereq": "ExitGameAck",
      //退出游戏
      "gameservice.settlement": "SettlementAck"
    };
    this.protoLHD = {
      "gameservice.login": "LoginAck",
      // 登录
      "gameservice.exitroom": "ExitRoomAck",
      // 退出房间
      "gameservice.gamescene": "GameSceneAck",
      // 刷新游戏场景
      "gameservice.playerlist": "PlayerListAck",
      // 获取玩家列表
      "gameservice.joinvip": "JoinVipAck",
      // 加入Vip座位
      "gameservice.joinvipnotify": "JoinVipNotify",
      // 获取Vip列表
      "gameservice.roomstatuschangednotify": "RoomStatusChangedNotify",
      // 游戏状态变化通知
      "gameservice.call": "CallAck",
      // 下注
      "gameservice.callnotify": "CallNotify",
      // 下注通知
      "gameservice.gamesettlenotify": "GameSettleNotify",
      // 游戏结束通知
      "gameservice.playernumberchangednotify": "PlayerNumberChangedNotify",
      //人数变化通知
      "gameservice.shortmessage": "ShortMessageAck",
      // 短消息
      "gameservice.shortmessagenotify": "ShortMessageNotify",
      // 短消息广播
      "gameservice.updatecoinnotify": "UpdateCoinNotify" // 货币更新广播
    };

    //Munda
    this.protoMunda = {
      "gameservice.login": "LoginAck",
      "gameservice.joinvip": "JoinVipAck",
      "gameservice.joinvipnotify": "JoinVipNotify",
      "gameservice.gamestartnotify": "GameStartNotifyAck",
      "gameservice.gamescene": "GameSceneAck",
      "gameservice.call": "CallAck",
      "gameservice.callnotify": "CallNotifyAck",
      "gameservice.gameendnotify": "GameEndNotify",
      "gameservice.kickout": "KickOutAck",
      "gameservice.exitgame": "ExitGameAck",
      // 退出游戏
      "gameservice.playerlist": "PlayerListAck",
      "gameservice.viplist": "VipListAck",
      //VIP 列表
      "gameservice.querygameendinfo": "GameEndNotify",
      "gameservice.shortmessage": "ShortMessageAck",
      //短消息
      "gameservice.shortmessagenotify": "ShortMessageNotify" //短消息广播
    };

    //MutliTeenPatti
    this.protoMtp = {
      "gameservice.login": "LoginAck",
      "gameservice.joinvip": "JoinVipAck",
      "gameservice.joinvipnotify": "JoinVipNotify",
      "gameservice.gamestartnotify": "GameStartNotifyAck",
      "gameservice.gamescene": "GameSceneAck",
      "gameservice.call": "CallAck",
      "gameservice.callnotify": "CallNotifyAck",
      "gameservice.gameendnotify": "GameEndNotify",
      "gameservice.kickout": "KickOutAck",
      "gameservice.exitgame": "ExitGameAck",
      // 退出游戏
      "gameservice.playerlist": "PlayerListAck",
      "gameservice.viplist": "VipListAck",
      //VIP 列表
      "gameservice.querygameendinfo": "GameEndNotify",
      "gameservice.shortmessage": "ShortMessageAck",
      //短消息
      "gameservice.shortmessagenotify": "ShortMessageNotify" //短消息广播
    };

    this.protoHorseRace = (_this$protoHorseRace = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.joinroom": "JoinRoomAck",
      //加入房间
      "gameservice.joinroomnotify": "JoinRoomNotify",
      //加入房间通知
      "gameservice.playerlist": "PlayerListAck",
      //获取房间列表
      "gameservice.vipplayerlist": "VipPlayerListAck",
      //获取Vip列表
      "gameservice.gamerecordlist": "GameRecordListAck",
      //获取获取战绩信息
      "gameservice.call": "CallAck",
      //下注
      "gameservice.callnotify": "CallNotify",
      //下注通知
      "gameservice.sendcardsnotify": "SendCardsNotify",
      //发牌通知
      "gameservice.joinvipposnotify": "JoinVipPosNotify",
      //加入vip座位广播
      "gameservice.joinvippos": "JoinVipPosAck",
      //加入vip座位
      "gameservice.startgamenotify": "StartGameNotify",
      //游戏开始通知
      "gameservice.endbetnotify": "EndBetNotify",
      //结束下注通知
      "gameservice.gameovernotify": "GameOverNotify"
    }, _this$protoHorseRace["gameservice.joinvippos"] = "JoinVipPosAck", _this$protoHorseRace["gameservice.outgamenotify"] = "OutGameNotify", _this$protoHorseRace["gameservice.outgame"] = "OutGameAck", _this$protoHorseRace["gameservice.shortmessage"] = "ShortMessageAck", _this$protoHorseRace["gameservice.shortmessagenotify"] = "ShortMessageNotify", _this$protoHorseRace["gameservice.playerwinloseinfonotify"] = "PlayerWinLoseInfoNotify", _this$protoHorseRace);
    this.protoSSC = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.gamestartnotify": "GameStartNotifyAck",
      //游戏开始
      "gameservice.gamescene": "GameSceneAck",
      //刚进入游戏后游戏场景发送
      "gameservice.call": "CallAck",
      // 下注
      "gameservice.callnotify": "CallNotifyAck",
      // 下注通知
      "gameservice.gameendnotify": "GameEndNotify",
      // 游戏结果
      "gameservice.querymyrecord": "QueryMyRecordAck",
      //记录 - 我的记录 
      "gameservice.queryjackpotrecord": "QueryJackpotRecordAck",
      //记录 - 头奖记录
      "gameservice.querybigwinnerrecord": "QueryBigWinnerRecordAck",
      //记录 - 大赢家记录
      "gameservice.queryopenrecord": "QueryOpenRecordAck",
      //查询开奖记录
      "gameservice.querygameendinfo": "GameEndNotify",
      //查询开奖记录
      "gameservice.exitgame": "ExitGameAck"
    };
    this.protoSGJ = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.call": "CallAck" //下注    
    };
    //玛雅机台
    this.protoMaya = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.call": "CallAck" //下注    
    };
    //小丑机台
    this.protoJoker = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.call": "CallAck" //下注    
    };
    //印度舞娘机台
    this.protoIndia = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.call": "CallAck" //下注    
    };
    //吸血鬼机台
    this.protoVampire = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.call": "CallAck" //下注    
    };
    //吸血鬼机台
    this.protoBull = {
      "gameservice.login": "LoginAck",
      //登录
      "gameservice.call": "CallAck" //下注    
    };

    //猫王游戏协议
    this.protoMW = {
      "gameservice.pingpang": "PingPang",
      "gameservice.login": "LoginAck",
      // 登录游戏
      "gameservice.enterroom": "EnterRoomAck",
      "gameservice.syncscene": "GameSceneNotify",
      "gameservice.gamescenenotify": "GameSceneNotify",
      "gameservice.callreq": "CallAck",
      "gameservice.callnotify": "CallNotify",
      "gameservice.changecallitem": "ChangeCallItemAck",
      "gameservice.changecallitemnotify": "ChangeCallItemNotify",
      "gameservice.notifyuserenter": "EnterUserNotify",
      "gameservice.leave": "UserLeaveAck",
      "gameservice.leaveusernotify": "LeaveUserNotify",
      "gameservice.selectredpacket": "RedPacketResult",
      "gameservice.cardresult": "CardResult",
      "gameservice.fantuanresult": "FanTuanResult",
      "gameservice.refreshcoin": "RefreshCoin",
      "gameservice.notifyhouchedata": "NotifyHouCheData",
      "gameservice.huocheresultreq": "HuoCheResult",
      "gameservice.notifytansuodata": "NotifyTanSuoData",
      "gameservice.tansuoresultreq": "TanSuoResult",
      "gameservice.notifyyanhoudata": "NotifyYanHouData",
      "gameservice.notifyyanhouresult": "NotifyYanHouResult",
      "gameservice.broadcastshandianatk": "BroadCastShanDianAtk",
      "gameservice.removemonsternotify": "RemoveMonsterNotify"
    };
    this.protoBenz = {
      "gameservice.login": "LoginAck",
      "gameservice.callack": "CallAck",
      "gameservice.call": "CallAck",
      "gameservice.gamescenenotify": "GameSceneNotify",
      "gameservice.gamescene": "GameSceneAck",
      "gameservice.exit": "ExitAck",
      "gameservice.updatecoinnotify": "UpdateCoinNotify"
    };

    //百人场炸金花
    this.protoBaccarat3Patti = (_this$protoBaccarat3P = {
      "gameservice.login": "LoginAck",
      "gameservice.gamescene": "GameSceneAck",
      "gameservice.call": "CallAck",
      "gameservice.callnotify": "CallNotifyAck",
      "gameservice.gameendnotify": "GameEndNotify",
      "gameservice.kickout": "KickOutAck",
      "gameservice.exitgame": "ExitGameAck",
      "gameservice.playerlist": "PlayerListAck",
      "gameservice.querygameendinfo": "QueryGameEndInfoAck",
      "gameservice.querymyrecord": "QueryMyRecordAck",
      "gameservice.gamestartnotify": "GameStartNotifyAck",
      "gameservice.joinvippos": "JoinVipPosAck",
      "gameservice.joinvipposnotify": "JoinVipPosNotify",
      "gameservice.vipplayerlist": "VipPlayerListAck",
      "gameservice.joinvipnotify": "JoinVipPosNotify"
    }, _this$protoBaccarat3P["gameservice.querygameendinfo"] = "GameEndNotify", _this$protoBaccarat3P["gameservice.shortmessage"] = "ShortMessageAck", _this$protoBaccarat3P["gameservice.shortmessagenotify"] = "ShortMessageNotify", _this$protoBaccarat3P["gameservice.updatecoinnotify"] = "UpdateCoinNotify", _this$protoBaccarat3P["gameservice.paymentfinishnotify"] = "PaymentFinishNotify", _this$protoBaccarat3P);

    // 火箭
    this.protoRocket = {
      "gameservice.login": "LoginAck",
      "gameservice.loadwhole": "LoadWholeAck",
      "gameservice.exit": "ExitAck",
      "gameservice.playerlist": "PlayerListAck",
      "gameservice.playernumberchangednotify": "PlayerNumberChangedNotify",
      "gameservice.bet": "BetAck",
      "gameservice.cash": "CashAck",
      "gameservice.cashnotify": "CashNotify",
      "gameservice.startbettingnotify": "StartBetNotify",
      "gameservice.startflynotify": "StartFlyNotify",
      "gameservice.flyfinishnotify": "FlyFinishNotify",
      "gameservice.bettingupdatenotify": "BettingUpdateNotify",
      "gameservice.updatecoinnotify": "UpdateCoinNotify"
    };

    // 飞机
    this.protoAviator = {
      "gameservice.login": "LoginAck",
      "gameservice.loadwhole": "LoadWholeAck",
      "gameservice.exit": "ExitAck",
      "gameservice.playerlist": "PlayerListAck",
      "gameservice.playernumberchangednotify": "PlayerNumberChangedNotify",
      "gameservice.bet": "BetAck",
      "gameservice.cash": "CashAck",
      "gameservice.cashnotify": "CashNotify",
      "gameservice.startbettingnotify": "StartBetNotify",
      "gameservice.startflynotify": "StartFlyNotify",
      "gameservice.flyfinishnotify": "FlyFinishNotify",
      "gameservice.bettingupdatenotify": "BettingUpdateNotify",
      "gameservice.updatecoinnotify": "UpdateCoinNotify",
      "gameservice.endbettingnotify": "EndBettingNotify",
      "gameservice.getrankingdata": "GetRankingDataAck",
      "gameservice.seed": "SeedAck",
      "gameservice.betnotify": "BetNotify",
      "gameservice.lastgamerecord": "LastGameRecordAck",
      "gameservice.getplayerrecord": "GetPlayerRecordAck"
    };

    // 动物园
    this.protoZoo = {
      "gameservice.login": "LoginAck",
      "gameservice.loadwhole": "LoadWholeAck",
      "gameservice.exit": "ExitAck",
      "gameservice.playerlist": "PlayerListAck",
      "gameservice.playernumberchangednotify": "PlayerNumberChangedNotify",
      "gameservice.bet": "BetAck",
      "gameservice.betnotify": "BetNotify",
      "gameservice.startbettingnotify": "StartBetNotify",
      "gameservice.startflynotify": "StartFlyNotify",
      "gameservice.bettingupdatenotify": "BettingUpdateNotify",
      "gameservice.updatecoinnotify": "UpdateCoinNotify",
      "gameservice.joinvip": "JoinVipAck",
      "gameservice.joinvipnotify": "JoinVipNotify",
      "gameservice.shortmessage": "ShortMessageAck",
      "gameservice.shortmessagenotify": "ShortMessageNotify"
    };

    // 板球
    this.protoCricket = {
      "gameservice.login": "LoginAck",
      "gameservice.loadwhole": "LoadWholeAck",
      "gameservice.exit": "ExitAck",
      "gameservice.playerlist": "PlayerListAck",
      "gameservice.playernumberchangednotify": "PlayerNumberChangedNotify",
      "gameservice.bet": "BetAck",
      "gameservice.betnotify": "BetNotify",
      "gameservice.startbettingnotify": "StartBetNotify",
      "gameservice.startflynotify": "StartFlyNotify",
      "gameservice.bettingupdatenotify": "BettingUpdateNotify",
      "gameservice.updatecoinnotify": "UpdateCoinNotify",
      "gameservice.joinvip": "JoinVipAck",
      "gameservice.joinvipnotify": "JoinVipNotify",
      "gameservice.shortmessage": "ShortMessageAck",
      "gameservice.shortmessagenotify": "ShortMessageNotify"
    };

    // 宙斯
    this.protoZeus = {
      "gameservice.login": "LoginAck",
      "gameservice.call": "CallAck",
      "gameservice.freecall": "CallAck",
      "gameservice.exit": "ExitAck",
      "gameservice.updatecoinnotify": "UpdateCoinNotify"
    };
  },
  getProto: function getProto(gameName) {
    if (gameName == "LOBBY") {
      return this.protoLOBBY;
    } else if (gameName == "tpGame") {
      return this.protoZJH;
    } else if (gameName == 'UPDOWN') {
      return this.protoUPDOWN;
    } else if (gameName == "ANDEER") {
      return this.protoAndeer;
    } else if (gameName == "HitMouse") {
      return this.protoDds;
    } else if (gameName == "HWZZ") {
      return this.protoHW;
    } else if (gameName == "Rummy") {
      return this.protoRummy;
    } else if (gameName == "TTQ") {
      return this.protoTTQ;
    } else if (gameName == "LHD") {
      return this.protoLHD;
    } else if (gameName == "HORSERACE") {
      return this.protoHorseRace;
    } else if (gameName == "Munda") {
      return this.protoMunda;
    } else if (gameName == "MTP") {
      return this.protoMtp;
    } else if (gameName == "SSC") {
      return this.protoSSC;
    } else if (gameName == "SGJ") {
      return this.protoSGJ;
    } else if (gameName == "MAYA") {
      return this.protoMaya;
    } else if (gameName == "JOKER") {
      return this.protoJoker;
    } else if (gameName == "INDIA") {
      return this.protoIndia;
    } else if (gameName == "VAMPIRE") {
      return this.protoVampire;
    } else if (gameName == "BULL") {
      return this.protoBull;
    } else if (gameName == "MW") {
      return this.protoMW;
    } else if (gameName == "Benz") {
      return this.protoBenz;
    } else if (gameName == "baccarat3Patti") {
      return this.protoBaccarat3Patti;
    } else if (gameName == "rocket") {
      return this.protoRocket;
    } else if (gameName == "aviator") {
      return this.protoAviator;
    } else if (gameName == "zooGame") {
      return this.protoZoo;
    } else if (gameName == "cricketGame") {
      return this.protoCricket;
    } else if (gameName == "zeusGame") {
      return this.protoZeus;
    }
  }
});

cc._RF.pop();