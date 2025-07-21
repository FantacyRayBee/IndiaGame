let ProtobufManager = {
    Root: {},
    protoMap: new Map(),
};


/**
 * 预加载proto文件
 * @param {[String]} filePathArr 相对于resources目录下的文件路径
 * @returns 
 */
ProtobufManager.proloadProtoFiles = function(filePathArr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(filePathArr)) {
            LoggerUtil.getInstance().log('The parameter type of the proto file to be loaded is incorrect');
            reject();
            return;
        };
        let loadedAcount = 0;
        let filePathArrLen = filePathArr.length;
        for (let i = 0; i < filePathArrLen; i++) {
            let filePath = filePathArr[i];
            protobuf.load(filePath, (err, root) => {
                if (err) {
                    LoggerUtil.getInstance().log(`Error loading proto file: ${err}`);
                    reject();
                    return;
                };
                if (root) {
                    if (ProtobufManager.protoMap.has(filePath) == false) {
                        ProtobufManager.protoMap.set(filePath, root);
                    };
                    loadedAcount += 1;
                    if (filePathArrLen == loadedAcount) {
                        LoggerUtil.getInstance().log('The specified protobuf file has been loaded and the Protobuf file cache pool is complete: ', cc.sys.isNative ? JSON.stringify(ProtobufManager.protoMap) : ProtobufManager.protoMap);
                        resolve();
                    };
                };
            });
        };
    });
};


/**
 * 加载proto文件
 * @param {[String]} filePathArr 相对于resources目录下的文件路径
 * @returns 
 */
ProtobufManager.loadProtoFiles = function(filePathArr) {
    if (!Array.isArray(filePathArr)) {
        LoggerUtil.getInstance().log('The parameter type of the proto file to be loaded is incorrect');
        return false;
    };
    let loadedAcount = 0;
    let filePathArrLen = filePathArr.length;
    for (let i = 0; i < filePathArrLen; i++) {
        let filePath = filePathArr[i];
        if (ProtobufManager.protoMap.has(filePath) == true) {
            loadedAcount += 1;
            let filePathArr1 = filePath.split("/");
            let len = filePathArr1.length;
            let root = ProtobufManager.protoMap.get(filePath);
            ProtobufManager.Root[filePathArr1[len - 1]] = root;
            if (filePathArrLen == loadedAcount) {
                LoggerUtil.getInstance().log('The specified protobuf file loading is complete, Protobuf file pool: ', cc.sys.isNative ? JSON.stringify(ProtobufManager.Root) : ProtobufManager.Root);
                return true;
            };
        };
    };
    return false;
};

ProtobufManager.packProtobuf = function(command, messageKey, jsonData, heartType) {
    //首先定义内包数据
    let commandArry = command.split(".");
    let messageStr = commandArry[0] + "." + messageKey;
    let protobufObj = null;
    let message = null;
    let buffer = null;
    try {
        protobufObj = ProtobufManager.Root[commandArry[0]].lookupType(messageStr);
        message = ProtobufManager.checkMessage(protobufObj, jsonData);
        if (protobufObj && message) {
            buffer = ProtobufManager.serializeMessage(protobufObj, message);
            //这里心跳区别下
            if (command === "baseproto.pingpang" && heartType) {
                if (heartType === "LOBBY_HEART") {
                    command = "lobbyservice.pingpang";
                }  
                else if (heartType === "GAME_HEART") {
                    command = "gameservice.pingpang";
                } 
                else {
                    LoggerUtil.getInstance().error("无法区分心跳类型");
                    return;
                } 
            };
            let data = {
                id: command,
                data: buffer
            };
            //其次定义外包数据
            protobufObj = this.Root["baseproto"].lookupType("baseproto.TransPack");
            message = this.checkMessage(protobufObj, data);
            buffer = this.serializeMessage(protobufObj, message);
        }
    } 
    catch (error) {
        LoggerUtil.getInstance().error("协议问题：" + JSON.stringify(jsonData));
        LoggerUtil.getInstance().error("协议问题：" + messageStr);
        LoggerUtil.getInstance().error("协议问题：" + error);
        LoggerUtil.getInstance().error("协议问题：" + command);
    };
    return buffer;
};

ProtobufManager.checkMessage = function(protobufObj, object) {
    let errMsg = protobufObj.verify(object);
    if (errMsg) {
        throw Error(errMsg);
    }
    let message = protobufObj.create(object);
    return message;
};

ProtobufManager.serializeMessage = function(protobufObj, message) {
    let buffer = protobufObj.encode(message).finish();
    return buffer;
};

ProtobufManager.decode = function(rootName, protoName, buffer) {
    let protobufObj = this.Root[rootName].lookupType(protoName);
    if (protobufObj) {
        return protobufObj.decode(buffer);
    } 
    else {
        LoggerUtil.getInstance().error(`${rootName}proto文件没有${protoName}对应的数据结构体`);
    }
};

window.ProtobufManager = ProtobufManager;