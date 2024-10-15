let ClientNotify = {
    callbackList: new Map(),
    index: 0,
};


ClientNotify.register = function(type, callback, target) {
    let isExist = ClientNotify.callbackList.has(type);
    let handle = "";
    if (isExist) {
        let isJoin = false;
        let arr = ClientNotify.callbackList.get(type);
        for (let index = 0, len = arr.length; index < len; index++) {
            let item = arr[index];
            if (callback === item[0] && target === item[1]) {
                isJoin = true;
                handle = target;
                break;
            };
        };

        if (!isJoin) {
            arr.push([callback, target]);
            handle = target;
            ClientNotify.callbackList.set(type, arr);
        };
    } 
    else {
        let arr = [];
        arr.push([callback, target]);
        handle = target;
        ClientNotify.callbackList.set(type, arr);
    };

    return handle;
};


ClientNotify.removeByHandle = function(type, handle) {
    let isExist = ClientNotify.callbackList.has(type);
    if (isExist) {
        let arr = ClientNotify.callbackList.get(type);
        if (!Array.isArray(arr)) {
            return; 
        };
        for (let i = 0; i < arr.length; i++) {
            let keyHandle = arr[i][1];
            if (keyHandle === handle) {
                arr.splice(i, 1);
                i -= 1;
            };
        };
    };
};


ClientNotify.send = function(type, dataDict) {
    let isExist = ClientNotify.callbackList.has(type);
    if (isExist) {
        let arr = ClientNotify.callbackList.get(type);
        for (let i = 0, len = arr.length; i < len; i++) {
            let temp = arr[i];
            if (temp != undefined && temp != null && temp[1] != null && temp[0] != undefined) {
                temp[0] && temp[0].call(temp[1], dataDict, temp[1]);
            }
        }
    }
};

window.ClientNotify = ClientNotify;