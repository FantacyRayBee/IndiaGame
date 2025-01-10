"use strict";
cc._RF.push(module, '6254c4tSOZDBorJrGoCpl4/', 'GameDownloader');
// Main/GameDownloader.js

"use strict";

var DownLoadTaskStatus = cc.Enum({
  NoLoad: 0,
  Loading: 1
});
var GameDownloader = cc.Class({
  properties: {
    noZipDownLoadersNum: 10,
    curLoadingGame: "",
    downLoadTaskArr: [],
    startTimeArr: []
  },
  ctor: function ctor() {
    this.loadZipTotalBytesMap = new Map();
  },
  statics: {
    _instance: null
  },
  commonLoadGame: function commonLoadGame(gameName) {
    if (typeof gameName != 'string' || gameName.length == 0) {
      return;
    }
    ;
    for (var i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
      var _downLoadTask = this.downLoadTaskArr[i];
      if (_downLoadTask.gameName === gameName) {
        return;
      }
      ;
    }
    ;
    // if (cc.sys.os == cc.sys.OS_ANDROID && !cc.sys.isNative) {//H5
    //     this.loadGameH5(gameName, false)
    //     return
    // }
    var downTask = {
      notify: false,
      gameName: gameName,
      downloaderArr: [],
      status: DownLoadTaskStatus.NoLoad,
      isZipFormat: cc.sys.localStorage.getItem(gameName) != null ? false : true
    };
    this.downLoadTaskArr.push(downTask);
    var downLoadTask = this.downLoadTaskArr[0];
    if (downLoadTask && downLoadTask.status === DownLoadTaskStatus.NoLoad) {
      this.loadPointGame(downLoadTask);
    }
    ;
  },
  priorLoadGame: function priorLoadGame(gameName) {
    if (typeof gameName != 'string' || gameName.length == 0) {
      return;
    }
    ;
    if (cc.sys.os == cc.sys.OS_ANDROID && !cc.sys.isNative) {
      //H5
      this.loadGameH5(gameName, true);
      return;
    }
    for (var i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
      if (this.downLoadTaskArr[i].gameName === gameName) {
        if (this.downLoadTaskArr[i].status !== DownLoadTaskStatus.Loading) {
          this.downLoadTaskArr[i].notify = true;
          this.loadPointGame(this.downLoadTaskArr[i]);
        } else {
          this.downLoadTaskArr[i].notify = true;
        }
        ;
        return;
      }
      ;
    }
    ;
    var downTask = {
      notify: true,
      gameName: gameName,
      downloaderArr: [],
      status: DownLoadTaskStatus.NoLoad,
      isZipFormat: cc.sys.localStorage.getItem(gameName) != null ? false : true
    };
    this.downLoadTaskArr.push(downTask);
    this.loadPointGame(downTask);
  },
  loadPointGame: function loadPointGame(downTask) {
    var gameName = downTask.gameName;
    var isZipFormat = downTask.isZipFormat;
    downTask.status = DownLoadTaskStatus.Loading;
    if (isZipFormat) {
      this.loadGameByZip(downTask);
    } else {
      this.loadGameByNoZip(downTask);
    }
    ;
  },
  loadGameByZip: function loadGameByZip(downTask) {
    var _this = this;
    var gameName = downTask.gameName;
    var downloaderArr = downTask.downloaderArr;
    LoggerUtil.getInstance().log("downloading Game-zip is: " + downTask.gameName);
    var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
    var urlZip = GlobalCfg.ASSETS_UPDATE_URL + "/assets/" + gameName + "/" + gameName + ".zip?version=" + GlobalCfg.ASSETS_VERSION;
    var dirPath = storagePath + "assets/";
    var zipDownLoader = new jsb.Downloader();
    zipDownLoader.setOnFileTaskSuccess(function (task) {
      LoggerUtil.getInstance().log(gameName + " - setOnFileTaskSuccess -- " + JSON.stringify(task));
      LoggerUtil.getInstance().log(gameName + " - The decompression address is\uFF1A" + (dirPath + gameName));
      if (_this.loadZipTotalBytesMap.has(task.requestURL)) {
        _this.loadZipTotalBytesMap["delete"](task.requestURL);
      }
      jsb.extensFunction.unzipLocalZip("" + dirPath + gameName + ".zip");
    });
    zipDownLoader.setOnTaskProgress(function (task, bytesReceived, totalBytesReceived, totalBytesExpected) {
      var notify = false;
      for (var i = 0, len = _this.downLoadTaskArr.length; i < len; i++) {
        var downLoadTask = _this.downLoadTaskArr[i];
        if (gameName == downLoadTask.gameName) {
          notify = downLoadTask.notify;
          break;
        }
        ;
      }
      ;
      if (notify) {
        if (_this.loadZipTotalBytesMap.has(task.requestURL)) {
          totalBytesExpected = _this.loadZipTotalBytesMap.get(task.requestURL);
        } else {
          _this.loadZipTotalBytesMap.set(task.requestURL, totalBytesExpected);
        }
        var progress = totalBytesReceived / totalBytesExpected;
        if (progress >= 1) {
          progress = 1;
        }
        ;
        var progressStr = (progress * 100).toFixed(2);
        var msgData = {
          progress: progressStr,
          subpackgeName: gameName,
          smallGameSize: (totalBytesExpected / 1024).toFixed(2)
        };
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS,
          msgData: msgData
        });
      }
      ;
      LoggerUtil.getInstance().log(gameName + " - zip_setOnTaskProgress -- notify: " + notify + " -- totalBytesExpected: " + totalBytesExpected + " -- totalBytesReceived: " + totalBytesReceived);
    });
    zipDownLoader.setOnTaskError(function (task, errorCode, errorCodeInternal, errorStr) {
      LoggerUtil.getInstance().log(gameName + " - zip_setOnTaskError -- errorCode: " + errorCode + " -- errorStr: " + errorStr);
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_ERROR,
        msgData: {
          subpackgeName: gameName
        }
      });
      zipDownLoader.createDownloadFileTask(task.requestURL, task.storagePath);
    });
    downloaderArr.push(zipDownLoader);

    // 判断文件路径
    var isExist = jsb.fileUtils.isDirectoryExist(dirPath);
    if (!isExist) {
      jsb.fileUtils.createDirectory(dirPath);
    }
    ;
    zipDownLoader.createDownloadFileTask(urlZip, "" + dirPath + gameName + ".zip");
    LoggerUtil.getInstance().log("downZip_path: " + urlZip, "saveZip_path: " + dirPath + gameName + ".zip");
  },
  loadGameByNoZip: function loadGameByNoZip(downTask) {
    var self = this;
    var gameName = downTask.gameName;
    var downloaderArr = downTask.downloaderArr;
    var needLoadFilesArr = [];
    var needLoadFilesSize = 0;
    var loadingFilesIndex = 0;
    var loadedFilesCount = 0;
    LoggerUtil.getInstance().log("downloading Game-no-zip is: " + downTask.gameName);
    var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
    var manifestUrl = GlobalCfg.ASSETS_UPDATE_URL + "/assets/" + gameName + "/project.manifest?version=" + GlobalCfg.ASSETS_VERSION;
    var getDownLoaderByStoragePath = function getDownLoaderByStoragePath(storagePath) {
      for (var i = 0, len = downloaderArr.length; i < len; i++) {
        var downloader = downloaderArr[i];
        if (downloader.storagePath == storagePath) {
          return downloader;
        }
        ;
      }
      ;
    };
    var setOnFileTaskSuccess = function setOnFileTaskSuccess(task) {
      LoggerUtil.getInstance().log("The file update was successful, and the updated content is\uFF1A" + JSON.stringify(task));
      var downloader = getDownLoaderByStoragePath(task.storagePath);
      if (downloader) {
        downloader.storagePath = '';
      }
      ;
      loadedFilesCount += 1;
      if (loadedFilesCount == needLoadFilesArr.length) {
        self.loadGameCompleteByNoZip(downTask);
      } else {
        var notify = false;
        for (var i = 0, len = self.downLoadTaskArr.length; i < len; i++) {
          var downLoadTask = self.downLoadTaskArr[i];
          if (gameName === downLoadTask.gameName) {
            notify = downLoadTask.notify;
            break;
          }
          ;
        }
        ;
        if (notify) {
          var progress = loadedFilesCount / needLoadFilesArr.length;
          var progressStr = (progress * 100).toFixed(2);
          var msgData = {
            progress: progressStr,
            subpackgeName: gameName,
            smallGameSize: needLoadFilesSize
          };
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS,
            msgData: msgData
          });
        }
        ;
        loadNeedUpdateFiles();
      }
      ;
    };
    var setOnTaskProgress = function setOnTaskProgress(task, bytesReceived, totalBytesReceived, totalBytesExpected) {};
    var setOnTaskError = function setOnTaskError(task, errorCode, errorCodeInternal, errorStr) {
      LoggerUtil.getInstance().log("An error occurred while updating the file, and the error code is " + errorCode + ", The reason for the error is " + errorStr);
      var downloader = getDownLoaderByStoragePath(task.storagePath);
      if (downloader) {
        downloader.createDownloadFileTask(task.requestURL, task.storagePath);
      }
      ;
    };
    var loadNeedUpdateFiles = function loadNeedUpdateFiles() {
      for (var i = 0, len = downloaderArr.length; i < len; i++) {
        var downloader = downloaderArr[i];
        if (downloader.storagePath.length == 0) {
          //没有任务
          var fileInfo = needLoadFilesArr[loadingFilesIndex];
          if (fileInfo) {
            var sourceName = fileInfo.filename;
            var md5 = fileInfo.md5;
            var url = GlobalCfg.ASSETS_UPDATE_URL + "/" + fileInfo.filename + "?md5=" + md5;
            downloader.storagePath = storagePath + fileInfo.filename;
            downloader.createDownloadFileTask(url, storagePath + fileInfo.filename);
            LoggerUtil.getInstance().log(gameName + " - The task thread ID is: " + downloader.id);
            LoggerUtil.getInstance().log(gameName + " - The task file path is\uFF1A" + fileInfo.filename);
            LoggerUtil.getInstance().log(gameName + " - The path to save the task file is\uFF1A" + (storagePath + sourceName));
            loadingFilesIndex += 1;
          } else {
            if (loadedFilesCount >= needLoadFilesArr.length) {
              self.loadGameCompleteByNoZip(downTask);
              break;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    };
    for (var i = 0; i < self.noZipDownLoadersNum; i++) {
      var downloader = new jsb.Downloader();
      downloader.storagePath = '';
      downloader.id = i;
      downloader.setOnFileTaskSuccess(setOnFileTaskSuccess);
      downloader.setOnTaskProgress(setOnTaskProgress);
      downloader.setOnTaskError(setOnTaskError);
      downloaderArr.push(downloader);
    }
    ;
    self.httpGet(manifestUrl, function (json) {
      var filesCount = json.length;
      for (var _i = 1; _i <= filesCount; _i++) {
        var element = json["" + _i];
        var serverMd5 = element.md5;
        var filePath = "";
        var arr = element.filename.split("/");
        for (var k = 0; k < arr.length - 1; k++) {
          filePath = filePath + arr[k] + "/";
        }
        ;
        var sourceName = jsb.fileUtils.fullPathForFilename(element.filename);
        var localMd5 = jsb.extensFunction.getMd5File(sourceName);
        if (localMd5 != serverMd5) {
          //判断文件路径是否存在
          var isExist = jsb.fileUtils.isDirectoryExist(storagePath + filePath);
          if (!isExist) {
            jsb.fileUtils.createDirectory(storagePath + filePath);
          }
          ;
          needLoadFilesSize += element.docSize;
          needLoadFilesArr.push(element);
        }
        ;
      }
      ;
      LoggerUtil.getInstance().log(gameName + " - The number of files that require hot swapping is\uFF1A" + needLoadFilesArr.length);
      if (needLoadFilesArr.length == 0) {
        self.loadGameCompleteByNoZip(downTask);
      } else {
        LoggerUtil.getInstance().log(gameName + " - The total size of files that require hot swapping is\uFF1A" + needLoadFilesSize + "KB");
        loadNeedUpdateFiles();
      }
      ;
    }, function () {
      self.loadGameByNoZip(downTask);
    });
  },
  loadGameCompleteByNoZip: function loadGameCompleteByNoZip(downTask) {
    var gameName = downTask.gameName;
    var serverVersion = Number(GlobalCfg.SUB_GAME_VERSION_INFO[gameName]);
    LoggerUtil.getInstance().log(gameName + " - Download completed, version number is\uFF1A" + serverVersion);
    cc.sys.localStorage.setItem(gameName, serverVersion);

    /**
     * 清除游戏引擎自动已加载子包缓存
     */
    var bundle = cc.assetManager.getBundle(gameName);
    if (bundle) {
      LoggerUtil.getInstance().log("\u6E05\u9664\u6E38\u620F\u5F15\u64CE\u81EA\u52A8\u5DF2\u52A0\u8F7D\u5B50\u5305\u7F13\u5B58-loadGameCompleteByNoZip-" + gameName);
      bundle.releaseAll();
      cc.assetManager.removeBundle(bundle);
    }
    ;
    var searchPaths = jsb.fileUtils.getSearchPaths();
    var storagePath1 = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
    Array.prototype.unshift.apply(searchPaths, [storagePath1]);
    searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
    cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
    jsb.fileUtils.setSearchPaths(searchPaths);
    for (var i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
      var downLoadTask = this.downLoadTaskArr[i];
      if (gameName === downLoadTask.gameName) {
        downLoadTask = null;
        this.downLoadTaskArr.splice(i, 1);
        break;
      }
      ;
    }
    ;
    LoggerUtil.getInstance().log("Have all the small games that need to be downloaded been downloaded: " + (this.downLoadTaskArr.length == 0));
    if (this.downLoadTaskArr.length != 0) {
      for (var _i2 = 0, _len = this.downLoadTaskArr.length; _i2 < _len; _i2++) {
        var _downLoadTask2 = this.downLoadTaskArr[_i2];
        if (_downLoadTask2.status === DownLoadTaskStatus.NoLoad) {
          this.loadPointGame(_downLoadTask2);
          break;
        }
        ;
      }
      ;
    }
    ;
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE,
      msgData: {
        subpackgeName: gameName
      }
    });
  },
  loadGameCompleteByZip: function loadGameCompleteByZip(gameZipName) {
    LoggerUtil.getInstance().log("loadGameCompleteByZip ====> " + gameZipName);
    var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
    var zipPath = storagePath + "assets/" + gameZipName;
    var gameName = gameZipName.split(".")[0];
    var version = GlobalCfg.SUB_GAME_VERSION_INFO[gameName];
    cc.sys.localStorage.setItem(gameName, version);
    jsb.fileUtils.removeFile(zipPath);

    /** 
     * 清除游戏引擎自动已加载子包缓存
     */
    var bundle = cc.assetManager.getBundle(gameName);
    if (bundle) {
      LoggerUtil.getInstance().log("\u6E05\u9664\u6E38\u620F\u5F15\u64CE\u81EA\u52A8\u5DF2\u52A0\u8F7D\u5B50\u5305\u7F13\u5B58-loadGameCompleteByZip-" + gameName);
      bundle.releaseAll();
      cc.assetManager.removeBundle(bundle);
    }
    ;
    var searchPaths = jsb.fileUtils.getSearchPaths();
    var storagePath1 = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
    Array.prototype.unshift.apply(searchPaths, [storagePath1]);
    searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
    cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
    jsb.fileUtils.setSearchPaths(searchPaths);
    LoggerUtil.getInstance().log("native suss load: " + gameZipName);
    LoggerUtil.getInstance().log("startLoadSubpackageZip-COMPLETE", gameName);
    for (var i = 0, len = this.downLoadTaskArr.length; i < len; i++) {
      var downLoadTask = this.downLoadTaskArr[i];
      if (gameName === downLoadTask.gameName) {
        downLoadTask = null;
        this.downLoadTaskArr.splice(i, 1);
        break;
      }
      ;
    }
    ;
    LoggerUtil.getInstance().log("Have all the small games that need to be downloaded been downloaded: " + (this.downLoadTaskArr.length == 0));
    if (this.downLoadTaskArr.length != 0) {
      for (var _i3 = 0, _len2 = this.downLoadTaskArr.length; _i3 < _len2; _i3++) {
        var _downLoadTask3 = this.downLoadTaskArr[_i3];
        if (_downLoadTask3.status === DownLoadTaskStatus.NoLoad) {
          this.loadPointGame(_downLoadTask3);
          break;
        }
        ;
      }
      ;
    }
    ;
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE,
      msgData: {
        subpackgeName: gameName
      }
    });
  },
  loadGameH5: function loadGameH5(packgeName, showProgress) {
    console.log("caojun loadGameH5 " + packgeName + " 1");
    cc.assetManager.loadBundle(packgeName, function (err, bundle) {
      if (err) {
        console.error("\u52A0\u8F7D Bundle " + packgeName + " \u5931\u8D25:", err);
        return; // 加载失败时直接退出，不执行后续逻辑
      }

      console.log("caojun loadGameH5 " + packgeName + " 2");
      bundle.preloadDir("/", function (completedCount, totalCount) {
        console.log("caojun loadGameH5 " + packgeName + " 3");
        // 更新进度条 
        var progressStr = completedCount / totalCount;
        console.log("caojun packgeName: " + packgeName + ", progressStr : " + progressStr);
        var msgData = {
          progress: (progressStr * 100).toFixed(2),
          subpackgeName: packgeName
        };
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS,
          msgData: msgData
        });
      }, function (err, resources) {
        // 所有资源加载完成后的回调 
        if (err) {
          console.error(packgeName + " 资源加载失败:", err);
        } else {
          console.log(packgeName + " 资源预加载完成!" + resources);
          var serverVersion = Number(GlobalCfg.SUB_GAME_VERSION_INFO[packgeName]);
          cc.sys.localStorage.setItem(packgeName, serverVersion);
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE,
            msgData: {
              subpackgeName: packgeName
            }
          });
        }
      });
    });
  },
  httpGet: function httpGet(url, callFun, outCallFun) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 8000;
    xhr.myTimeOut = setTimeout(function () {
      if (outCallFun) {
        outCallFun();
      }
    }, 8000);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status == 200) {
        clearTimeout(xhr.myTimeOut);
        var respone = xhr.responseText;
        if (respone[0] != "{") {
          respone = respone.substr(1, respone.length - 1);
        }
        var rsp = JSON.parse(respone);
        LoggerUtil.getInstance().log("Data of httpGet :", cc.sys.isNative ? JSON.stringify(rsp) : rsp);
        if (rsp) callFun(rsp);else callFun(respone);
      } else if (xhr.readyState === 4 && xhr.status == 401) {
        clearTimeout(xhr.myTimeOut);
        callFun({
          status: 401
        });
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }
});
GameDownloader.getInstance = function () {
  if (!GameDownloader._instance) {
    GameDownloader._instance = new GameDownloader();
  }
  ;
  return GameDownloader._instance;
};
module.exports = GameDownloader;
window.GameDownloader = GameDownloader;

cc._RF.pop();