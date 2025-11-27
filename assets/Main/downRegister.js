window.IndexedDBManager = require('IndexedDBManager');
window.IndexedDBManager.init({dbName: 'MyGameDB', version: 1, storeName: 'gameData'}).then(() => {
    console.log("IndexedDBManager OK")
}).catch((err) => {
    console.log("IndexedDBManager Error: ", err)
})


//图片他没有xml加载
cc.assetManager.downloader.register('.png', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            // console.log("Cache PNG from:", url);
            const blob = new Blob([data], {type: 'image/png'});
            onComplete(null, blob)
        } else {
            fetchAndCacheBlob(url, onComplete)
        }
    }).catch((err) => {
        fetchAndCacheBlob(url, onComplete)
    })
});

cc.assetManager.downloader.register('.jpg', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            // console.log("Cache PNG from:", url);
            const blob = new Blob([data], {type: 'image/jpg'});
            onComplete(null, blob)
        } else {
            fetchAndCacheBlob(url, onComplete)
        }
    }).catch((err) => {
        fetchAndCacheBlob(url, onComplete)
    })
});



// 拦截open
const oldOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, usingAsync, user, password) {
    this.zipCacheUrl = url;
    return oldOpen.apply(this, arguments);
}

const oldSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = async function (data) {
    //console.log("responseType = ", this.responseType, ", url = ", this.zipCacheUrl)
    let self = this;
    try {
        //查询缓存
        let cachedData = await window.IndexedDBManager.get(this.zipCacheUrl)
        if (cachedData) {
            Object.defineProperties(self, {
                status: {
                    value: 200,
                    writable: true,
                    enumerable: true,
                    configurable: true
                },
                statusText: {
                    value: 'OK',
                    writable: true,
                    enumerable: true,
                    configurable: true
                }
            })
            //按照responseType格式解析返回数据
            if (self.responseType === "text") {
                console.log("responseType1 = ", this.responseType, ", url = ", this.zipCacheUrl)
                const decoder = new TextDecoder('utf-8');
                let str;
                str = decoder.decode(cachedData);
                Object.defineProperties(self, {
                    responseText: {
                        value: str,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                })
                self.onload();
                return
            } else if (self.responseType === "arraybuffer") {
                console.log("responseType1 = ", this.responseType, ", url = ", this.zipCacheUrl)
                Object.defineProperties(self, {
                    response: {
                        value: cachedData,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                })
                self.onload();
                return
            } else if (self.responseType === "blob") {
                console.log("responseType1 = ", this.responseType, ", url = ", this.zipCacheUrl)
                let blobData = new Blob([cachedData]);
                Object.defineProperties(self, {
                    response: {
                        value: blobData,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                })
                self.onload();
                return
            } else if (self.responseType === "json") {
                console.log("responseType1 = ", this.responseType, ", url = ", this.zipCacheUrl)
                const decoder = new TextDecoder('utf-8');
                const str = decoder.decode(cachedData);
                Object.defineProperties(self, {
                    response: {
                        value: JSON.parse(str),
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                })
                self.onload();
                return
            } else {
                console.log("Cache MISS for URL:", this.zipCacheUrl);
            }
        }
    } catch (err) {
        console.error("Error checking cache or processing cached data for URL:", this.zipCacheUrl, err);
        // 缓存检查出错，降级到原始请求
        return oldSend.apply(self, arguments);
    }
    return oldSend.apply(self, arguments);
}


// 从网络获取图片并缓存
function fetchAndCacheBlob(url, onComplete) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.blob();
        })
        .then(data => {
            // 即使缓存失败也返回数据
            onComplete(null, data);
        })
        .catch(err => {
            console.error("从网络获取图片失败:", url, err);
            onComplete(err, null);
        });
}
