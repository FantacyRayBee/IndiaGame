let customizeCloseEvent = {

};

let LobbyServerManager = {
    socket: null,
    hearbeatTimer: null,
    hearbeatOutTimer: null,
    hearbeatTimeInterval: 10000,
    needReconnect: true,
    reconnectAcount: 0,

    isHaveGameEventShowListener: false,

    isTriggerGameEventHid: false, 

    readyState: {
        Connecting: 0,          // 正在链接中
        Connected: 1,           // 已经链接并且可以通讯
        DisConnecting: 2,       // 连接正在关闭
        DisConnected: 3,        // 连接已关闭或者没有链接成功
    },
};

LobbyServerManager.setProtoCfgAndUrl = function(protoCfg, websocketUrl) {
    LobbyServerManager.ProtoCfg = protoCfg;
    LobbyServerManager.WEB_SOCKET = websocketUrl;
    LobbyServerManager.clientCloseWSState = false;
};

LobbyServerManager.connectServer = function(isFirstConnect = true) {
    return new Promise((resolve, reject) => {
        LoggerUtil.getInstance().log("Is LobbyServer a first-time connect ?", isFirstConnect);
        if (LobbyServerManager.WEB_SOCKET === null) {
            reject('LobbyService WebSocket Url is null');
            return
        };
        LoggerUtil.getInstance().log(`LobbyService WebSocket Url is：${LobbyServerManager.WEB_SOCKET}`);
    
        if (LobbyServerManager.socket) {
            reject('Do not repeat the creation LobbyService WebSocket');
            return;
        };
    
        LobbyServerManager.needReconnect = true;
    
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
                let cacert = cc.url.raw('resources/pem/cacert.pem');
                if (cc.loader && cc.loader.md5Pipe) {
                    cacert = cc.loader.md5Pipe.transformURL(cacert);
                };
                LobbyServerManager.socket = new WebSocket(LobbyServerManager.WEB_SOCKET, null, cacert);
            } 
            else {
                LobbyServerManager.socket = new WebSocket(LobbyServerManager.WEB_SOCKET);
            };
        } 
        catch (error) {
            reject(error);
            return;
        };
    
        LobbyServerManager.socket.binaryType = 'arraybuffer';
        LobbyServerManager.socket.onopen = function (evt) {
            if (LobbyServerManager.onOpen) {
                LobbyServerManager.onOpen(evt, isFirstConnect);
                if (!LobbyServerManager.isHaveGameEventShowListener) {
                    LobbyServerManager.isHaveGameEventShowListener = true;
                    cc.game.on(cc.game.EVENT_SHOW, () => {
                        LoggerUtil.getInstance().log(`Switch back to the front desk, LobbyServerManager.isTriggerGameEventHid: ${LobbyServerManager.isTriggerGameEventHid}`);
                        if (!LobbyServerManager.isTriggerGameEventHid) {
                            return;
                        };
                        LobbyServerManager.isTriggerGameEventHid = false;
                        LoggerUtil.getInstance().timeEnd("Switching front-end and back-end duration-LobbyServer");
                        if (LobbyServerManager.socket && LobbyServerManager.socket.readyState == 1) {
                            LoggerUtil.getInstance().log("Switch back to the front desk, LobbyServer network is normal, start heartbeat detection！");
                            LobbyServerManager.send("lobbyservice.pingpang", "PingPang", {
                                timestamp: new Date().getTime()
                            }, "LOBBY_HEART");
                        }
                        else {
                            LoggerUtil.getInstance().log("Switch back to the front desk, LobbyServer network is abnormal, starting to shut down the network for reconnection！");
                            if (LobbyServerManager.socket) {
                                LobbyServerManager.socket.close();
                            }
                            else {
                                LobbyServerManager.onClose(customizeCloseEvent, false);
                            };
                        };
                    });
                    cc.game.on(cc.game.EVENT_HIDE, () => {
                        LoggerUtil.getInstance().time("Switching front-end and back-end duration-LobbyServer");
                        LobbyServerManager.isTriggerGameEventHid = true;
                        LobbyServerManager.stopHeartBeat();
                    });
                };
            };
            isFirstConnect = false;
            resolve();
        };
        LobbyServerManager.socket.onmessage = function (evt) {
            if (LobbyServerManager.onReceive) {
                LobbyServerManager.onReceive(evt);
            };
        };
        LobbyServerManager.socket.onerror = function (evt) {
            if (LobbyServerManager.onError) {
                LobbyServerManager.onError(evt);
            };
        };
        LobbyServerManager.socket.onclose = function (evt) {
            if (LobbyServerManager.onClose) {
                LobbyServerManager.onClose(evt, isFirstConnect);
            };
            reject("Lobby network connection failed, please enter later");
        }; 
    });
};

LobbyServerManager.startHeartBeat = function() {    
    // 设定时间之后发心跳消息
    LobbyServerManager.hearbeatTimer = setTimeout(() => {
        LobbyServerManager.send("lobbyservice.pingpang", "PingPang", {
            timestamp: new Date().getTime()
        }, "LOBBY_HEART");
    }, LobbyServerManager.hearbeatTimeInterval);

    LobbyServerManager.hearbeatOutTimer = setTimeout(() => {
        if (LobbyServerManager.socket) {
            LobbyServerManager.socket.close();
        }
        else {
            LobbyServerManager.onClose(customizeCloseEvent, false);
        };
        LoggerUtil.getInstance().log('LobbyService WebSocket status when the heartbeat detection timeout is: ', LobbyServerManager.socket && LobbyServerManager.socket.readyState); 
    }, LobbyServerManager.hearbeatTimeInterval * 3);
};

LobbyServerManager.stopHeartBeat = function() {
    LobbyServerManager.hearbeatTimer !== null && clearTimeout(LobbyServerManager.hearbeatTimer);
    LobbyServerManager.hearbeatTimer = null;

    LobbyServerManager.hearbeatOutTimer !== null && clearTimeout(LobbyServerManager.hearbeatOutTimer);
    LobbyServerManager.hearbeatOutTimer = null;
};

LobbyServerManager.send = function(command, messageKey, jsonData, heartType) {
    LoggerUtil.getInstance().log("LobbyService WebSocket status when send message is", LobbyServerManager.socket && LobbyServerManager.socket.readyState);
    if (LobbyServerManager.socket && LobbyServerManager.socket.readyState == 1) {
        let buff = ProtobufManager.packProtobuf(command, messageKey, jsonData, heartType);
        if (command !== "baseproto.pingpang") {
            if (cc.sys.isBrowser) {
                LoggerUtil.getInstance().log("LobbyService send ***********>", command, jsonData)
            } 
            else {
                LoggerUtil.getInstance().log("LobbyService send ***********>", command, JSON.stringify(jsonData));
            }
        };
        LobbyServerManager.socket.send(buff);
    }
    else if (LobbyServerManager.socket && LobbyServerManager.socket.readyState == 0) {
        setTimeout(() => {
            LobbyServerManager.send(command, messageKey, jsonData, heartType);
        }, 1000);
    }
    else {
        LobbyServerManager.stopHeartBeat();
        if (LobbyServerManager.socket) {
            LobbyServerManager.socket.close();
        }
        else {
            LobbyServerManager.onClose(customizeCloseEvent, false);
        };
    };
},

LobbyServerManager.onOpen = function (evt, isFirstConnect) {
    LoggerUtil.getInstance().log("LobbyService WebSocket onOpen***********>", JSON.stringify(evt));
    LobbyServerManager.reconnectAcount = 0;
    LobbyServerManager.startHeartBeat();
    CommonFun.getInstance().hidProgress();
  
    LobbyServerManager.send("lobbyservice.login", "LoginReq", {
        userId: GlobalCfg.USER_DATAS.userId,
        token: GlobalCfg.USER_DATAS.token,
        channel: GlobalCfg.CHANNEL_INFO, // 渠道包名
    });
};

LobbyServerManager.onError = function(evt) {
    LoggerUtil.getInstance().warn("LobbyService WebSocket onerror***********>", JSON.stringify(evt));
};

LobbyServerManager.onClose = function(evt, isFirstConnect) {
    if (evt) {
        LoggerUtil.getInstance().warn("LobbyService WebSocket onClose With Event", JSON.stringify(evt));
    }
    else {
        LoggerUtil.getInstance().warn("LobbyService WebSocket onClose ***********>");
    };
    
    // 关闭心跳检测
    LobbyServerManager.stopHeartBeat();
    // 清除ws实例对象
    LobbyServerManager.socket = null;
    // 是否需要重新连接
    if (LobbyServerManager.needReconnect && isFirstConnect == false) {
        LoggerUtil.getInstance().warn('LobbyService WebSocket tryReconnect...');
        LobbyServerManager.tryReconnect();
    };
};

LobbyServerManager.tryReconnect = function() {
    LobbyServerManager.reconnectAcount += 1;
    LoggerUtil.getInstance().log('The number of times LobbyService reconnects: ', LobbyServerManager.reconnectAcount);
    let networkType = APPManager.getNetWorkType();
    LoggerUtil.getInstance().log(`The current network type is: ${networkType}.  0-无网络; 1-移动网络; 2-无线网络`);
    if (networkType == 0 && LobbyServerManager.reconnectAcount > 30) {
        CommonFun.getInstance().showProgress("Please open the device's network !");
    }
    else if (networkType != 0 && LobbyServerManager.reconnectAcount > 60) {
        CommonFun.getInstance().showProgress('The network reconnected fails, the server network is busy!');
    }
    else {
        CommonFun.getInstance().showProgress('The network is reconnected ...'); 
    };
    LobbyServerManager.connectServer(false);
};

LobbyServerManager.clientCloseServer  = function() {
    LoggerUtil.getInstance().log("LobbyService WebSocket Close By Client");
    LobbyServerManager.needReconnect = false;
    LobbyServerManager.stopHeartBeat();
    if (LobbyServerManager.socket) {
        LobbyServerManager.socket.close();
        LobbyServerManager.socket = null;
    };
};

LobbyServerManager.onReceive = function(evt) {
    LobbyServerManager.stopHeartBeat();

    let bufferStr = evt.data;
    let buffer = new Uint8Array(bufferStr);
    let msgTransPack = ProtobufManager.decode("baseproto", "baseproto.TransPack", buffer);

    LoggerUtil.getInstance().log(`LobbyService WebSocket onReceive: ${msgTransPack.id}`);
    
    LobbyServerManager.startHeartBeat();

    if (msgTransPack.id != "lobbyservice.pingpang") {
        if (!LobbyServerManager.ProtoCfg[msgTransPack.id]) {
            LoggerUtil.getInstance().error(`自定义的ProtoCfg文件中没有${msgTransPack.id}所映射的结构名`);
            return;
        };
        let messageNameArry = msgTransPack.id.split(".");
        let protoRootName = messageNameArry[0];
        let protoMsgName = protoRootName + "." + LobbyServerManager.ProtoCfg[msgTransPack.id];
        let msgData = ProtobufManager.decode(protoRootName, protoMsgName, msgTransPack.data)
        let data = {msgCode: msgTransPack.id, msgData: msgData};
        if (cc.sys.isBrowser) {
            LoggerUtil.getInstance().log("Lobbyservice receives and distributes internal package data ===> ", msgData);
        } 
        else {
            LoggerUtil.getInstance().log("Lobbyservice receives and distributes internal package data ===> ", JSON.stringify(msgData));
        };
        if (LobbyServerManager.checkDistributed(data)) {
            ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, data);
        };
    }
};

LobbyServerManager.checkDistributed = function(webData) {
    let msgId = webData.msgCode;
    let notify = webData.msgData;
    LoggerUtil.getInstance().log("checkDistributed msgId ===> ", msgId);
    if (msgId === 'lobbyservice.kickout') {
        LobbyServerManager.clientCloseServer();
        GameServerManager.clientCloseServer();
        let reason = notify.reason;         // 踢出原因,  0：通用-未知(读msg展示即可), 1: 封禁踢出(可不读msg),
        let msg = notify.msg;
        if(reason == 0){
            CommonFun.getInstance().showMsgBox(msg, 'YES', () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.UPDATE);
            });
        }
        else if(reason == 1){
            // 封禁踢出
            CommonFun.getInstance().showMsgBox('Unable to log in, there is an exception with your account!', 'YES', () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.UPDATE);
            });
        }
        
        return false;
    }
    else if (msgId == "lobbyservice.pushcurrencychanged") {
        let reason = notify.reason;         // 原因
        let changed = notify.changed;       // 变化值
        let winnings = notify.winnings;     // winnings(后)
        let deposit = notify.deposit;       // deposit(后)
        let voucher = notify.voucher;       // 代金券(后)
        let firstRecharge = notify.firstRecharge;     // 是否是首次充值清除金币
        let firstRechargeRetainBonus = notify.firstRechargeRetainBonus; // 首次清0后保留的bonus
        let firstRechargeCleanWallet = notify.firstRechargeCleanWallet; // 首充清空钱包
        let goldBeforeRecharging = notify.goldBeforeRecharging; // 充值前金币
        if (firstRecharge) {
            GlobalCfg.USER_DATAS.oldUserDiamond = GlobalCfg.USER_DATAS.userDiamond;
            GlobalCfg.FIRST_RECHARGE_RETAIN_BONUS = firstRechargeRetainBonus;
        };

        // 刷新玩家金币
        GlobalCfg.USER_DATAS.userDiamond = deposit + winnings;
        GlobalCfg.USER_DATAS.deposit = notify.deposit;
        GlobalCfg.USER_DATAS.winnings = notify.winnings;
        GlobalCfg.USER_DATAS.bonus = notify.voucher;
        GlobalCfg.USER_DATAS.firstGetBonus = 0; // 首次充值后获取的代金券
        if (changed > GlobalCfg.USER_DATAS.highestRecharged) {
            GlobalCfg.USER_DATAS.highestRecharged = changed;
        };
        
        if (reason == 102) {
            // 充值事件
            GlobalCfg.USER_DATAS.isNotCharge = false;
            GlobalCfg.USER_DATAS.recharged += changed;
            GlobalCfg.USER_DATAS.lastRecharged = changed;
            if (firstRecharge == true) {
                if (firstRechargeCleanWallet) {
                    // 是否展示首充清金币的动画
                    GlobalCfg.FIRST_RECHARGE_TIPS_SHOW = true;
                    GlobalCfg.USER_DATAS.changed = firstRechargeRetainBonus; //首充需要清的金币
                    GlobalCfg.USER_DATAS.beforeRecharge = goldBeforeRecharging;
                    if (firstRechargeRetainBonus >= 100000000) { //10%转换弹框
                        GlobalCfg.FIRST_RECHARGE_TIPS_SHOW_10 = true;
                    }
                    else
                        GlobalCfg.FIRST_RECHARGE_TIPS_SHOW_10 = false;
                }else{
                    GlobalCfg.FIRST_RECHARGE_REWARD_SHOW = true;
                }
            }else{
                GlobalCfg.FIRST_RECHARGE_REWARD_SHOW = true;
            }
            // 上传充值数据到FB账号后台
            // 此处 标准事件 参数命名需参照官方标准，不可自行定义，https://developers.facebook.com/docs/app-events/reference ，AppEventsConstants类中定义
            let content = {fb_content: 'Recharge', fb_currency: 'USD'};
            let obj = {eventName: 'fb_mobile_purchase', valueToSum: Math.ceil(changed / 100), eventContent: content};
            APPManager.faceBookLogEvent(JSON.stringify(obj));

            //充值了 就发送关闭一次支付面板的指令
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: 'close_Only_Pay', msgData: {}});
            // 刷新商城商品列表
            let url = `${GlobalCfg.HTTP_SERVER}/v1/payment/commodity/storelist`;
            CommonFun.getInstance().httpGet(url, (json) => {  
                if (json && json.result == 0 && json.data) {
                    let data = json.data;
                    GlobalCfg.USER_DATAS.store = data.list;
                    ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.REFRESH_SHOP_COMMODITY,
                        msgData: {}
                    }); 
                }; 
            }, null, GlobalCfg.USER_DATAS.BearerToken);

            if (CommonFun.getInstance().isOpenVipModule()) {
                // 刷新VIP系统
                let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/info";
                CommonFun.getInstance().httpGet(httpUrl, (strInfo) => {
                    if (strInfo && strInfo.data) {
                        GlobalCfg.USER_DATAS.userVip = strInfo.data.user_vip;
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                            msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE,
                            msgData: {}
                        }); 
                    };
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            };
        }; 

        if(reason == 120) {
            //送蓝钻（代金券）
            GlobalCfg.USER_DATAS.firstGetBonus = changed;
            ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS,
                msgData: {}
            }); 
        }
        // 自己充值消息下发到每个游戏中
        ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO,
            msgData: notify
        }); 
        return true;
    }
    else if (msgId == "lobbyservice.updatebalance") {
        if (notify.currencyid == 1 && notify.balance != null) {
            GlobalCfg.USER_DATAS.userCoin = notify.balance;
        } else if (notify.currencyid == 3 && notify.balance != null) {
            GlobalCfg.USER_DATAS.userDiamond = notify.balance;
        }
        ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, webData);
        return true;
    }
    else if(msgId == "lobbyservice.withdrawcallback"){
        // 提现回调通知
        if (Reflect.has(notify,'success') == true) {
            if (notify.success == false) {
                let obj = {};
                obj['orderId'] = notify.orderId;
                obj['amount'] = notify.amount;
                obj['createTime'] = notify.createTime;
                obj['errMsg'] = notify.errMsg;
                CommonFun.getInstance().showWithDrawError(obj);

                if (CommonFun.getInstance().isOpenVipModule()) {
                    // VIP系统
                    let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/info";
                    CommonFun.getInstance().httpGet(httpUrl, (strInfo) => {
                        if (strInfo && strInfo.data) {
                            GlobalCfg.USER_DATAS.userVip = strInfo.data.user_vip;
                            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                                msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE,
                                msgData: {}
                            }); 
                        };
                    }, null, GlobalCfg.USER_DATAS.BearerToken);
                }
                else {
                    GlobalCfg.USER_DATAS.remainWithdrawCount += 1;   
                    GlobalCfg.USER_DATAS.userVip = strInfo.data.user_vip;
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.REMAIN_WITH_DRAW_UPDATE,
                        msgData: {}
                    }); 
                };
            };
        };
        return false
    }
    else if(msgId == "lobbyservice.pushnotice"){
        let title = notify.title;
        let content = notify.content;
        let kind = notify.kind;
        CommonFun.getInstance().showMsgBox(content, "YES", null, false, false, title);
        return false
    }
    else if(msgId == "lobbyservice.onseriescardopened") {
        // 钻卡开通通知
        let cardId = notify.cardId;         // 钻卡id
        let changed = notify.changed;       // 变化值 Array[]
        let winnings = notify.winnings;     // winnings(后)
        let deposit = notify.deposit;       // deposit(后)
        let voucher = notify.voucher;       // 代金券(后)

        GlobalCfg.USER_DATAS.voucherCard = cardId;  
        GlobalCfg.USER_DATAS.userDiamond = deposit + winnings;
        GlobalCfg.USER_DATAS.deposit = deposit;
        GlobalCfg.USER_DATAS.winnings = winnings;
        GlobalCfg.USER_DATAS.bonus = voucher;

        ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.RECHARGED_DAILYBONUS_CARD,
            msgData: {}
        });
         
        return true;
    } 
    else if(msgId == "lobbyservice.firstchargenotification"){
        // 首充通知
        GlobalCfg.USER_DATAS.changed = notify.deposit; // 变化值
        return false
    }
    else {
        return true;
    };
};

window.LobbyServerManager = LobbyServerManager;