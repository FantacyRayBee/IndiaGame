let DownLoadTaskStatus = cc.Enum({
    NoLoad: 0,
    Loading: 1,
});

let GameDownloader = cc.Class({

    properties: {
        noZipDownLoadersNum: 10,    
        curLoadingGame: "",
        downLoadTaskArr: [],
        startTimeArr: [],
    },
    ctor(){
        this.loadZipTotalBytesMap = new Map();
    },

    statics: {
        _instance: null
    },

    commonLoadGame: function(gameName) { 
        if (typeof(gameName) != 'string' || gameName.length == 0) {
            return;
        };
        for (let i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
            let downLoadTask = this.downLoadTaskArr[i];
            if (downLoadTask.gameName === gameName) {
                return;
            };
        };
        // if (cc.sys.os == cc.sys.OS_ANDROID && !cc.sys.isNative) {//H5
        //     this.loadGameH5(gameName, false)
        //     return
        // }
        let downTask = {
            notify: false,
            gameName: gameName,
            downloaderArr: [],
            status: DownLoadTaskStatus.NoLoad,
            isZipFormat: cc.sys.localStorage.getItem(gameName) != null ? false : true,
        };

        this.downLoadTaskArr.push(downTask);

        let downLoadTask = this.downLoadTaskArr[0];
        if (downLoadTask && downLoadTask.status === DownLoadTaskStatus.NoLoad) {
            this.loadPointGame(downLoadTask);
        };
    },

    priorLoadGame(gameName) {
        if (typeof(gameName) != 'string' || gameName.length == 0) {
            return;
        };
        if (cc.sys.os == cc.sys.OS_ANDROID && !cc.sys.isNative) {//H5
            this.loadGameH5(gameName, true)
            return
        }
        for (let i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
            if (this.downLoadTaskArr[i].gameName === gameName) {
                if (this.downLoadTaskArr[i].status !== DownLoadTaskStatus.Loading) {
                    this.downLoadTaskArr[i].notify = true;
                    this.loadPointGame(this.downLoadTaskArr[i]);
                }
                else {
                    this.downLoadTaskArr[i].notify = true;
                };
                return;
            }; 
        };
        let downTask = {
            notify: true,
            gameName: gameName,
            downloaderArr: [],
            status: DownLoadTaskStatus.NoLoad,
            isZipFormat: cc.sys.localStorage.getItem(gameName) != null ? false : true,
        };
        this.downLoadTaskArr.push(downTask);
        this.loadPointGame(downTask);
    },

    loadPointGame(downTask) {
        let gameName = downTask.gameName;
        let isZipFormat = downTask.isZipFormat;
        downTask.status = DownLoadTaskStatus.Loading;
        if (isZipFormat) {
            this.loadGameByZip(downTask);
        }
        else {
            this.loadGameByNoZip(downTask);
        };
    },

    loadGameByZip: function(downTask) {
        let gameName = downTask.gameName;
        let downloaderArr = downTask.downloaderArr;

        LoggerUtil.getInstance().log(`downloading Game-zip is: ${downTask.gameName}`);

        let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
        let urlZip = `${GlobalCfg.ASSETS_UPDATE_URL}/assets/${gameName}/${gameName}.zip?version=${GlobalCfg.ASSETS_VERSION}`;
        let dirPath = storagePath + "assets/";

        let zipDownLoader = new jsb.Downloader();
        zipDownLoader.setOnFileTaskSuccess((task) => {
            LoggerUtil.getInstance().log(`${gameName} - setOnFileTaskSuccess -- ${JSON.stringify(task)}`);
            LoggerUtil.getInstance().log(`${gameName} - The decompression address is：${dirPath + gameName}`);
            if (this.loadZipTotalBytesMap.has(task.requestURL)) {
                this.loadZipTotalBytesMap.delete(task.requestURL);
            }
            jsb.extensFunction.unzipLocalZip(`${dirPath}${gameName}.zip`);
        });
        zipDownLoader.setOnTaskProgress((task, bytesReceived, totalBytesReceived, totalBytesExpected) => {
            let notify = false;
            for (let i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
                let downLoadTask = this.downLoadTaskArr[i];
                if (gameName == downLoadTask.gameName) {
                    notify = downLoadTask.notify;
                    break;
                };
            };

            if (notify) {
                if (this.loadZipTotalBytesMap.has(task.requestURL)) {
                    totalBytesExpected = this.loadZipTotalBytesMap.get(task.requestURL);
                } else {
                    this.loadZipTotalBytesMap.set(task.requestURL, totalBytesExpected);
                }
                let progress = totalBytesReceived / totalBytesExpected;
                if (progress >= 1) {
                    progress = 1;
                };
                let progressStr = (progress * 100).toFixed(2);
                let msgData = {
                    progress: progressStr,
                    subpackgeName: gameName,
                    smallGameSize: (totalBytesExpected/1024).toFixed(2),
                };
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS, msgData: msgData});
            };

            LoggerUtil.getInstance().log(`${gameName} - zip_setOnTaskProgress -- notify: ${notify} -- totalBytesExpected: ${totalBytesExpected} -- totalBytesReceived: ${totalBytesReceived}`);
        });
        zipDownLoader.setOnTaskError((task, errorCode, errorCodeInternal, errorStr) => {
            LoggerUtil.getInstance().log(`${gameName} - zip_setOnTaskError -- errorCode: ${errorCode} -- errorStr: ${errorStr}`);
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_ERROR, msgData: {subpackgeName: gameName}});
            zipDownLoader.createDownloadFileTask(task.requestURL, task.storagePath);
        });

        downloaderArr.push(zipDownLoader);
    
        // 判断文件路径
        let isExist = jsb.fileUtils.isDirectoryExist(dirPath);
        if (!isExist) {
            jsb.fileUtils.createDirectory(dirPath);
        };
        
        zipDownLoader.createDownloadFileTask(urlZip, `${dirPath}${gameName}.zip`);
        LoggerUtil.getInstance().log(`downZip_path: ${urlZip}`, `saveZip_path: ${dirPath}${gameName}.zip`);
    },

    loadGameByNoZip: function(downTask) {
        let self = this;
        let gameName = downTask.gameName;
        let downloaderArr = downTask.downloaderArr;

        let needLoadFilesArr = [];
        let needLoadFilesSize = 0;
        let loadingFilesIndex = 0;
        let loadedFilesCount = 0;

        LoggerUtil.getInstance().log(`downloading Game-no-zip is: ${downTask.gameName}`);

        let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
        let manifestUrl = `${GlobalCfg.ASSETS_UPDATE_URL}/assets/${gameName}/project.manifest?version=${GlobalCfg.ASSETS_VERSION}`;


        let getDownLoaderByStoragePath = (storagePath) => {
            for (let i = 0, len = downloaderArr.length; i < len; i++) {
                let downloader = downloaderArr[i];
                if (downloader.storagePath == storagePath) {
                    return downloader;
                };
            };
        };

        let setOnFileTaskSuccess = (task) => {
            LoggerUtil.getInstance().log(`The file update was successful, and the updated content is：${JSON.stringify(task)}`);
            let downloader = getDownLoaderByStoragePath(task.storagePath);
            if (downloader) {
                downloader.storagePath = '';
            };
            loadedFilesCount += 1;

            if (loadedFilesCount == needLoadFilesArr.length) {
                self.loadGameCompleteByNoZip(downTask);
            } 
            else {
                let notify = false;
                for (let i = 0, len = self.downLoadTaskArr.length; i < len; i++) {
                    let downLoadTask = self.downLoadTaskArr[i];
                    if (gameName === downLoadTask.gameName) {
                        notify = downLoadTask.notify;
                        break;
                    };
                };

                if (notify) {
                    let progress = loadedFilesCount / needLoadFilesArr.length;
                    let progressStr = (progress * 100).toFixed(2);
                    let msgData = {
                        progress: progressStr,
                        subpackgeName: gameName,
                        smallGameSize: needLoadFilesSize,
                    };
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS, msgData: msgData});
                };

                loadNeedUpdateFiles();
            };
        };

        let setOnTaskProgress = (task, bytesReceived, totalBytesReceived, totalBytesExpected) => {

        };

        let setOnTaskError = (task, errorCode, errorCodeInternal, errorStr) => {
            LoggerUtil.getInstance().log(`An error occurred while updating the file, and the error code is ${errorCode}, The reason for the error is ${errorStr}`);
            let downloader = getDownLoaderByStoragePath(task.storagePath);
            if (downloader) {
                downloader.createDownloadFileTask(task.requestURL, task.storagePath);
            };
        };

        let loadNeedUpdateFiles = () => {
            for (let i = 0, len = downloaderArr.length; i < len; i++) {
                let downloader = downloaderArr[i];
                if (downloader.storagePath.length == 0) { //没有任务
                    let fileInfo = needLoadFilesArr[loadingFilesIndex];
                    if (fileInfo) {
                        let sourceName = fileInfo.filename;
                        let md5 = fileInfo.md5;
                        let url = `${GlobalCfg.ASSETS_UPDATE_URL}/${fileInfo.filename}?md5=${md5}`;
                        downloader.storagePath = storagePath + fileInfo.filename;
                        downloader.createDownloadFileTask(url, storagePath + fileInfo.filename);
                        LoggerUtil.getInstance().log(`${gameName} - The task thread ID is: ${downloader.id}`);
                        LoggerUtil.getInstance().log(`${gameName} - The task file path is：${fileInfo.filename}`);
                        LoggerUtil.getInstance().log(`${gameName} - The path to save the task file is：${storagePath + sourceName}`);
                        loadingFilesIndex += 1;
                    } 
                    else {
                        if (loadedFilesCount >= needLoadFilesArr.length) {
                            self.loadGameCompleteByNoZip(downTask);
                            break;
                        };
                    };
                };
            };
        };

        for (let i = 0; i < self.noZipDownLoadersNum; i++) {
            let downloader = new jsb.Downloader();
            downloader.storagePath = '';
            downloader.id = i;
            downloader.setOnFileTaskSuccess(setOnFileTaskSuccess);
            downloader.setOnTaskProgress(setOnTaskProgress);
            downloader.setOnTaskError(setOnTaskError);
            downloaderArr.push(downloader);
        };

   

        self.httpGet(manifestUrl, (json) => {
            let filesCount = json.length;
            for (let i = 1; i <= filesCount; i++) {
                let element = json["" + i];
                let serverMd5 = element.md5;
                let filePath = "";
                let arr = element.filename.split("/");
                for (let k = 0; k < arr.length - 1; k++) {
                    filePath = filePath + arr[k] + "/";
                };
                let sourceName = jsb.fileUtils.fullPathForFilename(element.filename);
                let localMd5 = jsb.extensFunction.getMd5File(sourceName);
                if (localMd5 != serverMd5) {
                    //判断文件路径是否存在
                    let isExist = jsb.fileUtils.isDirectoryExist(storagePath + filePath);
                    if (!isExist) {
                        jsb.fileUtils.createDirectory(storagePath + filePath);
                    };
    
                    needLoadFilesSize += element.docSize;
                    needLoadFilesArr.push(element);
                };
            };

            LoggerUtil.getInstance().log(`${gameName} - The number of files that require hot swapping is：${needLoadFilesArr.length}`);
            if (needLoadFilesArr.length == 0) {
                self.loadGameCompleteByNoZip(downTask);
            }
            else {
                LoggerUtil.getInstance().log(`${gameName} - The total size of files that require hot swapping is：${needLoadFilesSize}KB`);
                loadNeedUpdateFiles();
            };
        }, 
        () => {
            self.loadGameByNoZip(downTask);
        });
    },

    loadGameCompleteByNoZip: function(downTask) {
        let gameName = downTask.gameName;

        let serverVersion = Number(GlobalCfg.SUB_GAME_VERSION_INFO[gameName]);
        LoggerUtil.getInstance().log(`${gameName} - Download completed, version number is：${serverVersion}`);
        cc.sys.localStorage.setItem(gameName, serverVersion); 

        /**
         * 清除游戏引擎自动已加载子包缓存
         */
        let bundle = cc.assetManager.getBundle(gameName);
        if (bundle) {
            LoggerUtil.getInstance().log(`清除游戏引擎自动已加载子包缓存-loadGameCompleteByNoZip-${gameName}`);
            bundle.releaseAll();
            cc.assetManager.removeBundle(bundle);
        };

        let searchPaths = jsb.fileUtils.getSearchPaths();
        let storagePath1 = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
        Array.prototype.unshift.apply(searchPaths, [storagePath1]);
        searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        jsb.fileUtils.setSearchPaths(searchPaths);

        for (let i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
            let downLoadTask = this.downLoadTaskArr[i];
            if (gameName === downLoadTask.gameName) {
                downLoadTask = null;
                this.downLoadTaskArr.splice(i, 1);
                break;
            };
        };

        LoggerUtil.getInstance().log(`Have all the small games that need to be downloaded been downloaded: ${this.downLoadTaskArr.length == 0}`);
        if (this.downLoadTaskArr.length != 0) {
            for (let i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
                let downLoadTask = this.downLoadTaskArr[i];
                if (downLoadTask.status === DownLoadTaskStatus.NoLoad) {
                    this.loadPointGame(downLoadTask);
                    break;
                };
            };
        };

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE, msgData: {subpackgeName: gameName}});
    },

    loadGameCompleteByZip: function(gameZipName) {
        LoggerUtil.getInstance().log(`loadGameCompleteByZip ====> ${gameZipName}`);
        let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
        let zipPath = `${storagePath}assets/${gameZipName}`;
        let gameName = gameZipName.split(".")[0];
        let version = GlobalCfg.SUB_GAME_VERSION_INFO[gameName];
        cc.sys.localStorage.setItem(gameName, version);
        jsb.fileUtils.removeFile(zipPath);

        /** 
         * 清除游戏引擎自动已加载子包缓存
         */
        let bundle = cc.assetManager.getBundle(gameName);
        if (bundle) {
            LoggerUtil.getInstance().log(`清除游戏引擎自动已加载子包缓存-loadGameCompleteByZip-${gameName}`);
            bundle.releaseAll();
            cc.assetManager.removeBundle(bundle);
        };
    
        let searchPaths = jsb.fileUtils.getSearchPaths();
        let storagePath1 = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
        Array.prototype.unshift.apply(searchPaths, [storagePath1]);
        searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        jsb.fileUtils.setSearchPaths(searchPaths);
    
        LoggerUtil.getInstance().log("native suss load: " + gameZipName);
    
        LoggerUtil.getInstance().log("startLoadSubpackageZip-COMPLETE", gameName);
       
        for (let i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
            let downLoadTask = this.downLoadTaskArr[i];
            if (gameName === downLoadTask.gameName) {
                downLoadTask = null;
                this.downLoadTaskArr.splice(i, 1);
                break;
            };
        };

        LoggerUtil.getInstance().log(`Have all the small games that need to be downloaded been downloaded: ${this.downLoadTaskArr.length == 0}`);
        if (this.downLoadTaskArr.length != 0) {
            for (let i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
                let downLoadTask = this.downLoadTaskArr[i];
                if (downLoadTask.status === DownLoadTaskStatus.NoLoad) {
                    this.loadPointGame(downLoadTask);
                    break;
                };
            };
        };

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE, msgData: {subpackgeName: gameName}});
    },

    loadGameH5(packgeName, showProgress){
        console.log(`caojun loadGameH5 ${packgeName} 1`); 
        cc.assetManager.loadBundle(packgeName, (err, bundle) => { 
            if (err) {
                console.error(`加载 Bundle ${packgeName} 失败:`, err);
                return; // 加载失败时直接退出，不执行后续逻辑
            }
            console.log(`caojun loadGameH5 ${packgeName} 2`); 
            bundle.preloadDir("/", (completedCount, totalCount) => { 
                console.log(`caojun loadGameH5 ${packgeName} 3`); 
                // 更新进度条 
                let progressStr = completedCount / totalCount; 
                console.log(`caojun packgeName: ${packgeName}, progressStr : ${progressStr}`); 
                let msgData = {
                    progress: (progressStr * 100).toFixed(2),
                    subpackgeName: packgeName,
                };
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS, msgData: msgData});
            }, (err, resources) => { 
                // 所有资源加载完成后的回调 
                if (err) { 
                    console.error(packgeName+ " 资源加载失败:", err);
                } else { 
                    console.log(packgeName + " 资源预加载完成!" + resources); 
                    let serverVersion = Number(GlobalCfg.SUB_GAME_VERSION_INFO[packgeName]);
                    cc.sys.localStorage.setItem(packgeName, serverVersion);
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE, msgData: {subpackgeName: packgeName}});
                } 
            }); 
        });
    },

    httpGet: function(url, callFun, outCallFun) {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 8000;
        xhr.myTimeOut = setTimeout(() => {
            if (outCallFun) {
                outCallFun();
            }
        }, 8000);
        xhr.onreadystatechange = () => { 
            if (xhr.readyState === 4 && xhr.status == 200) {
                clearTimeout(xhr.myTimeOut);
                let respone = xhr.responseText;
                if (respone[0] != "{") {
                    respone = respone.substr(1, respone.length - 1);
                }
                let rsp = JSON.parse(respone);
                LoggerUtil.getInstance().log("Data of httpGet :", cc.sys.isNative ? JSON.stringify(rsp) : rsp);
                if (rsp)
                    callFun(rsp);
                else
                    callFun(respone);
            } 
            else if (xhr.readyState === 4 && xhr.status == 401) {
                clearTimeout(xhr.myTimeOut);
                callFun({
                    status: 401
                });
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    },
});

GameDownloader.getInstance = function() {
    if (!GameDownloader._instance) {
        GameDownloader._instance = new GameDownloader();
    };
    return GameDownloader._instance;
};

module.exports = GameDownloader;

window.GameDownloader = GameDownloader;
